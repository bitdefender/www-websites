import { debounce, UserAgent } from '@repobit/dex-utils';
import { ButtonClickEvent, AdobeDataLayerService } from '@repobit/dex-data-layer';
import page from '../page.js';
import { Constants } from '../libs/constants.js';

const TRACKED_PRODUCTS = [];
const TRACKED_PRODUCTS_COMPARISON = [];

export const GLOBAL_V2_LOCALES = ['en-bz', 'en-lv'];
export const IANA_BY_REGION_MAP = new Map([
  [3, { locale: 'en-GB', label: 'united kingdom' }],
  [4, { locale: 'au-AU', label: 'australia' }],
  [5, { locale: 'de-DE', label: 'germany' }],
  [6, { locale: 'ro-RO', label: 'romania' }],
  [7, { locale: 'es-ES', label: 'spain' }],
  [8, { locale: 'en-US', label: 'com' }],
  [9, { locale: 'it-IT', label: 'italy' }],
  [10, { locale: 'en-CA', label: 'canada' }],
  [12, { locale: 'pt-PT', label: 'portugal' }],
  [13, { locale: 'br-BR', label: 'brazil' }],
  [14, { locale: 'fr-FR', label: 'france' }],
  [15, { locale: 'en-GB', label: 'united kingdom' }],
  [16, { locale: 'en-US', label: 'rest of the world EU countries' }],
  [17, { locale: 'de-CH', label: 'germany-switzerland' }],
  [19, { locale: 'en-ZA', label: 'en south africa' }],
  [22, { locale: 'nl-NL', label: 'netherlands' }],
  [24, { locale: 'en-VN', label: 'en vietnam' }],
  [20, { locale: 'en-MX', label: 'en es mexico' }],
  [21, { locale: 'en-CO', label: 'en es columbia' }],
  [25, { locale: 'en-SG', label: 'en singapore' }],
  [26, { locale: 'en-SE', label: 'en sweden' }],
  [27, { locale: 'en-DK', label: 'en denmark' }],
  [28, { locale: 'en-HU', label: 'en hungary' }],
  [29, { locale: 'en-BG', label: 'en bulgaria' }],
  [30, { locale: 'en-HR', label: 'en croatia' }],
  [31, { locale: 'en-NO', label: 'en norway' }],
  [32, { locale: 'en-MD', label: 'en moldova' }],
  [33, { locale: 'en-RS', label: 'en serbia' }],
  [34, { locale: 'en-RU', label: 'en russia' }],
  [35, { locale: 'en-EG', label: 'en egypt' }],
  [36, { locale: 'en-SA', label: 'en saudi arabia' }],
  [37, { locale: 'fr-DZ', label: 'en Algeria' }],
  [38, { locale: 'en-AE', label: 'en united arab emirates' }],
  [39, { locale: 'en-PS', label: 'en palestinia' }],
  [40, { locale: 'en-CN', label: 'en china' }],
  [41, { locale: 'en-HK', label: 'en hong kong' }],
  [42, { locale: 'en-CK', label: 'Cook Islands' }],
  [43, { locale: 'en-KE', label: 'en kenya' }],
  [44, { locale: 'en-NG', label: 'en nigeria' }],
  [45, { locale: 'fr-TN', label: 'en Tunisia' }],
  [46, { locale: 'en-PL', label: 'en poland' }],
  [47, { locale: 'en-CZ', label: 'en Czech' }],
  [48, { locale: 'es-VE', label: 'en Venezuela' }],
  [49, { locale: 'en-TR', label: 'en turkey' }],
  [50, { locale: 'en-ID', label: 'en Indonesia' }],
  [51, { locale: 'en-PH', label: 'en Philippines' }],
  [52, { locale: 'en-TW', label: 'en taiwan' }],
  [53, { locale: 'en-UA', label: 'en Ukraine' }],
  [54, { locale: 'es-CL', label: 'en Chile' }],
  [55, { locale: 'en-MY', label: 'en Malaysia' }],
  [56, { locale: 'es-AR', label: 'en Argentina' }],
  [57, { locale: 'es-PE', label: 'en Peru' }],
  [59, { locale: 'hr-HR', label: 'Croatia' }],
  [60, { locale: 'ma-MA', label: 'Morocco' }],
  [61, { locale: 'pk-PK', label: 'Pakistan' }],
  [62, { locale: 'bo-BO', label: 'Bolivia' }],
  [63, { locale: 'do-DO', label: 'Dominican Republic' }],
  [64, { locale: 'kw-KW', label: 'Kuwait' }],
  [65, { locale: 'jo-JO', label: 'Jordan' }],
  [66, { locale: 'th-TH', label: 'Thailand' }],
  [67, { locale: 'en-BD', label: 'en Bangladesh' }],
  [68, { locale: 'en-LK', label: 'en Sri Lanka' }],
  [69, { locale: 'en-PY', label: 'en Paraguay' }],
  [70, { locale: 'en-UY', label: 'en Uruguay' }],
  [72, { locale: 'en-JP', label: 'en Japan' }],
]);

