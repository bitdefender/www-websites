// src/blocks/embed/embed.js
var loadScript = (url, callback, type) => {
	const head = document.querySelector("head");
	const script = document.createElement("script");
	script.src = url;
	if (type) script.setAttribute("type", type);
	script.onload = callback;
	head.append(script);
	return script;
};
var getDefaultEmbed = (url) => `<div style="left: 0; width: 100%; height: 0; position: relative; padding-bottom: 56.25%;">
    <iframe src="${url.href}" style="border: 0; top: 0; left: 0; width: 100%; height: 100%; position: absolute;" allowfullscreen=""
      scrolling="no" allow="encrypted-media" title="Content from ${url.hostname}" loading="lazy">
    </iframe>
  </div>`;
var embedYoutube = (url, autoplay) => {
	const usp = new URLSearchParams(url.search);
	const suffix = autoplay ? "&muted=1&autoplay=1" : "";
	let vid = encodeURIComponent(usp.get("v"));
	const embed = url.pathname;
	if (url.origin.includes("youtu.be")) [, vid] = url.pathname.split("/");
	return `<div style="left: 0; width: 100%; height: 0; position: relative; padding-bottom: 56.25%;">
      <iframe src="https://www.youtube.com${vid ? `/embed/${vid}?rel=0&v=${vid}${suffix}` : embed}" style="border: 0; top: 0; left: 0; width: 100%; height: 100%; position: absolute;" 
      allow="autoplay; fullscreen; picture-in-picture; encrypted-media; accelerometer; gyroscope; picture-in-picture" allowfullscreen="" scrolling="no" title="Content from Youtube" loading="lazy"></iframe>
    </div>`;
};
var embedVimeo = (url, autoplay) => {
	const [, video] = url.pathname.split("/");
	return `<div style="left: 0; width: 100%; height: 0; position: relative; padding-bottom: 56.25%;">
      <iframe src="https://player.vimeo.com/video/${video}${autoplay ? "?muted=1&autoplay=1" : ""}" 
      style="border: 0; top: 0; left: 0; width: 100%; height: 100%; position: absolute;" 
      frameborder="0" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen  
      title="Content from Vimeo" loading="lazy"></iframe>
    </div>`;
};
var embedTwitter = (url) => {
	const embedHTML = `<blockquote class="twitter-tweet"><a href="${url.href}"></a></blockquote>`;
	loadScript("https://platform.twitter.com/widgets.js");
	return embedHTML;
};
var loadEmbed = (block, link, autoplay) => {
	if (block.classList.contains("embed-is-loaded")) return;
	const config = [
		{
			match: ["youtube", "youtu.be"],
			embed: embedYoutube
		},
		{
			match: ["vimeo"],
			embed: embedVimeo
		},
		{
			match: ["twitter"],
			embed: embedTwitter
		}
	].find((e) => e.match.some((match) => link.includes(match)));
	const url = new URL(link);
	if (config) {
		block.innerHTML = config.embed(url, autoplay);
		block.classList.add(`embed-${config.match[0]}`);
	} else block.innerHTML = getDefaultEmbed(url);
	block.classList.add("embed-is-loaded");
};
function decorate(block) {
	const placeholder = block.querySelector("picture");
	const link = block.querySelector("a").href;
	const autoplayType = !block.classList.contains("autoplay-off");
	block.textContent = "";
	if (placeholder) {
		const wrapper = document.createElement("div");
		wrapper.className = "embed-placeholder";
		wrapper.innerHTML = "<div class=\"embed-placeholder-play\"><button title=\"Play\"></button></div>";
		wrapper.prepend(placeholder);
		wrapper.addEventListener("click", () => {
			loadEmbed(block, link, autoplayType);
		});
		block.append(wrapper);
	} else {
		const observer = new IntersectionObserver((entries) => {
			if (entries.some((e) => e.isIntersecting)) {
				observer.disconnect();
				loadEmbed(block, link, autoplayType);
			}
		});
		observer.observe(block);
	}
}
export { decorate as default };
