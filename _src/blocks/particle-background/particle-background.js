import { loadAll } from "../../vendor/tsparticles/all.js";
import { tsParticles } from "../../vendor/tsparticles/engine.js";
// src/blocks/particle-background/particle-background.js
async function init(block, aemOptions) {
	const particleIdSelector = "ts-particles";
	const particleDiv = document.createElement("div");
	particleDiv.setAttribute("id", particleIdSelector);
	if (aemOptions) {
		block = block.querySelector(".block");
		block.closest(".section").classList.add("we-container");
	} else block.parentElement.classList.add("we-container");
	block.parentElement.querySelector(".particle-background").prepend(particleDiv);
	async function loadParticles(options) {
		await loadAll(tsParticles);
		await tsParticles.load({
			id: particleIdSelector,
			options
		});
	}
	await loadParticles({
		particles: {
			number: { value: 20 },
			color: { value: "#ffffff" },
			links: {
				enable: true,
				distance: 200
			},
			shape: { type: "circle" },
			opacity: { value: .6 },
			size: { value: {
				min: 2,
				max: 4
			} },
			move: {
				enable: true,
				speed: .5
			}
		},
		background: { color: "#016DFF" },
		poisson: { enable: true },
		fullScreen: { enable: false }
	});
}
async function decorate(block, options) {
	await init(block, options);
	window.dispatchEvent(new CustomEvent("shadowDomLoaded"), {
		bubbles: true,
		composed: true
	});
}
export { decorate as default };