const PRICE_LOCALE_MAP = new Map([
  ['en-us', { force_country: 'en', country_code: 'us' }],
  ['en-bg', { force_country: 'bg', country_code: 'bg' }],
  ['en-ca', { force_country: 'ca', country_code: 'ca' }],
  ['en-cl', { force_country: 'cl', country_code: 'cl' }],
  ['en-dk', { force_country: 'dk', country_code: 'dk' }],
  ['en-hu', { force_country: 'hu', country_code: 'hu' }],
  ['en-id', { force_country: 'id', country_code: 'id' }],
  ['en-il', { force_country: 'il', country_code: 'il' }],
  ['en-in', { force_country: 'in', country_code: 'in' }],
  ['en-kr', { force_country: 'kr', country_code: 'kr' }],
  ['en-my', { force_country: 'my', country_code: 'my' }],
  ['en-no', { force_country: 'no', country_code: 'no' }],
  ['en-ph', { force_country: 'ph', country_code: 'ph' }],
  ['en-pl', { force_country: 'pl', country_code: 'pl' }],
  ['en-sa', { force_country: 'sa', country_code: 'sa' }],
  ['en-th', { force_country: 'th', country_code: 'th' }],
  ['en-za', { force_country: 'za', country_code: 'za' }],
  ['en-ae', { force_country: 'ae', country_code: 'ae' }],
  ['en-sg', { force_country: 'sg', country_code: 'sg' }],
  ['en-sd', { force_country: 'sd', country_code: 'sd' }],
  ['en-mt', { force_country: 'mt', country_code: 'mt' }],
  ['en-lv', { force_country: 'lv', country_code: 'lv' }],
  ['en-jm', { force_country: 'jm', country_code: 'jm' }],
  ['en-bz', { force_country: 'bz', country_code: 'bz' }],
  ['en-gb', { force_country: 'uk', country_code: 'gb' }],
  ['en-au', { force_country: 'au', country_code: 'au' }],
  ['en-nz', { force_country: 'nz', country_code: 'nz' }],
  ['en-cz', { force_country: 'cz', country_code: 'cz' }],
  ['en-global', { force_country: 'en', country_code: null }],
  ['es-cl', { force_country: 'cl', country_code: 'cl' }],
  ['es-co', { force_country: 'co', country_code: 'co' }],
  ['es-mx', { force_country: 'mx', country_code: 'mx' }],
  ['es-pe', { force_country: 'pe', country_code: 'pe' }],
  ['es-bz', { force_country: 'bz', country_code: 'bz' }],
  ['es-es', { force_country: 'es', country_code: 'es' }],
  ['es-global', { force_country: 'en', country_code: null }],
  ['ro-ro', { force_country: 'ro', country_code: 'ro' }],
  ['it-it', { force_country: 'it', country_code: 'it' }],
  ['fr-fr', { force_country: 'fr', country_code: 'fr' }],
  ['fr-be', { force_country: null, country_code: null, isZuora: true }],
  ['nl-be', { force_country: null, country_code: null, isZuora: true }],
  ['nl-nl', { force_country: null, country_code: null, isZuora: true }],
  ['de-de', { force_country: 'de', country_code: 'de' }],
  ['de-at', { force_country: 'de', country_code: 'at' }],
  ['de-ch', { force_country: 'ch', country_code: 'ch' }],
  ['sv-se', { force_country: 'se', country_code: 'se' }],
  ['pt-br', { force_country: 'br', country_code: 'br' }],
  ['pt-pt', { force_country: 'pt', country_code: 'pt' }],
  ['zh-hk', { force_country: 'en', country_code: 'hk' }],
  ['zh-tw', { force_country: 'en', country_code: 'tw' }],
]);

/**
 * @returns {boolean} check if you are on exactly the consumer page (e.g /en-us/consumer/)
 */
export function checkIfNotProductPage() {
  return Constants.NONE_PRODUCT_PAGES.includes(page.name);
}

/* eslint-disable max-len */
export function addScript(src, data = {}, loadStrategy = undefined, onLoadCallback = undefined, onErrorCallback = undefined, type = undefined) {
  const s = document.createElement('script');

  s.setAttribute('src', src);

  if (loadStrategy) {
    s.setAttribute(loadStrategy, true);
  }

  if (type) {
    s.setAttribute('type', type);
  }

  if (typeof data === 'object' && data !== null) {
    // eslint-disable-next-line no-restricted-syntax
    for (const key in data) {
      // eslint-disable-next-line no-prototype-builtins
      if (data.hasOwnProperty(key)) {
        s.dataset[key] = data[key];
      }
    }
  }

  if (onLoadCallback) {
    s.onload = onLoadCallback;
  }

  if (onErrorCallback) {
    s.onerror = onErrorCallback;
  }

  document.body.appendChild(s);
}

