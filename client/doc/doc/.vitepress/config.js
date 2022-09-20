import { defineConfig } from 'vitepress'
export default defineConfig({
  lang: 'zh',
  title: 'console在线管理器',
  description: 'console在线管理器',
  lastUpdated: true,
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
      items: [
        { text: 'monorepo方案', link: '/nav/group1/monorepo方案' },
      ]
    },
    {
      text: '二次开发',
      collapsible: true,
      items: [
        { text: '页面元素代码映射插件', link: '/nav/group2/页面元素代码映射插件' }
      ]
    }
  ]
}
