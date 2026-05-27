<template>
  <el-container class="admin-layout" style="height: 100vh;">
    <el-aside :width="isCollapse ? '64px' : '220px'" class="sidebar" style="background: #111118; transition: width 0.3s;">
      <div class="logo" style="height: 56px; display: flex; align-items: center; justify-content: center; color: #fff; font-size: 18px; font-weight: 700; border-bottom: 1px solid rgba(255,255,255,0.08);">
        <span v-if="!isCollapse">TalkFlow</span>
        <span v-else>TF</span>
      </div>
      <el-menu
        :default-active="$route.path"
        :collapse="isCollapse"
        background-color="#111118"
        text-color="rgba(255,255,255,0.65)"
        active-text-color="#409eff"
        router
        style="border-right: none;"
      >
        <el-menu-item index="/">
          <el-icon><DataLine /></el-icon>
          <span>数据看板</span>
        </el-menu-item>
        <el-menu-item index="/users">
          <el-icon><User /></el-icon>
          <span>用户管理</span>
        </el-menu-item>
        <el-menu-item index="/characters">
          <el-icon><Avatar /></el-icon>
          <span>角色管理</span>
        </el-menu-item>
        <el-menu-item index="/conversations">
          <el-icon><ChatDotRound /></el-icon>
          <span>对话管理</span>
        </el-menu-item>
        <el-menu-item index="/logs">
          <el-icon><Document /></el-icon>
          <span>日志管理</span>
        </el-menu-item>
        <el-menu-item index="/menus">
          <el-icon><Menu /></el-icon>
          <span>菜单管理</span>
        </el-menu-item>
        <el-menu-item index="/depts">
          <el-icon><OfficeBuilding /></el-icon>
          <span>部门管理</span>
        </el-menu-item>
        <el-menu-item index="/posts">
          <el-icon><Suitcase /></el-icon>
          <span>岗位管理</span>
        </el-menu-item>
        <el-menu-item index="/dicts">
          <el-icon><Collection /></el-icon>
          <span>字典管理</span>
        </el-menu-item>
        <el-menu-item index="/messages">
          <el-icon><Bell /></el-icon>
          <span>消息中心</span>
        </el-menu-item>
        <el-menu-item index="/settings">
          <el-icon><Setting /></el-icon>
          <span>系统配置</span>
        </el-menu-item>
        <el-menu-item index="/monitor">
          <el-icon><Monitor /></el-icon>
          <span>监控中心</span>
        </el-menu-item>
        <el-menu-item index="/jobs">
          <el-icon><Clock /></el-icon>
          <span>定时任务</span>
        </el-menu-item>
      </el-menu>
      <div class="collapse-btn" @click="isCollapse = !isCollapse" style="height: 40px; display: flex; align-items: center; justify-content: center; color: rgba(255,255,255,0.45); cursor: pointer; border-top: 1px solid rgba(255,255,255,0.08);">
        <el-icon :size="18">
          <DArrowLeft v-if="!isCollapse" />
          <DArrowRight v-else />
        </el-icon>
      </div>
    </el-aside>

    <el-container>
      <el-header class="top-header" style="height: 56px; display: flex; align-items: center; justify-content: space-between; padding: 0 20px; border-bottom: 1px solid var(--el-border-color-light);">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item v-if="$route.meta.title">{{ $route.meta.title }}</el-breadcrumb-item>
        </el-breadcrumb>
        <div style="display: flex; align-items: center; gap: 16px;">
          <el-switch v-model="isDark" @change="toggleDark" inline-prompt active-text="🌙" inactive-text="☀️" />
          <el-dropdown>
            <span style="cursor: pointer; display: flex; align-items: center; gap: 6px;">
              <el-icon><UserFilled /></el-icon>
              admin
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item @click="handleLogout">退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </el-header>

      <el-main :style="{ background: isDark ? '#141414' : '#f5f7fa', padding: '20px' }">
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import {
  DataLine, User, Avatar, ChatDotRound, Document, Menu,
  OfficeBuilding, Suitcase, Collection, Bell, Setting,
  Monitor, Clock, DArrowLeft, DArrowRight, UserFilled
} from '@element-plus/icons-vue'

const router = useRouter()
const isCollapse = ref(false)
const isDark = ref(false)

function toggleDark(val: boolean) {
  document.documentElement.classList.toggle('dark', val)
}

function handleLogout() {
  localStorage.removeItem('token')
  router.push('/login')
}
</script>

<style scoped>
.admin-layout {
  overflow: hidden;
}
.sidebar {
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
.sidebar .el-menu {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
}
</style>
