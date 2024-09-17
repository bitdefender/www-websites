import ZuoraNLClass from '../zuora.js';

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
  ['en-bg', { force_country: 'en', country_code: 'bg' }],
  ['en-ca', { force_country: 'en', country_code: 'ca' }],
  ['en-cl', { force_country: 'en', country_code: 'cl' }],
  ['en-dk', { force_country: 'en', country_code: 'dk' }],
  ['en-hu', { force_country: 'en', country_code: 'hu' }],
  ['en-id', { force_country: 'en', country_code: 'id' }],
  ['en-il', { force_country: 'en', country_code: 'il' }],
  ['en-in', { force_country: 'en', country_code: 'in' }],
  ['en-kr', { force_country: 'en', country_code: 'kr' }],
  ['en-my', { force_country: 'en', country_code: 'my' }],
  ['en-no', { force_country: 'en', country_code: 'no' }],
  ['en-ph', { force_country: 'en', country_code: 'ph' }],
  ['en-pl', { force_country: 'en', country_code: 'pl' }],
  ['en-sa', { force_country: 'en', country_code: 'sa' }],
  ['en-th', { force_country: 'en', country_code: 'th' }],
  ['en-za', { force_country: 'en', country_code: 'za' }],
  ['en-ae', { force_country: 'en', country_code: 'ae' }],
  ['en-sg', { force_country: 'en', country_code: 'sg' }],
  ['en-sd', { force_country: 'en', country_code: 'sd' }],
  ['en-mt', { force_country: 'en', country_code: 'mt' }],
  ['en-lv', { force_country: 'en', country_code: 'lv' }],
  ['en-jm', { force_country: 'en', country_code: 'jm' }],
  ['en-bz', { force_country: 'en', country_code: 'bz' }],
  ['en-gb', { force_country: 'uk', country_code: 'gb' }],
  ['en-au', { force_country: 'au', country_code: 'au' }],
  ['en-nz', { force_country: 'au', country_code: 'nz' }],
  ['en-global', { force_country: 'en', country_code: null }],
  ['es-cl', { force_country: 'en', country_code: 'cl' }],
  ['es-co', { force_country: 'en', country_code: 'co' }],
  ['es-mx', { force_country: 'mx', country_code: 'mx' }],
  ['es-pe', { force_country: 'en', country_code: 'pe' }],
  ['es-bz', { force_country: 'en', country_code: 'bz' }],
  ['es-es', { force_country: 'es', country_code: 'es' }],
  ['es-global', { force_country: 'en', country_code: null }],
  ['ro-ro', { force_country: 'ro', country_code: 'ro' }],
  ['it-it', { force_country: 'it', country_code: 'it' }],
  ['fr-fr', { force_country: 'fr', country_code: 'fr' }],
  ['fr-be', { force_country: null, country_code: null, isZuora: true }],
  ['nl-be', { force_country: null, country_code: null, isZuora: true }],
  ['nl-nl', { force_country: null, country_code: null, isZuora: true }],
  ['de-de', { force_country: 'de', country_code: 'de' }],
  ['sv-se', { force_country: 'se', country_code: 'se' }],
  ['pt-br', { force_country: 'br', country_code: 'br' }],
  ['pt-pt', { force_country: 'pt', country_code: 'pt' }],
  ['zh-hk', { force_country: 'en', country_code: 'hk' }],
  ['zh-tw', { force_country: 'en', country_code: 'tw' }],
]);

/**
 * Returns the value of a query parameter
 * @returns {String}
 */
export function getParamValue(param) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
}
export const localisationList = ['zh-hk', 'zh-tw', 'en-us', 'de-de', 'nl-nl', 'fr-fr', 'it-it', 'ro-ro'];
export function getDefaultLanguage() {
  // TODO: refactor. It's not working as should for en locales.
  const currentPathUrl = window.location.pathname;
  const foundLanguage = localisationList.find((item) => currentPathUrl.indexOf(`/${item}/`) !== -1);
  let lang = 'site';

  if (foundLanguage) {
    if (foundLanguage.startsWith('zh-') || foundLanguage.startsWith('en-')) {
      lang = foundLanguage.replace('zh-', '').replace('en-', '') || 'site';
    } else {
      [, lang] = foundLanguage.split('-');
    }
  }

  return lang;
}

