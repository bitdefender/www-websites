// src/blocks/bitdef-vs-brands/bitdef-vs-brands.js
function decorate(block) {
	block.querySelectorAll(".bitdef-vs-brands-wrapper table").forEach((table) => {
		table.closest("div").classList.add("table-container");
		table.querySelectorAll("tr").forEach((row, rowIndex) => {
			row.classList.add(`row-${rowIndex}`);
			if (rowIndex >= 3 && rowIndex <= 5) {
				if (rowIndex === 3) row.classList.add("blue-background");
				else row.classList.add("grey-background");
				row.querySelectorAll("td").forEach((td) => {
					td.classList.add("same-line");
				});
			}
			row.querySelectorAll("td").forEach((cell, cellIndex) => {
				cell.classList.add(`column-${cellIndex}`);
			});
		});
	});
	const firstDiv = block.querySelector(".bitdef-vs-brands > div");
	firstDiv.classList.add("heading-container");
	const newContainerDiv = document.createElement("div");
	newContainerDiv.classList.add("new-container");
	while (firstDiv.nextSibling) newContainerDiv.appendChild(firstDiv.nextSibling);
	block.insertBefore(newContainerDiv, firstDiv.nextSibling);
	const section = block;
	new IntersectionObserver(((entries, observer) => {
		entries.forEach((entry) => {
			if (entry.isIntersecting && !entry.target.dataset.animationTriggered) {
				entry.target.querySelectorAll("table").forEach((table) => {
					table.querySelectorAll(".same-line").forEach((row, index) => {
						row.classList.add(`animate-row${index + 1}`);
					});
				});
				entry.target.dataset.animationTriggered = true;
			}
		});
	}), { threshold: .5 }).observe(section);
}
export { decorate as default };
