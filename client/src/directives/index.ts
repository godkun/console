import type { App } from 'vue'
import ClickOutside from './clickOutside'

/**
 * 注册全局自定义指令
 * @param app
 */
export function setupDirectives(app: App) {
  app.directive('click-out-side', ClickOutside)
}
