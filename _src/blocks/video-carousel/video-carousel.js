import { embedYoutube } from "../../scripts/utils/utils.js";
import YouTubeTracker from "../../scripts/utils/youtube-tracker.js";
// src/blocks/video-carousel/video-carousel.js
function createCarousel(block, videos, titles) {
	const carouselContainer = document.createElement("div");
	carouselContainer.classList.add("carousel-container");
	const carouselTrack = document.createElement("div");
	carouselTrack.classList.add("carousel-track");
	videos.forEach((video, index) => {
		const carouselItem = document.createElement("div");
		carouselItem.classList.add("carousel-item");
		const videoTitle = document.createElement("div");
		videoTitle.classList.add("video-title");
		videoTitle.textContent = titles[index];
		const url = new URL(video);
		const videoContainer = document.createElement("div");
		videoContainer.classList.add("video-container");
		videoContainer.innerHTML = embedYoutube(url);
		if (!videoContainer.querySelector("iframe")) return;
		const videoId = videoContainer.querySelector("iframe").getAttribute("id");
		new YouTubeTracker(block, video, url, videoId).initialize();
		carouselItem.appendChild(videoContainer);
		carouselItem.appendChild(videoTitle);
		carouselTrack.appendChild(carouselItem);
		carouselTrack.scroll({ behavior: "smooth" });
	});
	carouselContainer.appendChild(carouselTrack);
	block.appendChild(carouselContainer);
	const carouselNav = document.createElement("div");
	carouselNav.classList.add("carousel-navigation");
	videos.forEach((_, index) => {
		const dot = document.createElement("div");
		dot.classList.add("carousel-dot");
		if (index === 0) dot.classList.add("active");
		dot.addEventListener("click", () => moveToSlide(index));
		carouselNav.appendChild(dot);
	});
	block.appendChild(carouselNav);
	let currentIndex = 0;
	function moveToSlide(index) {
		const dots = document.querySelectorAll(".carousel-dot");
		dots[currentIndex].classList.remove("active");
		dots[index].classList.add("active");
		currentIndex = index;
		carouselTrack.style.transform = `translateX(-${block.querySelector(".carousel-item")?.offsetWidth * index}px)`;
	}
}
function decorate(block) {
	const videos = Object.values(block.closest(".section").dataset).filter((value) => value.includes("https://www.youtube.com/embed/"));
	const titles = Object.keys(block.closest(".section").dataset).filter((key) => key.includes("title")).map((key) => block.closest(".section").dataset[key]);
	if (videos) createCarousel(block, videos, titles);
}
export { decorate as default };
