import fs from 'fs/promises';
import convert from 'xml-js';
import path from 'path';
import 'dotenv/config';

const LOCALES = 'https://www.bitdefender.com/p-api/v1/locales-and-countries';
const COUNTRIES = 'https://www.bitdefender.com/p-api/v1/locales/{locale}/countries';
const QUERY_INDEX_URL = 'https://www.bitdefender.com/{locale}/query-index.json';
const DOMAIN_URL = 'https://www.bitdefender.com';

/**
 * these are not a content buckets
 * these locales are alocated to multiple countries
*/
const buckets = [
  'en-mt', 'en-jm', 'en-lv', 'en-bz'
];

// Set to cache checked URLs that have a 200 status
const checkedValidUrls = new Set();
// Set to cache checked URLs that are invalid (do not return a 200 status)
const checkedNotValidUrls = new Set();

async function fetchJson(url) {
  try {
    const response = await fetch(url, {
      redirect: "error"
    });

    if (!response.status === 200) {
      throw new Error(`HTTP error! status: ${response.status} for URL: ${url}`);
    }

    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      throw new Error(`Expected JSON but received ${contentType} from ${url}`);
    }

    return await response.json();
  } catch (error) {
    console.error(error);
    return null;
  }
}

function getUniqueLocales(data) {
  return [...new Set(data.map(item => item.locale.toLowerCase()))];
}

function generateHreflangMap(localesArr) {
  return localesArr.map(locale => [locale, { baseUrl: `${DOMAIN_URL}/`, bucketLocale: '' }]);
}

async function checkUrlExists(url) {
  if (checkedValidUrls.has(url)) {
    return true;
  }

  if (checkedNotValidUrls.has(url)) {
    return false;
  }

  try {
    const min = 1000, max = 3000;
    const delay = Math.floor(Math.random() * (max - min + 1)) + min;
    await new Promise(resolve => setTimeout(resolve, delay));
    const response = await fetch(url, {
      method: 'GET',
      redirect: "error",
      headers: {
        'X-Client-Id': process.env.X_CLIENT_ID,
      }
    });

    if (response.status === 200) {
      checkedValidUrls.add(url);
      return true;
    } else {
      checkedNotValidUrls.add(url);
      return false;
    }
  } catch (error) {
    console.error(`Failed to check URL: ${url}`, error);
    checkedNotValidUrls.add(url);
    return false; // Return false if there’s any error
  }
}

async function addBucketCountriesToHreflangMap() {
  const hreflangMap = [];

  for (const bucketLocale of buckets) {
    const countriesUrl = COUNTRIES.replace('{locale}', bucketLocale);
    const countriesData = await fetchJson(countriesUrl);

    if (countriesData) {
      countriesData.forEach(country =>
        hreflangMap.push([`en-${country.country.toLowerCase()}`, { baseUrl: `${DOMAIN_URL}/`, bucketLocale }])
      );
    }
  }
  return hreflangMap;
}

async function processLocaleSitemap(locale, hreflangMap) {
  const queryIndexUrl = QUERY_INDEX_URL.replace('{locale}', locale);
  const queryData = await fetchJson(queryIndexUrl);

  if (!queryData) return;

  const validData = queryData.data.filter(entry => entry.path !== "0");
  const filteredHreflangMap = hreflangMap.filter(([lang]) => lang !== locale);
  const sitemapPath = path.join(process.cwd(), '../../_src/sitemap/csg/sitemap_' + locale + '.xml');

  const output = {
    urlset: {
      _attributes: {
        'xmlns:xhtml': 'http://www.w3.org/1999/xhtml',
        xmlns: 'http://www.sitemaps.org/schemas/sitemap/0.9',
      },
      url: await Promise.all(validData.map(async (row) => {
        const alternateLinks = [];
        alternateLinks.push({
          _attributes: {
            rel: 'alternate',
            hreflang: locale,
            href: `${DOMAIN_URL}${row.path}`,
          },
        });

        for (const [hreflang, { baseUrl, bucketLocale }] of filteredHreflangMap) {
          const pathWithoutLocale = row.path.replace(/^\/[a-z]{2}-[a-z]{2}\//, '/');
          const localeUrl = bucketLocale || hreflang;
          const href = `${baseUrl}${localeUrl}${pathWithoutLocale}`;

          if (await checkUrlExists(href)) { // Only include URLs with a 200 status code
            alternateLinks.push({
              _attributes: {
                rel: 'alternate',
                hreflang,
                href,
              },
            });
          } else {
            console.warn(`Skipping URL with non-200 status: ${href}`);
          }
        }

        return {
          loc: `${DOMAIN_URL}${row.path}`,
          'xhtml:link': alternateLinks,
        };
      })),
    },
  };

  const xmlOptions = { compact: true, ignoreComment: true, spaces: 4 };
  const xmlContent = `<?xml version="1.0" encoding="UTF-8"?>\n${convert.json2xml(output, xmlOptions)}`;
  await fs.writeFile(sitemapPath, xmlContent);
  console.log("Sitemap generated for locale:", locale);
}

(async () => {
  try {
    const localesData = await fetchJson(LOCALES);
    const localesArr = getUniqueLocales(localesData);

    let hreflangMap = generateHreflangMap(localesArr);
    // we will not use locale buckets for now.
    //hreflangMap = hreflangMap.concat(await addBucketCountriesToHreflangMap());

    for (const locale of localesArr) {
      if (locale === 'es-bz') {
        continue;
      }
      await processLocaleSitemap(locale, hreflangMap);
    }
  } catch (error) {
    console.error("An error occurred:", error);
  }
})();