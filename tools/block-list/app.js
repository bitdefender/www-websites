const axios = require('axios');
const { JSDOM } = require('jsdom');

// Base URLs
const hostname = 'https://main--www-websites--bitdefender.aem.page';
const jsonUrl = 'https://main--www-websites--bitdefender.hlx.page/query-index.json';

// Function to get class names from HTML
const extractClassNames = (html) => {
  const dom = new JSDOM(html);
  const document = dom.window.document;
  const mainElements = document.querySelectorAll('main > div > div[class]');

  const classNames = [];

  mainElements.forEach(el => {
    classNames.push(el.className);
  });

  return classNames;
};

// Function to fetch page and extract class names
const fetchPageClassNames = async (path) => {
  try {
    const url = `${hostname}${path}`;
    console.log('Get: ', url);
    const response = await axios.get(url);
    const classNames = extractClassNames(response.data);
    return classNames;
  } catch (error) {
    console.error(`Error fetching ${path}:`, error.message);
    return [];
  }
};

// Function to fetch the data array from the JSON URL
const fetchDataArray = async () => {
  try {
    const response = await axios.get(jsonUrl);
    return response.data.data; // Assuming the 'data' array is in 'response.data.data'
  } catch (error) {
    console.error(`Error fetching data array:`, error.message);
    return [];
  }
};

// Main function to process all paths
const processPaths = async () => {
  const classCountMap = {};

  // Fetch data array from the JSON file
  const dataArray = await fetchDataArray();

  // Process each path in the data array
  for (const item of dataArray) {
    const classNames = await fetchPageClassNames(item.path);

    classNames.forEach(className => {
      if (className in classCountMap) {
        classCountMap[className] += 1;
      } else {
        classCountMap[className] = 1;
      }
    });
  }

  // Sort the classCountMap by count in descending order
  const sortedClassCounts = Object.entries(classCountMap)
  .sort(([, a], [, b]) => b - a) // Sort by value (count) in descending order
  .reduce((acc, [className, count]) => {
      acc[className] = count;
      return acc;
  }, {});

  console.log("Class names and their counts:", classCountMap);
};

// Run the main function
processPaths();