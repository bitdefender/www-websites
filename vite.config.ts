// vite.config.js
import { defineConfig } from 'vite'
import path, { resolve } from 'path'
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
  base: '/_src',
  plugins: [
    viteStaticCopy({
      structured: true,
      targets: [
        // copy every .css under src/, preserving subfolders
        {
          src: ['src/**/*.*', '!src/**/*.js'], dest: './', rename: (fileName, extension, filePath) => {
            // e.g. "src/pages/about/style.css" → "pages/about/style.css"
            const filePaths = filePath.substring(filePath.indexOf('src'), filePath.length).split('/');
            const backwardsPath = '../'.repeat(filePaths.length - 1);
            filePaths.pop();
            filePaths.shift();
            const onwardsPath = filePaths.join('/');
            
            return extension ? `${backwardsPath}${onwardsPath}/${fileName}.${extension}` : `${backwardsPath}${onwardsPath}/${fileName}`;
          }
        },
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
        entryFileNames: info => {
          const id = info.facadeModuleId || ''

          // 1) Skip Rollup virtual modules (they start with '\0')
          if (id[0] === '\0') {
            return `${info.name}.js`
          }

          if (id.includes('/node_modules/')) {
            // compute path inside node_modules
            const rel = path.relative(
              path.resolve(__dirname, 'node_modules'),
              id.replace(/\.(js|ts)x?$/, '')
            )
            // drop scope @ if you also want that:
            const clean = rel.replace(/@/g, '')
            return `packages/${clean}.js`
          }
          // otherwise just mirror your src structure
          const relSrc = path.relative(
            path.resolve(__dirname, 'src'),
            id.replace(/\.(js|ts)x?$/, '')
          )

          // If path.relative gave us a "../…" (i.e. outside src), _don't_ use it
          if (relSrc.startsWith('..')) {
            return `${info.name}.js`
          }

          return `${relSrc}.js`
        },
        chunkFileNames: chunkInfo => {
          // you can apply the same logic to any non-entry chunks
          return chunkInfo.name.includes('node_modules')
            ? `packages/${chunkInfo.name.replace(/@/g, '')}.[hash].js`
            : `[name].[hash].js`
        },
        assetFileNames: 'assets/[name].[hash][extname]'
      },
    },
    // you can also tweak target, sourcemap, cssCodeSplit, etc. here
    target: 'esnext',
    sourcemap: true,
  },
  resolve: {
    // if you import @scope/pkg in your code and want it to resolve
    // to node_modules/pkg, you can drop the @ at dev time too:
    alias: [{
      find: /^ @(.+) $/,
      replacement: path.resolve(__dirname, 'node_modules/$1')
    }]
  }
})