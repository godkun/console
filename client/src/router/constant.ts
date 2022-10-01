import type { RouteRecordRaw } from 'vue-router'
import { PageEnum } from '@/enums'

export const RedirectName = 'Redirect'

export const ErrorPage = () => import('@/views/exception/404.vue')

export const Layout = () => import('@/layout/index.vue')

// 根据sort值，对路由表进行排序
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

export const ResetPasswordRoute: RouteRecordRaw = {
  path: '/password',
  name: 'Password',
  component: () => import('@/views/password/index.vue'),
  meta: {
    title: '注册'
  }
}

export const ErrorPageRoute = {
  path: '/:path(.*)*',
  name: 'ErrorPage',
  component: Layout,
  meta: {
    title: 'ErrorPage',
    hideBreadcrumb: true
  },
  children: [
    {
      path: '/:path(.*)*',
      name: 'ErrorPageSon',
      component: ErrorPage,
      meta: {
        title: 'ErrorPage',
        hideBreadcrumb: true
      }
    }
  ]
}

export const RedirectRoute = {
  path: '/redirect',
  name: RedirectName,
  component: Layout,
  meta: {
    title: RedirectName,
    hideBreadcrumb: true
  },
  children: [
    {
      path: '/redirect/:path(.*)',
      name: RedirectName,
      component: () => import('@/views/redirect/index.vue'),
      meta: {
        title: RedirectName,
        hideBreadcrumb: true
      }
    }
  ]
}

//普通路由 无需验证权限
export const constantRouter: any[] = [
  ResetPasswordRoute,
  RegisterRoute,
  LoginRoute,
  RootRoute,
  RedirectRoute
]
