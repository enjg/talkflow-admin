import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue'),
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
          meta: { title: '数据看板' },
        },
        // 系统管理
        {
          path: 'system/user',
          name: 'system-user',
          component: () => import('../views/UsersView.vue'),
          meta: { title: '用户管理' },
        },
        {
          path: 'system/role',
          name: 'system-role',
          component: () => import('../views/CharactersView.vue'),
          meta: { title: '角色管理' },
        },
        {
          path: 'system/menu',
          name: 'system-menu',
          component: () => import('../views/system/MenuView.vue'),
          meta: { title: '菜单管理' },
        },
        {
          path: 'system/dept',
          name: 'system-dept',
          component: () => import('../views/system/DeptView.vue'),
          meta: { title: '部门管理' },
        },
        {
          path: 'system/post',
          name: 'system-post',
          component: () => import('../views/system/PostView.vue'),
          meta: { title: '岗位管理' },
        },
        {
          path: 'system/dict',
          name: 'system-dict',
          component: () => import('../views/system/DictView.vue'),
          meta: { title: '字典管理' },
        },
        // 消息中心
        {
          path: 'system/message/sms',
          name: 'system-message-sms',
          component: () => import('../views/system/SmsView.vue'),
          meta: { title: '短信管理' },
        },
        {
          path: 'system/message/email',
          name: 'system-message-email',
          component: () => import('../views/system/EmailView.vue'),
          meta: { title: '邮箱管理' },
        },
        {
          path: 'system/message/notice',
          name: 'system-message-notice',
          component: () => import('../views/system/MessageView.vue'),
          meta: { title: '站内信管理' },
        },
        {
          path: 'system/message/announcement',
          name: 'system-message-announcement',
          component: () => import('../views/system/NoticeView.vue'),
          meta: { title: '通知公告' },
        },
        // 内容管理
        {
          path: 'content/characters',
          name: 'content-characters',
          component: () => import('../views/CharactersView.vue'),
          meta: { title: 'AI角色管理' },
        },
        {
          path: 'content/conversations',
          name: 'content-conversations',
          component: () => import('../views/ConversationsView.vue'),
          meta: { title: '对话管理' },
        },
        {
          path: 'content/statistics',
          name: 'content-statistics',
          component: () => import('../views/system/DictView.vue'),
          meta: { title: '学习统计' },
        },
        // 系统监控
        {
          path: 'monitor/online',
          name: 'monitor-online',
          component: () => import('../views/system/DeptView.vue'),
          meta: { title: '在线用户' },
        },
        {
          path: 'monitor/server',
          name: 'monitor-server',
          component: () => import('../views/system/PostView.vue'),
          meta: { title: '服务监控' },
        },
        {
          path: 'monitor/job',
          name: 'monitor-job',
          component: () => import('../views/system/DictView.vue'),
          meta: { title: '定时任务' },
        },
        {
          path: 'monitor/backup',
          name: 'monitor-backup',
          component: () => import('../views/system/MenuView.vue'),
          meta: { title: '数据备份' },
        },
        // 系统工具
        {
          path: 'tool/gen',
          name: 'tool-gen',
          component: () => import('../views/system/DeptView.vue'),
          meta: { title: '代码生成' },
        },
        {
          path: 'tool/build',
          name: 'tool-build',
          component: () => import('../views/system/PostView.vue'),
          meta: { title: '表单构建' },
        },
        {
          path: 'tool/swagger',
          name: 'tool-swagger',
          component: () => import('../views/system/DictView.vue'),
          meta: { title: '接口文档' },
        },
        {
          path: 'tool/config',
          name: 'tool-config',
          component: () => import('../views/system/MenuView.vue'),
          meta: { title: '系统配置' },
        },
        // 兼容旧路由
        {
          path: 'users',
          redirect: 'system/user',
        },
        {
          path: 'characters',
          redirect: 'content/characters',
        },
        {
          path: 'conversations',
          redirect: 'content/conversations',
        },
        {
          path: 'settings',
          name: 'settings',
          component: () => import('../views/SettingsView.vue'),
          meta: { title: '系统设置' },
        },
      ],
    },
  ],
})

router.beforeEach((to) => {
  const token = localStorage.getItem('admin_token')
  if (to.meta.requiresAuth && !token) return { name: 'login' }
  if (to.name === 'login' && token) return { name: 'dashboard' }
})

export default router
