import { App } from 'vue'
import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import { RedirectRoute } from '@/router/base'
import { PageEnum } from '@/enums/pageEnum'
import { createRouterGuards } from './router-guards'

// 不需要手动引入，放在src/router/modules 内的文件会自动被加载
const modules = import.meta.globEager('./modules/**/*.ts')

const routeModuleList: RouteRecordRaw[] = []

// 遍历路由文件，并将路由push到路由表中
Object.keys(modules).forEach((key) => {
  const mod = modules[key].default || {}
  const modList = Array.isArray(mod) ? [...mod] : [mod]
  routeModuleList.push(...modList)
})

// 根据sort值，对路由表进行排序
function sortRoute(a, b) {
  return (a.meta?.sort || 0) - (b.meta?.sort || 0)
}

routeModuleList.sort(sortRoute)

export const RootRoute: RouteRecordRaw = {
  path: '/',
  name: 'Root',
  redirect: PageEnum.BASE_HOME,
  meta: {
    title: 'Root'
  }
}

export const LoginRoute: RouteRecordRaw = {
  path: '/login',
  name: 'Login',
  component: () => import('@/views/login/index.vue'),
  meta: {
    title: '登录'
  }
}

export const RegisterRoute: RouteRecordRaw = {
  path: '/register',
  name: 'Register',
  component: () => import('@/views/register/index.vue'),
  meta: {
    title: '注册'
  }
}

//需要验证权限
export const asyncRoutes = [...routeModuleList]

//普通路由 无需验证权限
export const constantRouter: any[] = [RegisterRoute, LoginRoute, RootRoute, RedirectRoute]

const router = createRouter({
  history: createWebHashHistory(''),
  routes: constantRouter,
  strict: true,
  scrollBehavior: () => ({ left: 0, top: 0 })
})

export function setupRouter(app: App) {
  app.use(router)
  // 创建路由守卫
  createRouterGuards(router)
}

export default router
