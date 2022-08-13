import type { UserConfig } from 'vite'
import { resolve } from 'path'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import Components from 'unplugin-vue-components/vite'
import { NaiveUiResolver } from 'unplugin-vue-components/resolvers'

function pathResolve(dir: string) {
  return resolve(process.cwd(), '.', dir)
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
      host: 'monibuca.com',
      port: 4000,
      proxy: {
        '/api': {
          target: 'https://console.monibuca.com',
          changeOrigin: true
        }
        // '/api/gb28181': {
        //   target: 'https://console.monibuca.com',
        //   changeOrigin: true
        // }
      }
    },
    build: {
      target: 'es2015',
      outDir: 'dist',
      chunkSizeWarningLimit: 2000
    }
  }
}
