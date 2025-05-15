// vite.config.js
import { defineConfig } from 'vite'
import { resolve } from 'path'
import fg from 'fast-glob'
import { viteStaticCopy } from 'vite-plugin-static-copy'

export default defineConfig({
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
    })
  ],
  build: {
    outDir: '_src',
    minify: false,
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
      output: {
        // mirror each file under dist…, and rewrite imports
        preserveModules: true,
        preserveModulesRoot: 'src',

        // control filenames for entry chunks & shared chunks:
        entryFileNames: '[name].js',
        chunkFileNames: 'chunks/[name]-[hash].js',
        assetFileNames: '[name][extname]'
      }
    },

    // you can also tweak target, sourcemap, cssCodeSplit, etc. here
    target: 'esnext',
    sourcemap: true,
  },
  server: {
    host: 'localhost',
    port: 3001,
    proxy: {
      // proxy *everything else* back to your AEM up instance on 3000
      '/': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false,
        bypass: (req) => {
          // if the request is for Vite's HMR client or static bundles…
          if (!req || !req.url) return;
          if (
            req.url.startsWith('/@vite/')   ||
            req.url.endsWith('.js')         ||
            req.url.endsWith('.css')        ||
            req.url.endsWith('.map')
          ) {
            // return the original URL: Vite will serve it itself
            return req.url
          }
        }
        // you might need to tweak `bypass` to serve e.g. /dist/* from Vite
      }
    }
  },
})