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

export async function loadComponent(offer, block, options, selector)  {
  const origin = new URL(offer).origin;
  const container = selector ? document.querySelector(selector) : document.createElement('div');
  const shadowRoot = container.attachShadow({ mode: 'open' });

  shadowRoot.innerHTML = `<link rel="stylesheet" href="${origin}/_src/blocks/${block}/${block}.css" type="text/css">`;

  const [html, js] = await Promise.all([
    fetch(offer).then(r => r.text()),
    import(`${origin}/_src/blocks/${block}/${block}.js`)
  ])

  shadowRoot.innerHTML +=  html;
  updateLinkSources(shadowRoot, origin);
  await js.default(shadowRoot, {...options, metadata: parseMetadata(shadowRoot)});

  return container;
}
