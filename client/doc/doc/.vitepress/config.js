import { defineConfig } from 'vitepress'
export default defineConfig({
  base: '/doc',
  lang: 'zh',
  title: 'console在线管理器',
  description: 'console在线管理器',
  lastUpdated: true,
  outDir: 'doc',
  themeConfig: {
    nav: nav(),
    sidebar: {
      '/nav/': sidebar()
    },
    footer: {
      copyright: 'Copyright © 2022-present m7s'
    }
  }
})

function nav() {
  return [
    {
      text: '导航',
      link: '/nav/group1/',
      activeMatch: '/nav/'
    }
  ]
}
function sidebar() {
  return [
    {
      text: '基本功能',
      collapsible: true,
      items: [{ text: '控制台', link: '/nav/group1/控制台' }]
    },
    {
      text: '二次开发',
      collapsible: true,
      items: [{ text: '开发插件', link: '/nav/group2/开发插件' }]
    }
  ]
}
