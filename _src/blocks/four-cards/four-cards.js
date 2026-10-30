// src/blocks/four-cards/four-cards.js
var getIconElement = (col) => {
	const iconSpan = col.querySelector("[class*=\"icon-\"]");
	if (iconSpan) {
		const iconName = Array.from(iconSpan.classList).find((cls) => cls.startsWith("icon-"))?.substring(5);
		if (iconName) {
			const img = document.createElement("img");
			img.src = `/common/icons/${iconName}.svg`;
			img.setAttribute("slot", "icon");
			img.setAttribute("width", "32");
			img.setAttribute("height", "32");
			return img;
		}
	}
	const picture = col.querySelector("picture");
	if (picture) {
		const clone = picture.cloneNode(true);
		clone.setAttribute("slot", "icon");
		return clone;
	}
	return null;
};
var buildCardItem = (row, shape) => {
	const headings = [...row.querySelectorAll("h4, h3, h2, h1")];
	const title = headings.map((h) => h.textContent.trim()).filter(Boolean).join(" ");
	const titleHtml = headings.map((h) => h.innerHTML.trim()).filter(Boolean).join("<br>");
	const item = document.createElement("bd-card-item");
	item.setAttribute("title", title);
	if (titleHtml !== title) item.dataset.titleHtml = titleHtml;
	const iconEl = getIconElement(row);
	if (iconEl) item.appendChild(iconEl);
	const iconPicture = iconEl?.tagName === "PICTURE" ? row.querySelector("picture") : null;
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
			const bdBtn = document.createElement("bd-button-link");
			bdBtn.setAttribute("kind", "danger");
			bdBtn.setAttribute("href", link.getAttribute("href"));
			bdBtn.setAttribute("slot", "cta");
			bdBtn.setAttribute("size", "md");
			if (shape) bdBtn.setAttribute("shape", shape);
			bdBtn.textContent = link.textContent.trim();
			item.appendChild(bdBtn);
		} else {
			const bdP = document.createElement("bd-p");
			bdP.setAttribute("kind", "regular");
			bdP.innerHTML = p.innerHTML;
			item.appendChild(bdP);
		}
	});
	return item;
};
async function decorate(block) {
	try {
		await Promise.all([
			import("../../vendor/repobit/dex-system-design/cards.js"),
			import("../../vendor/repobit/dex-system-design/paragraph.js"),
			import("../../vendor/repobit/dex-system-design/button.js")
		]);
	} catch (err) {
		console.warn("four-cards: DSN import failed, continuing with native rendering", err);
	}
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
	const sectionTitle = isSectionTitleRow ? firstRow?.querySelector("h1,h2,h3,h4,h5,h6")?.textContent?.trim() || "" : "";
	const cardRows = isSectionTitleRow ? rows.slice(1) : rows;
	const sectionEl = block.closest(".section");
	const isCentered = sectionEl?.classList.contains("centered");
	const isBlue = block.classList.contains("blue") || sectionEl?.classList.contains("blue");
	const useSubgrid = block.classList.contains("use-subgrid") || sectionEl?.classList.contains("use-subgrid");
	const cardSection = document.createElement("bd-card-section");
	if (useSubgrid) cardSection.setAttribute("align-rows", "");
	if (sectionTitle) cardSection.setAttribute("title", sectionTitle);
	cardRows.forEach((row) => {
		const item = buildCardItem(row, shape);
		if (isCentered) {
			item.setAttribute("align", "center");
			item.querySelector("bd-button-link[slot=\"cta\"]")?.setAttribute("align", "center");
		}
		if (isBlue) item.setAttribute("bg-blue", "");
		if (shape) item.setAttribute("shape", shape);
		cardSection.appendChild(item);
	});
	block.replaceChildren(cardSection);
	block.querySelectorAll("bd-card-item[data-title-html]").forEach((cardItem) => {
		const bdH = cardItem.shadowRoot?.querySelector("bd-h");
		if (bdH) bdH.innerHTML = cardItem.dataset.titleHtml;
	});
	[...sectionEl?.querySelectorAll(".default-content-wrapper") || []].forEach((wrapper) => {
		const heading = wrapper.querySelector("h1,h2,h3,h4,h5,h6");
		if (heading && !cardSection.hasAttribute("title")) {
			cardSection.setAttribute("title", heading.textContent.trim());
			heading.remove();
		}
		const subtitleP = [...wrapper.querySelectorAll("p")].find((p) => !p.querySelector("a") && !p.querySelector("picture") && p.textContent.trim());
		if (subtitleP && !cardSection.hasAttribute("subtitle")) {
			cardSection.setAttribute("subtitle", subtitleP.textContent.trim());
			subtitleP.remove();
		}
		const link = wrapper.querySelector("a");
		if (link) {
			const bdBtn = document.createElement("bd-button-link");
			bdBtn.setAttribute("kind", "danger");
			bdBtn.setAttribute("align", "center");
			bdBtn.setAttribute("href", link.getAttribute("href"));
			bdBtn.setAttribute("size", "md");
			if (shape) bdBtn.setAttribute("shape", shape);
			bdBtn.textContent = link.textContent.trim();
			block.appendChild(bdBtn);
			(link.closest("p") || link.parentElement).remove();
		}
		if (!wrapper.textContent.trim()) wrapper.remove();
	});
}
export { decorate as default };
