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

let ICONS_CACHE = {};
async function decorateIcons(element) {
  // Prepare the inline sprite
  let svgSprite = element.getElementById('franklin-svg-sprite');
  if (!svgSprite) {
    const div = document.createElement('div');
    div.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" id="franklin-svg-sprite" style="display: none"></svg>';
    svgSprite = div.firstElementChild;
    element.append(div.firstElementChild);
  }
  // Download all new icons
  const icons = [...element.querySelectorAll('span.icon')];
  await Promise.all(icons.map(async (span) => {
    const iconName = Array.from(span.classList).find((c) => c.startsWith('icon-')).substring(5);
    if (!ICONS_CACHE[iconName]) {
      ICONS_CACHE[iconName] = true;
      try {
        let dynamicIconsSharepointPath = 'https://www.bitdefender.com/common/icons/';
        if (window.location.hostname.includes('bitdefender.co.uk')) {
          dynamicIconsSharepointPath = 'https://www.bitdefender.co.uk/content/dam/franklin/';
        }
        if (window.location.hostname.includes('bitdefender.fr')) {
          dynamicIconsSharepointPath = 'https://www.bitdefender.fr/content/dam/franklin/';
        }
        // check for localhost
        if (window.location.hostname === 'localhost') {
          dynamicIconsSharepointPath = 'https://www.bitdefender.com/common/icons/';
        }
        const response = await fetch(`${dynamicIconsSharepointPath}${iconName}.svg`);
        if (!response.ok) {
          ICONS_CACHE[iconName] = false;
          return;
        }
        // Styled icons don't play nice with the sprite approach because of shadow dom isolation
        const svg = await response.text();
        if (svg.match(/(<style | class=)/)) {
          ICONS_CACHE[iconName] = { styled: true, html: svg };
        } else {
          ICONS_CACHE[iconName] = {
            html: svg
              .replace('<svg', `<symbol id="icons-sprite-${iconName}"`)
              .replace(/ width=".*?"/, '')
              .replace(/ height=".*?"/, '')
              .replace('</svg>', '</symbol>'),
          };
        }
      } catch (error) {
        ICONS_CACHE[iconName] = false;
        // eslint-disable-next-line no-console
        console.error(error);
      }
    }
  }));

  const symbols = Object
    .keys(ICONS_CACHE).filter((k) => !svgSprite.querySelector(`#icons-sprite-${k}`))
    .map((k) => ICONS_CACHE[k])
    .filter((v) => !v.styled)
    .map((v) => v.html)
    .join('\n');
  svgSprite.innerHTML += symbols;

  icons.forEach((span) => {
    const iconName = Array.from(span.classList).find((c) => c.startsWith('icon-')).substring(5);
    const parent = span.firstElementChild?.tagName === 'A' ? span.firstElementChild : span;
    // Styled icons need to be inlined as-is, while unstyled ones can leverage the sprite
    if (ICONS_CACHE[iconName].styled) {
      parent.innerHTML = ICONS_CACHE[iconName].html;
    } else {
      parent.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg"><use href="#icons-sprite-${iconName}"/></svg>`;
    }
  });
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

    /* process section metadata */
    const sectionMeta = section.querySelector('div.section-metadata');
    if (sectionMeta) {
      const meta = readBlockConfig(sectionMeta);
      Object.keys(meta).forEach((key) => {
        if (key === 'style') {
          const styles = meta.style.split(',').map((style) => toClassName(style.trim()));
          styles.forEach((style) => section.classList.add(style));
        } else {
          section.dataset[toCamelCase(key)] = meta[key];
        }
      });
      sectionMeta.parentNode.remove();
    }
  });
}

function decorateBlock(block) {
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
  // If the block is a particle background, 
  // a new div is created and appended to the body so the external library can work
  if (block === "particle-background") {
    const newDiv = document.createElement('div');
    newDiv.style.display = "none";
    newDiv.innerHTML += html;
    decorateSections(newDiv);
    decorateBlock(newDiv.querySelector(`.${block}`));
    updateLinkSources(newDiv, `${origin}${offerFolder}/`);
    document.body.appendChild(newDiv);
    await js.default(newDiv, {...options});
    shadowRoot.appendChild(newDiv);
    newDiv.style.display = "block";
  } else {
    // in order to have a structure as close as possible as in franklin
    // when we import in aem, we also decorate the sections and the block
    // the functions are taken from lib-franklin.js
    let franklinHTMLStructure = document.createElement('div')
    franklinHTMLStructure.innerHTML = html;
    decorateSections(franklinHTMLStructure);
    decorateBlock(franklinHTMLStructure.querySelector(`.${block}`));
    shadowRoot.innerHTML +=  franklinHTMLStructure.innerHTML;
    updateLinkSources(shadowRoot, `${origin}${offerFolder}/`);
    await js.default(shadowRoot.querySelector('.section'), {...options});
    decorateIcons(shadowRoot);

    // Get the current page path without the hash part and query
    const currentPagePath = window.location.protocol + '//' + window.location.host + window.location.pathname;
    // get all the links that pointing within the page with a hash
    shadowRoot.querySelectorAll('a[href*="#"]').forEach(link => {
      let linkAnchor = link.getAttribute('href');
      try {
        const parsedLinkAnchor = new URL(linkAnchor, currentPagePath);
        const linkAnchorPath = parsedLinkAnchor.protocol + '//' + parsedLinkAnchor.host + parsedLinkAnchor.pathname;
        if (currentPagePath === linkAnchorPath) {
          link.addEventListener('click', (event) => {
            event.preventDefault();
  
            linkAnchor = '#' + linkAnchor.split('#')[1];
            const target = document.querySelector(linkAnchor);
            target.scrollIntoView({ behavior: 'smooth' });
          });
        }
      } catch (e) {
        return;
      }
    });
  }

  return container;
}
