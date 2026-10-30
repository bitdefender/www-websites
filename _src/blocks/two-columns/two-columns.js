// src/blocks/two-columns/two-columns.js
function decorate(block) {
	const container = block.firstElementChild;
	container.classList.add("columns-container");
	[...container.children].forEach((col, index) => {
		col.classList.add("column", `column-${index + 1}`);
	});
	container.querySelectorAll("picture").forEach((picture) => {
		const columnParent = picture.closest(".column");
		if (columnParent) columnParent.classList.add("has-picture");
	});
}
export { decorate as default };
