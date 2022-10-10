import { resolve } from 'path'
import unocss from '@unocss/vite'
import vue from '@vitejs/plugin-vue'
import Icons from 'unplugin-icons/vite'
import legacy from '@vitejs/plugin-legacy'
import progress from 'vite-plugin-progress'
import vueJsx from '@vitejs/plugin-vue-jsx'
import commonjs from 'rollup-plugin-commonjs'
import { splitVendorChunkPlugin } from 'vite'
import createHtmlPlugin from 'vite-plugin-html'
import IconsResolver from 'unplugin-icons/resolver'
import Components from 'unplugin-vue-components/vite'
import { visualizer } from 'rollup-plugin-visualizer'
import Inspector from '@console/vite-plugin-vue-inspector'
import externalGlobals from 'rollup-plugin-external-globals'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
import { FileSystemIconLoader } from 'unplugin-icons/loaders'
import { NaiveUiResolver } from 'unplugin-vue-components/resolvers'

function pathResolve(dir: string) {
  return resolve(process.cwd(), '.', dir)
}

const srcPath = pathResolve('src')

const localIconPath = `${srcPath}/assets/svg-icon`

/** 本地svg图标集合名称 */
const collectionName = 'icon-local'.replace(`icon-`, '')

const serverProxy = {
  target: 'https://console.monibuca.com',
  changeOrigin: true
}

const globals = externalGlobals({
  vue: 'Vue',
  vueRouter: 'VueRouter',
  'naive-ui': 'naive',
  'vue-demi': 'VueDemi'
})

export default ({ command }) => {
  return {
    base: './',
    plugins: [
      vue(),
      Inspector({
        enabled: true,
        toggleButtonVisibility: 'always',
        toggleComboKey: 'control',
        toggleButtonPos: 'bottom-right'
      }),
      vueJsx(),
      createHtmlPlugin({
        minify: true,
        inject: {
          data: {
            isProd: command === 'build',
            BASE_URL: `https://console.monibuca.com`
          }
        }
      }),
      Icons({
        compiler: 'vue3',
        customCollections: {
          [collectionName]: FileSystemIconLoader(localIconPath)
        },
        scale: 1,
        defaultClass: 'inline-block'
      }),
      Components({
        dts: true,
        resolvers: [
          NaiveUiResolver(),
          IconsResolver({ customCollections: [collectionName], componentPrefix: 'icon' })
        ]
      }),
      unocss(),
      createSvgIconsPlugin({
        iconDirs: [localIconPath],
        symbolId: `icon-local-[dir]-[name]`,
        inject: 'body-last',
        customDomId: '__SVG_ICON_LOCAL__'
      }),
      splitVendorChunkPlugin(),
      legacy(),
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
          replacement: pathResolve('src') + '/'
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
      host: 'monibuca.com',
      port: 4000,
      proxy: {
        '/api': serverProxy,
        '/m7s': serverProxy
      }
    },
    build: {
      target: 'es2015',
      outDir: 'dist',
      rollupOptions: {
        external: ['vue', 'vue-demi', 'vueRouter'],
        plugins: [commonjs(), globals]
      },
      terserOptions: {
        compress: {
          keep_infinity: false,
          drop_console: true
        }
      },
      minify: 'terser',
      chunkSizeWarningLimit: 2000
    }
  }
}
