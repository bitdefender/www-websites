/* eslint-disable no-restricted-syntax */
/* eslint-disable import/no-extraneous-dependencies */
const { exec } = require('child_process');
const { readFileSync, writeFileSync } = require('fs');
const { XMLSerializer, Window } = require('happy-dom');

const window = new Window();
const { document } = window;

// Function to run the npm ls command and return parsed JSON
function execNpmLs() {
  return new Promise((resolve, reject) => {
    exec('npm ls --json -all --omit=dev', (err, stdout) => {
      if (err) {
        // Sometimes npm ls returns an error code even if the JSON output is usable.
        try {
          const parsed = JSON.parse(stdout);
          return resolve(parsed);
        } catch (parseErr) {
          return reject(err);
        }
      }
      return resolve(JSON.parse(stdout));
    });
  });
}

// Recursively collect unique dependencies from the npm ls JSON
function collectDependencies(deps, result = {}, depth = 0) {
  if (!deps) return result;
  Object.entries(deps).forEach(([name, info]) => {
    // Add or update the dependency info (here, we're simply storing the version)
    if (!result[name]) result[name] = { primaryDependency: '', secondaryDependencies: [] };
    if (depth === 0) {
      result[name].primaryDependency = info.version;
    } else {
      result[name].secondaryDependencies.push(info.version);
    }
    // If this dependency has its own dependencies, process them recursively
    if (info.dependencies) {
      collectDependencies(info.dependencies, result, depth + 1);
    }
  });
  return result;
}

// Main function that updates the import map in an HTML file
async function updateHtmlImportMap(htmlFilePath) {
  try {
    // Get the npm dependency tree for production dependencies
    const npmLsOutput = await execNpmLs();
    const deps = collectDependencies(npmLsOutput.dependencies);

    // Build an import map object.
    // For demonstration purposes, we create a mapping where each dependency is mapped
    // to a dummy CDN URL using its version. Adjust the URL format as needed.
    const importMap = {
      imports: {},
    };
    for (const [name, { primaryDependency, secondaryDependencies }] of Object.entries(deps)) {
      if (primaryDependency) {
        importMap.imports[name] = `https://cdn.jsdelivr.net/npm/${name}@${primaryDependency}/+esm`;
      }
      for (const version of secondaryDependencies) {
        const packagePath = `/npm/${name}@${version}/+esm`;
        importMap.imports[packagePath] = `https://cdn.jsdelivr.net/${packagePath}`;
      }
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
  }
}

// Usage: Pass the HTML file path as the first argument, or it defaults to 'index.html'
updateHtmlImportMap('head.html');
updateHtmlImportMap('404.html');