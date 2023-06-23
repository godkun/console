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
        path: 'dashboard/:id',
        name: `${routeName}_dashboard`,
        meta: {
          title: '仪表盘'
        },
        component: () => import('@/views/instance/detail/dashboard/console/console.vue')
      },
      {
        path: 'config/:id',
        name: `config`,
        meta: {
          title: '配置'
        },
        component: () => import('@/views/instance/detail/config/index.vue')
      },
      {
        path: 'stream/:id',
        name: `${routeName}_stream_list`,
        meta: {
          title: '流列表'
        },
        component: () => import('@/views/instance/detail/stream-list/index.vue')
      },
      {
        path: 'streamDetail/:id',
        name: `${routeName}_stream_detail`,
        meta: {
          title: '流详情',
          hidden: true
        },
        component: () => import('@/views/instance/detail/stream-detail/index.vue')
      },
      {
        path: 'plugin/:id',
        name: `${routeName}_plugin_list`,
        meta: {
          title: '插件列表'
        },
        component: () => import('@/views/instance/detail/plugin-list/index.vue')
      },
      {
        path: 'pull/:id',
        name: `pull`,
        meta: {
          title: '导入远端流'
        },
        component: () => import('@/views/instance/detail/pull/index.vue')
      },
      {
        path: 'push/:id',
        name: `push`,
        meta: {
          title: '向远端推流'
        },
        component: () => import('@/views/instance/detail/push/index.vue')
      },
      {
        path: 'logs/:id',
        name: `logs`,
        meta: {
          title: '日志管理'
        },
        component: () => import('@/views/instance/detail/logrotate/index.vue')
      },
      {
        path: 'record/:id',
        name: `record`,
        meta: {
          title: '录像管理'
        },
        component: () => import('@/views/instance/detail/record/index.vue')
      },
      {
        path: 'gb28181/:id',
        name: `GB28181`,
        meta: {
          title: 'GB28181'
        },
        component: () => import('@/views/instance/detail/gb28181/index.vue')
      },
      {
        path: 'room/:id',
        name: `room`,
        meta: {
          title: 'Room'
        },
        component: () => import('@/views/instance/detail/room/index.vue')
      },
      {
        path: 'webrtc/:id',
        name: `webrtc`,
        meta: {
          title: 'WebRTC屏幕墙'
        },
        component: () => import('@/views/instance/detail/webrtc/index.vue')
      },
      // {
      //   path: 'monitor/:id',
      //   name: `monitor`,
      //   meta: {
      //     title: '监控仪表盘'
      //   },
      //   children: [
      //     {
      //       path: '',
      //       name: `monitor-search`,
      //       meta: {
      //         title: '查询流记录'
      //       },
      //       component: () => import('@/views/instance/detail/monitor/index.vue')
      //     },
      //     {
      //       path: 'detail/:stream',
      //       name: `monitor-detail`,
      //       meta: {
      //         title: '记录详情',
      //         hidden: true
      //       },
      //       component: () => import('@/views/instance/detail/monitor/detail.vue')
      //     }
      //   ]
      // },
      {
        path: 'monitor/:id',
        name: `monitor-search`,
        meta: {
          title: '监控记录'
        },
        component: () => import('@/views/instance/detail/monitor/index.vue')
      },
      {
        path: 'monitor/:id/detail/:stream',
        name: `monitor-detail`,
        meta: {
          title: '监控记录详情',
          hidden: true
        },
        component: () => import('@/views/instance/detail/monitor/detail.vue')
      },
      // {
      //   path: 'pprof/:id',
      //   name: `pprof`,
      //   meta: {
      //     title: '性能分析'
      //   },
      //   children: [
      //     {
      //       path: '',
      //       name: `pprof-index`,
      //       meta: {
      //         title: '总览'
      //       },
      //       component: () => import('@/views/instance/detail/pprof/index.vue')
      //     },
      //     {
      //       path: ':path',
      //       name: `pprof-detail`,
      //       meta: {
      //         title: '详情',
      //         hidden: true
      //       },
      //       component: () => import('@/views/instance/detail/pprof/index.vue')
      //     }
      //   ]
      // }
      {
        path: 'pprof/:id',
        name: `pprof-index`,
        meta: {
          title: '性能分析'
        },
        component: () => import('@/views/instance/detail/pprof/index.vue')
      },
      {
        path: 'pprof/:id/:path',
        name: `pprof-detail`,
        meta: {
          title: '性能分析详情',
          hidden: true
        },
        component: () => import('@/views/instance/detail/pprof/index.vue')
      },
      {
        path: 'address/:id',
        name: `address`,
        meta: {
          title: '地址生成器'
        },
        component: () => import('@/views/instance/detail/address/index.vue')
      }
    ]
  }
]

export default routes