// eslint-disable-next-line import/prefer-default-export
export function createTag(tag, attributes, html) {
  const el = document.createElement(tag);
  if (html) {
    if (html instanceof HTMLElement
      || html instanceof SVGElement
      || html instanceof DocumentFragment) {
      el.append(html);
    } else if (Array.isArray(html)) {
      el.append(...html);
    } else {
      el.insertAdjacentHTML('beforeend', html);
    }
  }
  if (attributes) {
    Object.entries(attributes).forEach(([key, val]) => {
      el.setAttribute(key, val);
    });
  }
  return el;
}

function isZuora() {
  const url = new URL(window.location.href);
  return url.pathname.includes('/nl-nl/') || url.pathname.includes('/nl-be/');
}

export function getMetadata(name) {
  const attr = name && name.includes(':') ? 'property' : 'name';
  const meta = [...document.head.querySelectorAll(`meta[${attr}="${name}"]`)].map((m) => m.content).join(', ');
  return meta || '';
}

export function getProductLinkCountryPrefix() {
  const { pathname } = window.location;

  if (pathname.includes('/en-au/')) {
    return 'https://www.bitdefender.com.au/site/Store/ajax';
  }

  if (pathname.includes('/en-gb/')) {
    return 'https://www.bitdefender.com.uk/site/Store/ajax';
  }

  if (pathname.includes('/ro-ro/')) {
    return 'https://www.bitdefender.ro/site/Store/ajax';
  }

  if (pathname.includes('/it-it/')) {
    return 'https://www.bitdefender.it/site/Store/ajax';
  }

  if (pathname.includes('/fr-fr/')) {
    return 'https://www.bitdefender.fr/site/Store/ajax';
  }

  if (pathname.includes('/fr-be/')) {
    return 'https://www.bitdefender.be/site/Store/ajax';
  }

  if (pathname.includes('/nl-be/')) {
    return 'https://www.bitdefender.be/site/Store/ajax';
  }

  if (pathname.includes('/nl-nl/')) {
    return 'https://www.bitdefender.nl/site/Store/ajax';
  }

  if (pathname.includes('/de-de/')) {
    return 'https://www.bitdefender.de/site/Store/ajax';
  }

  if (pathname.includes('/de-ch/')) {
    return 'https://www.bitdefender.de/site/Store/ajax';
  }

  if (pathname.includes('/sv-se/')) {
    return 'https://www.bitdefender.se/site/Store/ajax';
  }

  if (pathname.includes('/pt-br/')) {
    return 'https://www.bitdefender.com.br/site/Store/ajax';
  }

  if (pathname.includes('/pt-pt/')) {
    return 'https://www.bitdefender.pt/site/Store/ajax';
  }

  if (pathname.includes('/es-es/')) {
    return 'https://www.bitdefender.es/site/Store/ajax';
  }

  return 'https://www.bitdefender.com/site/Store/ajax';
}

export function getBuyLinkCountryPrefix() {
  return 'https://www.bitdefender.com/site/Store/buy';
}

export function getPriceLocalMapByLocale() {
  const locale = window.location.pathname.split('/')[1];
  return PRICE_LOCALE_MAP.get(locale) || PRICE_LOCALE_MAP.get('en-us');
}

// eslint-disable-next-line max-len
export function generateProductBuyLink(product, productCode, month = null, years = null, pid = null) {
  if (isZuora()) {
    return product.buy_link;
  }

  const m = product.variation?.dimension_value || month;
  const y = product.variation?.years || years;
  const url = new URL(window.location.href);
  let buyLinkPid = '';

  if (pid) {
    buyLinkPid = `pid.${pid}`;
  } else if (url.searchParams.get('pid')) {
    buyLinkPid = `pid.${url.searchParams.get('pid')}`;
  } else if (getMetadata('pid')) {
    buyLinkPid = `pid.${getMetadata('pid')}`;
  }

  if (GLOBAL_V2_LOCALES.includes(page.locale)) {
    buyLinkPid = 'pid.global_v2';
  }

  const forceCountry = getPriceLocalMapByLocale().force_country;
  return `${getBuyLinkCountryPrefix()}/${productCode}/${m}/${y}/${buyLinkPid}?force_country=${forceCountry}`;
}

export function setDataOnBuyLinks(element, dataInfo) {
  const { productId, variation } = dataInfo;
  if (productId) element.dataset.product = productId.trim();

  // element.dataset.buyPrice = variation.discounted_price || variation.price || 0;
  if (variation.price) element.dataset.buyPrice = variation.price.trim();
  if (variation.oldPrice) element.dataset.oldPrice = variation.oldPrice.trim();
  if (variation.currency_label) element.dataset.currency = variation.currency_label.trim();
  if (variation.region_id) element.dataset.region = variation.region_id.trim();
  if (variation.variation_name) element.dataset.variation = variation.variation_name.trim();
}

