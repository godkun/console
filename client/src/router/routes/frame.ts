import { RouteRecordRaw } from 'vue-router'
import { Layout } from '@/router/constant'
import { DesktopOutline } from '@vicons/ionicons5'
import { renderIcon } from '@/utils/index'

const IFrame = () => import('@/views/iframe/index.vue')

const routes: Array<RouteRecordRaw> = [
  {
    path: '/frame',
    name: 'Frame',
    redirect: '/frame/m7s',
    component: Layout,
    meta: {
      title: '帮助文档',
      sort: 8,
      icon: renderIcon(DesktopOutline)
    },
    children: [
      {
        path: 'console',
        name: 'console-doc',
        meta: {
          title: 'console管理器文档',
          frameSrc: 'https://console.monibuca.com/doc/'
        },
        component: IFrame
      },
      {
        path: 'm7s',
        name: 'frame-m7s',
        meta: {
          title: 'Monibuca文档',
          frameSrc: 'https://m7s.live/guide/introduction.html'
        },
        component: IFrame
      },
      {
        path: 'jessibuca',
        name: 'frame-jessibuca',
        meta: {
          title: 'jessibuca文档',
          frameSrc: 'https://jessibuca.com/'
        },
        component: IFrame
      }
    ]
  }
]

export default routes
