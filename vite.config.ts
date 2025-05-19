// vite.config.js
import { defineConfig } from 'vite'
import { resolve } from 'path'
import fg from 'fast-glob'
import { viteStaticCopy } from 'vite-plugin-static-copy'

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