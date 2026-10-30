import { decorateIcons } from "../../scripts/lib-franklin.js";
// src/blocks/interactive-banner/interactive-banner.js
/**
* Insert line breaks into text at specific word positions
* @param {string} text - The text to format
* @param {boolean} isMobile - Whether rendering for mobile device
* @param {string} mobileBreakpoints - Comma-separated word positions for mobile breaks (1-based)
* @param {string} desktopBreakpoints - Comma-separated word positions for desktop breaks (1-based)
* @returns {string} Text with line breaks inserted at specified positions
*/
function insertBreaks(text, isMobile, mobileBreakpoints, desktopBreakpoints) {
	const words = text.split(/\s+/);
	const breakPositions = isMobile ? mobileBreakpoints?.split(",") : desktopBreakpoints?.split(",");
	const result = [];
	let wordCounter = 0;
	for (let i = 0; i < words.length; i++) {
		result.push(words[i]);
		const pos = i + 1;
		if (breakPositions?.[0]) {
			if (breakPositions.includes(String(pos))) result.push("\n");
			else result.push(" ");
		} else {
			const defaultBreakInterval = 2;
			wordCounter++;
			if (wordCounter === defaultBreakInterval) {
				wordCounter = 0;
				result.push("\n");
			} else result.push(" ");
		}
	}
	return result.join("");
}
/**
* Convert SVG markup to Image object asynchronously
* @param {string} svgText - SVG markup as string
* @returns {Promise<Image>} Resolves with loaded Image object, rejects if SVG fails to load
*/
function svgTextToImage(svgText) {
	return new Promise((resolve, reject) => {
		const encoded = `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svgText)))}`;
		const img = new Image();
		img.onload = () => resolve(img);
		img.onerror = () => reject(/* @__PURE__ */ new Error("SVG load failed"));
		img.src = encoded;
	});
}
/**
* Initialize and render the dot cloud hero animation
* Supports both text and SVG rendering modes with color theming
* @param {HTMLElement} block - The block element containing the banner content
* @param {string} canvasId - The ID of the canvas element to render animation on
* @param {boolean} isMobile - Whether rendering for mobile viewport
* @param {string} mobileBreakpoints - Comma-separated word positions for mobile line breaks
* @param {string} desktopBreakpoints - Comma-separated word positions for desktop line breaks
* @param {boolean} svgMode - Whether to render SVG content (true) or text content (false)
* @returns {Promise<void>}
*/
async function initDotCloud(block, canvasId, isMobile, mobileBreakpoints, desktopBreakpoints, svgMode = false) {
	const DPR = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
	const DPR_MULTIPLIER = isMobile ? .5 : 1;
	const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
	const isPageVisible = !document.hidden;
	const canvas = document.getElementById(canvasId);
	if (!canvas) return;
	const ctx = canvas.getContext("2d", {
		alpha: true,
		willReadFrequently: true
	});
	const off = document.createElement("canvas");
	const octx = off.getContext("2d", { willReadFrequently: true });
	const title = block.querySelector("h1");
	const FONT_WEIGHT = 700;
	const DOT_STEP = 3;
	const DOT_RADIUS = 1;
	const FORCE = isMobile ? 400 : 100;
	const CLEAR_RADIUS = isMobile ? .2 : .3;
	const LINE_WIDTH = isMobile ? 1.2 : 1;
	const LINE_ALPHA = 1;
	const LINE_PERSIST = 2e3;
	const MAX_FPS = 60;
	let lastFrameTime = 0;
	const frameInterval = 1e3 / MAX_FPS;
	const fpsHistory = [];
	let performanceQuality = 1;
	const state = {
		text: svgMode ? "" : (insertBreaks(title.innerText, isMobile, mobileBreakpoints, desktopBreakpoints) || "AI-Powered").trim(),
		fontFamily: getComputedStyle(document.documentElement).getPropertyValue("--font") || "IBM Plex Sans",
		points: [],
		mouse: {
			x: 0,
			y: 0,
			down: false,
			inside: false
		}
	};
	const isReverted = block.closest(".section")?.classList.contains("reverted");
	let cachedDotColor;
	if (isReverted) cachedDotColor = getComputedStyle(document.documentElement).getPropertyValue("--reversed-dot-color").trim();
	else cachedDotColor = getComputedStyle(document.documentElement).getPropertyValue("--dot-color").trim();
	let svgImage = null;
	const linkCache = [];
	function addOrRefreshLink(a, b, now) {
		const ia = state.points.indexOf(a);
		const ib = state.points.indexOf(b);
		if (ia < 0 || ib < 0) return;
		const keyA = Math.min(ia, ib);
		const keyB = Math.max(ia, ib);
		for (const L of linkCache) if (L.ia === keyA && L.ib === keyB) {
			L.expire = now + LINE_PERSIST;
			return;
		}
		linkCache.push({
			ia: keyA,
			ib: keyB,
			expire: now + LINE_PERSIST
		});
		if (linkCache.length > 500) linkCache.shift();
	}
	function updatePerformanceMetrics(deltaTime) {
		const currentFps = 1e3 / deltaTime;
		fpsHistory.push(currentFps);
		if (fpsHistory.length > 60) fpsHistory.shift();
		if (fpsHistory.length >= 30) {
			const avgFps = fpsHistory.reduce((a, b) => a + b) / fpsHistory.length;
			if (avgFps < 30 && performanceQuality > .5) performanceQuality = Math.max(.5, performanceQuality - .05);
			else if (avgFps > 50 && performanceQuality < 1) performanceQuality = Math.min(1, performanceQuality + .02);
		}
	}
	function fitCanvas() {
		const rect = canvas.getBoundingClientRect();
		const w = Math.floor(rect.width);
		const h = Math.floor(rect.height);
		canvas.width = Math.round(w * DPR);
		canvas.height = Math.round(h * DPR);
		canvas.style.width = `${w}px`;
		canvas.style.height = `${h}px`;
	}
	/**
	* Render SVG content centered on offscreen canvas
	* Maintains aspect ratio and scales to fit within 75% of target dimensions
	* @param {Image} svg - SVG image to render
	* @param {number} targetW - Target canvas width
	* @param {number} targetH - Target canvas height
	* @returns {void}
	*/
	function renderSvgContent(svg, targetW, targetH) {
		const svgAspect = (svg.naturalWidth || svg.width || 64) / (svg.naturalHeight || svg.height || 64);
		const maxH = targetH * .75;
		const maxW = targetW * .75;
		let drawW;
		let drawH;
		if (maxW / svgAspect <= maxH) {
			drawW = maxW;
			drawH = maxW / svgAspect;
		} else {
			drawH = maxH;
			drawW = maxH * svgAspect;
		}
		const drawX = (targetW - drawW) / 2;
		const drawY = (targetH - drawH) / 2;
		octx.drawImage(svg, drawX, drawY, drawW, drawH);
	}
	/**
	* Render multi-line text content centered on offscreen canvas
	* Auto-scales font size to fit within canvas width with padding
	* @param {number} targetW - Target canvas width
	* @param {number} targetH - Target canvas height
	* @returns {void}
	*/
	function renderTextContent(targetW, targetH) {
		const lines = state.text.split("\n");
		const lineCount = lines.length;
		let fontSize = targetH / lineCount;
		octx.font = `${FONT_WEIGHT} ${fontSize}px ${state.fontFamily}`;
		let maxWidth = 0;
		for (const line of lines) {
			const metrics = octx.measureText(line);
			if (metrics.width > maxWidth) maxWidth = metrics.width;
		}
		const PAD = targetW * .04;
		if (maxWidth + PAD * 2 > targetW) {
			const scale = (targetW - PAD * 2) / maxWidth;
			fontSize *= scale;
			octx.font = `${FONT_WEIGHT} ${fontSize}px ${state.fontFamily}`;
		}
		const lineHeight = fontSize * 1;
		const startY = (targetH - lineHeight * lineCount) / 2 + fontSize * .8;
		octx.fillStyle = "#000";
		octx.textBaseline = "alphabetic";
		octx.font = `${FONT_WEIGHT} ${fontSize}px ${state.fontFamily}`;
		const x = PAD;
		for (let i = 0; i < lines.length; i++) {
			const y = startY + i * lineHeight;
			octx.fillText(lines[i], x, y);
		}
	}
	/**
	* Rasterize content (SVG or text) to offscreen canvas
	* Clears and recreates offscreen canvas with content based on rendering mode
	* @param {Image|null} svg - SVG image to render (only used in SVG mode)
	* @returns {void}
	*/
	function rasterizeTextToOffscreen(svg = null) {
		const targetW = canvas.width;
		const targetH = canvas.height;
		off.width = targetW;
		off.height = targetH;
		octx.clearRect(0, 0, off.width, off.height);
		if (svgMode && svg) renderSvgContent(svg, targetW, targetH);
		else renderTextContent(targetW, targetH);
	}
	/**
	* Extract dot particles from rasterized content
	* Samples pixels from offscreen canvas and creates particles at visible pixels
	* Uses configured DOT_STEP for density control
	* @returns {void}
	*/
	function buildPoints() {
		state.points.length = 0;
		const { width: W, height: H } = off;
		const img = octx.getImageData(0, 0, W, H).data;
		const step = Math.max(2, DOT_STEP) * DPR * DPR_MULTIPLIER;
		for (let y = 0; y < H; y += step) for (let x = 0; x < W; x += step) if (img[((y | 0) * W + (x | 0)) * 4 + 3] > 80) state.points.push({
			x,
			y,
			ox: x,
			oy: y,
			vx: 0,
			vy: 0
		});
		linkCache.length = 0;
	}
	/**
	* Animation frame callback - updates particle physics and renders to main canvas
	* Handles page visibility and respects prefers-reduced-motion preference
	* @param {number} currentTime - Timestamp from requestAnimationFrame
	* @returns {void}
	*/
	function draw(currentTime) {
		if (!isPageVisible) {
			requestAnimationFrame(draw);
			return;
		}
		const elapsed = currentTime - lastFrameTime;
		if (elapsed < frameInterval) {
			requestAnimationFrame(draw);
			return;
		}
		lastFrameTime = currentTime - elapsed % frameInterval;
		updatePerformanceMetrics(elapsed);
		const W = canvas.width;
		const H = canvas.height;
		ctx.save();
		ctx.globalAlpha = 1;
		ctx.globalCompositeOperation = "source-over";
		ctx.clearRect(0, 0, W, H);
		const r = DOT_RADIUS * DPR * DPR_MULTIPLIER;
		const mx = state.mouse.x;
		const my = state.mouse.y;
		const hasMouse = state.mouse.inside || state.mouse.down;
		const repelRadius = FORCE * CLEAR_RADIUS * DPR * DPR_MULTIPLIER;
		const repelRadius2 = repelRadius * repelRadius;
		const reducedMotion = prefersReducedMotion;
		const spring = reducedMotion ? .08 : .03;
		const damping = reducedMotion ? .8 : .9;
		const now = performance.now();
		if (!reducedMotion || hasMouse) for (const p of state.points) {
			if (hasMouse && !reducedMotion) {
				const dx = p.x - mx;
				const dy = p.y - my;
				const d2 = dx * dx + dy * dy;
				if (d2 < repelRadius2) {
					const dist = Math.max(1e-4, Math.sqrt(d2));
					const push = FORCE * DPR * DPR_MULTIPLIER / dist;
					const pushStrength = 1 - dist / Math.sqrt(repelRadius2);
					p.vx += dx / dist * push * .15 * pushStrength;
					p.vy += dy / dist * push * .15 * pushStrength;
				}
			}
			p.vx += (p.ox - p.x) * spring;
			p.vy += (p.oy - p.y) * spring;
			p.vx *= damping;
			p.vy *= damping;
			p.x += p.vx;
			p.y += p.vy;
		}
		for (const p of state.points) {
			ctx.fillStyle = cachedDotColor;
			ctx.beginPath();
			ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
			ctx.fill();
		}
		if (hasMouse && !reducedMotion && performanceQuality > .3) {
			const linkR2 = repelRadius2;
			const active = [];
			for (const p of state.points) {
				const dx = p.x - mx;
				const dy = p.y - my;
				if (dx * dx + dy * dy < linkR2) active.push(p);
			}
			const maxDist2 = (50 * DPR * DPR_MULTIPLIER * performanceQuality) ** 2;
			const k = 1;
			const cellSize = 50 * DPR * DPR_MULTIPLIER;
			const grid = /* @__PURE__ */ new Map();
			for (let i = 0; i < active.length; i++) {
				const p = active[i];
				const key = `${Math.floor(p.x / cellSize)},${Math.floor(p.y / cellSize)}`;
				if (!grid.has(key)) grid.set(key, []);
				grid.get(key).push(i);
			}
			for (let i = 0; i < active.length; i++) {
				const p1 = active[i];
				const cx = Math.floor(p1.x / cellSize);
				const cy = Math.floor(p1.y / cellSize);
				const nearest = [];
				for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) {
					const key = `${cx + dx},${cy + dy}`;
					const cell = grid.get(key);
					if (!cell) continue;
					for (const j of cell) {
						if (i === j) continue;
						const p2 = active[j];
						const ddx = p1.x - p2.x;
						const ddy = p1.y - p2.y;
						const d2 = ddx * ddx + ddy * ddy;
						if (d2 < maxDist2) {
							if (nearest.length < k) {
								nearest.push([d2, j]);
								if (nearest.length === k) nearest.sort((a, b) => a[0] - b[0]);
							} else if (d2 < nearest[0][0]) {
								nearest[0] = [d2, j];
								nearest.sort((a, b) => a[0] - b[0]);
							}
						}
					}
				}
				for (const [, j] of nearest) addOrRefreshLink(p1, active[j], now);
			}
		}
		let writeIdx = 0;
		for (let i = 0; i < linkCache.length; i++) {
			const L = linkCache[i];
			if (now <= L.expire) linkCache[writeIdx++] = L;
		}
		linkCache.length = writeIdx;
		ctx.lineWidth = LINE_WIDTH * DPR * DPR_MULTIPLIER;
		for (const L of linkCache) {
			const a = state.points[L.ia];
			const b = state.points[L.ib];
			if (!a || !b) continue;
			const remain = Math.max(0, L.expire - now);
			const alpha = LINE_ALPHA * Math.min(1, remain / LINE_PERSIST);
			ctx.strokeStyle = `rgba(${isReverted ? "255, 255, 255" : "0, 109, 255"}, ${alpha})`;
			ctx.beginPath();
			ctx.moveTo(a.x, a.y);
			ctx.lineTo(b.x, b.y);
			ctx.stroke();
		}
		ctx.restore();
		requestAnimationFrame(draw);
	}
	function regenerate(svg = null) {
		fitCanvas();
		rasterizeTextToOffscreen(svg);
		buildPoints();
		if (isReverted) cachedDotColor = getComputedStyle(document.documentElement).getPropertyValue("--reversed-dot-color").trim();
		else cachedDotColor = getComputedStyle(document.documentElement).getPropertyValue("--dot-color").trim();
	}
	function canvasPos(e) {
		const rect = canvas.getBoundingClientRect();
		return {
			x: (e.clientX - rect.left) * DPR,
			y: (e.clientY - rect.top) * DPR
		};
	}
	if (window.PointerEvent) {
		canvas.addEventListener("pointermove", (e) => {
			e.preventDefault();
			const p = canvasPos(e);
			state.mouse.x = p.x;
			state.mouse.y = p.y;
			state.mouse.inside = true;
		});
		canvas.addEventListener("pointerdown", (e) => {
			e.preventDefault();
			state.mouse.down = true;
			const p = canvasPos(e);
			state.mouse.x = p.x;
			state.mouse.y = p.y;
		});
		canvas.addEventListener("pointerup", () => {
			state.mouse.down = false;
		});
		canvas.addEventListener("pointerleave", () => {
			state.mouse.inside = false;
			state.mouse.down = false;
		});
	} else {
		canvas.addEventListener("mousemove", (e) => {
			const p = canvasPos(e);
			state.mouse.x = p.x;
			state.mouse.y = p.y;
			state.mouse.inside = true;
		});
		canvas.addEventListener("mousedown", (e) => {
			state.mouse.down = true;
			const p = canvasPos(e);
			state.mouse.x = p.x;
			state.mouse.y = p.y;
		});
		canvas.addEventListener("mouseup", () => {
			state.mouse.down = false;
		});
		canvas.addEventListener("mouseleave", () => {
			state.mouse.inside = false;
			state.mouse.down = false;
		});
		canvas.addEventListener("touchstart", (e) => {
			e.preventDefault();
			const touch = e.touches[0];
			const p = canvasPos(touch);
			state.mouse.x = p.x;
			state.mouse.y = p.y;
			state.mouse.down = true;
			state.mouse.inside = true;
		}, { passive: false });
		canvas.addEventListener("touchmove", (e) => {
			e.preventDefault();
			const touch = e.touches[0];
			const p = canvasPos(touch);
			state.mouse.x = p.x;
			state.mouse.y = p.y;
			state.mouse.inside = true;
		}, { passive: false });
		canvas.addEventListener("touchend", () => {
			state.mouse.down = false;
			state.mouse.inside = false;
		});
	}
	let resizeT;
	window.addEventListener("resize", () => {
		clearTimeout(resizeT);
		resizeT = setTimeout(() => regenerate(svgImage), 120);
	});
	if (svgMode) {
		const svgElement = block.querySelector("svg");
		if (svgElement) {
			const svgClone = svgElement.cloneNode(true);
			svgClone.querySelectorAll("path, circle, rect, polygon, ellipse, line, polyline").forEach((el) => {
				el.setAttribute("fill", cachedDotColor);
			});
			svgTextToImage(new XMLSerializer().serializeToString(svgClone)).then((img) => {
				svgImage = img;
				document.fonts.ready.then(() => {
					regenerate(svgImage);
					requestAnimationFrame(draw);
				});
			}).catch(() => {
				document.fonts.ready.then(() => {
					regenerate();
					requestAnimationFrame(draw);
				});
			});
		}
	} else document.fonts.ready.then(() => {
		regenerate();
		requestAnimationFrame(draw);
	});
}
/**
* Decorate interactive banner block with dot cloud animation
* Creates canvas, initializes animation with optional SVG mode, and handles responsive resizing
* @param {HTMLElement} block - The banner block element to decorate
* @returns {Promise<void>}
*/
async function decorate(block) {
	const { mobileBreakpoints, desktopBreakpoints, svgMode } = block.closest(".section").dataset;
	const isSvgMode = svgMode === "true" || svgMode === true;
	if (isSvgMode) block.classList.add("svg-mode");
	const isMobile = window.innerWidth < 768;
	const bannerCanvas = document.createElement("canvas");
	bannerCanvas.setAttribute("id", "animation-canvas");
	bannerCanvas.classList.add("interactive-canvas");
	block.appendChild(bannerCanvas);
	const canvas = block.querySelector("#animation-canvas");
	if (canvas) {
		let initialized = false;
		await decorateIcons(block);
		const resizeObserver = new ResizeObserver((entries) => {
			const { width, height } = entries[0].contentRect;
			if (!initialized && width > 0 && height > 0) {
				initDotCloud(block, "animation-canvas", isMobile, mobileBreakpoints, desktopBreakpoints, isSvgMode);
				initialized = true;
				resizeObserver.disconnect();
			}
		});
		resizeObserver.observe(canvas);
	}
}
export { decorate as default };
