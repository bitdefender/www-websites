import { load } from "../../vendor/repobit/dex-system-design/loader.js";
// src/blocks/four-cards/four-cards.js
var toIcon = (src, alt = "") => {
	const icon = document.createElement("bd-img");
	icon.slot = "icon";
	icon.setAttribute("src", src);
	icon.setAttribute("alt", alt);
	icon.setAttribute("fit", "contain");
	return icon;
};
/** The card's icon, and the authored picture it was made from when there is one. */
var getIcon = (col) => {
	const iconSpan = col.querySelector("[class*=\"icon-\"]");
	if (iconSpan) {
		const iconName = Array.from(iconSpan.classList).find((cls) => cls.startsWith("icon-"))?.substring(5);
		if (iconName) return { icon: toIcon(`/common/icons/${iconName}.svg`) };
	}
	const picture = col.querySelector("picture");
	if (picture) {
		const img = picture.querySelector("img");
		const src = img?.currentSrc || img?.getAttribute("src");
		return {
			icon: src ? toIcon(src, img.getAttribute("alt") || "") : null,
			picture
		};
	}
	return {};
};
var buildCardItem = (row, shape) => {
	const headings = [...row.querySelectorAll("h4, h3, h2, h1")];
	const title = headings.map((h) => h.textContent.trim()).filter(Boolean).join(" ");
	const titleHtml = headings.map((h) => h.innerHTML.trim()).filter(Boolean).join("<br>");
	const item = document.createElement("bd-card");
	const { icon, picture: iconPicture } = getIcon(row);
	if (icon) item.append(icon);
	if (title) {
		const heading = document.createElement("bd-h");
		heading.slot = "title";
		heading.setAttribute("as", "h3");
		heading.innerHTML = titleHtml;
		item.append(heading);
	}
	[...row.querySelectorAll("p")].forEach((p) => {
		const picture = p.querySelector("picture");
		if (picture) {
			if (picture === iconPicture) return;
			const media = document.createElement("div");
			media.className = "card-media";
			media.append(picture.closest("a.linked-image") || picture);
			item.appendChild(media);
			return;
		}
		if (p.querySelector("[class*=\"icon-\"]") || !p.textContent.trim()) return;
		const link = p.querySelector("a");
		if (link) {
			const bdBtn = document.createElement("bd-button");
			bdBtn.setAttribute("appearance", "accent");
			bdBtn.setAttribute("href", link.getAttribute("href"));
			bdBtn.setAttribute("slot", "actions");
			bdBtn.setAttribute("size", "md");
			if (shape) bdBtn.setAttribute("shape", shape);
			bdBtn.textContent = link.textContent.trim();
			item.appendChild(bdBtn);
		} else {
			const bdP = document.createElement("bd-p");
			bdP.setAttribute("appearance", "regular");
			bdP.innerHTML = p.innerHTML;
			item.appendChild(bdP);
		}
	});
	return item;
};
async function decorate(block) {
	const { margintop, shape } = block.closest(".section").dataset;
	if (margintop) {
		const blockParent = block.closest(".section");
		blockParent.style.marginTop = `${margintop}px`;
	}
	const rows = [...block.children];
	const firstRow = rows[0];
	const firstRowHasMedia = firstRow?.querySelector("picture, img, [class*=\"icon-\"]");
	const firstRowHasDescription = [...firstRow?.querySelectorAll("p") || []].some((p) => !p.querySelector("picture") && !p.querySelector("[class*=\"icon-\"]") && p.textContent.trim());
	const isSectionTitleRow = !firstRowHasMedia && !firstRowHasDescription;
	const rowTitle = isSectionTitleRow ? firstRow?.querySelector("h1,h2,h3,h4,h5,h6")?.textContent?.trim() || "" : "";
	const cardRows = isSectionTitleRow ? rows.slice(1) : rows;
	const sectionEl = block.closest(".section");
	const isCentered = sectionEl?.classList.contains("centered");
	const isBlue = block.classList.contains("blue") || sectionEl?.classList.contains("blue");
	const cardSection = document.createElement("bd-card-grid");
	cardRows.forEach((row) => {
		const item = buildCardItem(row, shape);
		if (isCentered) {
			item.setAttribute("align", "center");
			item.querySelector("bd-button[slot=\"actions\"]")?.setAttribute("align", "center");
		}
		if (isBlue) item.setAttribute("background", "tint");
		cardSection.appendChild(item);
	});
	const allDefaultWrappers = [...sectionEl?.querySelectorAll(".default-content-wrapper") || []];
	const buttons = [];
	let sectionTitle = rowTitle || null;
	let subtitle = null;
	allDefaultWrappers.forEach((wrapper) => {
		const heading = wrapper.querySelector("h1,h2,h3,h4,h5,h6");
		if (heading && sectionTitle === null) {
			sectionTitle = heading.textContent.trim();
			heading.remove();
		}
		const subtitleP = [...wrapper.querySelectorAll("p")].find((p) => !p.querySelector("a") && !p.querySelector("picture") && p.textContent.trim());
		if (subtitleP && subtitle === null) {
			subtitle = subtitleP.textContent.trim();
			subtitleP.remove();
		}
		const link = wrapper.querySelector("a");
		if (link) {
			const bdBtn = document.createElement("bd-button");
			bdBtn.setAttribute("appearance", "accent");
			bdBtn.setAttribute("align", "center");
			bdBtn.setAttribute("href", link.getAttribute("href"));
			bdBtn.setAttribute("size", "md");
			if (shape) bdBtn.setAttribute("shape", shape);
			bdBtn.textContent = link.textContent.trim();
			buttons.push(bdBtn);
			(link.closest("p") || link.parentElement).remove();
		}
		if (!wrapper.textContent.trim()) wrapper.remove();
	});
	if (sectionTitle) {
		const title = document.createElement("bd-h");
		title.slot = "title";
		title.setAttribute("as", "h2");
		title.textContent = sectionTitle;
		const head = [title];
		if (subtitle) {
			const description = document.createElement("bd-p");
			description.slot = "description";
			description.textContent = subtitle;
			head.push(description);
		}
		cardSection.prepend(...head);
	}
	try {
		await load([cardSection, ...buttons]);
	} catch (err) {
		console.warn("four-cards: DSN import failed, continuing with native rendering", err);
	}
	block.replaceChildren(cardSection, ...buttons);
}
export { decorate as default };