const cacheResponse = new Map();
const siteName = getDefaultLanguage();

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

async function findProductVariant(cachedResponse, variant) {
  if (!isZuora()) {
    const response = await cachedResponse;
    if (!response.ok) throw new Error(`${response.statusText}`);
    const json = await response.clone().json();

    // eslint-disable-next-line guard-for-in,no-restricted-syntax
    for (const i in json.data.product.variations) {
      // eslint-disable-next-line guard-for-in,no-restricted-syntax
      for (const j in json.data.product.variations[i]) {
        const v = json.data.product.variations[i][j];
        if (v.variation.variation_name === variant) {
          return v;
        }
      }
    }

    throw new Error('Variant not found');
  }

  // zuora logic
  // eslint-disable-next-line no-promise-executor-return
  await new Promise((res) => setTimeout(res, 50));

  const resp = cachedResponse.selected_variation;
  const units = cachedResponse.selected_users;

  const zuoraFormatedVariant = {
    buy_link: cachedResponse.buy_link,
    active_platform: null,
    avangate_variation_prefix: null,
    currency_id: null,
    currency_iso: resp.currency_iso,
    currency_label: resp.currency_label,
    discount: {
      discounted_price: resp.discount.discounted_price,
      discount_value: resp.discount.discount_value,
      discount_type: null,
    },
    in_selector: null,
    platform_id: resp.platform_id,
    platform_product_id: null, // todo not present '30338209',
    price: resp.price,
    product_id: resp.product_id,
    promotion: resp.promotion,
    promotion_functions: null,
    region_id: resp.region_id,
    variation: {
      variation_id: null,
      variation_name: resp.variation.variation_name, // todo not present
      dimension_id: null,
      dimension_value: units, // todo not present
      years: resp.variation.years,
    },
    variation_active: null,
    variation_id: resp.variation_id,
  };

  return zuoraFormatedVariant;
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

export function generateProductBuyLink(product, productCode, month = null, years = null) {
  if (isZuora()) {
    return product.buy_link;
  }

  const m = product.variation?.dimension_value || month;
  const y = product.variation?.years || years;

  const forceCountry = getPriceLocalMapByLocale().force_country;
  return `${getBuyLinkCountryPrefix()}/${productCode}/${m}/${y}/?force_country=${forceCountry}`;
}

export function setDataOnBuyLinks(element, dataInfo) {
  const { productId, variation } = dataInfo;
  if (productId) element.dataset.product = productId;

  element.dataset.buyPrice = variation.discounted_price || variation.price || 0;

  if (variation.price) element.dataset.oldPrice = variation.price;
  if (variation.currency_label) element.dataset.currency = variation.currency_label;
  if (variation.region_id) element.dataset.region = variation.region_id;
  if (variation.variation_name) element.dataset.variation = variation.variation_name;
}

export function formatPrice(price, currency, region = null, locale = null) {
  const loc = region ? IANA_BY_REGION_MAP.get(Number(region))?.locale || 'en-US' : locale;
  return new Intl.NumberFormat(loc, { style: 'currency', currency }).format(price);
}

/**
 * Fetches a product from the Bitdefender store.
 * @param code The product code
 * @param variant The product variant
 * @returns {Promise<*>}
 * hk - 51, tw - 52
 */
export async function fetchProduct(code = 'av', variant = '1u-1y', pid = null) {
  const url = new URL(window.location.href);

  if (!isZuora()) {
    let FETCH_URL = 'https://www.bitdefender.com/site/Store/ajax';
    const data = new FormData();
    // extract pid from url

    if (!pid) {
      // eslint-disable-next-line no-param-reassign
      pid = url.searchParams.get('pid') || getMetadata('pid');
    }

    data.append('data', JSON.stringify({
      ev: 1,
      product_id: code,
      config: {
        extra_params: {
          // eslint-disable-next-line object-shorthand
          pid: pid,
        },
      },
    }));

    if (url.hostname.includes('bitdefender.co.uk')) {
      const newData = JSON.parse(data.get('data'));
      newData.config.force_region = '3';
      data.set('data', JSON.stringify(newData));
    }

    if (url.hostname.includes('bitdefender.fr')) {
      const newData = JSON.parse(data.get('data'));
      newData.config.force_region = '14';
      data.set('data', JSON.stringify(newData));
    }

    if (siteName === 'uk') {
      const newData = JSON.parse(data.get('data'));
      newData.config.force_region = '3';
      data.set('data', JSON.stringify(newData));
    }

    if (siteName === 'fr') {
      const newData = JSON.parse(data.get('data'));
      newData.config.force_region = '14';
      data.set('data', JSON.stringify(newData));
    }

    const locale = window.location.pathname.split('/')[1];
    const currentPriceSetup = PRICE_LOCALE_MAP.get(locale) || 'en-us';
    const newData = JSON.parse(data.get('data'));
    FETCH_URL = `${FETCH_URL}?force_country=${currentPriceSetup.force_country}`;
    newData.config.country_code = currentPriceSetup.country_code;
    data.set('data', JSON.stringify(newData));

    if (cacheResponse.has(code)) {
      return findProductVariant(cacheResponse.get(code), variant);
    }

    // we don't await the response here, because we want to cache it
    const response = fetch(FETCH_URL, {
      method: 'POST',
      body: data,
    });

    cacheResponse.set(code, response);
    return findProductVariant(response, variant);
  }

  // zuora logic
  // if (cacheResponse.has(code)) {
  //   return findProductVariant(cacheResponse.get(code), variant);
  // }

  const variantSplit = variant.split('-');
  const units = variantSplit[0].split('u')[0];
  const years = variantSplit[1].split('y')[0];
  const campaign = getParamValue('campaign');
  const zuoraResponse = await ZuoraNLClass.loadProduct(`${code}/${units}/${years}`, campaign);
  // zuoraResponse.ok = true;

  // cacheResponse.set(code, zuoraResponse);
  return findProductVariant(zuoraResponse, variant);
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
export function renderNanoBlocks(
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
          const element = mv ? renderer(mv, ...params, block) : renderer(...params, block);
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

export function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

export function appendAdobeMcLinks(selector) {
  try {
    const visitor = window.Visitor.getInstance('0E920C0F53DA9E9B0A490D45@AdobeOrg', {
      trackingServer: 'sstats.bitdefender.com',
      trackingServerSecure: 'sstats.bitdefender.com',
      marketingCloudServer: 'sstats.bitdefender.com',
      marketingCloudServerSecure: 'sstats.bitdefender.com',
    });

    const wrapperSelector = typeof selector === 'string' ? document.querySelector(selector) : selector;

    const hrefSelector = '[href*=".bitdefender."]';
    wrapperSelector.querySelectorAll(hrefSelector).forEach((link) => {
      const isAdobeMcAlreadyAdded = link.href.includes('adobe_mc');
      if (isAdobeMcAlreadyAdded) {
        return;
      }
      const destinationURLWithVisitorIDs = visitor.appendVisitorIDsTo(link.href);
      link.href = destinationURLWithVisitorIDs.replace(/MCAID%3D.*%7CMCORGID/, 'MCAID%3D%7CMCORGID');
    });
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e);
  }
}

export const GLOBAL_EVENTS = {
  ADOBE_MC_LOADED: 'adobe_mc::loaded',
  PAGE_LOADED: 'page::loaded',
};

export function adobeMcAppendVisitorId(selector) {
  // https://experienceleague.adobe.com/docs/id-service/using/id-service-api/methods/appendvisitorid.html?lang=en

  if (window.ADOBE_MC_EVENT_LOADED) {
    appendAdobeMcLinks(selector);
  } else {
    document.addEventListener(GLOBAL_EVENTS.ADOBE_MC_LOADED, () => {
      appendAdobeMcLinks(selector);
    });
  }
}

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
  const resizeObserver = new ResizeObserver((entries) => {
    // eslint-disable-next-line no-unused-vars
    entries.forEach((entry) => {
      adjustHeights();
    });
  });

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
