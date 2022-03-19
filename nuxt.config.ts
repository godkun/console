import { defineNuxtConfig } from 'nuxt3'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

export default defineNuxtConfig({
  ssr: false,
  meta: {
    title: 'm7s 4.0',
    meta: [
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        name: 'description',
        content: '一个开源的Go语言实现的流媒体服务器开发框架,Monibuca 引擎 + 插件 = 定制化流媒体服务器',
      },
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
    script: [],
  },
  css: ['element-plus/dist/index.css', '~/assets/less/main.less'],
  buildModules: ['@pinia/nuxt'],
  vite: {
    plugins: [
      Components({
        // Automatically register all components in the `components` directory
        resolvers: [ElementPlusResolver()],
      }),
    ],
    // @ts-expect-error: Missing ssr key
    ssr: {
      noExternal: ['element-plus'],
    },
  },
})
