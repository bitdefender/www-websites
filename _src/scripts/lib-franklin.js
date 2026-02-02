/* eslint-disable no-multi-spaces */
/* eslint-disable max-classes-per-file */
/*
 * Copyright 2022 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */

import { UserAgent } from '@repobit/dex-utils';
import page from './page.js';

const STICKY_NAVIGATION_SECTION_METADATA_KEY = 'sticky-navigation-item';
export const ALL_FRANKLIN_DEV_SUBDOMAINS = ['localhost', '.aem.page', '.aem.live'];
export const STICKY_NAVIGATION_DATASET_KEY = 'stickyNavName';

/**
 * log RUM if part of the sample.
 * @param {string} checkpoint identifies the checkpoint in funnel
 * @param {Object} data additional data for RUM sample
 * @param {string} data.source DOM node that is the source of a checkpoint event
 * identified by #id or .classname
 * @param {string} data.target subject of the checkpoint event,
 * for instance the href of a link, or a search term
 */
export function sampleRUM(checkpoint, data = {}) {
  const SESSION_STORAGE_KEY = 'aem-rum';
  sampleRUM.baseURL = sampleRUM.baseURL || new URL(window.RUM_BASE == null ? 'https://rum.aem.page' : window.RUM_BASE, window.location);
  sampleRUM.defer = sampleRUM.defer || [];
  const defer = (fnname) => {
    sampleRUM[fnname] = sampleRUM[fnname]
      || ((...args) => sampleRUM.defer.push({ fnname, args }));
  };
  sampleRUM.drain = sampleRUM.drain
    || ((dfnname, fn) => {
      sampleRUM[dfnname] = fn;
      sampleRUM.defer
        .filter(({ fnname }) => dfnname === fnname)
        .forEach(({ fnname, args }) => sampleRUM[fnname](...args));
    });
  sampleRUM.always = sampleRUM.always || [];
  sampleRUM.always.on = (chkpnt, fn) => { sampleRUM.always[chkpnt] = fn; };
  sampleRUM.on = (chkpnt, fn) => { sampleRUM.cases[chkpnt] = fn; };
  defer('observe');
  defer('cwv');
  try {
    window.hlx = window.hlx || {};
    if (!window.hlx.rum) {
      const usp = new URLSearchParams(window.location.search);
      const weight = (usp.get('rum') === 'on') ? 1 : 100; // with parameter, weight is 1. Defaults to 100.
      // eslint-disable-next-line no-bitwise
      const id = Array.from({ length: 75 }, (_, i) => String.fromCharCode(48 + i)).filter((a) => /\d|[A-Z]/i.test(a)).filter(() => Math.random() * 75 > 70).join('');
      const random = Math.random();
      const isSelected = (random * weight < 1);
      const firstReadTime = window.performance ? window.performance.timeOrigin : Date.now();
      const urlSanitizers = {
        full: () => window.location.href,
        origin: () => window.location.origin,
        path: () => window.location.href.replace(/\?.*$/, ''),
      };
      // eslint-disable-next-line max-len
      const rumSessionStorage = sessionStorage.getItem(SESSION_STORAGE_KEY) ? JSON.parse(sessionStorage.getItem(SESSION_STORAGE_KEY)) : {};
      // eslint-disable-next-line object-curly-newline, max-len
      rumSessionStorage.pages = (rumSessionStorage.pages ? rumSessionStorage.pages : 0) + 1 + /* noise */ (Math.floor(Math.random() * 20) - 10);
      sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(rumSessionStorage));
      window.hlx.rum = {
        weight, id, random, isSelected, firstReadTime, sampleRUM, sanitizeURL: urlSanitizers[window.hlx.RUM_MASK_URL || 'path'], rumSessionStorage,
      };
    }
    const { weight, id, firstReadTime } = window.hlx.rum;
    if (window.hlx && window.hlx.rum && window.hlx.rum.isSelected) {
      const knownProperties = ['weight', 'id', 'referer', 'checkpoint', 't', 'source', 'target', 'cwv', 'CLS', 'FID', 'LCP', 'INP', 'TTFB'];
      const sendPing = (pdata = data) => {
        // eslint-disable-next-line max-len
        const t = Math.round(window.performance ? window.performance.now() : (Date.now() - firstReadTime));
        // eslint-disable-next-line object-curly-newline, max-len, no-use-before-define
        const body = JSON.stringify({ weight, id, referer: window.hlx.rum.sanitizeURL(), checkpoint, t, ...data }, knownProperties);
        const url = new URL(`.rum/${weight}`, sampleRUM.baseURL).href;
        // eslint-disable-next-line no-unused-expressions
        navigator.sendBeacon(url, body);
        // eslint-disable-next-line no-console
        console.debug(`ping:${checkpoint}`, pdata);
      };
      sampleRUM.cases = sampleRUM.cases || {
        cwv: () => sampleRUM.cwv(data) || true,
        lazy: () => {
          // use classic script to avoid CORS issues
          const script = document.createElement('script');
          script.src = 'https://rum.aem.page/.rum/@adobe/helix-rum-enhancer@^1/src/index.js';
          document.head.appendChild(script);
          return true;
        },
      };
      sendPing(data);
      if (sampleRUM.cases[checkpoint]) { sampleRUM.cases[checkpoint](); }
    }
    if (sampleRUM.always[checkpoint]) { sampleRUM.always[checkpoint](data); }
  } catch (error) {
    // something went wrong
  }
}

