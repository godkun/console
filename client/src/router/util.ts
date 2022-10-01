import type { RouteRecordRaw } from 'vue-router'
import { constantRouter } from './constant'

const routeModuleList: RouteRecordRaw[] = []

const modules = import.meta.globEager('./routes/**/*.ts')
// 遍历路由文件，并将路由 push 到路由表中
Object.keys(modules).forEach((key) => {
  const mod = modules[key].default || {}
  const modList = Array.isArray(mod) ? [...mod] : [mod]
  routeModuleList.push(...modList)
})

// 遍历路由文件，并将路由 push 到路由表中
function sortRoute(a, b) {
  return (a.meta?.sort || 0) - (b.meta?.sort || 0)
}

routeModuleList.sort(sortRoute)

export const asyncRoutes = [...routeModuleList]

export function getAllRoute() {
  return [...constantRouter, ...routeModuleList]
}
