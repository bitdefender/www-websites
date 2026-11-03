import { createTag, renderTurnstile } from "../../scripts/utils/utils.js";
import { UserAgent } from "../../vendor/repobit/dex-utils.js";
// src/blocks/realcheck-checker/realcheck-checker.js
var ENDPOINT = "https://stage.bitdefender.com/napi/realcheck/v1/analyze";
var PLATFORMS = [
	"youtube.com",
	"youtu.be",
	"x.com",
	"twitter.com",
	"instagram.com",
	"tiktok.com",
	"facebook.com",
	"fb.watch"
];
var STEPS = [
	"queued",
	"downloading",
	"analyzing",
	"intent"
];
var FINISHED = ["completed", "failed"];
var GIVE_UP_AFTER = 3e5;
var DEFAULT_RETRY_AFTER = 2;
var TURNSTILE_ID = "realcheck-checker-turnstile";
var TEXTS = {
	placeholder: "Paste a public video link",
	analyze: "Analyze",
	paste: "Paste from clipboard",
	"error-empty": "Paste a public video link to continue.",
	"error-invalid": "That doesn’t look like a link. Paste a public video link.",
	"error-unsupported": "This platform isn’t supported. Paste a public link from TikTok, YouTube, Instagram, Facebook or X.",
	"error-turnstile": "Please complete the security check.",
	"stage-queued": "Waiting in line…",
	"stage-downloading": "Downloading the video…",
	"stage-analyzing": "Analyzing content…",
	"stage-intent": "Assessing intent…",
	"step-queued": "Queued",
	"step-downloading": "Downloading video",
	"step-analyzing": "Analyzing audio",
	"step-intent": "Intent analysis",
	"step-done": "done",
	"step-active": "in progress",
	"step-waiting": "waiting",
	"verdict-0": "Likely authentic",
	"verdict-1": "Possibly altered",
	"verdict-2": "Likely altered",
	"risk-high": "High risk of deception",
	"risk-medium": "Medium risk of deception",
	"risk-low": "Low risk of deception",
	"risk-none": "No clear signs of deception",
	"report-title": "See the full analysis",
	"report-text": "Try the RealCheck app free for 7 days and get trending analyses, intent analysis and a speaker‑by‑speaker transcript.",
	"report-text-mobile": "Try the RealCheck mobile app free for 7 days and get trending analyses, intent analysis and a speaker‑by‑speaker transcript.",
	"qr-open": "Show a larger QR code",
	"qr-hint": "Open your phone’s camera and point it at this code",
	close: "Close",
	"failed-title": "We couldn’t analyze this video",
	"failed-text": "Something went wrong while analyzing this video. Please try again.",
	"error-no-speech": "Our detector works best on videos with speech.",
	"try-again": "Try again"
};
var toKey = (text) => text.trim().toLowerCase().replace(/[\s_]+/g, "-");
var wait = (seconds, signal) => new Promise((resolve, reject) => {
	const timer = setTimeout(resolve, seconds * 1e3);
	signal.addEventListener("abort", () => {
		clearTimeout(timer);
		reject(signal.reason);
	}, { once: true });
});
/**
* Checks a pasted link the way the API will, so the visitor hears about a typo at once.
* @param {string} raw What the visitor typed or pasted
* @returns {{ url?: string, error?: 'empty' | 'invalid' | 'unsupported' }}
*/
function checkLink(raw) {
	const value = (raw || "").trim();
	if (!value) return { error: "empty" };
	if (/\s/.test(value)) return { error: "invalid" };
	let url;
	try {
		url = new URL(/^[a-z][a-z0-9+.-]*:\/\//i.test(value) ? value : `https://${value}`);
	} catch {
		return { error: "invalid" };
	}
	const host = url.hostname.toLowerCase();
	const isIp = /^\d+(\.\d+){3}$/.test(host) || host.startsWith("[");
	if (url.protocol !== "https:" || url.username || url.password || isIp || !/^[^.]+(\.[^.]+)+$/.test(host) || url.href.length > 2048) return { error: "invalid" };
	return PLATFORMS.some((domain) => host === domain || host.endsWith(`.${domain}`)) ? { url: url.href } : { error: "unsupported" };
}
/**
* The colour and wording of a finished check. A clean verdict is blue whatever the risk;
* otherwise the risk picks the colour, and a missing risk keeps it grey with no risk line.
* @param {{ verdict: number, risk_level: string | null }} result
*/
function describeResult({ verdict, risk_level: risk }) {
	if (verdict === 0) return {
		tone: "blue",
		verdict: "verdict-0",
		risk: "risk-none"
	};
	const name = `verdict-${verdict}`;
	if (risk === "high") return {
		tone: "red",
		verdict: name,
		risk: "risk-high"
	};
	if (risk === "medium") return {
		tone: "orange",
		verdict: name,
		risk: "risk-medium"
	};
	if (risk === "low" || risk === "benign") return {
		tone: "grey",
		verdict: name,
		risk: "risk-low"
	};
	return {
		tone: "grey",
		verdict: name,
		risk: null
	};
}
var CheckFailed = class extends Error {
	constructor(code, message = "") {
		super(message || code);
		this.code = code;
	}
};
async function readJson(response) {
	try {
		return await response.json();
	} catch {
		return {};
	}
}
var retryAfter = (response) => {
	const seconds = Number(response.headers.get("Retry-After"));
	return seconds > 0 ? Math.min(seconds, 30) : DEFAULT_RETRY_AFTER;
};
/**
* Submits the link and polls until the check finishes, reporting every state on the way.
* Each submit sends a Turnstile token from `token()`, which the proxy checks and strips, as for
* booking-form's `/form`.
* @param {{ endpoint: string, url: string, signal: AbortSignal, fetch: typeof fetch,
*   token?: () => string, onUpdate: (check: object) => void }} options
* @returns {Promise<object>} The finished check
*/
async function runCheck({ endpoint, url, signal, fetch: request = window.fetch.bind(window), token = () => "", onUpdate }) {
	const deadline = Date.now() + GIVE_UP_AFTER;
	const submit = () => {
		const body = {
			type: "social_media",
			url
		};
		const turnstile = token();
		if (turnstile) body.token = turnstile;
		return request(`${endpoint}`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(body),
			signal
		});
	};
	let response = await submit();
	if (response.status >= 500) {
		await wait(Number(response.headers.get("Retry-After")) || 5, signal);
		response = await submit();
	}
	let check = await readJson(response);
	if (response.status !== 202 || !check.id) throw new CheckFailed(check.error?.code || `http_${response.status}`);
	while (!FINISHED.includes(check.status)) {
		onUpdate(check);
		if (Date.now() > deadline) throw new CheckFailed("timeout");
		await wait(retryAfter(response), signal);
		try {
			response = await request(`${endpoint}/${encodeURIComponent(check.id)}`, { signal });
		} catch (error) {
			if (signal.aborted) throw error;
			continue;
		}
		if (response.status === 404) throw new CheckFailed("check_not_found");
		if (response.ok) check = {
			...check,
			...await readJson(response)
		};
	}
	return check;
}
function readTexts(block) {
	const texts = { ...TEXTS };
	const parts = {};
	[...block.children].forEach((row) => {
		const [key, value] = row.children;
		if (!value || !key.textContent.trim() || row.querySelector("h1")) return;
		const name = toKey(key.textContent);
		parts[name] = value;
		texts[name] = value.textContent.trim() || texts[name];
		row.remove();
	});
	return {
		texts,
		parts
	};
}
var paragraph = (className, source) => {
	const element = createTag("p", { class: className });
	if (source) element.append(...source.childNodes);
	return element;
};
var stripScheme = (url) => url.replace(/^https?:\/\//i, "").replace(/^www\./i, "");
function appLink(source, dataset) {
	const href = source?.getAttribute("href") || "";
	if (href && !href.includes("#os-dynamic-link")) return href;
	if (UserAgent.isIos && dataset.iosLink) return dataset.iosLink;
	if (UserAgent.isAndroid && dataset.androidLink) return dataset.androidLink;
	return dataset.defaultLink || href;
}
function buildIntro(row) {
	const cell = row?.querySelector(":scope > div") || row;
	const h1 = cell?.querySelector("h1");
	const eyebrow = createTag("p", { class: "realcheck-checker__eyebrow" });
	const intro = createTag("div", { class: "realcheck-checker__intro" });
	if (!h1) return {
		eyebrow,
		intro
	};
	const children = [...cell.children];
	const before = children.slice(0, children.indexOf(h1));
	const after = children.slice(children.indexOf(h1) + 1);
	eyebrow.textContent = before.map((element) => element.textContent.trim()).join(" ");
	h1.classList.add("realcheck-checker__title");
	intro.append(h1, ...after.map((element) => {
		element.classList.add("realcheck-checker__description");
		return element;
	}));
	return {
		eyebrow,
		intro
	};
}
var PASTE_ICON = "<svg viewBox=\"0 0 24 24\" aria-hidden=\"true\"><rect x=\"6\" y=\"4\" width=\"12\" height=\"17\" rx=\"2\"/><path d=\"M9 4V3h6v1M9 10h6M9 14h6\"/></svg>";
function buildForm(texts, parts) {
	const form = createTag("form", {
		class: "realcheck-checker__form",
		novalidate: ""
	});
	const field = createTag("div", { class: "realcheck-checker__field" });
	const input = createTag("input", {
		class: "realcheck-checker__input",
		type: "url",
		inputmode: "url",
		name: "link",
		autocomplete: "off",
		spellcheck: "false",
		placeholder: texts.placeholder,
		"aria-label": texts.placeholder,
		"aria-describedby": "realcheck-checker-error realcheck-checker-note"
	});
	field.append(input);
	if (navigator.clipboard?.readText) {
		const paste = createTag("button", {
			class: "realcheck-checker__paste",
			type: "button",
			title: texts.paste,
			"aria-label": texts.paste
		}, PASTE_ICON);
		field.append(paste);
	}
	const submit = createTag("button", {
		class: "realcheck-checker__analyze",
		type: "submit"
	});
	submit.textContent = texts.analyze;
	const error = createTag("p", {
		class: "realcheck-checker__error",
		id: "realcheck-checker-error",
		role: "alert"
	});
	const notes = createTag("div", {
		class: "realcheck-checker__notes",
		id: "realcheck-checker-note"
	});
	if (parts.note) notes.append(paragraph("realcheck-checker__note", parts.note));
	if (parts.terms) notes.append(paragraph("realcheck-checker__terms", parts.terms));
	notes.querySelectorAll("a").forEach((link) => {
		link.target = "_blank";
		link.rel = "noopener";
	});
	const row = createTag("div", { class: "realcheck-checker__row" });
	row.append(field, submit);
	const turnstile = createTag("div", {
		class: "realcheck-checker__turnstile",
		id: TURNSTILE_ID
	});
	form.append(row, error, turnstile, notes);
	return form;
}
function buildProgress(texts) {
	const progress = createTag("div", {
		class: "realcheck-checker__progress",
		tabindex: "-1"
	});
	const screen = createTag("div", { class: "realcheck-checker__screen" });
	const thumb = createTag("img", {
		class: "realcheck-checker__screen__thumb",
		alt: "",
		referrerpolicy: "no-referrer",
		hidden: ""
	});
	const stage = createTag("p", {
		class: "realcheck-checker__stage",
		"aria-live": "polite"
	});
	screen.append(thumb, createTag("span", { class: "realcheck-checker__sweep" }), stage);
	const steps = createTag("ol", { class: "realcheck-checker__steps" });
	STEPS.forEach((step) => {
		const item = createTag("li", {
			class: "realcheck-checker__step",
			"data-step": step
		});
		item.innerHTML = "<span class=\"realcheck-checker__step__icon\" aria-hidden=\"true\"></span><span class=\"realcheck-checker__step__label\"></span><span class=\"realcheck-checker__step__status\"></span>";
		item.querySelector(".realcheck-checker__step__label").textContent = texts[`step-${step}`];
		steps.append(item);
	});
	progress.append(screen, steps);
	return progress;
}
function buildResult(texts, parts, dataset) {
	const result = createTag("div", { class: "realcheck-checker__result" });
	result.innerHTML = `
    <p class="realcheck-checker__video__title"></p>
    <p class="realcheck-checker__video__link"><a target="_blank" rel="noopener"></a></p>
    <div class="realcheck-checker__verdict">
      <img class="realcheck-checker__thumb" alt="" referrerpolicy="no-referrer" hidden>
      <div class="realcheck-checker__verdict__text">
        <h2 class="realcheck-checker__verdict__title" tabindex="-1"></h2>
        <p class="realcheck-checker__risk"></p>
      </div>
    </div>
    <div class="realcheck-checker__report">
      <div class="realcheck-checker__scroller"></div>
      <div class="realcheck-checker__upsell">
        <div class="realcheck-checker__upsell__text">
          <p class="realcheck-checker__upsell__title"></p>
          <p class="realcheck-checker__upsell__body"></p>
        </div>
      </div>
    </div>`;
	const isMobile = UserAgent.isIos || UserAgent.isAndroid;
	result.querySelector(".realcheck-checker__upsell__title").textContent = texts["report-title"];
	result.querySelector(".realcheck-checker__upsell__body").textContent = texts[isMobile ? "report-text-mobile" : "report-text"];
	const report = parts.report?.querySelector("picture");
	const qr = parts.qr?.querySelector("picture");
	const mounts = [];
	if (report) mounts.push(() => result.querySelector(".realcheck-checker__scroller").append(report));
	else result.querySelector(".realcheck-checker__report").classList.add("realcheck-checker__report--no-image");
	const upsell = result.querySelector(".realcheck-checker__upsell");
	if (isMobile) {
		const source = parts.app?.querySelector("a");
		const href = appLink(source, dataset);
		if (href) {
			const app = createTag("a", {
				class: "realcheck-checker__app",
				href,
				target: "_blank",
				rel: "noopener"
			});
			app.textContent = source?.textContent.trim() || texts["report-title"];
			upsell.append(app);
		}
	} else if (qr) {
		const open = createTag("button", {
			class: "realcheck-checker__qr",
			type: "button",
			"aria-label": texts["qr-open"]
		});
		upsell.prepend(open);
		const overlay = createTag("div", {
			class: "realcheck-checker__overlay",
			role: "dialog",
			"aria-label": texts["qr-hint"],
			hidden: ""
		});
		const close = createTag("button", {
			class: "realcheck-checker__overlay__close",
			type: "button",
			"aria-label": texts.close
		}, "×");
		const large = createTag("div", { class: "realcheck-checker__overlay__qr" });
		mounts.push(() => {
			open.append(qr);
			large.append(qr.cloneNode(true));
		});
		const hint = createTag("p", { class: "realcheck-checker__overlay__hint" });
		hint.textContent = texts["qr-hint"];
		const panel = createTag("div", { class: "realcheck-checker__overlay__panel" });
		panel.append(close, large, hint);
		overlay.append(panel);
		result.querySelector(".realcheck-checker__report").append(overlay);
		const toggle = (show) => {
			overlay.hidden = !show;
			(show ? close : open).focus();
		};
		open.addEventListener("click", () => toggle(true));
		close.addEventListener("click", () => toggle(false));
		overlay.addEventListener("click", (event) => event.target === overlay && toggle(false));
		overlay.addEventListener("keydown", (event) => event.key === "Escape" && toggle(false));
	}
	const mountPictures = () => mounts.splice(0).forEach((mount) => mount());
	return {
		result,
		mountPictures
	};
}
function buildFailed(texts) {
	const failed = createTag("div", { class: "realcheck-checker__failed" });
	failed.innerHTML = `
    <span class="realcheck-checker__failed__icon" aria-hidden="true">!</span>
    <h2 class="realcheck-checker__failed__title" tabindex="-1"></h2>
    <p class="realcheck-checker__failed__reason"></p>
    <button class="realcheck-checker__again" type="button"></button>`;
	failed.querySelector("h2").textContent = texts["failed-title"];
	failed.querySelector("button").textContent = texts["try-again"];
	return failed;
}
function showThumbnail(img, src) {
	if (!src?.startsWith("https://")) {
		img.hidden = true;
		img.removeAttribute("src");
		return;
	}
	if (img.getAttribute("src") === src) return;
	img.hidden = true;
	img.onload = () => {
		img.hidden = false;
	};
	img.onerror = () => {
		img.hidden = true;
	};
	img.src = src;
}
function autoScroll(scroller) {
	if (!window.requestAnimationFrame || window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return () => {};
	let frame;
	let position = 0;
	let paused = 60;
	const step = () => {
		const max = scroller.scrollHeight - scroller.clientHeight;
		if (paused > 0) paused -= 1;
		else if (max > 0) {
			position = position >= max ? 0 : position + .6;
			paused = position === 0 ? 60 : 0;
			scroller.scrollTop = position;
		}
		frame = requestAnimationFrame(step);
	};
	const stop = () => cancelAnimationFrame(frame);
	[
		"wheel",
		"touchstart",
		"pointerdown",
		"focus"
	].forEach((type) => scroller.addEventListener(type, stop, {
		once: true,
		passive: true
	}));
	frame = requestAnimationFrame(step);
	return stop;
}
async function decorate(block) {
	const { dataset } = block.closest(".section") || { dataset: {} };
	const { texts, parts } = readTexts(block);
	const { eyebrow, intro } = buildIntro(block.firstElementChild);
	const mock = new URLSearchParams(window.location.search).get("realcheck-mock");
	const endpoint = dataset.realcheckEndpoint || "https://stage.bitdefender.com/napi/realcheck/v1/analyze";
	const request = mock !== null ? (await import("./realcheck-checker-mock.js")).default(mock) : window.fetch.bind(window);
	const band = createTag("div", {
		class: "realcheck-checker__band",
		"aria-hidden": "true"
	});
	const card = createTag("div", { class: "realcheck-checker__card" });
	const form = buildForm(texts, parts);
	const progress = buildProgress(texts);
	const { result, mountPictures } = buildResult(texts, parts, dataset);
	const failed = buildFailed(texts);
	card.append(eyebrow, intro, form, progress, result, failed);
	if (dataset.signature) {
		const signature = paragraph("realcheck-checker__signature");
		signature.textContent = dataset.signature;
		card.append(signature);
	}
	block.replaceChildren(band, card);
	const useTurnstile = mock === null;
	let widgetId;
	if (useTurnstile) renderTurnstile(TURNSTILE_ID, { invisible: false }).then((widget) => {
		widgetId = widget.widgetId;
	}).catch(() => {});
	const currentToken = () => widgetId === void 0 ? "" : window.turnstile?.getResponse(widgetId) || "";
	const takeToken = () => {
		const token = currentToken();
		if (token) window.turnstile.reset(widgetId);
		return token;
	};
	const input = form.querySelector("input");
	const error = form.querySelector(".realcheck-checker__error");
	let controller;
	let stopScroll = () => {};
	const show = (state, tone = "blue") => {
		block.dataset.state = state;
		block.dataset.tone = tone;
	};
	const showError = (code) => {
		error.textContent = code ? texts[`error-${code}`] : "";
		input.setAttribute("aria-invalid", code ? "true" : "false");
		if (code) input.focus();
	};
	const showProgress = (check) => {
		const current = Math.max(0, STEPS.indexOf(check.status));
		progress.querySelector(".realcheck-checker__stage").textContent = texts[`stage-${STEPS[current]}`];
		progress.querySelectorAll(".realcheck-checker__step").forEach((item, index) => {
			const state = [
				"done",
				"active",
				"waiting"
			][Math.sign(index - current) + 1];
			item.dataset.status = state;
			item.querySelector(".realcheck-checker__step__status").textContent = texts[`step-${state}`];
		});
		showThumbnail(progress.querySelector(".realcheck-checker__screen__thumb"), check.media?.thumbnail_url);
	};
	const showResult = (check, url) => {
		const { tone, verdict, risk } = describeResult(check.result);
		const title = result.querySelector(".realcheck-checker__video__title");
		title.textContent = check.media?.title || "";
		title.hidden = !check.media?.title;
		const link = result.querySelector(".realcheck-checker__video__link a");
		link.href = url;
		link.textContent = stripScheme(url);
		showThumbnail(result.querySelector(".realcheck-checker__thumb"), check.media?.thumbnail_url);
		result.querySelector(".realcheck-checker__verdict__title").textContent = texts[verdict];
		const riskLine = result.querySelector(".realcheck-checker__risk");
		riskLine.textContent = risk ? texts[risk] : "";
		riskLine.hidden = !risk;
		mountPictures();
		show("completed", tone);
		result.querySelector("h2").focus({ preventScroll: true });
		stopScroll = autoScroll(result.querySelector(".realcheck-checker__scroller"));
	};
	const showFailed = (code, message) => {
		const reason = texts[`error-${toKey(code || "")}`] || message || texts["failed-text"];
		failed.querySelector(".realcheck-checker__failed__reason").textContent = reason;
		show("failed");
		failed.querySelector("h2").focus({ preventScroll: true });
	};
	form.addEventListener("submit", async (event) => {
		event.preventDefault();
		if (controller) return;
		const { url, error: code } = checkLink(input.value);
		showError(code);
		if (code) return;
		if (useTurnstile && !currentToken()) {
			showError("turnstile");
			return;
		}
		controller = new AbortController();
		showProgress({ status: "queued" });
		showThumbnail(progress.querySelector(".realcheck-checker__screen__thumb"), null);
		show("running");
		progress.focus({ preventScroll: true });
		try {
			const check = await runCheck({
				endpoint,
				url,
				signal: controller.signal,
				fetch: request,
				token: useTurnstile ? takeToken : void 0,
				onUpdate: showProgress
			});
			if (check.status === "completed" && check.result) showResult(check, url);
			else showFailed(check.error?.code, check.error?.message);
		} catch (failure) {
			if (failure.code === "platform_not_supported" || failure.code === "invalid_url") {
				show("idle");
				showError(failure.code === "invalid_url" ? "invalid" : "unsupported");
			} else if (!controller.signal.aborted) showFailed(failure.code);
		} finally {
			controller = null;
		}
	});
	input.addEventListener("input", () => showError(""));
	form.querySelector(".realcheck-checker__paste")?.addEventListener("click", async () => {
		try {
			input.value = (await navigator.clipboard.readText()).trim();
			showError("");
		} catch {}
		input.focus();
	});
	failed.querySelector(".realcheck-checker__again").addEventListener("click", () => {
		stopScroll();
		show("idle");
		input.focus();
	});
	show("idle");
}
export { ENDPOINT, checkLink, decorate as default, describeResult, runCheck };
