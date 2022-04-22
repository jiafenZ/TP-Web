import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/register',
    component: () => import('@/views/login/register'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  // {
  //   path: '/add',
  //   component: () => import('@/views/interface/api/add'),
  //   hidden: true
  // },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: { title: '平台首页', icon: 'dashboard' }
    }]
  },

  {
    path: '/users',
    component: Layout,
    redirect: '/users',
    children: [{
      path: 'user',
      name: 'user',
      component: () => import('@/views/users/index'),
      meta: { title: '用户管理', icon: 'user', roles: ['admin'] }
    }]
  },

  {
    path: '/interface',
    component: Layout,
    redirect: '/interface/project',
    name: 'interface',
    meta: { title: '接口测试', icon: 'el-icon-s-help' },
    children: [
      {
        path: 'project',
        name: 'project',
        component: () => import('@/views/interface/project/index'),
        meta: { title: '项目信息', icon: 'tree' }
      },
      {
        path: 'projectConfigure',
        name: 'projectConfigure',
        component: () => import('@/views/interface/projectConfigure/index'),
        meta: { title: '项目配置', icon: 'tree' },
        children: [
          {
            path: 'module',
            component: () => import('@/views/interface/projectConfigure/module/index'),
            name: 'module',
            meta: { title: '模块配置' }
          },
          {
            path: 'database',
            component: () => import('@/views/interface/projectConfigure/database/index'),
            name: 'database',
            meta: { title: '数据库配置' }
          },
          {
            path: 'baseURL',
            component: () => import('@/views/interface/projectConfigure/baseURL/index'),
            name: 'baseURL',
            meta: { title: 'baseURL' }
          },
          {
            path: 'header',
            component: () => import('@/views/interface/projectConfigure/header/index'),
            name: 'header',
            meta: { title: 'header配置' }
          }
        ]
      },
      {
        path: 'environment',
        name: 'environment',
        component: () => import('@/views/interface/environment/index'),
        meta: { title: '环境配置', icon: 'table' }
      },
      {
        path: 'data',
        name: 'data',
        component: () => import('@/views/interface/data/index'),
        meta: { title: '测试数据', icon: 'tree' }
      },
      {
        path: 'api',
        name: 'api',
        component: () => import('@/views/interface/api/index'),
        meta: { title: '基础接口', icon: 'tree' }
      },
      {
        path: 'add',
        name: 'add',
        component: () => import('@/views/interface/api/add')
      },
      {
        path: 'edit',
        name: 'edit',
        component: () => import('@/views/interface/api/edit')
      },
      {
        path: 'case',
        name: 'case',
        component: () => import('@/views/interface/case/index'),
        meta: { title: '测试用例', icon: 'tree' }
      }
    ]
  },

  {
    path: '/testCase',
    component: Layout,
    redirect: '/testCase',
    children: [{
      path: 'testCase',
      name: 'testCase',
      component: () => import('@/views/testCase/index'),
      meta: { title: '测试用例', icon: 'form' }
    }]
  },

  {
    path: '/document',
    component: Layout,
    redirect: '/document',
    children: [{
      path: 'document',
      name: 'document',
      component: () => import('@/views/document/index'),
      meta: { title: '文档中心', icon: 'form' }
    }]
  },

  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

// export const asyncRoutes = [
//   {
//     path: '/users',
//     component: Layout,
//     redirect: '/users',
//     children: [{
//       path: 'user',
//       name: '用户管理',
//       component: () => import('@/views/users/index'),
//       meta: { title: '用户管理', icon: 'user', roles: ['admin'] }
//     }]
//   },

//   // 404 page must be placed at the end !!!
//   { path: '*', redirect: '/404', hidden: true }
// ]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
