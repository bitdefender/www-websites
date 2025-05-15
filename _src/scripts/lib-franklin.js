import '../node_modules/@repobit/dex-utils/dist/src/index.js';
import page from './page.js';
import UserAgent from '../node_modules/@repobit/dex-utils/dist/src/user-agent/index.js';

const STICKY_NAVIGATION_SECTION_METADATA_KEY = "sticky-navigation-item";
const ALL_FRANKLIN_DEV_SUBDOMAINS = ["localhost", ".aem.page", ".aem.live"];
const STICKY_NAVIGATION_DATASET_KEY = "stickyNavName";
function sampleRUM(checkpoint, data = {}) {
  const SESSION_STORAGE_KEY = "aem-rum";
  sampleRUM.baseURL = sampleRUM.baseURL || new URL(window.RUM_BASE == null ? "https://rum.aem.page" : window.RUM_BASE, window.location);
  sampleRUM.defer = sampleRUM.defer || [];
  const defer = (fnname) => {
    sampleRUM[fnname] = sampleRUM[fnname] || ((...args) => sampleRUM.defer.push({ fnname, args }));
  };
  sampleRUM.drain = sampleRUM.drain || ((dfnname, fn) => {
    sampleRUM[dfnname] = fn;
    sampleRUM.defer.filter(({ fnname }) => dfnname === fnname).forEach(({ fnname, args }) => sampleRUM[fnname](...args));
  });
  sampleRUM.always = sampleRUM.always || [];
  sampleRUM.always.on = (chkpnt, fn) => {
    sampleRUM.always[chkpnt] = fn;
  };
  sampleRUM.on = (chkpnt, fn) => {
    sampleRUM.cases[chkpnt] = fn;
  };
  defer("observe");
  defer("cwv");
  try {
    window.hlx = window.hlx || {};
    if (!window.hlx.rum) {
      const usp = new URLSearchParams(window.location.search);
      const weight2 = usp.get("rum") === "on" ? 1 : 100;
      const id2 = Array.from({ length: 75 }, (_, i) => String.fromCharCode(48 + i)).filter((a) => /\d|[A-Z]/i.test(a)).filter(() => Math.random() * 75 > 70).join("");
      const random = Math.random();
      const isSelected = random * weight2 < 1;
      const firstReadTime2 = window.performance ? window.performance.timeOrigin : Date.now();
      const urlSanitizers = {
        full: () => window.location.href,
        origin: () => window.location.origin,
        path: () => window.location.href.replace(/\?.*$/, "")
      };
      const rumSessionStorage = sessionStorage.getItem(SESSION_STORAGE_KEY) ? JSON.parse(sessionStorage.getItem(SESSION_STORAGE_KEY)) : {};
      rumSessionStorage.pages = (rumSessionStorage.pages ? rumSessionStorage.pages : 0) + 1 + /* noise */
      (Math.floor(Math.random() * 20) - 10);
      sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(rumSessionStorage));
      window.hlx.rum = {
        weight: weight2,
        id: id2,
        random,
        isSelected,
        firstReadTime: firstReadTime2,
        sampleRUM,
        sanitizeURL: urlSanitizers[window.hlx.RUM_MASK_URL || "path"],
        rumSessionStorage
      };
    }
    const { weight, id, firstReadTime } = window.hlx.rum;
    if (window.hlx && window.hlx.rum && window.hlx.rum.isSelected) {
      const knownProperties = ["weight", "id", "referer", "checkpoint", "t", "source", "target", "cwv", "CLS", "FID", "LCP", "INP", "TTFB"];
      const sendPing = (pdata = data) => {
        const t = Math.round(window.performance ? window.performance.now() : Date.now() - firstReadTime);
        const body = JSON.stringify({ weight, id, referer: window.hlx.rum.sanitizeURL(), checkpoint, t, ...data }, knownProperties);
        const url = new URL(`.rum/${weight}`, sampleRUM.baseURL).href;
        navigator.sendBeacon(url, body);
        console.debug(`ping:${checkpoint}`, pdata);
      };
      sampleRUM.cases = sampleRUM.cases || {
        cwv: () => sampleRUM.cwv(data) || true,
        lazy: () => {
          const script = document.createElement("script");
          script.src = "https://rum.aem.page/.rum/@adobe/helix-rum-enhancer@^1/src/index.js";
          document.head.appendChild(script);
          return true;
        }
      };
      sendPing(data);
      if (sampleRUM.cases[checkpoint]) {
        sampleRUM.cases[checkpoint]();
      }
    }
    if (sampleRUM.always[checkpoint]) {
      sampleRUM.always[checkpoint](data);
    }
  } catch (error) {
  }
}
async function loadCSS(href) {
  return new Promise((resolve, reject) => {
    if (!document.querySelector(`head > link[href="${href}"]`)) {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = href;
      link.onload = resolve;
      link.onerror = reject;
      document.head.append(link);
    } else {
      resolve();
    }
  });
}
function getMetadata(name) {
  const attr = name && name.includes(":") ? "property" : "name";
  const meta = [...document.head.querySelectorAll(`meta[${attr}="${name}"]`)].map((m) => m.content).join(", ");
  return meta || "";
}
function toClassName(name) {
  return typeof name === "string" ? name.toLowerCase().replace(/[^\w\u4e00-\u9fa5]/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "") : "";
}
function toCamelCase(name) {
  return toClassName(name).replace(/-([a-z])/g, (g) => g[1].toUpperCase());
}
function getAllMetadata(scope) {
  return [...document.head.querySelectorAll(`meta[property^="${scope}:"],meta[name^="${scope}-"]`)].reduce((res, meta) => {
    const id = toClassName(meta.name ? meta.name.substring(scope.length + 1) : meta.getAttribute("property").split(":")[1]);
    res[id] = meta.getAttribute("content");
    return res;
  }, {});
}
const ICONS_CACHE = {};
async function internalDecorateIcons(element) {
  const icons = [...element.querySelectorAll("span.icon")];
  await Promise.all(icons.map(async (span) => {
    const iconName = Array.from(span.classList).find((c) => c.startsWith("icon-")).substring(5);
    if (!ICONS_CACHE[iconName]) {
      ICONS_CACHE[iconName] = true;
      try {
        const dynamicIconsSharepointPath = "/common/icons/";
        const response = await fetch(`${dynamicIconsSharepointPath}${iconName}.svg`);
        if (!response.ok) {
          ICONS_CACHE[iconName] = false;
          return;
        }
        const svg = await response.text();
        ICONS_CACHE[iconName] = { html: svg };
      } catch (error) {
        ICONS_CACHE[iconName] = false;
        console.error(error);
      }
    }
  }));
  icons.forEach((span) => {
    const iconName = Array.from(span.classList).find((c) => c.startsWith("icon-")).substring(5);
    const parent = span.firstElementChild?.tagName === "A" ? span.firstElementChild : span;
    try {
      const spanParent = span.parentElement;
      if (spanParent?.tagName === "A" && !spanParent?.hasAttribute("aria-label")) {
        spanParent.setAttribute("aria-label", iconName);
      }
    } catch (error) {
      console.error(`Error setting aria-label for icon ${iconName}:`, error);
    }
    parent.innerHTML = ICONS_CACHE[iconName].html;
  });
}
let previousDecoration = Promise.resolve();
async function decorateIcons(element) {
  previousDecoration = previousDecoration.then(() => internalDecorateIcons(element));
  await previousDecoration;
}
async function decorateTags(element) {
  const tagTypes = [
    { regex: /\[#(.*?)#\]/g, className: "dark-blue" },
    { regex: /\[{(.*?)}\]/g, className: "light-blue" },
    { regex: /\[blue-round(.*?)blue-round\]/g, className: "light-blue-round" },
    { regex: /\[\$(.*?)\$\]/g, className: "green" }
  ];
  function replaceTags(inputValue) {
    let nodeValue = inputValue;
    let replaced = false;
    tagTypes.forEach((tagType) => {
      let match = tagType.regex.exec(nodeValue);
      while (match !== null) {
        nodeValue = nodeValue.replace(match[0], `<span class="tag tag-${tagType.className}">${match[1]}</span>`);
        replaced = true;
        tagType.regex.lastIndex = 0;
        match = tagType.regex.exec(nodeValue);
      }
    });
    return { nodeValue, replaced };
  }
  function replaceTagsInNode(node) {
    if (node.nodeType === Node.TEXT_NODE) {
      const originalValue = node.nodeValue;
      const { nodeValue } = replaceTags(originalValue);
      if (nodeValue !== originalValue) {
        const newNode = document.createElement("span");
        newNode.innerHTML = nodeValue;
        node.parentNode.replaceChild(newNode, node);
      }
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      node.childNodes.forEach(replaceTagsInNode);
    }
  }
  replaceTagsInNode(element);
}
function decorateBlock(block) {
  const shortBlockName = block.classList[0];
  if (shortBlockName) {
    block.classList.add("block");
    block.dataset.blockName = shortBlockName;
    block.dataset.blockStatus = "initialized";
    const blockWrapper = block.parentElement;
    blockWrapper.classList.add(`${shortBlockName}-wrapper`);
    const section = block.closest(".section");
    if (section) section.classList.add(`${shortBlockName}-container`);
  }
}
function readBlockConfig(block) {
  const config = {};
  block.querySelectorAll(":scope > div").forEach((row) => {
    if (row.children) {
      const cols = [...row.children];
      if (cols[1]) {
        const col = cols[1];
        const name = toClassName(cols[0].textContent);
        let value = "";
        if (col.querySelector("a")) {
          const as = [...col.querySelectorAll("a")];
          if (as.length === 1) {
            value = as[0].href;
          } else {
            value = as.map((a) => a.href);
          }
        } else if (col.querySelector("img")) {
          const imgs = [...col.querySelectorAll("img")];
          if (imgs.length === 1) {
            value = imgs[0].src;
          } else {
            value = imgs.map((img) => img.src);
          }
        } else if (col.querySelector("p")) {
          const ps = [...col.querySelectorAll("p")];
          if (ps.length === 1) {
            value = ps[0].textContent;
          } else {
            value = ps.map((p) => p.textContent);
          }
        } else value = row.children[1].textContent;
        config[name] = value;
      }
    }
  });
  return config;
}
function decorateSections(main) {
  main.querySelectorAll(":scope > div").forEach((section) => {
    const wrappers = [];
    let defaultContent = false;
    [...section.children].forEach((e) => {
      if (e.tagName === "DIV" || !defaultContent) {
        const wrapper = document.createElement("div");
        wrappers.push(wrapper);
        defaultContent = e.tagName !== "DIV";
        if (defaultContent) wrapper.classList.add("default-content-wrapper");
      }
      wrappers[wrappers.length - 1].append(e);
    });
    wrappers.forEach((wrapper) => section.append(wrapper));
    section.classList.add("section");
    section.dataset.sectionStatus = "initialized";
    section.style.display = "none";
    const sectionMeta = section.querySelector("div.section-metadata");
    if (sectionMeta) {
      const meta = readBlockConfig(sectionMeta);
      Object.keys(meta).forEach((key) => {
        if (key === "style") {
          const styles = meta.style.split(",").map((style) => toClassName(style.trim()));
          styles.forEach((style) => section.classList.add(style));
        } else if (key === STICKY_NAVIGATION_SECTION_METADATA_KEY) {
          section.id = `section-${toClassName(meta[key])}`;
          section.dataset[STICKY_NAVIGATION_DATASET_KEY] = meta[key];
        } else if (key === "id") {
          section.id = meta[key];
        } else {
          section.dataset[toCamelCase(key)] = meta[key];
        }
      });
      sectionMeta.parentNode.remove();
    }
  });
}
function updateSectionsStatus(main) {
  const sections = [...main.querySelectorAll(":scope > div.section")];
  for (let i = 0; i < sections.length; i += 1) {
    const section = sections[i];
    const status = section.dataset.sectionStatus;
    if (status !== "loaded") {
      const loadingBlock = section.querySelector('.block[data-block-status="initialized"], .block[data-block-status="loading"]');
      if (loadingBlock) {
        section.dataset.sectionStatus = "loading";
        break;
      } else {
        section.dataset.sectionStatus = "loaded";
        section.style.display = null;
      }
    }
  }
}
function decorateBlocks(main) {
  main.querySelectorAll("div.section > div > div").forEach(decorateBlock);
}
function buildBlock(blockName, content) {
  const table = Array.isArray(content) ? content : [[content]];
  const blockEl = document.createElement("div");
  blockEl.classList.add(blockName);
  table.forEach((row) => {
    const rowEl = document.createElement("div");
    row.forEach((col) => {
      const colEl = document.createElement("div");
      const vals = col.elems ? col.elems : [col];
      vals.forEach((val) => {
        if (val) {
          if (typeof val === "string") {
            colEl.innerHTML += val;
          } else {
            colEl.appendChild(val);
          }
        }
      });
      rowEl.appendChild(colEl);
    });
    blockEl.appendChild(rowEl);
  });
  return blockEl;
}
function getBlockConfig(block) {
  const { blockName } = block.dataset;
  const cssPath = `${window.hlx.codeBasePath}/blocks/${blockName}/${blockName}.css`;
  const jsPath = `${window.hlx.codeBasePath}/blocks/${blockName}/${blockName}.js`;
  const original = { blockName, cssPath, jsPath };
  return (window.hlx.patchBlockConfig || []).filter((fn) => typeof fn === "function").reduce((config, fn) => fn(config, original), { blockName, cssPath, jsPath });
}
async function loadModule(name, jsPath, cssPath, ...args) {
  const cssLoaded = cssPath ? loadCSS(cssPath) : Promise.resolve();
  const decorationComplete = jsPath ? new Promise((resolve) => {
    (async () => {
      let mod;
      try {
        mod = await import(jsPath);
        if (mod.default) {
          await mod.default.apply(null, args);
        }
      } catch (error) {
        console.log(`failed to load module for ${name}`, error);
      }
      resolve(mod);
    })();
  }) : Promise.resolve();
  return Promise.all([cssLoaded, decorationComplete]).then(([, api]) => api);
}
async function loadBlock(block) {
  const status = block.dataset.blockStatus;
  if (status !== "loading" && status !== "loaded") {
    block.dataset.blockStatus = "loading";
    const { blockName, cssPath, jsPath } = getBlockConfig(block);
    try {
      await loadModule(blockName, jsPath, cssPath, block);
    } catch (error) {
      console.log(`failed to load block ${blockName}`, error);
    }
    block.dataset.blockStatus = "loaded";
  }
}
async function loadBlocks(main) {
  updateSectionsStatus(main);
  const blocks = [...main.querySelectorAll("div.block")];
  for (let i = 0; i < blocks.length; i += 1) {
    await loadBlock(blocks[i]);
    updateSectionsStatus(main);
  }
}
function createOptimizedPicture(src, alt = "", eager = false, breakpoints = [{ media: "(min-width: 600px)", width: "2000" }, { width: "750" }]) {
  const url = new URL(src, window.location.href);
  const picture = document.createElement("picture");
  const { pathname } = url;
  const ext = pathname.substring(pathname.lastIndexOf(".") + 1);
  breakpoints.forEach((br) => {
    const source = document.createElement("source");
    if (br.media) source.setAttribute("media", br.media);
    source.setAttribute("type", "image/webp");
    source.setAttribute("srcset", `${pathname}?width=${br.width}&format=webply&optimize=medium`);
    picture.appendChild(source);
  });
  breakpoints.forEach((br, i) => {
    if (i < breakpoints.length - 1) {
      const source = document.createElement("source");
      if (br.media) source.setAttribute("media", br.media);
      source.setAttribute("srcset", `${pathname}?width=${br.width}&format=${ext}&optimize=medium`);
      picture.appendChild(source);
    } else {
      const img = document.createElement("img");
      img.setAttribute("loading", eager ? "eager" : "lazy");
      img.setAttribute("alt", alt);
      picture.appendChild(img);
      img.setAttribute("src", `${pathname}?width=${br.width}&format=${ext}&optimize=medium`);
    }
  });
  return picture;
}
function setImageDimensions(pictureElement, width, height) {
  const imgTag = pictureElement.querySelector("img");
  if (imgTag) {
    imgTag.setAttribute("width", width);
    imgTag.setAttribute("height", height);
  }
}
function normalizeHeadings(el, allowedHeadings) {
  const allowed = allowedHeadings.map((h) => h.toLowerCase());
  el.querySelectorAll("h1, h2, h3, h4, h5, h6").forEach((tag) => {
    const h = tag.tagName.toLowerCase();
    if (allowed.indexOf(h) === -1) {
      let level = parseInt(h.charAt(1), 10) - 1;
      while (allowed.indexOf(`h${level}`) === -1 && level > 0) {
        level -= 1;
      }
      if (level === 0) {
        while (allowed.indexOf(`h${level}`) === -1 && level < 7) {
          level += 1;
        }
      }
      if (level !== 7) {
        tag.outerHTML = `<h${level} id="${tag.id}">${tag.textContent}</h${level}>`;
      }
    }
  });
}
function decorateTemplateAndTheme() {
  const addClasses = (element, classes) => {
    classes.split(",").forEach((c) => {
      element.classList.add(toClassName(c.trim()));
    });
  };
  const darkMode = page.getParamValue("theme");
  if (darkMode && darkMode === "dark") addClasses(document.body, "dark-mode");
  const template = getMetadata("template");
  if (template) addClasses(document.body, template);
  const theme = getMetadata("theme");
  if (theme) addClasses(document.body, theme);
}
function decorateButtons(element) {
  const wrapButtonText = (a) => a.innerHTML.startsWith("<") ? `${a.querySelector("span.icon")?.outerHTML || ""}<span class="button-text">${a.textContent}</span>` : `<span class="button-text">${a.textContent}</span>${a.querySelector("span.icon")?.outerHTML || ""}`;
  element.querySelectorAll("a").forEach((a) => {
    if (a.closest(".nav-brand") || a.closest(".nav-sections")) {
      return;
    }
    a.title = a.title || a.textContent;
    if (a.href !== a.textContent) {
      const up = a.parentElement;
      const twoup = a.parentElement.parentElement;
      const threeup = a.parentElement.parentElement?.parentElement;
      if (!a.querySelector("img")) {
        if (a.innerText?.includes("[hide-mobile]")) {
          if (UserAgent.os === "ios" || UserAgent.os === "android") {
            a.remove();
            return;
          }
          const buttonText = a.innerText;
          a.innerText = buttonText.replace("[hide-mobile]", "");
        }
        if (up.childNodes.length === 1 && up.tagName === "STRONG" && twoup.childNodes.length === 1 && twoup.tagName === "P") {
          a.className = "button primary";
          twoup.classList.add("button-container");
          up.replaceWith(a);
          a.innerHTML = wrapButtonText(a);
          return;
        }
        if (up.childNodes.length === 1 && up.tagName === "EM" && twoup.childNodes.length === 1 && twoup.tagName === "STRONG" && threeup?.childNodes.length === 1 && threeup?.tagName === "P") {
          a.className = "button secondary";
          threeup.classList.add("button-container");
          up.replaceWith(a);
          a.innerHTML = wrapButtonText(a);
          return;
        }
        if (up.childNodes.length === 1 && up.tagName === "P" && a.href.includes("/fragments/")) {
          a.className = "button modal";
          up.classList.add("button-container");
          return;
        }
        if (up.childNodes.length === 1 && up.tagName === "P" && a.href.includes("central.bitdefender")) {
          a.className = "button central";
          up.classList.add("button-container");
          return;
        }
        if (up.childNodes.length === 3 && up.tagName === "P" && a.nextElementSibling?.tagName === "EM") {
          a.className = "button";
          up.classList.add("button-container");
          a.innerHTML = wrapButtonText(a);
          a.dataset.modal = a.nextSibling.textContent.trim().slice(1, -1);
          a.nextSibling.remove();
          return;
        }
        if (up.childNodes.length === 1 && up.tagName === "P" && up.innerText.startsWith("?")) {
          a.className = "info-button modal";
          up.classList.add("info-button-container");
          a.textContent = a.textContent.slice(1).trim();
          a.title = a.title.slice(1).trim();
          return;
        }
        if (up.childNodes.length === 1 && up.tagName === "P" && up.innerText.startsWith("->")) {
          a.className = "button link-arrow-right";
          up.classList.add("button-container");
          a.textContent = a.textContent.slice(2).trim();
          a.title = a.title.slice(2).trim();
          return;
        }
        if (up.childNodes.length === 1 && (up.tagName === "P" || up.tagName === "DIV")) {
          a.className = "button";
          up.classList.add("button-container");
          a.innerHTML = wrapButtonText(a);
        }
        if (up.tagName === "TD" && up.closest("table.ratings")) {
          a.className = "button";
          up.classList.add("button-container");
          a.innerHTML = wrapButtonText(a);
        }
      }
    }
  });
}
async function waitForLCP(lcpBlocks) {
  const block = document.querySelector(".block");
  const hasLCPBlock = block && lcpBlocks.includes(block.dataset.blockName);
  if (hasLCPBlock) await loadBlock(block);
  document.body.style.display = null;
  const lcpCandidate = document.querySelector("main img");
  await new Promise((resolve) => {
    if (lcpCandidate && !lcpCandidate.complete) {
      lcpCandidate.setAttribute("loading", "eager");
      lcpCandidate.addEventListener("load", resolve);
      lcpCandidate.addEventListener("error", resolve);
    } else {
      resolve();
    }
  });
}
function loadHeader(header) {
  const headerBlock = buildBlock("header", "");
  header.append(headerBlock);
  decorateBlock(headerBlock);
  return loadBlock(headerBlock);
}
function loadFooter(footer) {
  const footerBlock = buildBlock("footer", "");
  footer.append(footerBlock);
  decorateBlock(footerBlock);
  return loadBlock(footerBlock);
}
function parsePluginParams(id, config) {
  const pluginId = !config ? id.split("/").splice(id.endsWith("/") ? -2 : -1, 1)[0].replace(/\.js/, "") : id;
  const pluginConfig = {
    load: "eager",
    ...typeof config === "string" || !config ? { url: (config || id).replace(/\/$/, "") } : config
  };
  pluginConfig.options ||= {};
  return { id: pluginId, config: pluginConfig };
}
const executionContext = {
  createOptimizedPicture,
  getAllMetadata,
  getMetadata,
  decorateBlock,
  decorateButtons,
  decorateIcons,
  loadBlock,
  loadCSS,
  sampleRUM,
  toCamelCase,
  toClassName
};
class PluginsRegistry {
  #plugins;
  constructor() {
    this.#plugins = /* @__PURE__ */ new Map();
  }
  // Register a new plugin
  add(id, config) {
    const { id: pluginId, config: pluginConfig } = parsePluginParams(id, config);
    this.#plugins.set(pluginId, pluginConfig);
  }
  // Get the plugin
  get(id) {
    return this.#plugins.get(id);
  }
  // Check if the plugin exists
  includes(id) {
    return !!this.#plugins.has(id);
  }
  // Load all plugins that are referenced by URL, and updated their configuration with the
  // actual API they expose
  async load(phase) {
    [...this.#plugins.entries()].filter(([, plugin]) => plugin.condition && !plugin.condition(document, plugin.options, executionContext)).map(([id]) => this.#plugins.delete(id));
    return Promise.all([...this.#plugins.entries()].filter(([, plugin]) => (!plugin.condition || plugin.condition(document, plugin.options, executionContext)) && phase === plugin.load && plugin.url).map(async ([key, plugin]) => {
      try {
        const pluginApi = await loadModule(
          key,
          !plugin.url.endsWith(".js") ? `${plugin.url}/${key}.js` : plugin.url,
          !plugin.url.endsWith(".js") ? `${plugin.url}/${key}.css` : null,
          document,
          plugin.options,
          executionContext
        ) || {};
        this.#plugins.set(key, { ...plugin, ...pluginApi });
      } catch (err) {
        console.error("Could not load specified plugin", key);
      }
    }));
  }
  // Run a specific phase in the plugin
  async run(phase) {
    return [...this.#plugins.values()].reduce((promise, plugin) => (
      // Using reduce to execute plugins sequencially
      plugin[phase] && (!plugin.condition || plugin.condition(document, plugin.options, executionContext)) ? promise.then(() => plugin[phase](document, plugin.options, executionContext)) : promise
    ), Promise.resolve());
  }
}
class TemplatesRegistry {
  // Register a new template
  // eslint-disable-next-line class-methods-use-this
  add(id, url) {
    if (Array.isArray(id)) {
      id.forEach((i) => window.hlx.templates.add(i));
      return;
    }
    const { id: templateId, config: templateConfig } = parsePluginParams(id, url);
    templateConfig.condition = () => toClassName(getMetadata("template")) === templateId;
    window.hlx.plugins.add(templateId, templateConfig);
  }
  // Get the template
  // eslint-disable-next-line class-methods-use-this
  get(id) {
    return window.hlx.plugins.get(id);
  }
  // Check if the template exists
  // eslint-disable-next-line class-methods-use-this
  includes(id) {
    return window.hlx.plugins.includes(id);
  }
}
function setup() {
  window.hlx = window.hlx || {};
  window.hlx.RUM_MASK_URL = "full";
  window.hlx.codeBasePath = "";
  window.hlx.lighthouse = new URLSearchParams(window.location.search).get("lighthouse") === "on";
  window.hlx.patchBlockConfig = [];
  window.hlx.plugins = new PluginsRegistry();
  window.hlx.templates = new TemplatesRegistry();
  const scriptEl = document.querySelector('script[src$="/_src/scripts/scripts.js"]');
  if (scriptEl) {
    try {
      [window.hlx.codeBasePath] = new URL(scriptEl.src).pathname.split("/scripts/scripts.js");
    } catch (error) {
      console.log(error);
    }
  }
}
function initialiseSentry() {
  window.sentryOnLoad = () => {
    window.Sentry.init({
      // Alternatively, use `process.env.npm_package_version` for a dynamic release version
      // if your build tool supports it.
      release: "www-websites@1.0.0",
      // Set tracesSampleRate to 1.0 to capture 100%
      // of transactions for tracing.
      // We recommend adjusting this value in production
      // Learn more at
      // https://docs.sentry.io/platforms/javascript/configuration/options/#traces-sample-rate
      tracesSampleRate: 0.05,
      // Capture Replay for 10% of all sessions,
      // plus for 100% of sessions with an error
      // Learn more at
      // https://docs.sentry.io/platforms/javascript/session-replay/configuration/#general-integration-configuration
      replaysSessionSampleRate: 0.1,
      replaysOnErrorSampleRate: 1,
      allowUrls: ["www.bitdefender.com"]
    });
  };
}
function init() {
  initialiseSentry();
  setup();
  sampleRUM("top");
  window.addEventListener("load", () => sampleRUM("load"));
  window.addEventListener("unhandledrejection", (event) => {
    sampleRUM("error", { source: event.reason.sourceURL, target: event.reason.line });
  });
  window.addEventListener("error", (event) => {
    sampleRUM("error", { source: event.filename, target: event.lineno });
  });
}
init();

export { ALL_FRANKLIN_DEV_SUBDOMAINS, STICKY_NAVIGATION_DATASET_KEY, buildBlock, createOptimizedPicture, decorateBlock, decorateBlocks, decorateButtons, decorateIcons, decorateSections, decorateTags, decorateTemplateAndTheme, executionContext, getAllMetadata, getMetadata, loadBlock, loadBlocks, loadCSS, loadFooter, loadHeader, normalizeHeadings, readBlockConfig, sampleRUM, setImageDimensions, setup, toCamelCase, toClassName, updateSectionsStatus, waitForLCP };
//# sourceMappingURL=lib-franklin.js.map
