import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

// 基础路由 - 不需要权限
const constantRoutes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/LoginView.vue'),
    meta: { title: '登录' },
  },
  {
    path: '/404',
    name: '404',
    component: () => import('../views/404.vue'),
    meta: { title: '404' },
  },
  {
    path: '/',
    component: () => import('../layouts/AdminLayout.vue'),
    meta: { requiresAuth: true },
    redirect: '/dashboard',
    children: [
      // 数据看板
      {
        path: 'dashboard',
        name: 'dashboard',
        component: () => import('../views/DashboardView.vue'),
        meta: { title: '数据看板', icon: 'Odometer' },
      },
      // 系统管理
      {
        path: 'system/user',
        name: 'system-user',
        component: () => import('../views/UsersView.vue'),
        meta: { title: '用户管理', icon: 'User' },
      },
      {
        path: 'system/role',
        name: 'system-role',
        component: () => import('../views/system/RoleManage.vue'),
        meta: { title: '权限管理', icon: 'UserFilled' },
      },
      {
        path: 'system/menu',
        name: 'system-menu',
        component: () => import('../views/system/MenuManage.vue'),
        meta: { title: '菜单管理', icon: 'Menu' },
      },
      {
        path: 'system/dept',
        name: 'system-dept',
        component: () => import('../views/system/DeptView.vue'),
        meta: { title: '部门管理', icon: 'OfficeBuilding' },
      },
      {
        path: 'system/post',
        name: 'system-post',
        component: () => import('../views/system/PostView.vue'),
        meta: { title: '岗位管理', icon: 'Postcard' },
      },
      {
        path: 'system/dict',
        name: 'system-dict',
        component: () => import('../views/system/DictView.vue'),
        meta: { title: '字典管理', icon: 'Collection' },
      },
      {
        path: 'system/message/sms',
        name: 'system-sms',
        component: () => import('../views/system/SmsView.vue'),
        meta: { title: '短信管理', icon: 'Message' },
      },
      {
        path: 'system/message/email',
        name: 'system-email',
        component: () => import('../views/system/EmailView.vue'),
        meta: { title: '邮箱管理', icon: 'Promotion' },
      },
      {
        path: 'system/message/notice',
        name: 'system-notice',
        component: () => import('../views/system/MessageView.vue'),
        meta: { title: '站内信管理', icon: 'ChatDotRound' },
      },
      {
        path: 'system/message/announcement',
        name: 'system-announcement',
        component: () => import('../views/system/NoticeView.vue'),
        meta: { title: '通知公告', icon: 'Notification' },
      },
      // 配置管理
      {
        path: 'config/ai-character',
        name: 'config-ai-character',
        component: () => import('../views/config/AiCharacterConfig.vue'),
        meta: { title: 'AI角色配置', icon: 'MagicStick' },
      },
      // 内容管理
      {
        path: 'content/characters',
        name: 'content-characters',
        component: () => import('../views/CharactersView.vue'),
        meta: { title: 'AI角色管理', icon: 'MagicStick' },
      },
      {
        path: 'content/conversations',
        name: 'content-conversations',
        component: () => import('../views/ConversationsView.vue'),
        meta: { title: '对话管理', icon: 'ChatLineRound' },
      },
      {
        path: 'content/statistics',
        name: 'content-statistics',
        component: () => import('../views/DashboardView.vue'),
        meta: { title: '学习统计', icon: 'DataAnalysis' },
      },
      // 系统监控
      {
        path: 'monitor/online',
        name: 'monitor-online',
        component: () => import('../views/DashboardView.vue'),
        meta: { title: '在线用户', icon: 'Connection' },
      },
      {
        path: 'monitor/server',
        name: 'monitor-server',
        component: () => import('../views/DashboardView.vue'),
        meta: { title: '服务监控', icon: 'Cpu' },
      },
      {
        path: 'monitor/job',
        name: 'monitor-job',
        component: () => import('../views/DashboardView.vue'),
        meta: { title: '定时任务', icon: 'Timer' },
      },
      {
        path: 'monitor/backup',
        name: 'monitor-backup',
        component: () => import('../views/DashboardView.vue'),
        meta: { title: '数据备份', icon: 'FolderOpened' },
      },
      // 系统工具
      {
        path: 'tool/gen',
        name: 'tool-gen',
        component: () => import('../views/DashboardView.vue'),
        meta: { title: '代码生成', icon: 'Files' },
      },
      {
        path: 'tool/build',
        name: 'tool-build',
        component: () => import('../views/DashboardView.vue'),
        meta: { title: '表单构建', icon: 'Grid' },
      },
      {
        path: 'tool/swagger',
        name: 'tool-swagger',
        component: () => import('../views/DashboardView.vue'),
        meta: { title: '接口文档', icon: 'Link' },
      },
      {
        path: 'tool/config',
        name: 'tool-config',
        component: () => import('../views/SettingsView.vue'),
        meta: { title: '系统配置', icon: 'Tools' },
      },
    ],
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/404',
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes: constantRoutes,
})

// 路由守卫
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('admin_token')

  if (to.meta.requiresAuth && !token) {
    next({ name: 'login' })
  } else if (to.name === 'login' && token) {
    next({ name: 'dashboard' })
  } else {
    next()
  }
})

export default router
