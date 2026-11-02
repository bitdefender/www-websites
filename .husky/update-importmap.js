/* eslint-disable no-restricted-syntax */
/* eslint-disable import/no-extraneous-dependencies */
const { readFileSync, writeFileSync } = require('fs');
const { XMLSerializer, Window } = require('happy-dom');

const window = new Window({
  settings: {
    // Prevent any <script>…</script> from running:
    disableJavaScriptEvaluation: true,
    // Prevent external .js files from even being fetched:
    disableJavaScriptFileLoading: true,
    // (Optional) if you'd rather get a "load" event instead of an error
    // when loading is disabled, you can also set:
    // handleDisabledFileLoadingAsSuccess: true,
  }
});
const { document } = window;

// Versions come from package-lock.json, not node_modules: an install older than
// the lockfile must not end up in the import map (it shipped a downgrade once)
function getLockedDependencies() {
  const { dependencies } = JSON.parse(readFileSync('package.json', 'utf-8'));
  const lock = JSON.parse(readFileSync('package-lock.json', 'utf-8'));
  const lockedRanges = lock.packages[''].dependencies || {};
  const result = [];
  for (const [name, range] of Object.entries(dependencies)) {
    const version = lock.packages[`node_modules/${name}`]?.version;
    if (lockedRanges[name] !== range || !version) {
      throw new Error(`package-lock.json has no ${name}@${range}, run npm install`);
    }
    result.push([name, version]);
  }
  // npm ls order (by name@version), which the committed import maps already follow
  return Object.fromEntries(result.sort(([a, av], [b, bv]) => `${a}@${av}`.localeCompare(`${b}@${bv}`, 'en')));
}

// Main function that updates the import map in an HTML file
async function updateHtmlImportMap(htmlFilePath) {
  try {
    const deps = getLockedDependencies();

    // Build an import map object.
    // For demonstration purposes, we create a mapping where each dependency is mapped
    // to a dummy CDN URL using its version. Adjust the URL format as needed.
    const importMap = {
      imports: {},
    };
    for (const [name, version] of Object.entries(deps)) {
      importMap.imports[`${name}`] = `https://esm.sh/${name}@${version}`;
      importMap.imports[`${name}/`] = `https://esm.sh/${name}@${version}/`;
    }

    // Read the HTML file
    const htmlContent = readFileSync(htmlFilePath, 'utf-8');
    const parser = new window.DOMParser();
    let newDocument = parser.parseFromString(htmlContent, 'text/html');
    const isCompleteHTMLFile = Boolean(newDocument.head.innerHTML);

    if (!isCompleteHTMLFile) {
      newDocument = document;
      newDocument.head.innerHTML = htmlContent;
    }

    // Find the <script> element with type="importsmap"
    let scriptElement = newDocument.querySelector('script[type="importmap"]');
    if (!scriptElement) {
      scriptElement = newDocument.createElement('script');
      scriptElement.type = 'importmap';
      newDocument.head.prepend(scriptElement);
    }

    // Update the script element's content with the new import map (formatted as JSON)
    scriptElement.textContent = JSON.stringify(importMap, null, 2);

    // Serialize the updated HTML and write it back to the file
    const serializer = new XMLSerializer();
    let content = '';
    const childNodes = isCompleteHTMLFile ? newDocument.childNodes : newDocument.head.childNodes;
    childNodes.forEach((child) => {
      content += serializer.serializeToString(child).replace(/\s+xmlns="[^"]*"/, '');
    });

    writeFileSync(htmlFilePath, content, 'utf-8');
    console.log(`Updated ${htmlFilePath} with the new import map.`);
  } catch (err) {
    console.error('Error updating the import map:', err);
    // fail the pre-commit hook instead of committing a stale import map
    process.exitCode = 1;
  }
}

// Usage: Pass the HTML file path as the first argument, or it defaults to 'index.html'
updateHtmlImportMap('head.html');
updateHtmlImportMap('404.html');