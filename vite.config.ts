// vite.config.js
import { defineConfig } from 'vite'
import { resolve } from 'path'
import fg from 'fast-glob'
import { viteStaticCopy } from 'vite-plugin-static-copy'
import type { Plugin, OutputBundle, OutputChunk } from 'rollup';

function watchStatics() {
  return {
    name: 'watch-statics',
    buildStart() {
      // scan for all CSS & images under src/
      const files = fg.sync('src/**/*.css');
      for (const file of files) {
        // tell Rollup to watch this file
        this.addWatchFile(resolve(process.cwd(), file));
      }
    },
  };
}

function renameNodeModulesFolder(
  oldName: string,
  newName: string
): Plugin {
  return {
    name: 'rename-node-modules-folder',
    generateBundle(_options, bundle: OutputBundle) {
      // 1) Rename the file names (so node_modules/foo.js → vendor/foo.js)
      for (const fileName of Object.keys(bundle)) {
        if (fileName.startsWith(`${oldName}/`)) {
          const chunk = bundle[fileName]!;
          const newFileName = fileName.replace(
            `${oldName}/`,
            `${newName}/`
          );
          delete bundle[fileName];
          chunk.fileName = newFileName;
          bundle[newFileName] = chunk;
        }
      }

      // Step 2: rename scoped packages @scope/pkg → scope_pkg
      for (const fileName of Object.keys(bundle)) {
        if (fileName.startsWith(`${newName}/@`)) {
          const chunk = bundle[fileName]!;
          // split into segments: [ vendor, @scope, pkg, ...rest ]
          const parts = fileName.split('/');
          const scope = parts[1].slice(1);      // remove leading "@"
          const pkg   = parts[2];               // package name
          const rest  = parts.slice(3).join('/'); 
          // new directory: vendor/scope_pkg/[rest]
          const newDir = `${newName}/${scope}/${pkg}`;
          const newFileName = rest
            ? `${newDir}/${rest}`
            : newDir; // in case the file was directly the folder entry
          delete bundle[fileName];
          chunk.fileName = newFileName;
          bundle[newFileName] = chunk;
        }
      }

      // Step 3: patch import paths in each JS chunk
      for (const out of Object.values(bundle)) {
        if (out.type === 'chunk') {
          const chunk = out as OutputChunk;
          let code = chunk.code;

          // a) static imports from node_modules → vendor
          code = code.replaceAll(
            '/node_modules/',
            '/vendor/');

          // c) imports from vendor/@scope/pkg → vendor/scope_pkg
          code = code.replaceAll(
            /\/@([^\/]+)\/([^\/]+)\//g,
            (_match, quote, scope) => {
              return `/${quote}/${scope}/`
            }
          );

          chunk.code = code;
        }
      }
    },
  };
}

export default defineConfig({
  base: '_src',
  plugins: [
    viteStaticCopy({
      structured: true,
      targets: [
        // copy every .css under src/, preserving subfolders
        { src: ['src/**/*.*', '!src/**/*.js'], dest: './', rename: (fileName, extension, filePath) => {
          // e.g. "src/pages/about/style.css" → "pages/about/style.css"
          const filePaths = filePath.substring(filePath.indexOf('src'), filePath.length).split('/');
          const backwardsPath = '../'.repeat(filePaths.length - 1);
          filePaths.pop();
          filePaths.shift();
          const onwardsPath = filePaths.join('/');
          return `${backwardsPath}${onwardsPath}/${fileName}.${extension}`;
        }},
      ]
    }),
  ],
  build: {
    outDir: '_src',
    minify: true,
    // tell Vite's Rollup runner about multiple inputs:
    rollupOptions: {
      preserveEntrySignatures: 'strict', // or false, or 'exports-only'
      input: fg.sync('src/**/*.js').reduce((map, file) => {
        const name = file
        .replace(/^src\//, '')
        .replace(/\.js$/, '')
        map[name] = resolve(__dirname, file)
        return map
      }, {}),
      plugins: [
        watchStatics(),
        renameNodeModulesFolder('node_modules', 'vendor') as any,
      ],
      output: {
        // mirror each file under dist…, and rewrite imports
        preserveModules: true,
        preserveModulesRoot: 'src',

        // control filenames for entry chunks & shared chunks:
        entryFileNames: '[name].js',
        chunkFileNames: 'chunks/[name]-[hash].js',
        assetFileNames: '[name][extname]'
      },
    },

    // you can also tweak target, sourcemap, cssCodeSplit, etc. here
    target: 'esnext',
    sourcemap: true,
  },
})