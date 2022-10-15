import App from './App.vue'
import { createApp } from 'vue'
import { setupStore } from '@/store'
import { setupRouter } from './router'
import { setupDirectives } from './directives'
import { AppProvider } from '@/components/Application'
import { SvgIcon } from '@/components/SvgIcon'
import { setupNaive, setupAssets } from '@/plugins'

async function setupApp() {
  setupAssets()
  const appProvider = createApp(AppProvider)

  const app = createApp(App)

  // 挂载 pinia 状态
  setupStore(app)

  // 注册全局常用的 naive-ui 组件
  setupNaive(app)

  // 注册全局自定义指令，如：v-permission权限指令
  setupDirectives(app)

  //优先挂载一下 Provider 解决路由守卫，Axios中可使用，Dialog，Message 等之类组件
  appProvider.mount('#appProvider', true)

  // 挂载路由
  await setupRouter(app)

  // 挂载全局svg组件
  app.component('svg-icon', SvgIcon)

  app.mount('#app', true)
}

setupApp()
