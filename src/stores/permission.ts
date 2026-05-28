import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { RouteRecordRaw } from 'vue-router'
import router from '@/router'
import { getMenus } from '@/api/system'

export interface MenuInfo {
  id: number
  parentId: number
  name: string
  path: string
  component: string
  icon: string
  title: string
  type: number // 0:目录 1:菜单 2:按钮
  sort: number
  visible: number
  status: number
  children?: MenuInfo[]
}

export const usePermissionStore = defineStore('permission', () => {
  const menus = ref<MenuInfo[]>([])
  const routes = ref<RouteRecordRaw[]>([])

  // 动态导入组件映射
  const componentMap: Record<string, () => Promise<any>> = {
    DashboardView: () => import('@/views/DashboardView.vue'),
    UsersView: () => import('@/views/UsersView.vue'),
    MenuManage: () => import('@/views/system/MenuManage.vue'),
    RoleManage: () => import('@/views/system/RoleManage.vue'),
    DeptView: () => import('@/views/system/DeptView.vue'),
    PostView: () => import('@/views/system/PostView.vue'),
    DictView: () => import('@/views/system/DictView.vue'),
    SmsView: () => import('@/views/system/SmsView.vue'),
    EmailView: () => import('@/views/system/EmailView.vue'),
    MessageView: () => import('@/views/system/MessageView.vue'),
    NoticeView: () => import('@/views/system/NoticeView.vue'),
    CharactersView: () => import('@/views/CharactersView.vue'),
    ConversationsView: () => import('@/views/ConversationsView.vue'),
    SettingsView: () => import('@/views/SettingsView.vue'),
  }

  // 递归生成路由
  function buildRoutes(menuList: MenuInfo[]): RouteRecordRaw[] {
    const result: RouteRecordRaw[] = []
    for (const menu of menuList) {
      if (menu.type === 2) continue // 按钮不生成路由
      const route: RouteRecordRaw = {
        path: menu.path,
        name: menu.name,
        component: componentMap[menu.component] || (() => import('@/views/DashboardView.vue')),
        meta: {
          title: menu.title,
          icon: menu.icon,
        },
      }
      if (menu.children && menu.children.length > 0) {
        route.children = buildRoutes(menu.children)
      }
      result.push(route)
    }
    return result
  }

  // 从后端获取菜单并生成路由
  async function generateRoutes() {
    try {
      const res = await getMenus()
      const menuData = res.data || res
      menus.value = menuData
      const dynamicRoutes = buildRoutes(menuData)

      // 添加到布局路由下
      const layoutRoute: RouteRecordRaw = {
        path: '/',
        component: () => import('@/layouts/AdminLayout.vue'),
        meta: { requiresAuth: true },
        redirect: '/dashboard',
        children: dynamicRoutes,
      }

      router.addRoute(layoutRoute)
      routes.value = dynamicRoutes

      return dynamicRoutes
    } catch (error) {
      console.error('获取菜单失败:', error)
      return []
    }
  }

  // 重置路由
  function resetRoutes() {
    routes.value = []
    menus.value = []
    // 移除动态添加的路由
    const layoutRoute = router.getRoutes().find(r => r.path === '/')
    if (layoutRoute?.name) {
      router.removeRoute(layoutRoute.name)
    }
  }

  return {
    menus,
    routes,
    generateRoutes,
    resetRoutes,
  }
})
