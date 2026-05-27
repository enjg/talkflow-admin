<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { menuList, type MenuItem } from '@/config/menu'
import * as ElementPlusIcons from '@element-plus/icons-vue'

const props = defineProps<{
  collapsed: boolean
}>()

const emit = defineEmits<{
  (e: 'update:collapsed', val: boolean): void
}>()

const route = useRoute()
const router = useRouter()

const isCollapse = computed(() => props.collapsed)

function toggleCollapse() {
  emit('update:collapsed', !props.collapsed)
}

function handleMenuSelect(index: string) {
  router.push(index)
}

// 计算当前激活的菜单
const activeMenu = computed(() => {
  return route.path
})

// 计算需要展开的子菜单
const openMenus = computed(() => {
  const path = route.path
  const parts = path.split('/').filter(Boolean)
  const opens: string[] = []
  // 构建展开路径，如 /system/message/sms -> ['/system', '/system/message']
  let current = ''
  for (let i = 0; i < parts.length - 1; i++) {
    current += '/' + parts[i]
    opens.push(current)
  }
  return opens
})
</script>

<template>
  <div class="sidebar-container">
    <!-- Logo -->
    <div class="sidebar-logo" :class="{ 'is-collapsed': isCollapse }">
      <span class="logo-icon">🎙️</span>
      <span v-show="!isCollapse" class="logo-title">TalkFlow Admin</span>
    </div>

    <!-- 菜单 -->
    <el-scrollbar class="menu-scrollbar">
      <el-menu
        :default-active="activeMenu"
        :default-openeds="openMenus"
        :collapse="isCollapse"
        :collapse-transition="false"
        background-color="#0f0f12"
        text-color="#8b8b9e"
        active-text-color="#a78bfa"
        :unique-opened="false"
        @select="handleMenuSelect"
      >
        <template v-for="item in menuList" :key="item.path">
          <!-- 无子菜单 -->
          <el-menu-item
            v-if="!item.children || item.children.length === 0"
            :index="item.path"
          >
            <el-icon v-if="item.icon">
              <component :is="ElementPlusIcons[item.icon]" />
            </el-icon>
            <template #title>{{ item.title }}</template>
          </el-menu-item>

          <!-- 有子菜单 -->
          <el-sub-menu v-else :index="item.path">
            <template #title>
              <el-icon v-if="item.icon">
                <component :is="ElementPlusIcons[item.icon]" />
              </el-icon>
              <span>{{ item.title }}</span>
            </template>

            <template v-for="child in item.children" :key="child.path">
              <!-- 三级：无子菜单 -->
              <el-menu-item
                v-if="!child.children || child.children.length === 0"
                :index="child.path"
              >
                <el-icon v-if="child.icon">
                  <component :is="ElementPlusIcons[child.icon]" />
                </el-icon>
                <template #title>{{ child.title }}</template>
              </el-menu-item>

              <!-- 三级：有子菜单 -->
              <el-sub-menu v-else :index="child.path">
                <template #title>
                  <el-icon v-if="child.icon">
                    <component :is="ElementPlusIcons[child.icon]" />
                  </el-icon>
                  <span>{{ child.title }}</span>
                </template>
                <el-menu-item
                  v-for="grandchild in child.children"
                  :key="grandchild.path"
                  :index="grandchild.path"
                >
                  <el-icon v-if="grandchild.icon">
                    <component :is="ElementPlusIcons[grandchild.icon]" />
                  </el-icon>
                  <template #title>{{ grandchild.title }}</template>
                </el-menu-item>
              </el-sub-menu>
            </template>
          </el-sub-menu>
        </template>
      </el-menu>
    </el-scrollbar>

    <!-- 折叠按钮 -->
    <div class="sidebar-collapse-btn" @click="toggleCollapse">
      <el-icon :size="16">
        <ElementPlusIcons.Fold v-if="!isCollapse" />
        <ElementPlusIcons.Expand v-else />
      </el-icon>
      <span v-show="!isCollapse" class="collapse-text">收起菜单</span>
    </div>
  </div>
</template>

<style scoped>
.sidebar-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: #0f0f12;
  border-right: 1px solid rgba(255, 255, 255, 0.05);
  transition: width 0.3s;
}

.sidebar-logo {
  display: flex;
  align-items: center;
  gap: 10px;
  height: 56px;
  padding: 0 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  overflow: hidden;
  white-space: nowrap;
}

.sidebar-logo.is-collapsed {
  justify-content: center;
  padding: 0;
}

.logo-icon {
  font-size: 22px;
  flex-shrink: 0;
}

.logo-title {
  font-size: 14px;
  font-weight: 600;
  color: #e0e0e8;
  letter-spacing: 0.5px;
}

.menu-scrollbar {
  flex: 1;
  overflow: hidden;
}

/* el-menu 暗色样式覆盖 */
:deep(.el-menu) {
  border-right: none;
  padding: 8px 6px;
}

:deep(.el-menu-item),
:deep(.el-sub-menu__title) {
  height: 42px;
  line-height: 42px;
  border-radius: 8px;
  margin-bottom: 2px;
  font-size: 13px;
}

:deep(.el-menu-item:hover),
:deep(.el-sub-menu__title:hover) {
  background-color: rgba(255, 255, 255, 0.04) !important;
}

:deep(.el-menu-item.is-active) {
  background-color: rgba(167, 139, 250, 0.12) !important;
  color: #a78bfa !important;
  font-weight: 500;
}

:deep(.el-sub-menu .el-menu) {
  padding: 0;
  background-color: transparent !important;
}

:deep(.el-sub-menu .el-menu-item) {
  padding-left: 52px !important;
  height: 38px;
  line-height: 38px;
  font-size: 12.5px;
}

:deep(.el-sub-menu .el-sub-menu .el-menu-item) {
  padding-left: 72px !important;
  height: 36px;
  line-height: 36px;
  font-size: 12px;
}

:deep(.el-menu--collapse .el-menu-item),
:deep(.el-menu--collapse .el-sub-menu__title) {
  padding: 0 !important;
  text-align: center;
}

:deep(.el-menu--collapse .el-sub-menu .el-menu-item) {
  padding-left: 20px !important;
}

/* 图标样式 */
:deep(.el-icon) {
  font-size: 16px;
  margin-right: 8px;
  color: #6b6b80;
}

:deep(.el-menu-item.is-active .el-icon) {
  color: #a78bfa;
}

.sidebar-collapse-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  height: 44px;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  color: #5a5a6e;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 12px;
}

.sidebar-collapse-btn:hover {
  color: #a0a0b8;
  background-color: rgba(255, 255, 255, 0.03);
}

.collapse-text {
  font-size: 12px;
}
</style>
