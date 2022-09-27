import { App } from 'vue'

import { permission } from './permission'
import ClickOutside from './clickOutside'

/**
 * 注册全局自定义指令
 * @param app
 */
export function setupDirectives(app: App) {
  // 权限控制指令（演示）
  app.directive('permission', permission)
  app.directive('click-out-side', ClickOutside)
}