export function formatPrice(price, currency) {
  if (!price) {
    return null;
  }
  // const loc = region ? IANA_BY_REGION_MAP.get(Number(region))?.locale || 'en-US' : locale;
  return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(price);
}

const nanoBlocks = new Map();

function findTextNodes(parent) {
  let all = [];
  for (let node = parent.firstChild; node; node = node.nextSibling) {
    if (node.nodeType === Node.TEXT_NODE) all.push(node);
    else all = all.concat(findTextNodes(node));
  }
  return all;
}

/**
 * Create a nano block
 * The renderer should return a valid HTMLElement. This parameter is mandatory.
 * @param name The name of the block
 * @param renderer The renderer function
 */
export function createNanoBlock(name, renderer) {
  nanoBlocks.set(name.toLowerCase(), renderer);
}

/**
 * Parse nano block parameters, support string and array.
 * parseString("aa, bb, cc") -> [ 'aa', 'bb', 'cc' ]
 * parseString("aa, [x, y, z], cc") -> [ 'aa', [ 'x', 'y', 'z' ], 'cc' ]
 * @param params string representing nanoblock parameters
 * @returns an array representation of the parameters
 */
function parseParams(params) {
  const segments = params.split(',').map((segment) => segment.trim());
  const result = [];

  let tempArray = [];
  let isInArray = false;

  segments.forEach((segment) => {
    if (isInArray) {
      if (segment.endsWith(']')) {
        tempArray.push(segment.slice(0, -1).trim());
        result.push(tempArray);
        tempArray = [];
        isInArray = false;
      } else {
        tempArray.push(segment.trim());
      }
    } else if (segment.startsWith('[')) {
      if (segment.endsWith(']')) {
        result.push(segment.slice(1, -1).trim());
      } else {
        tempArray.push(segment.slice(1).trim());
        isInArray = true;
      }
    } else {
      result.push(segment);
    }
  });

  return result;
}

// this was added as a translation support ( adding new breaklines in content was needed )
// as a part of a new line metadata
// values could be something like "value, value2, ,,new text on new line"
function replaceDoubleCommas(str) {
  // Convert the string to an array for easy manipulation
  const arr = str.split('');

  // Loop through the array from the end to the beginning
  for (let i = arr.length - 1; i > 0; i -= 1) {
    // Check if there are two consecutive commas
    if (arr[i] === ',' && arr[i - 1] === ',') {
      // Replace the two consecutive commas with a single comma
      arr.splice(i, 1);
    }
  }

  // Convert the array back to a string
  return arr.join('');
}

export function getDatasetFromSection(block) {
  const parentSelector = block.closest('.section');
  return parentSelector.dataset;
}

/**
 * Renders nano blocks
 * @param parent The parent element
 */
export async function renderNanoBlocks(
  parent = document.body,
  mv = undefined,
  index = undefined,
  block = undefined,
) {
  const regex = /{([^}]+)}/g;
  findTextNodes(parent).forEach((node) => {
    const text = node.textContent.trim();
    const matches = text.match(regex);
    if (matches) {
      matches.forEach((match) => {
        const [name] = parseParams(match.slice(1, -1));
        const datasetValue = getDatasetFromSection(parent);

        const datasetEntryValue = (index !== undefined ? datasetValue[`${name.toLowerCase()}${index + 1}`] : datasetValue[name.toLowerCase()]) || '';
        const formattedDatasetEntryValue = replaceDoubleCommas(datasetEntryValue);

        const newMatch = [match, formattedDatasetEntryValue.split(',')].join(',').replace(/[{}]/g, '');

        const [newName, ...params] = parseParams(newMatch);
        const renderer = nanoBlocks.get(newName.toLowerCase());
        if (renderer) {
          // eslint-disable-next-line max-len
          const element = mv ? renderer(mv, ...params, block, index, parent) : renderer(...params, block, index, parent);
          element.classList.add('nanoblock');
          const oldElement = node.parentNode;
          oldElement.parentNode.replaceChild(element, oldElement);
        }
      });
    }
  });
}

/**
 * Results returned from {@link fetchIndex} come from a derived Excel sheet that is constructed
 * with the FILTER function. This FILTER function has the unwanted side effect of returning '0' in
 * cells that are empty in the original sheet.
 *
 * This function replaces those '0' values with empty cells again.
 *
 * @see fetchIndex
 * @param {Object} data - the data returned from the fetchIndex function.
 */
export function fixExcelFilterZeroes(data) {
  data.forEach((line) => {
    Object.keys(line).forEach((k) => {
      line[k] = line[k] === '0' ? '' : line[k];
    });
  });
}

