/**
 * 菜单配置 - 3级菜单体系
 */
export interface MenuItem {
  path: string
  title: string
  icon?: string
  children?: MenuItem[]
}

export const menuList: MenuItem[] = [
  {
    path: '/dashboard',
    title: '数据看板',
    icon: 'Odometer',
  },
  {
    path: '/system',
    title: '系统管理',
    icon: 'Setting',
    children: [
      { path: '/system/user', title: '用户管理', icon: 'User' },
      { path: '/system/role', title: '权限管理', icon: 'UserFilled' },
      { path: '/system/menu', title: '菜单管理', icon: 'Menu' },
      { path: '/system/dept', title: '部门管理', icon: 'OfficeBuilding' },
      { path: '/system/post', title: '岗位管理', icon: 'Postcard' },
      { path: '/system/dict', title: '字典管理', icon: 'Collection' },
      {
        path: '/system/message',
        title: '消息中心',
        icon: 'Bell',
        children: [
          { path: '/system/message/sms', title: '短信管理', icon: 'Message' },
          { path: '/system/message/email', title: '邮箱管理', icon: 'Promotion' },
          { path: '/system/message/notice', title: '站内信管理', icon: 'ChatDotRound' },
          { path: '/system/message/announcement', title: '通知公告', icon: 'Notification' },
        ],
      },
    ],
  },
  {
    path: '/config',
    title: '配置管理',
    icon: 'Tools',
    children: [
      { path: '/config/ai-character', title: 'AI角色配置', icon: 'MagicStick' },
      { path: '/config/ai-model', title: 'AI模型配置', icon: 'Cpu' },
      { path: '/config/points-consume', title: '积分消耗管理', icon: 'Coin' },
    ],
  },
  {
    path: '/member',
    title: '会员管理',
    icon: 'User',
    children: [
      { path: '/member/list', title: '会员列表', icon: 'List' },
    ],
  },
  {
    path: '/points',
    title: '会员积分管理',
    icon: 'Coin',
    children: [
      { path: '/points/manage', title: '积分管理', icon: 'Coin' },
      { path: '/points/level', title: '会员等级管理', icon: 'Trophy' },
    ],
  },
  {
    path: '/content',
    title: '内容管理',
    icon: 'Document',
    children: [
      { path: '/content/characters', title: 'AI角色管理', icon: 'MagicStick' },
      { path: '/content/conversations', title: '对话管理', icon: 'ChatLineRound' },
      { path: '/content/statistics', title: '学习统计', icon: 'DataAnalysis' },
    ],
  },
  {
    path: '/monitor',
    title: '系统监控',
    icon: 'Monitor',
    children: [
      { path: '/monitor/online', title: '在线用户', icon: 'Connection' },
      { path: '/monitor/server', title: '服务监控', icon: 'Cpu' },
      { path: '/monitor/job', title: '定时任务', icon: 'Timer' },
      { path: '/monitor/backup', title: '数据备份', icon: 'FolderOpened' },
    ],
  },
  {
    path: '/tool',
    title: '系统工具',
    icon: 'Suitcase',
    children: [
      { path: '/tool/gen', title: '代码生成', icon: 'Files' },
      { path: '/tool/build', title: '表单构建', icon: 'Grid' },
      { path: '/tool/swagger', title: '接口文档', icon: 'Link' },
      { path: '/tool/config', title: '系统配置', icon: 'Tools' },
    ],
  },
]
