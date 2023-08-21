import { resolve } from 'path'
import unocss from '@unocss/vite'
import vue from '@vitejs/plugin-vue'
import progress from 'vite-plugin-progress'
import vueJsx from '@vitejs/plugin-vue-jsx'
import commonjs from 'rollup-plugin-commonjs'
import { splitVendorChunkPlugin } from 'vite'
import createHtmlPlugin from 'vite-plugin-html'
import Components from 'unplugin-vue-components/vite'
import { visualizer } from 'rollup-plugin-visualizer'
// import Inspector from '@console/vite-plugin-vue-inspector'
import externalGlobals from 'rollup-plugin-external-globals'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
import { NaiveUiResolver } from 'unplugin-vue-components/resolvers'
import { viteVConsole } from 'vite-plugin-vconsole'

function pathResolve(dir: string) {
  return resolve(process.cwd(), '.', dir)
}

const localIconPath = resolve(process.cwd(), 'src/assets/svg-icon')

const serverProxy = {
  // target: 'https://console.monibuca.com:9999',
  target: 'http://localhost:9999',
  changeOrigin: true,
  rewrite: (path) => path.replace(/^\/m7s/, '')
}
// const serverWsProxy = {
//   target: 'wss://console.monibuca.com:10000',
//   changeOrigin: true,
//   rewrite: (path) => path.replace(/^\/m7s/, '')
// }
const globals = externalGlobals({
  vue: 'Vue',
  vueRouter: 'VueRouter',
  'naive-ui': 'naive',
  'vue-demi': 'VueDemi'
})

export default ({ command, mode }) => {
  return {
    base: './',
    plugins: [
      vue(),
      viteVConsole({
        entry: resolve('src/wails.ts'), // or you can use entry: [path.resolve('src/main.ts')]
        enabled: true,
        config: {
          maxLogNumber: 1000,
          theme: 'dark'
        }
      }),
      // Inspector({
      //   enabled: false,
      //   toggleButtonVisibility: 'never',
      //   toggleComboKey: 'control',
      //   toggleButtonPos: 'bottom-right'
      // }),
      vueJsx(),
      createHtmlPlugin({
        minify: true,
        inject: {
          data: {
            isProd: command === 'build',
            entry: mode == 'wails' ? '/src/wails.ts' : '/src/web.ts'
            // BASE_URL: `web`
          }
        }
      }),
      Components({
        dts: true,
        dirs: ['src/components'],
        resolvers: [NaiveUiResolver()]
      }),
      unocss(),
      createSvgIconsPlugin({
        iconDirs: [localIconPath],
        symbolId: `icon-[name]`
      }),
      splitVendorChunkPlugin(),
      // legacy(),
      visualizer({
        gzipSize: true,
        brotliSize: true
      }),
      progress()
    ],
    resolve: {
      alias: [
        {
          find: /\/#\//,
          replacement: pathResolve('types') + '/'
        },
        {
          find: '@',
          replacement: pathResolve('src')
        }
      ],
      dedupe: ['vue']
    },
    css: {
      preprocessorOptions: {
        less: {
          modifyVars: {},
          javascriptEnabled: true,
          additionalData: `@import "src/styles/less/index.less";`
        }
      }
    },
    // 需要配置本地 host
    server: {
      // https: {
      //   cert: fs.readFileSync(join(__dirname, '../server/console.monibuca.com_bundle.crt')),
      //   key: fs.readFileSync(join(__dirname, '../server/console.monibuca.com.key'))
      // },
      // host: 'console.monibuca.com',
      port: 4000,
      proxy: {
        '/api': serverProxy,
        '/m7s': serverProxy
      }
    },
    build: {
      // target: 'esnext',
      // outDir: mode == 'prd' ? 'dist' : '../server/web',
      rollupOptions: {
        external: ['vue', 'vue-demi', 'vueRouter'],
        plugins: [commonjs(), globals]
      },
      // terserOptions: {
      //   compress: {
      //     keep_infinity: false,
      //     drop_console: true
      //   }
      // },
      minify: 'esbuild',
      chunkSizeWarningLimit: 2000
    }
  }
}
