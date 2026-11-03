// src/blocks/data-columns/data-columns.js
function decorate(block) {
	const section = block.closest(".section");
	const { backgroundColor, active } = section.dataset;
	if (backgroundColor) section.style.backgroundColor = backgroundColor;
	block.querySelector("div:not(:first-child)").classList.add("data-wrapper");
	const columnLeft = block.querySelector(".data-wrapper > div:first-of-type");
	columnLeft?.classList.add("data-column-left");
	block.querySelector(".data-wrapper > div:nth-of-type(2)")?.classList.add("data-column-right");
	const articlesWrapper = block.querySelector("div:nth-of-type(3)");
	articlesWrapper?.classList.add("articles-wrapper");
	const nav = block.querySelector("ul");
	if (nav) {
		nav?.classList.add("nav-list", "dropdown-list");
		const activeItem = nav?.querySelector(`li:nth-child(${active})`) || nav?.querySelector("li:first-child");
		const activeText = activeItem?.textContent.trim() || "Select";
		const dropdown = document.createElement("div");
		dropdown.classList.add("dropdown");
		const trigger = document.createElement("div");
		trigger.classList.add("dropdown-trigger");
		trigger.textContent = activeText;
		dropdown.appendChild(trigger);
		dropdown.appendChild(nav);
		trigger.addEventListener("click", (e) => {
			e.stopPropagation();
			nav?.classList.toggle("open");
		});
		document.addEventListener("click", () => {
			nav?.classList.remove("open");
		});
		nav.querySelectorAll("li").forEach((li) => {
			li.classList.add("nav-item");
			const link = li.querySelector("a");
			li.addEventListener("click", (e) => {
				e.preventDefault();
				nav.querySelectorAll("li").forEach((item) => item.classList.remove("active"));
				li.classList.add("active");
				trigger.textContent = li.textContent.trim();
				nav.classList.remove("open");
				if (link?.href) window.location.href = link.href;
			});
		});
		activeItem?.classList.add("active");
		columnLeft.appendChild(dropdown);
	}
	articlesWrapper?.querySelectorAll("div")?.forEach((child, idx) => {
		if ((idx + 1) % 2 === 0) child.style.order = idx;
		else child.style.order = idx + 2;
		if (child.querySelector("img") || child.querySelector(".icon")) {
			child.classList.add("article-image");
			return;
		}
		child.classList.add("article-column");
	});
	const statsObserver = new IntersectionObserver((entries) => {
		entries.forEach((entry) => {
			if (!entry.isIntersecting) return;
			entry.target.querySelectorAll("h1").forEach((stat) => {
				const originalText = stat.textContent.trim();
				const normalized = originalText.replace(/[^0-9.,\s]/g, "").replace(/\s/g, "").replace(/,/g, ".").replace(/(\.\d*)\./g, "$1");
				const numericValue = parseFloat(normalized);
				if (Number.isNaN(numericValue)) return;
				stat.setAttribute("data-original", originalText);
				let current = 0;
				const increment = numericValue / 100;
				const animation = setInterval(() => {
					current += increment;
					if (current >= numericValue) {
						stat.textContent = originalText;
						clearInterval(animation);
						return;
					}
					const lower = originalText.toLowerCase();
					const suffixes = {
						trillion: [
							"trillion",
							"billón",
							"billion",
							"兆"
						],
						billion: [
							"billion",
							"milliard",
							"mil millones",
							"亿"
						],
						million: [
							"million",
							"millón",
							"百万"
						]
					};
					const formatValue = (num) => new Intl.NumberFormat(void 0, { maximumFractionDigits: 3 }).format(num);
					let matchedWord = null;
					Object.entries(suffixes).some(([, words]) => words.some((word) => {
						if (lower.includes(word.toLowerCase())) {
							matchedWord = word;
							return true;
						}
						return false;
					}));
					let formatted = formatValue(current);
					if (matchedWord) formatted = `${formatted} ${matchedWord}`;
					stat.textContent = formatted;
				}, 20);
			});
			statsObserver.unobserve(entry.target);
		});
	}, { threshold: .2 });
	statsObserver.observe(section);
}
export { decorate as default };
