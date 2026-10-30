/*
 * vite.config.mjs — bundles the npm packages `_src/` imports into
 * `_src/dist/` and points the import maps in head.html and 404.html at the
 * bundles. Ported from the `vendor` environment of www-blog-csg's
 * vite.config.js. Our own code in `_src/` is still served unbuilt, so the
 * import map stays; only its targets move from esm.sh to `_src/dist/`.
 *
 *   npm run build   -> vite build   (also run by postinstall and pre-commit)
 *
 * `_src/dist/` is generated output, committed because Edge Delivery serves
 * the repo as-is. Never edit it by hand; CI rebuilds it and fails on a diff.
 *
 * Every npm specifier `_src/` imports (static imports, re-exports, and
 * dynamic imports of a string literal) becomes one minified ESM file,
 * `@repobit/dex-utils` -> `_src/dist/repobit/dex-utils.js`. Modules several
 * entries share (Lit, dex-store, dex-constants, ...) go to `_src/dist/_chunks/`
 * so they load once. No hashes: a changed bundle diffs in place.
 *
 * The bundles are built from node_modules, so the build first checks that
 * node_modules matches package-lock.json: a stale install must not ship.
 */

import fs from 'node:fs';
import path from 'node:path';
import { Window, XMLSerializer } from 'happy-dom';
import { defineConfig, parseSync } from 'vite';

const SRC = '_src';
const OUT = '_src/dist';

/** Files that carry the import map. */
const HTML_FILES = ['head.html', '404.html'];

/**
 * Specifiers a package doesn't export, mapped to the file they stand for.
 * The bundler can't resolve them, the browser only sees the import map.
 */
const UNEXPORTED = Object.fromEntries(Object.entries({
  '@repobit/dex-system-design/spotlight-section': 'spotlight-section/spotlight-section.js',
  '@repobit/dex-system-design/video-player': 'video-player/video-player.js',
}).map(([specifier, file]) => [specifier, path.resolve('node_modules/@repobit/dex-system-design/src/components', file)]));

/** @param {string} file path relative to `_src/`, `/`-separated */
const isSkipped = (file) => /^(dist|tests)\//.test(file) || file.split('/').includes('vendor');

const readJson = (file) => JSON.parse(fs.readFileSync(file, 'utf8'));

/** Runtime dependency names from package.json: the packages that get bundled. */
const PACKAGES = Object.keys(readJson('package.json').dependencies);

/** @param {string} specifier import specifier */
const isPackage = (specifier) => PACKAGES.some((name) => specifier === name || specifier.startsWith(`${name}/`));

/**
 * Fail unless package.json, package-lock.json and node_modules agree: the
 * lockfile must hold every dependency range, and every runtime package it
 * pins must be installed at that version.
 */
function checkInstall() {
  const { dependencies } = readJson('package.json');
  const lock = readJson('package-lock.json');
  const lockedRanges = lock.packages[''].dependencies || {};
  Object.entries(dependencies).forEach(([name, range]) => {
    if (lockedRanges[name] !== range) {
      throw new Error(`package-lock.json has no ${name}@${range}, run npm install`);
    }
  });
  Object.entries(lock.packages)
    .filter(([key, { dev }]) => key.startsWith('node_modules/') && !dev)
    .forEach(([key, { version, optional, devOptional }]) => {
      const manifest = `${key}/package.json`;
      if (!fs.existsSync(manifest)) {
        if (optional || devOptional) return;
        throw new Error(`${key} is not installed, run npm install`);
      }
      const installed = readJson(manifest).version;
      if (installed !== version) {
        throw new Error(`${key} is ${installed}, package-lock.json has ${version}, run npm install`);
      }
    });
}

/**
 * The package specifiers a module imports at runtime: static imports and
 * re-exports, and dynamic imports of a string literal. Each distinct
 * specifier becomes an entry, subpaths included.
 * @param {string} file path relative to `_src/`, `/`-separated
 * @returns {string[]}
 */
