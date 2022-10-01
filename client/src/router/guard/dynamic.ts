import type { Router, RouteLocationNormalized, NavigationGuardNext } from 'vue-router'
import { useAsyncRouteStoreWidthOut } from '@/store/modules/asyncRoute'
import { ErrorPageRoute } from '@/router/constant'
import { PageEnum } from '@/enums'
const LOGIN_PATH = PageEnum.BASE_LOGIN

export async function createDynamicRouteGuard(
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext,
  router: Router
) {
  const asyncRouteStore = useAsyncRouteStoreWidthOut()
  if (from.path === LOGIN_PATH && to.name === 'errorPage') {
    next(PageEnum.BASE_HOME)
    return
  }

  if (asyncRouteStore.getIsDynamicAddedRoute) {
    next()
    return
  }

  const routes = await asyncRouteStore.generateRoutes()

  // 动态添加可访问路由表
  routes.forEach((item) => {
    router.addRoute(item)
  })

  //添加404
  const isErrorPage = router.getRoutes().findIndex((item) => item.name === ErrorPageRoute.name)
  if (isErrorPage === -1) {
    router.addRoute(ErrorPageRoute)
  }
  asyncRouteStore.setDynamicAddedRoute(true)

  next({
    path: to.path,
    query: to.query
  })
}
