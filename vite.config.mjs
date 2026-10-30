/*
 * vite.config.mjs — builds the served tree `_src/` from the sources in
 * `src/`. Ported from www-blog-csg's vite.config.js. The dev server is
 * `aem up`, never `vite`.
 *
 *   npm run build   -> rm -rf _src && vite build    (clean one-shot)
 *   npm run watch   -> vite build --watch            (incremental)
 *   npm run dev     -> build, then watch + aem up
 *
 * `_src/` is generated output, committed because Edge Delivery serves the
 * repo as-is. Never edit it by hand; on a merge conflict inside it take
 * either side, run `npm run build`, commit. CI rebuilds it and fails on a
 * diff.
 *
 * Two Vite environments write into the same folder (`builder.buildApp`
 * runs both):
 *
 *   modules  every first-party `.js` -> `.js`, one file per module at the
 *            same path (library mode + preserveModules); npm imports become
 *            relative paths into `vendor/`, so no import map is needed
 *   vendor   every npm specifier `src/` imports -> minified ESM under
 *            `vendor/`, one file per specifier plus shared chunks
 *
 * plus vite-plugin-static-copy for files served verbatim: everything that
 * isn't first-party JS (CSS, SVG, images, fonts, JSON, sitemaps), and the
 * third-party code in VENDORED.
 *
 * Source-only files never reach the output: tests, markdown, package.json.
 *
 * Neither environment empties the output: one would wipe the other's
 * files. `npm run build` does the clean instead.
 *
 * The bundles are built from node_modules, so the build first checks that
 * node_modules matches package-lock.json: a stale install must not ship.
 *
 * Known limitation: rolldown's watcher cannot discover NEW files. After
 * adding a block, a static asset or an npm import, restart `npm run dev`.
 * Edits to existing files, copied ones included, rebuild on their own.
 */

import fs from 'node:fs';
import path from 'node:path';
import { defineConfig, parseSync } from 'vite';
import { viteStaticCopy } from 'vite-plugin-static-copy';

const SRC = 'src';
const OUT = '_src';

/**
 * Third-party code served verbatim (prefixes relative to `src/`). It is
 * excluded from the module build, kept external so importers still say
 * `../../scripts/vendor/parallax/icons-parallax.js`, and copied as-is.
 */
const VENDORED = ['vendor/', 'scripts/vendor/', 'plugins/'];

/** @param {string} file path relative to `src/`, `/`-separated */
const isVendored = (file) => VENDORED.some((prefix) => file.startsWith(prefix));

/** @param {string} file path relative to `src/`, `/`-separated */
const isSourceOnly = (file) => file.startsWith('tests/') || /\.md$/.test(file) || /(^|\/)package(-lock)?\.json$/.test(file);

/** Import specifiers the modules environment leaves as they are; never bundled. */
const EXTERNAL = [
  /^https?:\/\//,
  // Vendored code imported by first-party code (copied verbatim instead).
  /(^|\/)(vendor|plugins)\//,
];

/**
 * Specifiers a package doesn't export, mapped to the file they stand for.
 * The bundler can't resolve them; the vendor build makes them entries.
 */
const UNEXPORTED = Object.fromEntries(Object.entries({
  '@repobit/dex-system-design/spotlight-section': 'spotlight-section/spotlight-section.js',
  '@repobit/dex-system-design/video-player': 'video-player/video-player.js',
}).map(([specifier, file]) => [specifier, path.resolve('node_modules/@repobit/dex-system-design/src/components', file)]));

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
 * specifier becomes a vendor entry, subpaths included.
 * @param {string} file path relative to `src/`, `/`-separated
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

/**
 * Output key of a vendored specifier, leading `@` dropped so served paths
 * stay plain: `@repobit/dex-utils` -> `vendor/repobit/dex-utils`.
 * @param {string} specifier package specifier
 */
const vendorKey = (specifier) => `vendor/${specifier.replace(/^@/, '')}`;

/**
 * Name a shared vendor chunk after the package of its last module, the one
 * the chunk's other modules exist for. No hash: the output is committed, so
 * a changed chunk diffs in place. Rolldown numbers a name that repeats.
 * @param {{ name: string, moduleIds: string[] }} chunk
 */
function vendorChunkName({ name, moduleIds }) {
  const pkg = moduleIds.at(-1)?.match(/node_modules[\\/]((?:@[^\\/]+[\\/])?[^\\/]+)/)?.[1];
  return `vendor/_chunks/${pkg ? pkg.replace(/^@/, '').replace(/[\\/]/, '-') : name}.js`;
}

/**
 * Point the modules environment's npm imports at the vendor bundle,
 * relative to the importing module's output file, so the served code needs
 * no import map. preserveModules puts every module at its `src/` path,
 * which is what makes the relative path computable here. An import the
 * vendor bundle lacks fails the build.
 * @param {string[]} dependencies the specifiers the vendor environment bundles
 * @returns {import('vite').Plugin}
 */
function vendorImports(dependencies) {
  return {
    name: 'vendor-imports',
    enforce: 'pre',
    applyToEnvironment: (environment) => environment.name === 'modules',
    resolveId(source, importer) {
      if (!isPackage(source)) return null;
      if (!dependencies.includes(source)) {
        // The build started before the import was written, or the import is
        // one packageImports() cannot see.
        this.error(`${source} is not vendored: restart the build, or check packageImports() in vite.config.mjs`);
      }
      const from = path.posix.dirname(path.relative(SRC, importer).split(path.sep).join('/'));
      const file = path.posix.relative(from, `${vendorKey(source)}.js`);
      return { id: file.startsWith('.') ? file : `./${file}`, external: true };
    },
  };
}

