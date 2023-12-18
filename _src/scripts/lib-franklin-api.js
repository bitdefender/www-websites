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
  shadoRoot
    .querySelectorAll('source')
    .forEach(source => source.srcset = new URL(source.getAttribute("srcset"), origin).href);

  shadoRoot
    .querySelectorAll('img')
    .forEach(image => image.src = new URL(image.getAttribute("src"), origin).href);
};

export async function loadComponent(offer, block, options, selector)  {
  const offerURL = new URL(offer);
  const origin = offerURL.origin;
  const offerFolder = offerURL.pathname.split("/").slice(0,-1).join("/");
  const container = selector ? document.querySelector(selector) : document.createElement('div');
  const shadowRoot = container.attachShadow({ mode: 'open' });

  shadowRoot.innerHTML = `<link rel="stylesheet" href="${origin}/_src/blocks/${block}/${block}.css" type="text/css">`;

  const [html, js] = await Promise.all([
    fetch(offer).then(r => r.text()),
    import(`${origin}/_src/blocks/${block}/${block}.js`)
  ])

  shadowRoot.innerHTML +=  html;
  updateLinkSources(shadowRoot, `${origin}${offerFolder}/`);
  await js.default(shadowRoot, {...options, metadata: parseMetadata(shadowRoot)});

  return container;
}
