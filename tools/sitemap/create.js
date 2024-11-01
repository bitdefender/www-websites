import fs from 'fs/promises';
import convert from 'xml-js';
import path from 'path';

const LOCALES = 'https://www.bitdefender.com/p-api/v1/locales-and-countries';
const COUNTRIES = 'https://www.bitdefender.com/p-api/v1/locales/{locale}/countries';
const QUERY_INDEX_URL = 'https://www.bitdefender.com/{locale}/query-index.json';
const DOMAIN_URL = 'https://www.bitdefender.com';

// const hreflangMap = [
//   ['en-ro', { baseUrl: 'https://www.bitdefender.ro', pageType: '.html' }],
//   ['de', { baseUrl: 'https://www.bitdefender.de', pageType: '.html' }],
//   ['sv', { baseUrl: 'https://www.bitdefender.se', pageType: '.html' }],
//   ['pt', { baseUrl: 'https://www.bitdefender.pt', pageType: '.html' }],
//   ['en-sv', { baseUrl: 'https://www.bitdefender.se', pageType: '.html' }],
//   ['pt-BR', { baseUrl: 'https://www.bitdefender.com.br', pageType: '.html' }],
//   ['en', { baseUrl: 'https://www.bitdefender.com', pageType: '.html' }],
//   ['it', { baseUrl: 'https://www.bitdefender.it', pageType: '.html' }],
//   ['fr', { baseUrl: 'https://www.bitdefender.fr', pageType: '.html' }],
//   ['nl-BE', { baseUrl: 'https://www.bitdefender.be', pageType: '.html' }],
//   ['es', { baseUrl: 'https://www.bitdefender.es', pageType: '.html' }],
//   ['en-AU', { baseUrl: 'https://www.bitdefender.com.au', pageType: '' }],
//   ['ro', { baseUrl: 'https://www.bitdefender.ro', pageType: '.html' }],
//   ['nl', { baseUrl: 'https://www.bitdefender.nl', pageType: '.html' }],
//   ['en-GB', { baseUrl: 'https://www.bitdefender.co.uk', pageType: '.html' }],
//   ['zh-hk', { baseUrl: 'https://www.bitdefender.com/zh-hk', pageType: '' }],
//   ['zh-tw', { baseUrl: 'https://www.bitdefender.com/zh-tw', pageType: '' }],
//   ['x-default', { baseUrl: 'https://www.bitdefender.com', pageType: '.html' }],
// ];

// please make sure that these buckets are in sync with Vlaicu
const buckets = [
  'en-mt', // Global EUR
  'en-jm', // Global USD
  'en-lv', // Global EUR V2
  'en-bz', //Global USD V2
];

const hreflangMap = [];

try {
  const responseLocales = await fetch(LOCALES);
  const jsonLocales = await responseLocales.json();
  const getUniqueLocales = (data) => {
    const uniqueLocales = [...new Set(data.map(item => item.locale.toLowerCase()))];
    return uniqueLocales;
  }

  const localesArr = getUniqueLocales(jsonLocales);

  for (let i = 0; i < localesArr.length; i++) {
    let locale = localesArr[i];
    hreflangMap.push([locale, { baseUrl: 'https://www.bitdefender.com/' , bucketLocale: ''}])
  }

  // logic for buckets 
  for (let i = 0; i < buckets.length; i++) {
    const bucketLocale = buckets[i];
    let countriesUrls = COUNTRIES.replace('{locale}', bucketLocale);
    let json = {};

    try {
      let resp = await fetch(countriesUrls);
      json = await resp.json();
    } catch (error) {
      console.error("ERROR: ", countriesUrls);
      console.error(error);
    }

    for (let j = 0; j < json.length; j++) {
      const country = json[j].country.toLowerCase();
      hreflangMap.push([`en-${country}`, { baseUrl: 'https://www.bitdefender.com/' , bucketLocale: bucketLocale}])
    }
  
  }

  localesArr.forEach(async locale => {
    let json = {};
    let queryIndex = QUERY_INDEX_URL.replace('{locale}', locale);

    try {
      const response = await fetch(queryIndex);
      json = await response.json();
      json.data = json.data.filter(entry => entry.path !== "0");
      json.total = json.data.length;
    } catch (error) {
      console.error("ERROR: ", queryIndex);
      console.error(error);
      return;
    }

    // remove locale from href lang
    const updatedHreflangMap = hreflangMap.filter(([lang]) => lang !== locale);

    const sitemapPath = path.join(process.cwd(), '../../_src/sitemap/csg/sitemap_' + locale + '.xml');

    const output = {
      urlset: {
        _attributes: {
          'xmlns:xhtml': 'http://www.w3.org/1999/xhtml',
          xmlns: 'http://www.sitemaps.org/schemas/sitemap/0.9',
        },
        url: json?.data.map((row) => ({
          loc: `${DOMAIN_URL}${row.path}`,
          'xhtml:link': Object.keys(updatedHreflangMap).map((key) => {
            const hreflang = updatedHreflangMap[key][0];
            const pathCount = row.path.split('/').filter(String).length;
            const pathWithoutLocale = row.path.replace(/^\/[a-z]{2}-[a-z]{2}\//, "/");
            const bucketLocale = updatedHreflangMap[key][1].bucketLocale;
            const localeUrl = bucketLocale || hreflang;
            const href = `${updatedHreflangMap[key][1].baseUrl}${localeUrl}${pathWithoutLocale}`;
            return {
              _attributes: {
                rel: 'alternate',
                hreflang,
                href,
              },
            };
          }),
        })),
      },
    };

    const options = { compact: true, ignoreComment: true, spaces: 4 };
    const xml = `<?xml version="1.0" encoding="UTF-8"?>\n${convert.json2xml(output, options)}`;
    await fs.writeFile(sitemapPath, xml);
    console.log("DONE: ", queryIndex);
  })
} catch (error) {
  // eslint-disable-next-line no-console
  console.error(error);
}
