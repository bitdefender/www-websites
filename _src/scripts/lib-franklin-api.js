/**
 * @param {HTMLDivElement} shadoRoot
 */
const parseMetadata = (shadowRoot) => {
  const metadata = {};
  const sectionMetadata = shadowRoot.querySelector(".section-metadata");

  for (const child of sectionMetadata.children) {
    const [keyChild, valueChild] = child.children;
    metadata[keyChild.textContent] = valueChild.textContent;
  }

  sectionMetadata.remove();

  return metadata;
}

/**
 * @param {HTMLDivElement} shadoRoot
 * @param {string} origin - prepends the origin to the relative links
 */
const updateLinkSources = (shadoRoot, origin) => {
  const allSources = shadoRoot.querySelectorAll('source');
  allSources.forEach((source) => {
    if (source.srcset.startsWith('./') || source.srcset.startsWith('/')) {
      const srcSet = source.srcset.startsWith('.') ? source.srcset.slice(1) : source.srcset;
      source.srcset = `${origin}${srcSet}`;
    }
  });

  const allImages = shadoRoot.querySelectorAll('img');
  allImages.forEach((image) => {
    if (image.src.startsWith('./') || image.src.startsWith('/')) {
      const imgSrc = image.src.startsWith('.') ? image.src.slice(1) : image.src;
      image.src = `${origin}${imgSrc}`;
    }
  });
};

/**
 * @param {ShadowRoot} shadowRoot
 * @param {string} offer
 * @param {string} origin
 * @returns {Promise<void>}
 * load the block HTML
 */
const loadHTML = async (shadowRoot, offer, origin) => {
  // make a call to get all the plain HTML
  shadowRoot.innerHTML = await fetch(offer).then(r => r.text())

  updateLinkSources(shadowRoot, origin);
};

/**
 * @param {ShadowRoot} shadowRoot
 * @param {string} offer
 * @returns {Promise<void>}
 * load the block HTML
 */
const loadCSS = async (shadowRoot, offer) => {
  const style = await import(offer, {
    assert: { type: 'css' }
  });

  shadowRoot.adoptedStyleSheets = [style.default];
};

/**
 * @param {ShadowRoot} shadowRoot
 * @param {string} offer
 * @param {object} options
 * @returns {Promise<void>}
 * load the block HTML
 */
const loadJS = async (shadowRoot, offer, options) => {
  const logicModule = await import(offer);
  logicModule.default(shadowRoot, {...options, metadata: parseMetadata(shadowRoot)});
};

export async function loadComponent(offer, block, options, selector)  {
  const origin = new URL(offer).origin;
  const container = selector ? document.querySelector(selector) : document.createElement('div');
  const shadowRoot = container.attachShadow({ mode: 'open' });

  await loadHTML(shadowRoot, offer, origin);
  loadCSS(shadowRoot, `${origin}/_src/blocks/${block}/${block}.css`);
  await loadJS(shadowRoot, `${origin}/_src/blocks/${block}/${block}.js`, options);
  return container;
}
