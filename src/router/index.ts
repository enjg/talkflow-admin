     1|import { createRouter, createWebHistory } from 'vue-router'
     2|import type { RouteRecordRaw } from 'vue-router'
     3|
     4|// 基础路由 - 不需要权限
     5|const constantRoutes: RouteRecordRaw[] = [
     6|  {
     7|    path: '/login',
     8|    name: 'login',
     9|    component: () => import('../views/LoginView.vue'),
    10|    meta: { title: '登录' },
    11|  },
    12|  {
    13|    path: '/404',
    14|    name: '404',
    15|    component: () => import('../views/404.vue'),
    16|    meta: { title: '404' },
    17|  },
    18|  {
    19|    path: '/',
    20|    component: () => import('../layouts/AdminLayout.vue'),
    21|    meta: { requiresAuth: true },
    22|    redirect: '/dashboard',
    23|    children: [
    24|      // 数据看板
    25|      {
    26|        path: 'dashboard',
    27|        name: 'dashboard',
    28|        component: () => import('../views/DashboardView.vue'),
    29|        meta: { title: '数据看板', icon: 'Odometer' },
    30|      },
    31|      // 系统管理
    32|      {
    33|        path: 'system/user',
    34|        name: 'system-user',
    35|        component: () => import('../views/UsersView.vue'),
    36|        meta: { title: '用户管理', icon: 'User' },
    37|      },
    38|      {
    39|        path: 'system/role',
    40|        name: 'system-role',
    41|        component: () => import('../views/system/RoleManage.vue'),
    42|        meta: { title: '权限管理', icon: 'UserFilled' },
    43|      },
    44|      {
    45|        path: 'system/menu',
    46|        name: 'system-menu',
    47|        component: () => import('../views/system/MenuManage.vue'),
    48|        meta: { title: '菜单管理', icon: 'Menu' },
    49|      },
    50|      {
    51|        path: 'system/dept',
    52|        name: 'system-dept',
    53|        component: () => import('../views/system/DeptView.vue'),
    54|        meta: { title: '部门管理', icon: 'OfficeBuilding' },
    55|      },
    56|      {
    57|        path: 'system/post',
    58|        name: 'system-post',
    59|        component: () => import('../views/system/PostView.vue'),
    60|        meta: { title: '岗位管理', icon: 'Postcard' },
    61|      },
    62|      {
    63|        path: 'system/dict',
    64|        name: 'system-dict',
    65|        component: () => import('../views/system/DictView.vue'),
    66|        meta: { title: '字典管理', icon: 'Collection' },
    67|      },
    68|      {
    69|        path: 'system/message/sms',
    70|        name: 'system-sms',
    71|        component: () => import('../views/system/SmsView.vue'),
    72|        meta: { title: '短信管理', icon: 'Message' },
    73|      },
    74|      {
    75|        path: 'system/message/email',
    76|        name: 'system-email',
    77|        component: () => import('../views/system/EmailView.vue'),
    78|        meta: { title: '邮箱管理', icon: 'Promotion' },
    79|      },
    80|      {
    81|        path: 'system/message/notice',
    82|        name: 'system-notice',
    83|        component: () => import('../views/system/MessageView.vue'),
    84|        meta: { title: '站内信管理', icon: 'ChatDotRound' },
    85|      },
    86|      {
    87|        path: 'system/message/announcement',
    88|        name: 'system-announcement',
    89|        component: () => import('../views/system/NoticeView.vue'),
    90|        meta: { title: '通知公告', icon: 'Notification' },
    91|      },
    92|      // 配置管理
    93|      {
    94|        path: 'config/ai-character',
    95|        name: 'config-ai-character',
    96|        component: () => import('../views/config/AiCharacterConfig.vue'),
    97|        meta: { title: 'AI角色配置', icon: 'MagicStick' },
    98|      },
    99|      // 内容管理
   100|      {
   101|        path: 'content/characters',
   102|        name: 'content-characters',
   103|        component: () => import('../views/CharactersView.vue'),
   104|        meta: { title: 'AI角色管理', icon: 'MagicStick' },
   105|      },
   106|      {
   107|        path: 'content/conversations',
   108|        name: 'content-conversations',
   109|        component: () => import('../views/ConversationsView.vue'),
   110|        meta: { title: '对话管理', icon: 'ChatLineRound' },
   111|      },
   112|      {
   113|        path: 'content/statistics',
   114|        name: 'content-statistics',
   115|        component: () => import('../views/DashboardView.vue'),
   116|        meta: { title: '学习统计', icon: 'DataAnalysis' },
   117|      },
   118|      // 系统监控
   119|      {
   120|        path: 'monitor/online',
   121|        name: 'monitor-online',
   122|        component: () => import('../views/DashboardView.vue'),
   123|        meta: { title: '在线用户', icon: 'Connection' },
   124|      },
   125|      {
   126|        path: 'monitor/server',
   127|        name: 'monitor-server',
   128|        component: () => import('../views/DashboardView.vue'),
   129|        meta: { title: '服务监控', icon: 'Cpu' },
   130|      },
   131|      {
   132|        path: 'monitor/job',
   133|        name: 'monitor-job',
   134|        component: () => import('../views/DashboardView.vue'),
   135|        meta: { title: '定时任务', icon: 'Timer' },
   136|      },
   137|      {
   138|        path: 'monitor/backup',
   139|        name: 'monitor-backup',
   140|        component: () => import('../views/DashboardView.vue'),
   141|        meta: { title: '数据备份', icon: 'FolderOpened' },
   142|      },
   143|      // 系统工具
   144|      {
   145|        path: 'tool/gen',
   146|        name: 'tool-gen',
   147|        component: () => import('../views/DashboardView.vue'),
   148|        meta: { title: '代码生成', icon: 'Files' },
   149|      },
   150|      {
   151|        path: 'tool/build',
   152|        name: 'tool-build',
   153|        component: () => import('../views/DashboardView.vue'),
   154|        meta: { title: '表单构建', icon: 'Grid' },
   155|      },
   156|      {
   157|        path: 'tool/swagger',
   158|        name: 'tool-swagger',
   159|        component: () => import('../views/DashboardView.vue'),
   160|        meta: { title: '接口文档', icon: 'Link' },
   161|      },
   162|      {
   163|        path: 'tool/config',
   164|        name: 'tool-config',
   165|        component: () => import('../views/SettingsView.vue'),
   166|        meta: { title: '系统配置', icon: 'Tools' },
   167|      },
   168|    ],
   169|  },
   170|  {
   171|    path: '/:pathMatch(.*)*',
   172|    redirect: '/404',
   173|  },
   174|]
   175|
   176|const router = createRouter({
   177|  history: createWebHistory(),
   178|  routes: constantRoutes,
   179|})
   180|
   181|// 路由守卫
   182|router.beforeEach((to, from, next) => {
   183|  const token = localStorage.getItem('admin_token')
   184|
   185|  if (to.meta.requiresAuth && !token) {
   186|    next({ name: 'login' })
   187|  } else if (to.name === 'login' && token) {
   188|    next({ name: 'dashboard' })
   189|  } else {
   190|    next()
   191|  }
   192|})
   193|
   194|export default router
   195|