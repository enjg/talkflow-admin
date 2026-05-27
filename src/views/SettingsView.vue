<template>
  <div class="settings-view">
    <el-card shadow="never">
      <template #header>
        <div class="card-header">
          <span>系统配置</span>
          <el-button type="primary" @click="handleSave" :loading="saving">
            <el-icon><Check /></el-icon>保存配置
          </el-button>
        </div>
      </template>

      <el-tabs v-model="activeTab">
        <!-- 基础配置 -->
        <el-tab-pane label="基础配置" name="basic">
          <el-form :model="config" label-width="140px" style="max-width: 650px; margin-top: 20px;">
            <el-form-item label="站点名称">
              <el-input v-model="config.siteName" placeholder="请输入站点名称" />
            </el-form-item>
            <el-form-item label="站点描述">
              <el-input v-model="config.siteDesc" type="textarea" :rows="3" placeholder="请输入站点描述" />
            </el-form-item>
            <el-form-item label="站点Logo URL">
              <el-input v-model="config.siteLogo" placeholder="请输入Logo URL" />
            </el-form-item>
            <el-form-item label="注册功能">
              <el-switch v-model="config.registerEnabled" active-text="开启" inactive-text="关闭" />
            </el-form-item>
            <el-form-item label="默认语言">
              <el-select v-model="config.language" style="width: 100%;">
                <el-option label="简体中文" value="zh-CN" />
                <el-option label="English" value="en-US" />
                <el-option label="日本語" value="ja-JP" />
              </el-select>
            </el-form-item>
          </el-form>
        </el-tab-pane>

        <!-- AI配置 -->
        <el-tab-pane label="AI配置" name="ai">
          <el-form :model="config" label-width="140px" style="max-width: 650px; margin-top: 20px;">
            <el-form-item label="默认AI模型">
              <el-select v-model="config.aiModel" style="width: 100%;">
                <el-option label="MiMo-7B (Nous Research)" value="mimo-7b" />
                <el-option label="GPT-4o" value="gpt-4o" />
                <el-option label="GPT-4o-mini" value="gpt-4o-mini" />
                <el-option label="Claude-3.5 Sonnet" value="claude-3.5-sonnet" />
                <el-option label="DeepSeek-V3" value="deepseek-v3" />
              </el-select>
            </el-form-item>
            <el-form-item label="TTS模型">
              <el-select v-model="config.ttsModel" style="width: 100%;">
                <el-option label="Edge TTS" value="edge-tts" />
                <el-option label="OpenAI TTS" value="openai-tts" />
                <el-option label="Azure TTS" value="azure-tts" />
                <el-option label="禁用" value="disabled" />
              </el-select>
            </el-form-item>
            <el-form-item label="最大Token数">
              <el-input-number v-model="config.maxTokens" :min="256" :max="128000" :step="256" style="width: 100%;" />
            </el-form-item>
            <el-form-item label="Temperature">
              <el-slider v-model="config.temperature" :min="0" :max="2" :step="0.1" show-input />
            </el-form-item>
            <el-form-item label="上下文轮数">
              <el-input-number v-model="config.contextTurns" :min="0" :max="50" style="width: 100%;" />
            </el-form-item>
            <el-form-item label="API请求速率限制">
              <el-input-number v-model="config.rateLimit" :min="1" :max="10000" :step="10" style="width: 100%;" />
              <div class="form-tip">每分钟最大请求数</div>
            </el-form-item>
            <el-form-item label="流式响应">
              <el-switch v-model="config.streamResponse" active-text="开启" inactive-text="关闭" />
            </el-form-item>
          </el-form>
        </el-tab-pane>

        <!-- 安全配置 -->
        <el-tab-pane label="安全配置" name="security">
          <el-form :model="config" label-width="140px" style="max-width: 650px; margin-top: 20px;">
            <el-form-item label="JWT过期时间(秒)">
              <el-input-number v-model="config.jwtExpiry" :min="300" :max="604800" :step="300" style="width: 100%;" />
              <div class="form-tip">当前值: {{ formatDuration(config.jwtExpiry) }}</div>
            </el-form-item>
            <el-form-item label="RefreshToken过期(秒)">
              <el-input-number v-model="config.refreshTokenExpiry" :min="3600" :max="2592000" :step="3600" style="width: 100%;" />
              <div class="form-tip">当前值: {{ formatDuration(config.refreshTokenExpiry) }}</div>
            </el-form-item>
            <el-form-item label="密码最小长度">
              <el-input-number v-model="config.passwordMinLength" :min="6" :max="32" style="width: 100%;" />
            </el-form-item>
            <el-form-item label="登录失败锁定">
              <el-switch v-model="config.loginLockEnabled" active-text="开启" inactive-text="关闭" />
            </el-form-item>
            <el-form-item v-if="config.loginLockEnabled" label="最大失败次数">
              <el-input-number v-model="config.maxLoginAttempts" :min="3" :max="20" style="width: 100%;" />
            </el-form-item>
            <el-form-item v-if="config.loginLockEnabled" label="锁定时长(分钟)">
              <el-input-number v-model="config.lockDuration" :min="5" :max="1440" :step="5" style="width: 100%;" />
            </el-form-item>
            <el-form-item label="验证码">
              <el-switch v-model="config.captchaEnabled" active-text="开启" inactive-text="关闭" />
            </el-form-item>
          </el-form>
        </el-tab-pane>

        <!-- 邮件配置 -->
        <el-tab-pane label="邮件配置" name="email">
          <el-form :model="config" label-width="140px" style="max-width: 650px; margin-top: 20px;">
            <el-form-item label="SMTP服务器">
              <el-input v-model="config.smtpHost" placeholder="smtp.example.com" />
            </el-form-item>
            <el-form-item label="SMTP端口">
              <el-input-number v-model="config.smtpPort" :min="1" :max="65535" style="width: 100%;" />
            </el-form-item>
            <el-form-item label="发件人邮箱">
              <el-input v-model="config.smtpFrom" placeholder="noreply@example.com" />
            </el-form-item>
            <el-form-item label="SMTP用户名">
              <el-input v-model="config.smtpUser" placeholder="请输入SMTP用户名" />
            </el-form-item>
            <el-form-item label="SMTP密码">
              <el-input v-model="config.smtpPassword" type="password" show-password placeholder="请输入SMTP密码" />
            </el-form-item>
            <el-form-item label="SSL/TLS">
              <el-switch v-model="config.smtpSsl" active-text="开启" inactive-text="关闭" />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="handleTestEmail">发送测试邮件</el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { Check } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const activeTab = ref('basic')
