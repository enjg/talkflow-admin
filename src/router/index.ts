import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import AdminLayout from '@/layouts/AdminLayout.vue'

const routes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/LoginView.vue'),
    meta: { title: '登录' },
  },
  {
    path: '/',
    component: AdminLayout,
    children: [
      {
        path: '',
        name: 'Dashboard',
        component: () => import('@/views/DashboardView.vue'),
        meta: { title: '数据看板' },
      },
      {
        path: 'users',
        name: 'Users',
        component: () => import('@/views/UsersView.vue'),
        meta: { title: '用户管理' },
      },
      {
        path: 'characters',
        name: 'Characters',
        component: () => import('@/views/CharactersView.vue'),
        meta: { title: '角色管理' },
      },
      {
        path: 'conversations',
        name: 'Conversations',
        component: () => import('@/views/ConversationsView.vue'),
        meta: { title: '对话管理' },
      },
      {
        path: 'logs',
        name: 'Logs',
        component: () => import('@/views/LogsView.vue'),
        meta: { title: '日志管理' },
      },
      {
        path: 'menus',
        name: 'Menus',
        component: () => import('@/views/MenusView.vue'),
        meta: { title: '菜单管理' },
      },
      {
        path: 'depts',
        name: 'Depts',
        component: () => import('@/views/DeptsView.vue'),
        meta: { title: '部门管理' },
      },
      {
        path: 'posts',
        name: 'Posts',
        component: () => import('@/views/PostsView.vue'),
        meta: { title: '岗位管理' },
      },
      {
        path: 'dicts',
        name: 'Dicts',
        component: () => import('@/views/DictsView.vue'),
        meta: { title: '字典管理' },
      },
      {
        path: 'messages',
        name: 'Messages',
        component: () => import('@/views/MessagesView.vue'),
        meta: { title: '消息中心' },
      },
      {
        path: 'settings',
        name: 'Settings',
        component: () => import('@/views/SettingsView.vue'),
        meta: { title: '系统配置' },
      },
      {
        path: 'monitor',
        name: 'Monitor',
        component: () => import('@/views/MonitorView.vue'),
        meta: { title: '监控中心' },
      },
      {
        path: 'jobs',
        name: 'Jobs',
        component: () => import('@/views/JobsView.vue'),
        meta: { title: '定时任务' },
      },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to, _from, next) => {
  const token = localStorage.getItem('token')
  if (to.path !== '/login' && !token) {
    next('/login')
  } else if (to.path === '/login' && token) {
    next('/')
  } else {
    next()
  }
})

export default router