export async function fetchIndex(indexFile, sheet, pageSize = 500) {
  const idxKey = indexFile.concat(sheet || '');

  const handleIndex = async (offset) => {
    const sheetParam = sheet ? `&sheet=${sheet}` : '';

    const resp = await fetch(`/${window.location.pathname.split('/')[1]}/${indexFile}.json?limit=${pageSize}&offset=${offset}${sheetParam}`);
    const json = await resp.json();

    const newIndex = {
      complete: (json.limit + json.offset) === json.total,
      offset: json.offset + pageSize,
      promise: null,
      data: [...window.index[idxKey].data, ...json.data],
    };

    return newIndex;
  };

  window.index = window.index || {};
  window.index[idxKey] = window.index[idxKey] || {
    data: [],
    offset: 0,
    complete: false,
    promise: null,
  };

  if (window.index[idxKey].complete) {
    return window.index[idxKey];
  }

  if (window.index[idxKey].promise) {
    return window.index[idxKey].promise;
  }

  window.index[idxKey].promise = handleIndex(window.index[idxKey].offset);
  const newIndex = await (window.index[idxKey].promise);
  window.index[idxKey] = newIndex;

  return newIndex;
}

export const GLOBAL_EVENTS = {
  ADOBE_MC_LOADED: 'adobe_mc::loaded',
  PAGE_LOADED: 'page::loaded',
};

