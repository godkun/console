import { App } from 'vue'
import { createRouter, createWebHashHistory } from 'vue-router'
import { createRouterGuard } from './guard'
import { getAllRoute } from './util'

export const router = createRouter({
  history: createWebHashHistory(''),
  routes: getAllRoute(),
  scrollBehavior: () => ({ left: 0, top: 0 })
})

export async function setupRouter(app: App) {
  app.use(router)
  createRouterGuard(router)
  await router.isReady()
}

export * from './constant'
export * from './util'
