// src/blocks/testimonials-component/testimonials-component.js
function decorate(block, options) {
	if (options) {
		block = block.querySelector(".block");
		block.closest(".section").classList.add("we-container");
	}
	block.closest(".section").dataset;
	const [title, subtitle, source, ...reviews] = block.children;
	title.classList.add("title-class");
	subtitle.classList.add("subtitle-class");
	source.classList.add("source-class");
	const reviewsContainer = document.createElement("div");
	reviewsContainer.classList.add("reviews-container");
	reviews.forEach((review, index) => {
		review.classList.add("review");
		const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
		svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
		svg.setAttribute("viewBox", "0 0 448 512");
		svg.setAttribute("width", "32px");
		svg.setAttribute("height", "32px");
		svg.style.fill = "#006EFF";
		svg.innerHTML = "<!--!Font Awesome Pro 6.5.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2024 Fonticons, Inc.--><path d=\"M0 216C0 149.7 53.7 96 120 96h8 32v64H128h-8c-30.9 0-56 25.1-56 56v8H192V416H0V320 224v-8zm256 0c0-66.3 53.7-120 120-120h8 32v64H384h-8c-30.9 0-56 25.1-56 56v8H448V416H256V320 224v-8z\"/>";
		const reviewContainer = document.createElement("div");
		reviewContainer.classList.add("review-container");
		if (index === 0) reviewContainer.classList.add("show");
		else reviewContainer.classList.add("hide");
		reviewContainer.appendChild(svg);
		reviewContainer.appendChild(review);
		reviewsContainer.appendChild(reviewContainer);
	});
	block.appendChild(reviewsContainer);
	const prevButton = document.createElement("button");
	prevButton.innerHTML = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 320 512\" fill=\"#006EFF\" width=\"24\" height=\"24\"><path d=\"M18.7 256l22.6 22.6 160 160L224 461.3 269.3 416l-22.6-22.6L109.3 256 246.6 118.6 269.3 96 224 50.7 201.4 73.4l-160 160L18.7 256z\"/></svg>";
	prevButton.classList.add("prev-button");
	prevButton.addEventListener("click", () => {
		navigateSlider(-1);
	});
	const nextButton = document.createElement("button");
	nextButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" fill="#006EFF" width="24" height="24">
  <path d="M301.3 256l-22.6 22.6-160 160L96 461.3 50.7 416l22.6-22.6L210.7 256 73.4 118.6 50.7 96 96 50.7l22.6 22.6 160 160L301.3 256z"></path>
</svg>`;
	nextButton.classList.add("next-button");
	nextButton.addEventListener("click", () => {
		navigateSlider(1);
	});
	const navigationContainer = document.createElement("div");
	navigationContainer.classList.add("navigation-container");
	block.appendChild(navigationContainer);
	navigationContainer.appendChild(source);
	const buttonsContainer = document.createElement("div");
	buttonsContainer.classList.add("buttons-container");
	navigationContainer.appendChild(buttonsContainer);
	buttonsContainer.appendChild(prevButton);
	buttonsContainer.appendChild(nextButton);
	let currentIndex = 0;
	const reviewsCount = reviews.length;
	function navigateSlider(direction) {
		const currentReview = block.querySelector(".show");
		const nextIndex = (currentIndex + direction + reviewsCount) % reviewsCount;
		const nextReview = reviewsContainer.children[nextIndex];
		currentReview.classList.remove("show");
		currentReview.classList.add("hide");
		nextReview.classList.remove("hide");
		nextReview.classList.add("show");
		currentIndex = nextIndex;
	}
	window.dispatchEvent(new CustomEvent("shadowDomLoaded"), {
		bubbles: true,
		composed: true
	});
}
export { decorate as default };