const ICONS_CACHE = {};
export async function decorateIcons(element) {
  // Prepare the inline sprite
  let svgSprite = document.getElementById('franklin-svg-sprite');
  if (!svgSprite) {
    const div = document.createElement('div');
    div.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" id="franklin-svg-sprite" style="display: none"></svg>';
    svgSprite = div.firstElementChild;
    document.body.append(div.firstElementChild);
  }

  // Download all new icons
  const icons = [...element.querySelectorAll('span.icon')];
  await Promise.all(icons.map(async (span) => {
    const iconName = Array.from(span.classList).find((c) => c.startsWith('icon-')).substring(5);
    if (!ICONS_CACHE[iconName]) {
      ICONS_CACHE[iconName] = true;
      try {
        let dynamicIconsSharepointPath = '/common/icons/';
        if (window.location.hostname.includes('www-landing-pages') || window.location.hostname.includes('bitdefender.com/pages')) {
          dynamicIconsSharepointPath = '/icons/';
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

// General function to match the height of elements based on a selector
export async function matchHeights(targetNode, selector) {
  const resetHeights = () => {
    const elements = targetNode.querySelectorAll(selector);
    elements.forEach((element) => {
      element.style.minHeight = '';
    });
  };

  const adjustHeights = () => {
    if (window.innerWidth >= 768) {
      resetHeights();
      const elements = targetNode.querySelectorAll(selector);
      const elementsHeight = Array.from(elements).map((element) => element.offsetHeight);
      const maxHeight = Math.max(...elementsHeight);

      elements.forEach((element) => {
        element.style.minHeight = `${maxHeight}px`;
      });
    } else {
      resetHeights();
    }
  };

  const matchHeightsCallback = (mutationsList) => {
    Array.from(mutationsList).forEach((mutation) => {
      if (mutation.type === 'childList') {
        adjustHeights();
      }
    });
  };

  const observer = new MutationObserver(matchHeightsCallback);
  const resizeObserver = new ResizeObserver(debounce((entries) => {
    // eslint-disable-next-line no-unused-vars
    entries.forEach((entry) => {
      adjustHeights();
    });
  }), 100);

  if (targetNode) {
    observer.observe(targetNode, { childList: true, subtree: true });
  }

  window.addEventListener('resize', () => {
    adjustHeights();
  });

  const elements = targetNode.querySelectorAll(selector);
  elements.forEach((element) => {
    resizeObserver.observe(element);
  });

  adjustHeights();
}

export function getPidFromUrl() {
  const url = new URL(window.location.href);
  return url.searchParams.get('pid') || getMetadata('pid');
}

export function trackProduct(product, location = '') {
  // eslint-disable-next-line max-len
  if (!product && product.length === 0) return;
  if (location && location === 'comparison') {
    // eslint-disable-next-line max-len
    const isDuplicate = TRACKED_PRODUCTS_COMPARISON.find((p) => p.platformProductId === product.platformProductId && p.variantId === product.variantId);
    if (!isDuplicate) TRACKED_PRODUCTS_COMPARISON.push(product);
  } else {
    // eslint-disable-next-line max-len
    const isDuplicate = TRACKED_PRODUCTS.find((p) => p.platformProductId === product.platformProductId && p.variantId === product.variantId);
    if (!isDuplicate) TRACKED_PRODUCTS.push(product);
  }
}

export function pushTrialDownloadToDataLayer() {
  const trialPaths = [
    'fragments/thank-you-for-downloading',
    'fragments/get-bitdefender',
    'fragments/trial',
  ];

  const getTrialID = (currentPage, button) => {
    if (['thank-you', 'free-antivirus'].includes(currentPage)) {
      return '8430';
    }

    const buttonProductId = button?.getAttribute('product-id');
    if (buttonProductId) return buttonProductId;

    const closestStoreElementWithId = button?.closest('.section')?.querySelector('[product-id]') || button?.closest('.section');
    return closestStoreElementWithId.getAttribute('product-id')
      || getMetadata('breadcrumb-title')
      || getMetadata('og:title');
  };

  const currentPage = page.name;
  const downloadType = currentPage === 'thank-you' ? 'product' : 'trial';

  const pushTrialData = (button = null) => {
    AdobeDataLayerService.push(new ButtonClickEvent(
      `${downloadType} downloaded`,
      { productId: getTrialID(currentPage, button) },
    ));
  };

  const sections = document.querySelectorAll('a.button.modal');
  if (sections.length) {
    sections.forEach((button) => {
      const href = button.getAttribute('href');
      if (trialPaths.some((trialPath) => href.includes(trialPath))
        && !button.hasAttribute('data-layer-ignore')) {
        button.addEventListener('click', () => { pushTrialData(button); });
      }
    });
  } else if (currentPage === 'thank-you') {
    pushTrialData();
  }
}

export function setUrlParams(urlIn, paramsIn = []) {
  const isRelativeLink = /^(?!\/\/|[a-z]+:)/i;

  if (!Array.isArray(paramsIn)) {
    // eslint-disable-next-line no-console
    console.error(`paramsIn must be an Array but you provided an ${typeof paramsIn}`);
    return urlIn;
  }

  const url = isRelativeLink.test(urlIn) ? new URL(urlIn, window.location.origin) : new URL(urlIn);

  // eslint-disable-next-line no-restricted-syntax
  for (const param of paramsIn) {
    if (!param) {
      // eslint-disable-next-line no-continue
      continue;
    }
    const [key, value] = param.split('=');

    if (value === '') {
      url.searchParams.delete(key);
    } else {
      url.searchParams.set(key, value || '');
    }
  }

  return url.href;
}

export function getDomain() {
  return window.location.pathname.split('/').filter((item) => item)[0];
}

export function isView(viewport) {
  const element = document.querySelectorAll(`[data-${viewport}-detector]`)[0];
  return !!(element && getComputedStyle(element).display !== 'none');
}

export function openUrlForOs(urlMacos, urlWindows, urlAndroid, urlIos, anchorSelector = null) {
  // Open the appropriate URL based on the OS
  let openUrl;
  switch (UserAgent.os) {
    case 'Mac/iOS':
      openUrl = urlMacos;
      break;
    case 'Windows':
      openUrl = urlWindows;
      break;
    case 'Linux':
    case 'android':
      openUrl = urlAndroid;
      break;
    case 'ios':
      openUrl = urlIos;
      break;
    default:
      openUrl = null; // Fallback or 'Unknown' case
  }

  if (openUrl) {
    if (anchorSelector) {
      anchorSelector.href = openUrl;
    } else {
      window.open(openUrl, '_self');
    }
  }
}

export function getBrowserName() {
  const { userAgent } = navigator;

  if (userAgent.includes('Firefox')) {
    return 'Firefox';
  } if (userAgent.includes('Edg')) {
    return 'Edge';
  } if (userAgent.includes('Chrome') && !userAgent.includes('Edg')) {
    return 'Chrome';
  } if (userAgent.includes('Safari') && !userAgent.includes('Chrome')) {
    return 'Safari';
  }
  return 'Unknown';
}

/**
 * Returns the promotion/campaign found in the URL
 * @returns {string|null}
 */
export const getUrlPromotion = () => page.getParamValue('pid')
  || page.getParamValue('promotionId')
  || page.getParamValue('campaign')
  || null;

/**
 * Returns the promotion/campaign found in the Vlaicu file or 'global_v2' for specific locales
 * @returns {string|null}
 */
export const getCampaignBasedOnLocale = () => {
  if (GLOBAL_V2_LOCALES.find((domain) => page.locale === domain)) {
    return 'global_v2';
  }

  if (!Constants.ZUROA_LOCALES.includes(page.locale)) {
    return Constants.NO_PROMOTION;
  }

  return Constants.PRODUCT_ID_MAPPINGS?.campaign || Constants.NO_PROMOTION;
};

export function decorateBlockWithRegionId(element, id) {
  // we could consider to use `element.setAttribute('s-object-region', id);` in the future
  if (element) element.id = id;
}

export function decorateLinkWithLinkTrackingId(element, id) {
  if (element) element.setAttribute('s-object-id', id);
}

export const getPageExperimentKey = () => getMetadata(Constants.TARGET_EXPERIMENT_METADATA_KEY);

/**
 *
 * @returns {boolean} returns wether A/B tests should be disabled or not
 */
export const shouldABTestsBeDisabled = () => {
  /** This is a special case for when adobe.target is disabled using dotest query param */
  const windowSearchParams = new URLSearchParams(window.location.search);
  if (windowSearchParams.get(Constants.DISABLE_TARGET_PARAMS.key)
    === Constants.DISABLE_TARGET_PARAMS.value) {
    return true;
  }

  return false;
};

/**
 *
 * @returns {object} - get experiment information
 */
export const getExperimentDetails = () => {
  if (!window.hlx || !window.hlx.experiment) {
    return null;
  }

  const { id: experimentId, selectedVariant: experimentVariant } = window.hlx.experiment;
  return { experimentId, experimentVariant };
};

/**
 * get the name of the page as seen by analytics
 * @returns {string}
 */
export const generatePageLoadStartedName = () => {
  /**
   *
   * @param {string[]} tags
   * @returns {string[]} get all analytic tags
   */
  if (window.location.href.includes('oaiusercontent')) {
    return 'ajutor:sunt:intro:fereastra';
  }
  const getTags = (tags) => (tags ? tags.split(':').filter((tag) => !!tag).map((tag) => tag.trim()) : []);
  const { pathname } = window.location;

  const METADATA_ANALYTICS_TAGS = 'analytics-tags';
  const tags = getTags(getMetadata(METADATA_ANALYTICS_TAGS));
  const { locale } = page;
  // currenty, the language is the default first tag and section parameter, with webview, we want
  // something else to be the first tag and section
  const pageSectionDataLocale = getMetadata('locale') || page.locale;

  let tagName;
  if (tags.length) {
    tagName = [pageSectionDataLocale, ...tags].filter(Boolean).join(':'); // e.g. au:consumer:product:internet security
  } else {
    const allSegments = pathname.split('/').filter((segment) => segment !== '');
    const lastSegment = allSegments[allSegments.length - 1];
    // eslint-disable-next-line no-multi-assign
    const subSubSubSection = allSegments[allSegments.length - 1] = allSegments[allSegments.length - 1].replace(/-/g, ' ');
    const nameSection = lastSegment === 'subscriber-protection-platform' ? 'partners' : 'product';
    tagName = `${locale}:${nameSection}:${subSubSubSection}`;
    if (lastSegment === 'consumer') {
      tagName = `${locale}:consumer:solutions`;
    }

    if (pathname.includes('spot-the-scam-quiz')) {
      tagName = `${locale}:consumer:quiz`;
      if (getMetadata('skip-start-page')) tagName = `${locale}:consumer:quiz:question-1`;
      if (!pathname.endsWith('/')) {
        tagName = `${locale}:consumer:quiz:results:${subSubSubSection}`;
      }
    }

    if (pathname.includes('scam-masters')) {
      tagName = `${locale}:consumer:quiz:scam-masters`;
    }

    if (pathname.includes('reverse-phone-lookup')) {
      tagName = `${locale}:consumer:product:${subSubSubSection}`;
      if (pathname.includes('/reverse-phone-lookup/')) {
        tagName = `${locale}:consumer:product:reverse phone lookup:${subSubSubSection}`;
      }
    }

    if (pathname.includes('bundle-solutions')) {
      tagName = `${locale}:oem:bundle solutions`;
    }

    if (window.errorCode === '404') {
      tagName = `${locale}:404`;
    }
  }

  return tagName;
};

/**
 *
 * @returns {string} get product findings for analytics
 */
export const getProductFinding = () => {
  const productFindingMetadata = getMetadata('product-finding');
  if (productFindingMetadata) {
    return productFindingMetadata;
  }

  const pageName = page.name.toLowerCase();
  let productFinding;
  switch (pageName) {
    case 'consumer':
      productFinding = 'solutions page';
      break;
    case 'thank-you':
      productFinding = 'thank you page';
      break;
    case 'toolbox page':
      productFinding = 'toolbox page';
      break;
    case 'downloads':
      productFinding = 'downloads page';
      break;
    case 'spot-the-scam-quiz':
      productFinding = 'consumer quiz';
      break;
    default:
      productFinding = 'product pages';
      break;
  }

  // case when the pages are link-checker/something
  const currentPath = window.location.pathname;
  if (currentPath.includes('/link-checker')) {
    productFinding = 'toolbox page';
  }

  // case when the pages are /spot-the-scam-quiz/something
  if (currentPath.includes('/spot-the-scam-quiz')) {
    productFinding = 'consumer quiz';
  }

  return productFinding;
};

export function generateLDJsonSchema() {
  const country = getMetadata('jsonld-areaserved')
    .split(';')
    .map((pair) => pair.split(':'))
    .findLast(([key]) => key === page.locale)?.[1] || null;

  const jsonldName = getMetadata('jsonld-name');

  if (!country || !jsonldName) {
    return;
  }

  const ldJson = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: jsonldName,
    url: `${window.location.origin}${window.location.pathname}`,
    inLanguage: page.locale,
    areaServed: {
      '@type': 'Country',
      name: country,
    },
    isPartOf: {
      '@type': 'WebSite',
      name: 'Bitdefender',
      url: `${window.location.origin}/${page.locale}/`,
    },
  };

  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.textContent = JSON.stringify(ldJson, null, 2); // Pretty print
  document.head.appendChild(script);
}

let isRendering = false;
let widgetExecuting = false;
export function renderTurnstile(containerId, { invisible = false } = {}) {
  if (isRendering) {
    return Promise.reject(new Error('Turnstile is already rendering.'));
  }

  isRendering = true;

  return new Promise((resolve, reject) => {
    function finish(error, result = null) {
      isRendering = false;
      widgetExecuting = false;
      if (error) reject(error);
      else resolve(result);
    }

    function renderWidget() {
      if (!window.turnstile) {
        return finish(new Error('Turnstile not loaded.'));
      }

      const container = document.getElementById(containerId);
      if (!container) {
        return finish(new Error(`Container "${containerId}" not found.`));
      }

      // Clear previous widget
      container.innerHTML = '';

      const widgetId = window.turnstile.render(container, {
        sitekey: '0x4AAAAAABkTzSd63P7J-Tl_',
        size: invisible ? 'compact' : 'normal',
        callback: (token) => {
          widgetExecuting = false;

          if (!invisible) window.latestVisibleToken = token;
          if (!token) return finish(new Error('Token missing.'));
          return finish(null, { widgetId, token });
        },
        'error-callback': () => {
          finish(new Error('Turnstile error during execution.'));
        },
        'expired-callback': () => {
          finish(new Error('Turnstile token expired.'));
        },
      });

      if (invisible) {
        if (!widgetExecuting) {
          widgetExecuting = true;

          try {
            window.turnstile.execute(widgetId);
          } catch (err) {
            window.turnstile.reset(widgetId);
            window.turnstile.execute(widgetId);
          }
        }
      } else {
        finish(null, { widgetId });
      }

      return undefined;
    }

    if (window.turnstile) {
      renderWidget();
    } else {
      const script = document.createElement('script');
      script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?onload=onloadTurnstileCallback';
      script.async = true;
      script.defer = true;
      window.onloadTurnstileCallback = renderWidget;
      document.head.appendChild(script);
    }
  });
}

export async function submitWithTurnstile({
  widgetId,
  data,
  fileName,
  successCallback = null,
  errorCallback = null,
}) {
  let ENDPOINT = 'https://stage.bitdefender.com/form';
  if (window.location.hostname.startsWith('www.')) {
    ENDPOINT = ENDPOINT.replace('stage.', 'www.');
  }

  try {
    if (!window.turnstile || typeof window.turnstile.getResponse !== 'function') {
      throw new Error('Turnstile is not loaded.');
    }

    const token = window.turnstile.getResponse(widgetId);
    if (!token || token.length < 10) {
      throw new Error('Turnstile token is missing or invalid. Please complete the challenge.');
    }

    const requestData = {
      file: `/sites/common/formdata/${fileName}.xlsx`,
      table: 'Table1',
      row: { ...data },
      token,
    };

    const res = await fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestData),
    });

    if (!res.ok) {
      throw new Error(`Server returned status ${res.status}`);
    }

    if (typeof successCallback === 'function') successCallback();

    window.turnstile.reset(widgetId);
  } catch (err) {
    if (typeof errorCallback === 'function') errorCallback(err);
  }
}

/**
 * @param {HTMLElement} element
 * @param {object} storeProperties
 * @param {string} storeProperties.productId
 * @param {number} storeProperties.devices
 * @param {number} storeProperties.subscription
 * @param {boolean} storeProperties.ignoreEventsParent
 * @param {boolean} storeProperties.storeEvent
 * @summary
 * Modifies element into the following structure:
 * ```html
 * <bd-context>
 *   <bd-product>
 *     <bd-option>
 *       initial element's children
 *     </bd-option>
 *   </bd-product>
 * </bd-context>
 * ```
 */
export const wrapChildrenWithStoreContext = (element, {
  productId,
  devices,
  subscription,
  ignoreEventsParent = false,
  storeEvent = '',
}) => {
  if (!element || element.firstElementChild?.matches('bd-context')) {
    return;
  }

  const context = document.createElement('bd-context');
  if (ignoreEventsParent) {
    context.setAttribute('ignore-events-parent', '');
  }

  const product = document.createElement('bd-product');
  product.setAttribute('product-id', productId);

  const option = document.createElement('bd-option');
  option.setAttribute('devices', devices);
  option.setAttribute('subscription', subscription);
  if (storeEvent) {
    option.setAttribute('data-layer-event', storeEvent);
  }

  while (element.firstChild) {
    option.appendChild(element.firstChild);
  }

  product.appendChild(option);
  context.appendChild(product);
  element.appendChild(context);
};
