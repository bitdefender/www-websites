/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable quotes */
/* eslint-disable no-await-in-loop */
/* eslint-disable arrow-parens */
/* eslint-disable no-restricted-syntax */
const fs = require('fs');

/**
 * @typedef {Object} QueryIndexItem
 * @property {string} path
 * @property {string} title
 * @property {string} description
 * @property {string} breadcrumbtitle
 * @property {string} h1
 * @property {string[][]} blocks
 * @property {string[]} fragments
 * @property {string[]} fragments
 * @property {string} robots
 * @property {number} lastModifiedTimestamp
 * @property {string} lastModified
 */

/**
 * @typedef {Object} DiscoveredEntry
 * @property {number} entries
 * @property {string[]} paths
 * @property {?QueryIndexItem} queryIndex
 */

/**
 * @typedef {Record<string, DiscoveredEntry>} DiscoveredItem
 */

// Base domains
const domains = [
    'de-de',
    'es-es',
    'en-global',
    'en-us',
    'es-global',
    'fr-fr',
    'it-it',
    'nl-nl',
    'pt-br',
    'pt-pt',
    'ro-ro',
    'sv-se',
    'zh-tw',
];
const KNOWN_USED_COMPONENTS = ['footer', 'nav', 'header'];

// Function to fetch page and extract class names
/**
 * Function to get page block names
 * @param {string[][]} pageClassesArray
 * @return {string[]}
 */
const getPageBlockNames = (pageClassesArray) => pageClassesArray
  .map(pageClasses => pageClasses?.[0])
  .filter(Boolean);

/**
 * Function to fetch the data array from the JSON URL
 * @returns {Promise<QueryIndexItem[]>}
 */
const fetchDataArray = async () => {
  try {
    const returnedData = [];
    const fetchPromises = [];
    domains.forEach((domain) => {
      const url = `https://main--www-websites--bitdefender.aem.page/${domain}/query-index.json?sheet=raw_index`;
      const promise = fetch(url)
        .then((response) => response.json())
        .then((data) => {
          if (data.data && Array.isArray(data.data)) {
            returnedData.push(...data.data);
          }
        });
      fetchPromises.push(promise);
    });

    await Promise.all(fetchPromises);

    return returnedData;
  } catch (error) {
    console.error(`Error fetching data array:`, error.message);
    return [];
  }
};

/**
 * Fetch the Page from URL and make notes of the classes and components
 * @param {QueryIndexItem} queryIndexItem
 * @param {DiscoveredItem} blocksCountMap
 * @param {DiscoveredItem} fragmentCountMap
 */
const processBlocksAndFragments = (queryIndexItem, blocksCountMap, fragmentCountMap) => {
  if (!queryIndexItem) {
    return;
  }
  const blockNames = getPageBlockNames(queryIndexItem.blocks);
  blockNames.forEach((blockName) => {
    if (blockName in blocksCountMap) {
      blocksCountMap[blockName].entries += 1;
      blocksCountMap[blockName].paths.push(queryIndexItem.path);
    } else {
      blocksCountMap[blockName] = {
        entries: 1,
        paths: [queryIndexItem.path],
      };
    }
  });

  queryIndexItem.fragments.forEach((fragmentPath) => {
    const completeFragmentPath = fragmentPath.replace('lang', queryIndexItem.path.split('/')?.[2]);
    
    if (fragmentCountMap[completeFragmentPath]) {
      fragmentCountMap[completeFragmentPath].entries += 1;
      fragmentCountMap[completeFragmentPath].paths.push(queryIndexItem.path);
      processBlocksAndFragments(fragmentCountMap[completeFragmentPath]?.queryIndex, blocksCountMap, fragmentCountMap);
    }
  });
};

/**
 * Main function to process all paths
 * @param {string[]} components
 */
const processPaths = async (components) => {
  /** @type {DiscoveredItem} */
  const blocksCountMap = {};
  /** @type {DiscoveredItem} */
  const fragmentCountMap = {};

  // Fetch data array from the JSON file
  const dataArray = await fetchDataArray();

  dataArray.forEach(item => {
    try {
      item.blocks = JSON.parse(item.blocks);
      item.fragments = JSON.parse(item.fragments);
      item.lastModifiedTimestamp = Number(item.lastModifiedTimestamp);

      if (item.path.includes('fragment-collection')) {
        fragmentCountMap[item.path] = {
          entries: 0,
          paths: [],
          queryIndex: item,
        };
      }
    } catch (e) {
      console.warn(e);
    }
  });

  // Process each path in the data array
  dataArray.forEach(item => processBlocksAndFragments(item, blocksCountMap, fragmentCountMap));

  /** components to be searched passed as arguments */
  let componentsToSearch;
  try {
    componentsToSearch = components.length
      ? components
      : fs.readdirSync('./_src/blocks', { withFileTypes: true })
        .filter(item => item.isDirectory())
        .map(item => item.name);
  } catch (e) {
    componentsToSearch = Object.keys(blocksCountMap);
  }

  // Check all components and see which ones are worth noting
  const unusedComponents = [];
  componentsToSearch
    .forEach(componentName => {
      if (KNOWN_USED_COMPONENTS.includes(componentName)) {
        return;
      }

      if (!blocksCountMap[componentName]) {
        unusedComponents.push(componentName);
        return;
      }

      console.log(
        `Component ${componentName} was found `,
        blocksCountMap[componentName].entries,
        ` times.`,
        `Example paths:`,
        blocksCountMap[componentName].paths
          // eslint-disable-next-line no-unused-vars
          .sort((a, _) => (a.includes('/en-us/') ? -1 : 1))
          .filter((path, index, self) => self.indexOf(path) === index)
          .slice(0, 10),
        '\n',
      );
    });

  console.log('\nUnused Components:');
  unusedComponents.forEach((component) => {
    console.log(component);
  });

  // Check all fragments and see which ones are not used
  console.log('\nUnused Fragments:');
  Object.entries(fragmentCountMap).forEach(([key, value]) => {
    if (value.entries === 0) {
      console.log(key);
    }
  });
};

// Get all the components that you wish to search for from the command line
const componentsToSearch = process.argv.slice(2);

// Run the main function
processPaths(componentsToSearch);
