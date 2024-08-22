import fs from 'fs/promises';
import convert from 'xml-js';
import path from 'path';

const QUERY_INDEX_URL = 'https://www.bitdefender.com.au/solutions/query-index.json';
const LOCALE_URL = 'https://www.bitdefender.com.au';

const hreflangMap = [
  ['en-ro', { baseUrl: 'https://www.bitdefender.ro', pageType: '.html' }],
  ['de', { baseUrl: 'https://www.bitdefender.de', pageType: '.html' }],
  ['sv', { baseUrl: 'https://www.bitdefender.se', pageType: '.html' }],
  ['pt', { baseUrl: 'https://www.bitdefender.pt', pageType: '.html' }],
  ['en-sv', { baseUrl: 'https://www.bitdefender.se', pageType: '.html' }],
  ['pt-BR', { baseUrl: 'https://www.bitdefender.com.br', pageType: '.html' }],
  ['en', { baseUrl: 'https://www.bitdefender.com', pageType: '.html' }],
  ['it', { baseUrl: 'https://www.bitdefender.it', pageType: '.html' }],
  ['fr', { baseUrl: 'https://www.bitdefender.fr', pageType: '.html' }],
  ['nl-BE', { baseUrl: 'https://www.bitdefender.be', pageType: '.html' }],
  ['es', { baseUrl: 'https://www.bitdefender.es', pageType: '.html' }],
  ['en-AU', { baseUrl: 'https://www.bitdefender.com.au', pageType: '' }],
  ['ro', { baseUrl: 'https://www.bitdefender.ro', pageType: '.html' }],
  ['nl', { baseUrl: 'https://www.bitdefender.nl', pageType: '.html' }],
  ['en-GB', { baseUrl: 'https://www.bitdefender.co.uk', pageType: '.html' }],
  ['zh-hk', { baseUrl: 'https://www.bitdefender.com/zh-hk', pageType: '' }],
  ['zh-tw', { baseUrl: 'https://www.bitdefender.com/zh-tw', pageType: '' }],
  ['x-default', { baseUrl: 'https://www.bitdefender.com', pageType: '.html' }],
];

try {
  const response = await fetch(QUERY_INDEX_URL);
  const json = await response.json();
  const sitemapPath = path.join(process.cwd(), '../../solutions/sitemap.xml');

  const output = {
    urlset: {
      _attributes: {
        'xmlns:xhtml': 'http://www.w3.org/1999/xhtml',
        xmlns: 'http://www.sitemaps.org/schemas/sitemap/0.9',
      },
      url: json?.data.map((row) => ({
        loc: `${LOCALE_URL}${row.path}`,
        'xhtml:link': Object.keys(hreflangMap).map((key) => {
          const hreflang = hreflangMap[key][0];
          const pathCount = row.path.split('/').filter(String).length;
          const href = `${hreflangMap[key][1].baseUrl}${row.path}${pathCount > 1 ? hreflangMap[key][1].pageType : ''}`;
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
} catch (error) {
  // eslint-disable-next-line no-console
  console.error(error);
}
