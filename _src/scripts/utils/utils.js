/* eslint-disable no-use-before-define */
import { getMetadata } from '../lib-franklin.js';

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

async function findProductVariant(cachedResponse, variant) {
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

/**
 * Fetches a product from the Bitdefender store.
 * @param code The product code
 * @param variant The product variant
 * @returns {Promise<*>}
 * hk - 51, tw - 52
 */
export async function fetchProduct(code = 'av', variant = '1u-1y', pid = null) {
  let FETCH_URL = 'https://www.bitdefender.com/site/Store/ajax';
  const data = new FormData();
  // extract pid from url
  const url = new URL(window.location.href);
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

  if (url.pathname.includes('/en-au/')) {
    const newData = JSON.parse(data.get('data'));
    newData.config.force_region = '4';
    data.set('data', JSON.stringify(newData));
    FETCH_URL = 'https://www.bitdefender.com.au/site/Store/ajax';
  }

  if ((siteName === 'hk' || siteName === 'tw')) {
    // append force_region for hk and tw
    const newData = JSON.parse(data.get('data'));

    newData.config.force_region = siteName === 'hk' ? '41' : '52';

    data.set('data', JSON.stringify(newData));
  }

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

/**
 * Renders nano blocks
 * @param parent The parent element
 */
export function renderNanoBlocks(parent = document.body, mv = undefined, index = undefined) {
  const regex = /{([^}]+)}/g;
  findTextNodes(parent).forEach((node) => {
    const text = node.textContent.trim();
    const matches = text.match(regex);
    if (matches) {
      matches.forEach((match) => {
        const [name] = parseParams(match.slice(1, -1));
        const datasetValue = getDatasetFromSection(parent);

        const datasetEntryValue = (index !== undefined ? datasetValue[`${name.toLowerCase()}${index + 1}`] : datasetValue[name.toLowerCase()]) || '';

        // const currentIndexForSectionMetadata = index;
        // const datasetAllValues = datasetValue[name.toLowerCase()].split(',').map((item) => item.trim());
        // const datasetEntryValue = (index !== undefined ? datasetAllValues[0] : datasetAllValues[currentIndexForSectionMetadata]) || '';

        const newMatch = [match, datasetEntryValue.split(',')].join(',').replace(/[{}]/g, '');

        const [newName, ...params] = parseParams(newMatch);
        const renderer = nanoBlocks.get(newName.toLowerCase());
        if (renderer) {
          const element = mv ? renderer(mv, ...params) : renderer(...params);
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

export function getDatasetFromSection(block) {
  const parentSelector = block.closest('.section');
  return parentSelector.dataset;
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

export const GLOBAL_EVENTS = {
  ADOBE_MC_LOADED: 'adobe_mc::loaded',
  PAGE_LOADED: 'page::loaded',
};
