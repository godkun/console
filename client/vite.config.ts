import { splitVendorChunkPlugin } from 'vite'
import { resolve } from 'path'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import Components from 'unplugin-vue-components/vite'
import { NaiveUiResolver } from 'unplugin-vue-components/resolvers'
import { visualizer } from 'rollup-plugin-visualizer'
import legacy from '@vitejs/plugin-legacy'
import createHtmlPlugin from 'vite-plugin-html'
import Inspector from "@console/vite-plugin-vue-inspector"
import externalGlobals from 'rollup-plugin-external-globals'

function pathResolve(dir: string) {
  return resolve(process.cwd(), '.', dir)
}
const serverProxy = {
  target: 'https://console.monibuca.com:9999',
  changeOrigin: true
}
export default ({ command }) => {
  return {
    base: './',
    plugins: [
      vue(),
      Inspector({
        enabled: true,
        toggleButtonVisibility: 'always',
        toggleComboKey: 'control'
      }),
      vueJsx(),
      createHtmlPlugin({
        minify: true,
        inject: {
          data: {
            isProd: command === 'build'
          }
        }
      }),
      // 按需引入 NaiveUi 且自动创建组件声明
      Components({
        dts: true,
        resolvers: [NaiveUiResolver()]
      }),
      splitVendorChunkPlugin(),
      legacy(),
      visualizer({
        gzipSize: true,
        brotliSize: true
      })
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
          additionalData: `@import "src/styles/var.less";`
        }
      }
    },
    // 需要配置本地host
    server: {
      host: 'monibuca.com',
      port: 4000,
      proxy: {
        '/api': serverProxy,
        '/gb28181': serverProxy,
        '/rtsp': serverProxy,
        '/hdl': serverProxy,
        '/rtmp': serverProxy,
        '/hls': serverProxy
      }
    },
    build: {
      target: 'es2015',
      outDir: 'dist',
      rollupOptions: {
        external: ['vue', 'vue-demi'],
        // external: ['vue', 'naive-ui', 'vue-demi'],
        plugins: [
          externalGlobals({
            vue: 'Vue',
            // 'naive-ui': 'naive-ui',
            'vue-demi': 'VueDemi'
          })
        ]
      },
      // terser 配置
      terserOptions: {
        compress: {
          keep_infinity: false,
          // 开启 console 方便专项解决问题 TODO: 预发移除
          drop_console: true
        }
      },
      minify: 'terser',
      chunkSizeWarningLimit: 2000
    }
  }
}