function packageImports(file) {
  const code = fs.readFileSync(`${SRC}/${file}`, 'utf8');
  const { module } = parseSync(file, code);
  const imports = module.staticImports
    .filter(({ entries }) => !entries.length || entries.some((entry) => !entry.isType))
    .map(({ moduleRequest }) => moduleRequest.value);
  const reExports = module.staticExports
    .flatMap(({ entries }) => entries)
    .filter((entry) => entry.moduleRequest && !entry.isType)
    .map((entry) => entry.moduleRequest.value);
  const dynamicImports = module.dynamicImports
    .map(({ moduleRequest }) => code.slice(moduleRequest.start, moduleRequest.end))
    .filter((request) => /^(['"]).*\1$/.test(request))
    .map((request) => request.slice(1, -1));
  return [...imports, ...reExports, ...dynamicImports].filter(isPackage);
}

/** @returns {string[]} every package specifier `_src/` imports, sorted */
function discoverSpecifiers() {
  const specifiers = new Set();
  // No `encoding` option means the default, 'utf8': the names are strings.
  fs.readdirSync(SRC, { recursive: true })
    .map((rel) => rel.split(path.sep).join('/'))
    .filter((file) => file.endsWith('.js') && !isSkipped(file))
    .forEach((file) => packageImports(file).forEach((specifier) => specifiers.add(specifier)));
  return [...specifiers].sort();
}

/**
 * Output key of a specifier, leading `@` dropped so served paths stay
 * plain: `@repobit/dex-utils` -> `repobit/dex-utils`.
 * @param {string} specifier package specifier
 */
const outputKey = (specifier) => specifier.replace(/^@/, '');

/**
 * Name a shared chunk after the package of its last module, the one the
 * chunk's other modules exist for. Rolldown numbers a name that repeats.
 * @param {{ name: string, moduleIds: string[] }} chunk
 */
function chunkName({ name, moduleIds }) {
  const pkg = moduleIds.at(-1)?.match(/node_modules[\\/]((?:@[^\\/]+[\\/])?[^\\/]+)/)?.[1];
  return `_chunks/${pkg ? pkg.replace(/^@/, '').replace(/[\\/]/, '-') : name}.js`;
}

/**
 * Replace the import map in an HTML file, or prepend one. head.html is a
 * fragment, so it is parsed into the head of a blank document.
 * @param {string} htmlFilePath
 * @param {Record<string, string>} imports
 */
function writeImportMap(htmlFilePath, imports) {
  const window = new Window({
    settings: {
      disableJavaScriptEvaluation: true,
      disableJavaScriptFileLoading: true,
    },
  });
  const htmlContent = fs.readFileSync(htmlFilePath, 'utf8');
  let document = new window.DOMParser().parseFromString(htmlContent, 'text/html');
  const isCompleteHTMLFile = Boolean(document.head.innerHTML);
  if (!isCompleteHTMLFile) {
    ({ document } = window);
    document.head.innerHTML = htmlContent;
  }

  let script = document.querySelector('script[type="importmap"]');
  if (!script) {
    script = document.createElement('script');
    script.type = 'importmap';
    document.head.prepend(script);
  }
  script.textContent = JSON.stringify({ imports }, null, 2);

  const serializer = new XMLSerializer();
  const childNodes = isCompleteHTMLFile ? document.childNodes : document.head.childNodes;
  const content = [...childNodes]
    .map((child) => serializer.serializeToString(child).replace(/\s+xmlns="[^"]*"/, ''))
    .join('');
  fs.writeFileSync(htmlFilePath, content, 'utf8');
}

/**
 * Point every bundled specifier at its file under `_src/dist/`. Exact
 * entries only: an import of an unbundled subpath fails loudly instead of
 * falling through a `name/` prefix.
 * @param {string[]} specifiers
 * @returns {import('vite').Plugin}
 */
function importMap(specifiers) {
  return {
    name: 'import-map',
    writeBundle() {
      const imports = Object.fromEntries(specifiers.map((specifier) => [specifier, `/${OUT}/${outputKey(specifier)}.js`]));
      HTML_FILES.forEach((file) => writeImportMap(file, imports));
    },
  };
}

checkInstall();

const specifiers = discoverSpecifiers();

/** Entries: output key -> bare specifier (or the file an unexported one stands for). */
const input = Object.fromEntries(specifiers.map((specifier) => [outputKey(specifier), UNEXPORTED[specifier] ?? specifier]));

export default defineConfig({
  publicDir: false,
  // Library mode leaves `process.env` for the consumer to replace. The
  // browser is the consumer here.
  define: { 'process.env.NODE_ENV': JSON.stringify('production') },
  plugins: [importMap(specifiers)],
  build: {
    outDir: OUT,
    emptyOutDir: true, // a dropped package must not linger
    reportCompressedSize: false,
    // `input` wins over `lib.entry`, which Vite would path.resolve() against
    // the root; as input, the bare specifiers go through the resolver with
    // browser conditions. `lib` still requires an entry.
    lib: { entry: input, formats: ['es'] },
    rolldownOptions: {
      input,
      output: {
        entryFileNames: '[name].js',
        chunkFileNames: chunkName,
        minify: true, // library-mode `es` output keeps whitespace otherwise
      },
    },
  },
});