/**
 * Loads a CSS file.
 * @param {string} href URL to the CSS file
 */
export async function loadCSS(href) {
  return new Promise((resolve, reject) => {
    if (!document.querySelector(`head > link[href="${href}"]`)) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = href;
      link.onload = resolve;
      link.onerror = reject;
      document.head.append(link);
    } else {
      resolve();
    }
  });
}

/**
 * Retrieves the content of metadata tags.
 * @param {string} name The metadata name (or property)
 * @returns {string} The metadata value(s)
 */
export function getMetadata(name) {
  const attr = name && name.includes(':') ? 'property' : 'name';
  const meta = [...document.head.querySelectorAll(`meta[${attr}="${name}"]`)].map((m) => m.content).join(', ');
  return meta || '';
}

/**
 * Sanitizes a string for use as class name.
 * @param {string} name The unsanitized string
 * @returns {string} The class name
 */
export function toClassName(name) {
  return typeof name === 'string'
    ? name.toLowerCase()
      .replace(/[^\w\u4e00-\u9fa5]/g, '-') // Include Chinese characters in the regular expression
      .replace(/-+/g, '-') // Replace consecutive hyphens with a single hyphen
      .replace(/^-|-$/g, '') // Remove leading and trailing hyphens
    : '';
}

/**
 * Sanitizes a string for use as a js property name.
 * @param {string} name The unsanitized string
 * @returns {string} The camelCased name
 */
export function toCamelCase(name) {
  return toClassName(name).replace(/-([a-z])/g, (g) => g[1].toUpperCase());
}

/**
 * Gets all the metadata elements that are in the given scope.
 * @param {String} scope The scope/prefix for the metadata
 * @returns an array of HTMLElement nodes that match the given scope
 */
export function getAllMetadata(scope) {
  return [...document.head.querySelectorAll(`meta[property^="${scope}:"],meta[name^="${scope}-"]`)]
    .reduce((res, meta) => {
      const id = toClassName(meta.name
        ? meta.name.substring(scope.length + 1)
        : meta.getAttribute('property').split(':')[1]);
      res[id] = meta.getAttribute('content');
      return res;
    }, {});
}

const ICONS_CACHE = {};
/**
 * Replace icons with inline SVG and prefix with codeBasePath.
 * @param {Element} [element] Element containing icons
 */