/**
 * Walk `src/` once and collect the modules environment's entries (output
 * key, no extension -> absolute source path), the npm specifiers they
 * import for the vendor environment, and the files copied verbatim.
 * @returns {{ js: Record<string, string>, dependencies: string[], copied: string[] }}
 */
function discoverEntries() {
  /** @type {Record<string, string>} */
  const js = {};
  /** @type {Set<string>} */
  const dependencies = new Set();
  /** @type {string[]} */
  const copied = [];
  // No `encoding` option means the default, 'utf8': the names are strings.
  fs.readdirSync(SRC, { recursive: true })
    .map((rel) => rel.split(path.sep).join('/'))
    .filter((file) => !isSourceOnly(file) && !file.endsWith('.DS_Store') && fs.statSync(`${SRC}/${file}`).isFile())
    .forEach((file) => {
      if (!file.endsWith('.js') || isVendored(file)) {
        copied.push(path.resolve(SRC, file));
        return;
      }
      js[file.slice(0, -'.js'.length)] = path.resolve(SRC, file);
      packageImports(file).forEach((specifier) => dependencies.add(specifier));
    });
  return { js, dependencies: [...dependencies].sort(), copied };
}

/**
 * Rolldown's watcher only sees the module graph, so on its own an edit to a
 * copied file (a block's CSS, say) waits for the next JS change to reach
 * `_src/`. Watching the copied files too makes that edit rebuild the modules
 * environment, and vite-plugin-static-copy re-copies on every rebuild.
 * @param {string[]} files absolute paths of the files copied verbatim
 * @returns {import('vite').Plugin}
 */
function watchCopied(files) {
  return {
    name: 'watch-copied',
    applyToEnvironment: (environment) => environment.name === 'modules',
    buildStart() {
      if (this.meta.watchMode) files.forEach((file) => this.addWatchFile(file));
    },
  };
}

/**
 * The module build emits JavaScript only. An asset means Vite tried to
 * bundle a file that should have been copied (a `new URL(…, import.meta.url)`
 * without `@vite-ignore`, say), so fail loudly.
 * @param {{ names: string[] }} asset
 */
function noAssets({ names }) {
  throw new Error(`unexpected emitted asset ${names[0]}; static files are copied verbatim, not bundled`);
}

checkInstall();

const entries = discoverEntries();

/** Vendor entries: output key -> bare specifier (or the file an unexported one stands for). */
const vendorInput = Object.fromEntries(entries.dependencies
  .map((specifier) => [vendorKey(specifier), UNEXPORTED[specifier] ?? specifier]));

const shared = {
  outDir: OUT,
  emptyOutDir: false,
  copyPublicDir: false,
  reportCompressedSize: false,
};

export default defineConfig({
  publicDir: false,
  builder: {
    // There is no client build (CSS is copied verbatim): modules, then vendor.
    async buildApp(builder) {
      await builder.build(builder.environments.modules);
      await builder.build(builder.environments.vendor);
    },
  },
  plugins: [
    vendorImports(entries.dependencies),
    watchCopied(entries.copied),
    viteStaticCopy({
      environment: 'modules',
      targets: [
        {
          // Everything that isn't first-party JS: CSS, SVG, images, fonts,
          // JSON, sitemaps. Its own target, so the `.js` exclusion here
          // can't cancel the vendored JS below.
          src: [
            `${SRC}/**/*`,
            `!${SRC}/**/*.js`,
            `!${SRC}/tests/**`,
            `!${SRC}/**/*.md`,
            `!${SRC}/**/package.json`,
            `!${SRC}/**/package-lock.json`,
            `!${SRC}/**/.DS_Store`,
          ],
          dest: '',
          rename: { stripBase: 1 }, // drop the leading `src/`
        },
        {
          src: VENDORED.map((prefix) => `${SRC}/${prefix}**/*.js`),
          dest: '',
          rename: { stripBase: 1 },
        },
      ],
    }),
  ],
  environments: {
    modules: {
      consumer: 'client',
      build: {
        ...shared,
        minify: false, // readable served code; no sourcemaps are published
        assetsInlineLimit: 0,
        lib: { entry: entries.js, formats: ['es'] },
        rolldownOptions: {
          external: EXTERNAL,
          output: {
            preserveModules: true,
            preserveModulesRoot: SRC,
            entryFileNames: '[name].js',
            assetFileNames: noAssets,
          },
        },
      },
    },
    vendor: {
      consumer: 'client',
      // Library mode leaves `process.env` for the consumer to replace. The
      // browser is the consumer here.
      define: { 'process.env.NODE_ENV': JSON.stringify('production') },
      build: {
        ...shared,
        // `input` wins over `lib.entry`, which Vite would path.resolve()
        // against the root; as input, the bare specifiers go through the
        // resolver with browser conditions. `lib` still requires an entry.
        lib: { entry: vendorInput, formats: ['es'] },
        rolldownOptions: {
          input: vendorInput,
          output: {
            entryFileNames: '[name].js',
            // A module several entries share (Lit, dex-store, the data
            // layer) loads once, from one chunk.
            chunkFileNames: vendorChunkName,
            minify: true, // library-mode `es` output keeps whitespace otherwise
          },
        },
      },
    },
  },
});
