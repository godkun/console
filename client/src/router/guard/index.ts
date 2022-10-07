import { Router } from 'vue-router'
import { createDynamicRouteGuard } from './dynamic'
import { useTitle } from '@vueuse/core'
/**
 * 创建路由守卫
 * @param router
 */
export function createRouterGuard(router: Router) {
  router.beforeEach(async (to, from, next) => {
    // 开始 loadingBar
    window.$loadingBar?.start()
    await createDynamicRouteGuard(to, from, next, router)
  })
  router.afterEach((to) => {
    useTitle(to.meta.title as string)
    if (to.name == 'stream-play') {
      to.meta.frameSrc = to.query.frameSrc
    }
    const id = to.params.id
    if (!id) {
      window.$loadingBar?.finish()
      return
    } else {
      router.options.routes.forEach((item) => {
        if (item.name == 'instance') {
          item.meta.hidden = true
        }
        if (item.name == 'list') {
          item.meta.hidden = false
        }
      })
      // 结束 loadingBar
      window.$loadingBar?.finish()
    }
  })
}
