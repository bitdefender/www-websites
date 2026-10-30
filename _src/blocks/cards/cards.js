import { createOptimizedPicture } from "../../scripts/lib-franklin.js";
// src/blocks/cards/cards.js
function decorate(block) {
	const ul = document.createElement("ul");
	[...block.children].forEach((row) => {
		const li = document.createElement("li");
		li.innerHTML = row.innerHTML;
		[...li.children].forEach((div) => {
			if (div.children.length === 1 && div.querySelector("picture")) div.className = "cards-card-image";
			else div.className = "cards-card-body";
		});
		ul.append(li);
	});
	ul.querySelectorAll("img").forEach((img) => img.closest("picture").replaceWith(createOptimizedPicture(img.src, img.alt, false, [{ width: "750" }])));
	block.textContent = "";
	block.append(ul);
}
export { decorate as default };
