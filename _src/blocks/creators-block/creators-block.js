// src/blocks/creators-block/creators-block.js
function decorate(block) {
	const parentBlockStyle = block.closest(".section > div").style;
	const { backgroundColor } = block.closest(".section").dataset;
	if (backgroundColor) parentBlockStyle.backgroundColor = backgroundColor;
	block.querySelectorAll("table").forEach((table) => {
		const newDiv = document.createElement("div");
		newDiv.classList.add("creator-box");
		const linkToCreator = table.querySelector("tr:nth-child(4) td");
		const creatorLink = linkToCreator ? linkToCreator.textContent.trim() : "";
		const img = table.querySelector("tr:last-child").querySelector("img");
		let backgroundImage = "";
		if (img) backgroundImage = `url(${img.src})`;
		table.querySelectorAll("tr").forEach((tr, rowIndex) => {
			if (rowIndex === table.rows.length - 1) return;
			tr.querySelectorAll("td").forEach((td) => {
				const innerDiv = document.createElement("div");
				innerDiv.innerHTML = td.innerHTML;
				newDiv.style.background = `linear-gradient(to bottom, rgba(0, 0, 0, 0) 60%, #000 100%), ${backgroundImage}`;
				newDiv.style.backgroundSize = "cover";
				newDiv.style.backgroundPosition = "center";
				newDiv.appendChild(innerDiv);
			});
		});
		const fourthDiv = newDiv.querySelectorAll("div:nth-child(4)");
		if (fourthDiv.length > 0) newDiv.removeChild(fourthDiv[0]);
		if (creatorLink) {
			const anchor = document.createElement("a");
			anchor.href = creatorLink;
			anchor.target = "_blank";
			anchor.appendChild(newDiv);
			table.parentNode.replaceChild(anchor, table);
		} else table.parentNode.removeChild(table);
	});
}
export { decorate as default };