async function internalDecorateIcons(element) {
  // Download all new icons
  const icons = [...element.querySelectorAll('span.icon')];
  await Promise.all(icons.map(async (span) => {
    const iconName = Array.from(span.classList).find((c) => c.startsWith('icon-')).substring(5);
    if (!ICONS_CACHE[iconName]) {
      ICONS_CACHE[iconName] = true;
      try {
        const dynamicIconsSharepointPath = '/common/icons/';
        const response = await fetch(`${dynamicIconsSharepointPath}${iconName}.svg`);
        if (!response.ok) {
          ICONS_CACHE[iconName] = false;
          return;
        }

        const svg = await response.text();
        ICONS_CACHE[iconName] = { html: svg };
      } catch (error) {
        ICONS_CACHE[iconName] = false;
        // eslint-disable-next-line no-console
        console.error(error);
      }
    }
  }));

  icons.forEach((span) => {
    const iconName = Array.from(span.classList).find((c) => c.startsWith('icon-')).substring(5);
    const parent = span.firstElementChild?.tagName === 'A' ? span.firstElementChild : span;

    // Set aria-label if the parent is an anchor tag
    try {
      const spanParent = span.parentElement;
      if (spanParent?.tagName === 'A' && !spanParent?.hasAttribute('aria-label')) {
        spanParent.setAttribute('aria-label', iconName);
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(`Error setting aria-label for icon ${iconName}:`, error);
    }

    parent.innerHTML = ICONS_CACHE[iconName].html;
  });
}

let previousDecoration = Promise.resolve();

/**
 * Replace icons with inline SVG and prefix with codeBasePath.
 * @param {Element} [element] Element containing icons
 */
export async function decorateIcons(element) {
  previousDecoration = previousDecoration.then(() => internalDecorateIcons(element));
  await previousDecoration;
}

// Wrap content between bracketed markers even when it spans multiple nodes/elements.
// Preserves existing nodes and listeners by using DOM Range operations.
export async function decorateTags(root) {
  // Define open/close markers you support and the output class to apply.
  // Add 'blue-pill' as requested.
  const TAGS = [
    { open: '[#',          close: '#]',          className: 'dark-blue' },
    { open: '[{',          close: '}]',          className: 'light-blue' },
    { open: '[blue-round', close: 'blue-round]', className: 'light-blue-round' },
    { open: '[blue-pill',  close: 'blue-pill]',  className: 'blue-pill' },
    { open: '[$',          close: '$]',          className: 'green' },
  ];

  const OPEN_MARKERS = new Map(TAGS.map((t) => [t.open, t]));
  const OPEN_LIST = TAGS.map((t) => t.open);

  // Filter: skip inside already-decorated tags and script/style.
  const TW_FILTER = {
    acceptNode(node) {
      const p = node.parentElement;
      if (!p) return NodeFilter.FILTER_REJECT;
      if (p.closest('.tag')) return NodeFilter.FILTER_REJECT;
      const tag = p.tagName;
      if (tag === 'SCRIPT' || tag === 'STYLE') return NodeFilter.FILTER_REJECT;
      if (!node.nodeValue) return NodeFilter.FILTER_REJECT;
      return NodeFilter.FILTER_ACCEPT;
    },
  };

  // Helper: find earliest open marker in a text value.
  function findEarliestOpen(text) {
    let best = null;
    OPEN_LIST.forEach((open) => {
      const idx = text.indexOf(open);
      if (idx !== -1 && (best === null || idx < best.index)) {
        best = { index: idx, marker: open, tag: OPEN_MARKERS.get(open) };
      }
    });
    return best;
  }

  // Helper: get the next text node under `root` after `node`.
  function nextTextNodeAfter(node) {
    const w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, TW_FILTER);
    w.currentNode = node;
    return w.nextNode();
  }

  // Find the close marker for a given tag, starting at `startNode` and `fromOffset` in that node.
  function findClose(startNode, fromOffset, closeStr) {
    let node = startNode;
    let offset = fromOffset;
    while (node) {
      const text = node.nodeValue || '';
      const idx = text.indexOf(closeStr, offset);
      if (idx !== -1) {
        return { node, index: idx };
      }
      node = nextTextNodeAfter(node);
      offset = 0;
    }
    return null;
  }

  // Isolate an exact substring in a text node as its own node via splitText,
  // and return the node after it.
  // Example: given node "abc[#" and index at '[#', split before and after marker
  // -> remove or position around it.
  function isolateAndRemoveMarker(startNode, index, markerLength) {
    // Split at the start of marker.
    const markerStart = startNode.splitText(index);
    // Split after the marker.
    const afterMarker = markerStart.splitText(markerLength);
    // Remove the marker node itself.
    markerStart.remove();
    // For an open marker: the range should start at `afterMarker` offset 0.
    // For a close marker: the range should end at `afterMarker` offset 0.
    return afterMarker;
  }

  // Main pass: keep scanning until no changes (handles multiple tags).
  let changedSomething = true;
  while (changedSomething) {
    changedSomething = false;

    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, TW_FILTER);
    for (let textNode = walker.nextNode(); textNode; textNode = walker.nextNode()) {
      const text = textNode.nodeValue || '';
      const found = findEarliestOpen(text);
      // eslint-disable-next-line no-continue
      if (!found) continue;

      const { index: openIdx, tag } = found;

      // Remove/open: split the open marker out so we can start the range after it.
      const startAfterOpen = isolateAndRemoveMarker(textNode, openIdx, tag.open.length, true);

      // Find and isolate the closing marker across subsequent nodes.
      const closeHit = findClose(startAfterOpen, 0, tag.close);
      if (!closeHit) {
        // No close found: put the open marker back literally and continue.
        startAfterOpen.parentNode.insertBefore(document.createTextNode(tag.open), startAfterOpen);
        // eslint-disable-next-line no-continue
        continue;
      }

      const { node: endNode, index: closeIdx } = closeHit;
      const endAfterClose = isolateAndRemoveMarker(endNode, closeIdx, tag.close.length, false);

      // Wrap range [startAfterOpen (offset 0), endAfterClose (offset 0)]
      const range = new Range();
      range.setStart(startAfterOpen, 0);
      range.setEnd(endAfterClose, 0);

      const wrapper = document.createElement('span');
      wrapper.className = `tag tag-${tag.className}`;

      try {
        // This throws if the range partially selects a non-Text node;
        // we then fall back to extract/insert.
        range.surroundContents(wrapper);
      } catch {
        const frag = range.extractContents();
        wrapper.appendChild(frag);
        range.insertNode(wrapper);
      }

      changedSomething = true;

      // Restart the outer walk because the DOM changed (nodes shifted).
      break;
    }
  }
}

