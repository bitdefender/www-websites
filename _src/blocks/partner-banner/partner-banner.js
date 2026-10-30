import { wrapSectionInDsSection } from "../../scripts/utils/utils.js";
// src/blocks/partner-banner/partner-banner.js
var text = (el) => el?.textContent.replace(/\s+/g, " ").trim() || "";
var slotted = (picture, slot) => {
	if (!picture) return null;
	picture.setAttribute("slot", slot);
	const img = picture.querySelector("img");
	if (img) img.setAttribute("alt", img.getAttribute("alt") || "");
	return picture;
};
async function decorate(block) {
	wrapSectionInDsSection(block);
	try {
		await Promise.all([import("../../vendor/repobit/dex-system-design/partner-banner.js"), import("../../vendor/repobit/dex-system-design/button.js")]);
	} catch (err) {
		console.warn("partner-banner: DSN import failed, keeping the authored content", err);
		return;
	}
	const heading = block.querySelector("h1, h2, h3, h4, h5, h6");
	const headingCell = heading?.closest(".partner-banner > div > div");
	const pictures = [...block.querySelectorAll("picture")];
	const lockup = pictures.find((picture) => headingCell?.contains(picture));
	const photo = pictures.find((picture) => picture !== lockup);
	const copy = [...block.querySelectorAll("p")].filter((p) => text(p) && !p.querySelector("picture") && !headingCell?.contains(p));
	const links = copy.filter((p) => p.querySelector("a") && text(p) === text(p.querySelector("a")));
	const prose = copy.filter((p) => !links.includes(p));
	const attribution = prose.find((p) => p.querySelector("em, i") && text(p) === text(p.querySelector("em, i")));
	const [quote, lead] = prose.filter((p) => p !== attribution);
	const banner = document.createElement("bd-partner-banner");
	if (heading) banner.setAttribute("heading", text(heading));
	if (heading) banner.setAttribute("as", heading.tagName.toLowerCase());
	if (quote) banner.setAttribute("quote", text(quote));
	if (attribution) banner.setAttribute("attribution", text(attribution));
	if (lead) banner.setAttribute("lead", text(lead));
	const buttons = links.map((p) => {
		const link = p.querySelector("a");
		const button = document.createElement("bd-button-link");
		button.setAttribute("slot", "actions");
		const primary = p.querySelector("strong, b, a.button.primary");
		button.setAttribute("variant", primary ? "white" : "outline-white");
		button.setAttribute("href", link.getAttribute("href") || "");
		button.textContent = text(link);
		return button;
	});
	banner.append(...[
		slotted(photo, "photo"),
		slotted(lockup, "lockup"),
		...buttons
	].filter(Boolean));
	block.replaceChildren(banner);
}
export { decorate as default };
