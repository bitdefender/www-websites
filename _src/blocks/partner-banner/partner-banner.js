import { wrapSectionInDsSection } from "../../scripts/utils/utils.js";
import { load } from "../../vendor/repobit/dex-system-design/loader.js";
// src/blocks/partner-banner/partner-banner.js
var text = (el) => el?.textContent.replace(/\s+/g, " ").trim() || "";
/** An element for one of the banner's slots, holding the copy. */
var slotted = (tag, slot, copy, attributes = {}) => {
	const el = document.createElement(tag);
	el.slot = slot;
	Object.entries(attributes).forEach(([name, value]) => el.setAttribute(name, value));
	el.textContent = copy;
	return el;
};
/** The photo, as the banner's media: the authored picture, which it cover-fits. */
var asMedia = (picture) => {
	if (!picture) return null;
	picture.setAttribute("slot", "media");
	const img = picture.querySelector("img");
	if (img) img.setAttribute("alt", img.getAttribute("alt") || "");
	return picture;
};
/** The partner lockup, as the bd-img the banner's lockup slot takes: the picture's image. */
var asLockup = (picture) => {
	const img = picture?.querySelector("img");
	if (!img) return null;
	const lockup = document.createElement("bd-img");
	lockup.slot = "lockup";
	[
		"src",
		"width",
		"height",
		"loading"
	].forEach((name) => {
		if (img.hasAttribute(name)) lockup.setAttribute(name, img.getAttribute(name));
	});
	lockup.setAttribute("alt", img.getAttribute("alt") || "");
	return lockup;
};
async function decorate(block) {
	wrapSectionInDsSection(block);
	const heading = block.querySelector("h1, h2, h3, h4, h5, h6");
	const pictures = [...block.querySelectorAll("picture")];
	const headingCell = heading?.closest(".partner-banner > div > div") || pictures[1]?.closest(".partner-banner > div > div");
	const lockup = pictures.find((picture) => headingCell?.contains(picture));
	const photo = pictures.find((picture) => picture !== lockup);
	const copy = [...block.querySelectorAll("p")].filter((p) => text(p) && !p.querySelector("picture") && !headingCell?.contains(p));
	const links = copy.filter((p) => p.querySelector("a") && text(p) === text(p.querySelector("a")));
	const prose = copy.filter((p) => !links.includes(p));
	const attribution = prose.find((p) => p.querySelector("em, i") && text(p) === text(p.querySelector("em, i")));
	const [quote, lead] = prose.filter((p) => p !== attribution);
	const banner = document.createElement("bd-partner-banner");
	const lockupImage = asLockup(lockup);
	if (lockupImage) banner.append(lockupImage);
	if (heading) banner.append(slotted("bd-h", "title", text(heading), { as: heading.tagName.toLowerCase() }));
	if (quote) banner.append(text(quote));
	if (attribution) banner.append(slotted("span", "caption", text(attribution)));
	if (lead) banner.append(slotted("bd-p", "description", text(lead)));
	const buttons = links.map((p) => {
		const link = p.querySelector("a");
		const button = document.createElement("bd-button");
		button.setAttribute("slot", "actions");
		const primary = p.querySelector("strong, b, a.button.primary");
		button.setAttribute("appearance", primary ? "white" : "outline-white");
		button.setAttribute("href", link.getAttribute("href") || "");
		button.textContent = text(link);
		return button;
	});
	banner.append(...buttons);
	try {
		await load(banner);
	} catch (err) {
		console.warn("partner-banner: DSN import failed, keeping the authored content", err);
		return;
	}
	const media = asMedia(photo);
	if (media) banner.prepend(media);
	block.replaceChildren(banner);
}
export { decorate as default };