const saving = ref(false)

const config = reactive({
  // 基础
  siteName: 'TalkFlow Admin',
  siteDesc: 'TalkFlow AI对话管理系统 - 基于MiMo模型的智能对话平台',
  siteLogo: '/logo.svg',
  registerEnabled: true,
  language: 'zh-CN',
  // AI
  aiModel: 'mimo-7b',
  ttsModel: 'edge-tts',
  maxTokens: 8192,
  temperature: 0.7,
  contextTurns: 10,
  rateLimit: 60,
  streamResponse: true,
  // 安全
  jwtExpiry: 7200,
  refreshTokenExpiry: 604800,
  passwordMinLength: 8,
  loginLockEnabled: true,
  maxLoginAttempts: 5,
  lockDuration: 30,
  captchaEnabled: true,
  // 邮件
  smtpHost: 'smtp.example.com',
  smtpPort: 465,
  smtpFrom: 'noreply@talkflow.com',
  smtpUser: 'noreply@talkflow.com',
  smtpPassword: '',
  smtpSsl: true,
})

function formatDuration(seconds: number): string {
  if (seconds < 3600) return `${Math.floor(seconds / 60)}分钟`
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}小时`
  return `${Math.floor(seconds / 86400)}天`
}

function handleSave() {
  saving.value = true
  setTimeout(() => {
    saving.value = false
    ElMessage.success('配置保存成功')
  }, 800)
}

function handleTestEmail() {
  ElMessage.info('正在发送测试邮件...')
  setTimeout(() => {
    ElMessage.success('测试邮件发送成功，请检查收件箱')
  }, 1500)
}
</script>

<style scoped>
.settings-view {
  padding: 4px;
}
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.form-tip {
  font-size: 12px;
  color: var(--el-text-color-secondary);
  margin-top: 4px;
}
</style>
