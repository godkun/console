import { RouteRecordRaw } from 'vue-router'
import { Layout } from '@/router/constant'
import { AppstoreOutlined } from '@vicons/antd'
import { renderIcon } from '@/utils/index'

const routeName = 'instance'

/**
 * @param name 路由名称, 必须设置,且不能重名
 * @param meta 路由元信息（路由附带扩展信息）
 * @param redirect 重定向地址, 访问这个路由时,自定进行重定向
 * @param meta.disabled 禁用整个菜单
 * @param meta.title 菜单名称
 * @param meta.icon 菜单图标
 * @param meta.keepAlive 缓存该路由
 * @param meta.sort 排序越小越排前
 * */
const routes: Array<RouteRecordRaw> = [
  {
    path: '/instance',
    name: 'list',
    redirect: '/instance/detail',
    component: Layout,
    meta: {
      title: '实例详情',
      icon: renderIcon(AppstoreOutlined),
      sort: 2,
      hidden: true
    },
    children: [
      {
        path: 'dashboard',
        name: `${routeName}_dashboard`,
        meta: {
          title: '监控'
        },
        component: () => import('@/views/instance/detail/dashboard/console/console.vue')
      },
      {
        path: 'config',
        name: `config`,
        meta: {
          title: '配置',
          hidden: true
        },
        component: () => import('@/views/instance/detail/config/index.vue')
      },
      {
        path: 'stream',
        name: `${routeName}_stream_list`,
        meta: {
          title: '流列表'
        },
        component: () => import('@/views/instance/detail/stream-list/index.vue')
      },
      {
        path: 'streamDetail',
        name: `${routeName}_stream_detail`,
        meta: {
          title: '流详情',
          hidden: true
        },
        component: () => import('@/views/instance/detail/stream-detail/index.vue')
      },
      {
        path: 'plugin',
        name: `${routeName}_plugin_list`,
        meta: {
          title: '插件列表'
        },
        component: () => import('@/views/instance/detail/plugin-list/index.vue')
      },
      {
        path: 'pull',
        name: `pull`,
        meta: {
          title: '导入远端流'
        },
        component: () => import('@/views/instance/detail/pull/index.vue')
      },
      {
        path: 'gb28181',
        name: `GB28181`,
        meta: {
          title: 'GB28181'
        },
        component: () => import('@/views/instance/detail/gb28181/index.vue')
      }
    ]
  }
]

export default routes