/**
 * Decorates a block.
 * @param {Element} block The block element
 */
export function decorateBlock(block) {
  const shortBlockName = block.classList[0];
  if (shortBlockName) {
    block.classList.add('block');
    block.dataset.blockName = shortBlockName;
    block.dataset.blockStatus = 'initialized';
    const blockWrapper = block.parentElement;
    blockWrapper.classList.add(`${shortBlockName}-wrapper`);
    const section = block.closest('.section');
    if (section) section.classList.add(`${shortBlockName}-container`);
  }
}

/**
 * Extracts the config from a block.
 * @param {Element} block The block element
 * @returns {object} The block config
 */
export function readBlockConfig(block) {
  const config = {};
  block.querySelectorAll(':scope > div').forEach((row) => {
    if (row.children) {
      const cols = [...row.children];
      if (cols[1]) {
        const col = cols[1];
        const name = toClassName(cols[0].textContent);
        let value = '';
        if (col.querySelector('a')) {
          const as = [...col.querySelectorAll('a')];
          if (as.length === 1) {
            value = as[0].href;
          } else {
            value = as.map((a) => a.href);
          }
        } else if (col.querySelector('img')) {
          const imgs = [...col.querySelectorAll('img')];
          if (imgs.length === 1) {
            value = imgs[0].src;
          } else {
            value = imgs.map((img) => img.src);
          }
        } else if (col.querySelector('p')) {
          const ps = [...col.querySelectorAll('p')];
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

/**
 * Decorates all sections in a container element.
 * @param {Element} main The container element
 */
export function decorateSections(main) {
  main.querySelectorAll(':scope > div').forEach((section) => {
    const wrappers = [];
    let defaultContent = false;
    [...section.children].forEach((e) => {
      if (e.tagName === 'DIV' || !defaultContent) {
        const wrapper = document.createElement('div');
        wrappers.push(wrapper);
        defaultContent = e.tagName !== 'DIV';
        if (defaultContent) wrapper.classList.add('default-content-wrapper');
      }
      wrappers[wrappers.length - 1].append(e);
    });
    wrappers.forEach((wrapper) => section.append(wrapper));
    section.classList.add('section');
    section.dataset.sectionStatus = 'initialized';
    section.style.display = 'none';

    /* process section metadata */
    const sectionMeta = section.querySelector('div.section-metadata');
    if (sectionMeta) {
      const meta = readBlockConfig(sectionMeta);
      Object.keys(meta).forEach((key) => {
        if (key === 'style') {
          const styles = meta.style.split(',').map((style) => toClassName(style.trim()));
          styles.forEach((style) => section.classList.add(style));
        } else if (key === STICKY_NAVIGATION_SECTION_METADATA_KEY) {
          section.id = `section-${toClassName(meta[key])}`;
          section.dataset[STICKY_NAVIGATION_DATASET_KEY] = meta[key];
        } else if (key === 'id') {
          section.id = meta[key];
        } else {
          section.dataset[toCamelCase(key)] = meta[key];
        }
      });
      sectionMeta.parentNode.remove();
    }
  });
}

/**
 * Updates all section status in a container element.
 * @param {Element} main The container element
 */
export function updateSectionsStatus(main) {
  const sections = [...main.querySelectorAll(':scope > div.section')];
  for (let i = 0; i < sections.length; i += 1) {
    const section = sections[i];
    const status = section.dataset.sectionStatus;
    if (status !== 'loaded') {
      const loadingBlock = section.querySelector('.block[data-block-status="initialized"], .block[data-block-status="loading"]');
      if (loadingBlock) {
        section.dataset.sectionStatus = 'loading';
        break;
      } else {
        section.dataset.sectionStatus = 'loaded';
        section.style.display = null;
      }
    }
  }
}

/**
 * Decorates all blocks in a container element.
 * @param {Element} main The container element
 */
export function decorateBlocks(main) {
  main
    .querySelectorAll('div.section > div > div')
    .forEach(decorateBlock);
}

/**
 * Builds a block DOM Element from a two dimensional array, string, or object
 * @param {string} blockName name of the block
 * @param {*} content two dimensional array or string or object of content
 */
export function buildBlock(blockName, content) {
  const table = Array.isArray(content) ? content : [[content]];
  const blockEl = document.createElement('div');
  // build image block nested div structure
  blockEl.classList.add(blockName);
  table.forEach((row) => {
    const rowEl = document.createElement('div');
    row.forEach((col) => {
      const colEl = document.createElement('div');
      const vals = col.elems ? col.elems : [col];
      vals.forEach((val) => {
        if (val) {
          if (typeof val === 'string') {
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
  return (blockEl);
}

/**
 * Gets the configuration for the given block, and also passes
 * the config through all custom patching helpers added to the project.
 *
 * @param {Element} block The block element
 * @returns {Object} The block config (blockName, cssPath and jsPath)
 */
function getBlockConfig(block) {
  const { blockName } = block.dataset;
  const cssPath = `${window.hlx.codeBasePath}/blocks/${blockName}/${blockName}.css`;
  const jsPath = `${window.hlx.codeBasePath}/blocks/${blockName}/${blockName}.js`;
  const original = { blockName, cssPath, jsPath };
  return (window.hlx.patchBlockConfig || [])
    .filter((fn) => typeof fn === 'function')
    .reduce((config, fn) => fn(config, original), { blockName, cssPath, jsPath });
}

/**
 * Loads JS and CSS for a module and executes it's default export.
 * @param {string} name The module name
 * @param {string} jsPath The JS file to load
 * @param {string} [cssPath] An optional CSS file to load
 * @param {object[]} [args] Parameters to be passed to the default export when it is called
 */
async function loadModule(name, jsPath, cssPath, ...args) {
  const cssLoaded = cssPath ? loadCSS(cssPath) : Promise.resolve();
  const decorationComplete = jsPath
    ? new Promise((resolve) => {
      (async () => {
        let mod;
        try {
          mod = await import(jsPath);
          if (mod.default) {
            await mod.default.apply(null, args);
          }
        } catch (error) {
          // eslint-disable-next-line no-console
          console.log(`failed to load module for ${name}`, error);
        }
        resolve(mod);
      })();
    })
    : Promise.resolve();
  return Promise.all([cssLoaded, decorationComplete])
    .then(([, api]) => api);
}

/**
 * Loads JS and CSS for a block.
 * @param {Element} block The block element
 */
export async function loadBlock(block) {
  const status = block.dataset.blockStatus;
  if (status !== 'loading' && status !== 'loaded') {
    block.dataset.blockStatus = 'loading';
    const { blockName, cssPath, jsPath } = getBlockConfig(block);
    try {
      await loadModule(blockName, jsPath, cssPath, block);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(`failed to load block ${blockName}`, error);
    }
    block.dataset.blockStatus = 'loaded';
  }
}

/**
 * Loads JS and CSS for all blocks in a container element.
 * @param {Element} main The container element
 */
export async function loadBlocks(main) {
  updateSectionsStatus(main);
  const blocks = [...main.querySelectorAll('div.block')];
  for (let i = 0; i < blocks.length; i += 1) {
    // eslint-disable-next-line no-await-in-loop
    await loadBlock(blocks[i]);
    updateSectionsStatus(main);
  }
}

/**
 * Returns a picture element with webp and fallbacks
 * @param {string} src The image URL
 * @param {string} [alt] The image alternative text
 * @param {boolean} [eager] Set loading attribute to eager
 * @param {Array} [breakpoints] Breakpoints and corresponding params (eg. width)
 * @returns {Element} The picture element
 */
export function createOptimizedPicture(src, alt = '', eager = false, breakpoints = [{ media: '(min-width: 600px)', width: '2000' }, { width: '750' }]) {
  const url = new URL(src, window.location.href);
  const picture = document.createElement('picture');
  const { pathname } = url;
  const ext = pathname.substring(pathname.lastIndexOf('.') + 1);

  // webp
  breakpoints.forEach((br) => {
    const source = document.createElement('source');
    if (br.media) source.setAttribute('media', br.media);
    source.setAttribute('type', 'image/webp');
    source.setAttribute('srcset', `${pathname}?width=${br.width}&format=webply&optimize=medium`);
    picture.appendChild(source);
  });

  // fallback
  breakpoints.forEach((br, i) => {
    if (i < breakpoints.length - 1) {
      const source = document.createElement('source');
      if (br.media) source.setAttribute('media', br.media);
      source.setAttribute('srcset', `${pathname}?width=${br.width}&format=${ext}&optimize=medium`);
      picture.appendChild(source);
    } else {
      const img = document.createElement('img');
      img.setAttribute('loading', eager ? 'eager' : 'lazy');
      img.setAttribute('alt', alt);
      picture.appendChild(img);
      img.setAttribute('src', `${pathname}?width=${br.width}&format=${ext}&optimize=medium`);
    }
  });

  return picture;
}

export function setImageDimensions(pictureElement, width, height) {
  const imgTag = pictureElement.querySelector('img');
  if (imgTag) {
    imgTag.setAttribute('width', width);
    imgTag.setAttribute('height', height);
  }
}

/**
 * Normalizes all headings within a container element.
 * @param {Element} el The container element
 * @param {string} allowedHeadings The list of allowed headings (h1 ... h6)
 */
export function normalizeHeadings(el, allowedHeadings) {
  const allowed = allowedHeadings.map((h) => h.toLowerCase());
  el.querySelectorAll('h1, h2, h3, h4, h5, h6').forEach((tag) => {
    const h = tag.tagName.toLowerCase();
    if (allowed.indexOf(h) === -1) {
      // current heading is not in the allowed list -> try first to "promote" the heading
      let level = parseInt(h.charAt(1), 10) - 1;
      while (allowed.indexOf(`h${level}`) === -1 && level > 0) {
        level -= 1;
      }
      if (level === 0) {
        // did not find a match -> try to "downgrade" the heading
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

/**
 * Set template (page structure) and theme (page styles).
 */
export function decorateTemplateAndTheme() {
  const addClasses = (element, classes) => {
    classes.split(',').forEach((c) => {
      element.classList.add(toClassName(c.trim()));
    });
  };
  const darkMode = page.getParamValue('theme');
  if (darkMode && darkMode === 'dark') addClasses(document.body, 'dark-mode');
  const template = getMetadata('template');
  if (template) addClasses(document.body, template);
  const theme = getMetadata('theme');
  if (theme) addClasses(document.body, theme);
}

/**
 * Decorates paragraphs containing a single link as buttons.
 * @param {Element} element container element
 */
export function decorateButtons(element) {
  const wrapButtonText = (a) => ((a.innerHTML.startsWith('<'))
    ? `${a.querySelector('span.icon')?.outerHTML || ''}<span class="button-text">${a.textContent}</span>`
    : `<span class="button-text">${a.textContent}</span>${a.querySelector('span.icon')?.outerHTML || ''}`
  );
  element.querySelectorAll('a').forEach((a) => {
    if (a.closest('.nav-brand') || a.closest('.nav-sections')) {
      return;
    }

    a.title = a.title || a.textContent;
    if (a.href !== a.textContent) {
      const up = a.parentElement;
      const twoup = a.parentElement.parentElement;
      const threeup = a.parentElement.parentElement?.parentElement;

      if (!a.querySelector('img')) {
        if (a.innerText?.includes('[hide-mobile]')) {
          if (UserAgent.os === 'ios' || UserAgent.os === 'android') {
            a.remove();
            return;
          }
          const buttonText = a.innerText;
          a.innerText = buttonText.replace('[hide-mobile]', '');
        }

        // Example: <p><strong><a href="example.com">Text</a></strong></p>
        if (up.childNodes.length === 1 && up.tagName === 'STRONG'
          && twoup.childNodes.length === 1 && twoup.tagName === 'P') {
          a.className = 'button primary';
          twoup.classList.add('button-container');
          up.replaceWith(a);
          a.innerHTML = wrapButtonText(a);
          return;
        }

        if (up.childNodes.length === 1
          && ((up.tagName === 'EM' && twoup.childNodes.length === 1 && twoup.tagName === 'STRONG')
          || (up.tagName === 'STRONG' && twoup.childNodes.length === 1 && twoup.tagName === 'EM'))
          && threeup?.childNodes.length === 1 && threeup?.tagName === 'P') {
          a.className = 'button secondary';
          threeup.classList.add('button-container');
          up.replaceWith(a);
          a.innerHTML = wrapButtonText(a);
          return;
        }
        // Example: <p><a href="example.com">Text</a> (example.com)</p>
        if (up.childNodes.length === 1 && a.href.includes('/fragments/')) {
          a.className = 'button modal';
          up.classList.add('button-container');
          return;
        }

        // Example: <p><a href="https://central.bitdefender.com">Text</a> (example text)</p>
        if (up.childNodes.length === 1 && up.tagName === 'P' && a.href.includes('central.bitdefender')) {
          a.className = 'button central';
          up.classList.add('button-container');
          return;
        }

        // Example: <p><a href="example.com">Text</a> <em>50% Discount</em></p>
        if (up.childNodes.length === 3 && up.tagName === 'P' && a.nextElementSibling?.tagName === 'EM') {
          a.className = 'button';
          up.classList.add('button-container');
          a.innerHTML = wrapButtonText(a);
          a.dataset.modal = a.nextSibling.textContent.trim().slice(1, -1);
          a.nextSibling.remove();
          return;
        }
        // Example: <p><a href="example.com">? Text</a></p>
        if (up.childNodes.length === 1 && up.tagName === 'P' && up.textContent.startsWith('?')) {
          a.className = 'info-button modal';
          up.classList.add('info-button-container');
          a.textContent = a.textContent.slice(1).trim();
          a.title = a.title.slice(1).trim();
          return;
        }

        if (up.childNodes.length === 1 && up.tagName === 'P' && up.textContent.startsWith('->')) {
          a.className = 'button link-arrow-right';
          up.classList.add('button-container');
          a.textContent = a.textContent.slice(2).trim();
          a.title = a.title.slice(2).trim();
          return;
        }

        // Example: <p><a href="example.com">Text</a></p>
        if (up.childNodes.length === 1 && (up.tagName === 'P' || up.tagName === 'DIV')) {
          a.className = 'button'; // default
          up.classList.add('button-container');
          a.innerHTML = wrapButtonText(a);
        }

        if (up.tagName === 'TD' && up.closest('table.ratings')) {
          a.className = 'button';
          up.classList.add('button-container');
          a.innerHTML = wrapButtonText(a);
        }
      }
    }
  });
}

/**
 * Load LCP block and/or wait for LCP in default content.
 */
export async function waitForLCP(lcpBlocks) {
  const block = document.querySelector(lcpBlocks.join(','));
  if (block) await loadBlock(block);
  document.body.style.display = null;
  const lcpCandidate = document.querySelector('main img');
  await new Promise((resolve) => {
    if (lcpCandidate && !lcpCandidate.complete) {
      lcpCandidate.setAttribute('loading', 'eager');
      lcpCandidate.addEventListener('load', resolve);
      lcpCandidate.addEventListener('error', resolve);
    } else {
      resolve();
    }
  });
}

/**
 * Loads a block named 'header' into header
 * @param {Element} header header element
 * @returns {Promise}
 */
export function loadHeader(header) {
  const headerBlock = buildBlock('header', '');
  header.append(headerBlock);
  decorateBlock(headerBlock);
  return loadBlock(headerBlock);
}

/**
 * Loads a block named 'footer' into footer
 * @param footer footer element
 * @returns {Promise}
 */
export function loadFooter(footer) {
  const footerBlock = buildBlock('footer', '');
  footer.append(footerBlock);
  decorateBlock(footerBlock);
  return loadBlock(footerBlock);
}

function parsePluginParams(id, config) {
  const pluginId = !config
    ? id.split('/').splice(id.endsWith('/') ? -2 : -1, 1)[0].replace(/\.js/, '')
    : id;
  const pluginConfig = {
    load: 'eager',
    ...(typeof config === 'string' || !config
      ? { url: (config || id).replace(/\/$/, '') }
      : config),
  };
  pluginConfig.options ||= {};
  return { id: pluginId, config: pluginConfig };
}

// Define an execution context for plugins
export const executionContext = {
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
  toClassName,
};

class PluginsRegistry {
  #plugins;

  constructor() {
    this.#plugins = new Map();
  }

  // Register a new plugin
  add(id, config) {
    const { id: pluginId, config: pluginConfig } = parsePluginParams(id, config);
    this.#plugins.set(pluginId, pluginConfig);
  }

  // Get the plugin
  get(id) { return this.#plugins.get(id); }

  // Check if the plugin exists
  includes(id) { return !!this.#plugins.has(id); }

  // Load all plugins that are referenced by URL, and updated their configuration with the
  // actual API they expose
  async load(phase) {
    [...this.#plugins.entries()]
      .filter(([, plugin]) => plugin.condition
      && !plugin.condition(document, plugin.options, executionContext))
      .map(([id]) => this.#plugins.delete(id));
    return Promise.all([...this.#plugins.entries()]
      // Filter plugins that don't match the execution conditions
      .filter(([, plugin]) => (
        (!plugin.condition || plugin.condition(document, plugin.options, executionContext))
        && phase === plugin.load && plugin.url
      ))
      .map(async ([key, plugin]) => {
        try {
          // If the plugin has a default export, it will be executed immediately
          const pluginApi = (await loadModule(
            key,
            !plugin.url.endsWith('.js') ? `${plugin.url}/${key}.js` : plugin.url,
            !plugin.url.endsWith('.js') ? `${plugin.url}/${key}.css` : null,
            document,
            plugin.options,
            executionContext,
          )) || {};
          this.#plugins.set(key, { ...plugin, ...pluginApi });
        } catch (err) {
          // eslint-disable-next-line no-console
          console.error('Could not load specified plugin', key);
        }
      }));
  }

  // Run a specific phase in the plugin
  async run(phase) {
    return [...this.#plugins.values()]
      .reduce((promise, plugin) => ( // Using reduce to execute plugins sequencially
        plugin[phase] && (!plugin.condition
            || plugin.condition(document, plugin.options, executionContext))
          ? promise.then(() => plugin[phase](document, plugin.options, executionContext))
          : promise
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
    templateConfig.condition = () => toClassName(getMetadata('template')) === templateId;
    window.hlx.plugins.add(templateId, templateConfig);
  }

  // Get the template
  // eslint-disable-next-line class-methods-use-this
  get(id) { return window.hlx.plugins.get(id); }

  // Check if the template exists
  // eslint-disable-next-line class-methods-use-this
  includes(id) { return window.hlx.plugins.includes(id); }
}

/**
 * Setup block utils.
 */
export function setup() {
  window.hlx = window.hlx || {};
  window.hlx.RUM_MASK_URL = 'full';
  window.hlx.codeBasePath = '';
  window.hlx.lighthouse = new URLSearchParams(window.location.search).get('lighthouse') === 'on';
  window.hlx.patchBlockConfig = [];
  window.hlx.plugins = new PluginsRegistry();
  window.hlx.templates = new TemplatesRegistry();

  try {
    [window.hlx.codeBasePath] = new URL(import.meta.url).pathname.split('/scripts/');
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error);
  }
}

/**
 * Auto initializiation.
 */
function init() {
  setup();
  sampleRUM('top');

  window.addEventListener('load', () => sampleRUM('load'));

  window.addEventListener('unhandledrejection', (event) => {
    sampleRUM('error', { source: event.reason.sourceURL, target: event.reason.line });
  });

  window.addEventListener('error', (event) => {
    sampleRUM('error', { source: event.filename, target: event.lineno });
  });
}

init();
