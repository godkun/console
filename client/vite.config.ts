import type { UserConfig } from 'vite'
import { resolve } from 'path'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import Components from 'unplugin-vue-components/vite'
import { NaiveUiResolver } from 'unplugin-vue-components/resolvers'

function pathResolve(dir: string) {
  return resolve(process.cwd(), '.', dir)
}
const serverProxy = {
  target: 'https://console.monibuca.com:9999',
  changeOrigin: true
}
export default (): UserConfig => {
  return {
    base: './',
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
    plugins: [
      vue(),
      vueJsx(),
      // 按需引入 NaiveUi 且自动创建组件声明
      Components({
        dts: true,
        resolvers: [NaiveUiResolver()]
      })
    ],
    // 需要配置本地host
    server: {
      host: 'local.monibuca.com',
      port: 4000,
      proxy: {
        '/api': serverProxy,
        '/gb28181': serverProxy,
        '/rtsp': serverProxy,
        '/hdl': serverProxy,
        '/rtmp': serverProxy,
        '/hls': serverProxy,
      }
    },
    build: {
      target: 'es2015',
      outDir: 'dist',
      chunkSizeWarningLimit: 2000
    }
  }
}
