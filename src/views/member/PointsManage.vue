<template>
  <div class="page-container">
    <h2>积分管理</h2>
    <el-tabs v-model="activeTab" type="border-card">
      <!-- 积分规则 -->
      <el-tab-pane label="积分规则" name="rules">
        <el-form label-width="120px" style="max-width:600px">
          <h4 style="color:#e0e0e0;margin-bottom:12px">获得规则</h4>
          <el-form-item label="注册赠送">
            <el-input-number v-model="rules.register" :min="0" /> 积分
          </el-form-item>
          <el-form-item label="每日签到">
            <el-input-number v-model="rules.dailyCheckin" :min="0" /> 积分（每日上限 <el-input-number v-model="rules.dailyCheckinMax" :min="0" style="width:100px" />）
          </el-form-item>
          <el-form-item label="完成对话">
            <el-input-number v-model="rules.sessionComplete" :min="0" /> 积分
          </el-form-item>
          <el-form-item label="邀请好友">
            <el-input-number v-model="rules.inviteFriend" :min="0" /> 积分
          </el-form-item>
          <h4 style="color:#e0e0e0;margin:20px 0 12px">消耗规则</h4>
          <el-form-item label="普通对话">
            <el-input-number v-model="rules.chatNormal" :min="0" /> 积分/次
          </el-form-item>
          <el-form-item label="高级角色">
            <el-input-number v-model="rules.chatPremium" :min="0" /> 积分/次
          </el-form-item>
          <el-form-item label="TTS语音">
            <el-input-number v-model="rules.tts" :min="0" /> 积分/次
          </el-form-item>
          <el-form-item>
            <el-button type="primary">保存规则</el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>

      <!-- 套餐管理 -->
      <el-tab-pane label="套餐管理" name="packages">
        <el-button type="primary" style="margin-bottom:12px" @click="showPackageDialog()">新增套餐</el-button>
        <el-table :data="packages" stripe>
          <el-table-column prop="name" label="名称" />
          <el-table-column prop="description" label="描述" />
          <el-table-column prop="points" label="积分" width="100" />
          <el-table-column prop="price" label="价格" width="100">
            <template #default="{ row }">¥{{ row.price }}</template>
          </el-table-column>
          <el-table-column prop="duration" label="有效期" width="100">
            <template #default="{ row }">{{ row.duration }}天</template>
          </el-table-column>
          <el-table-column label="状态" width="80">
            <template #default="{ row }">
              <el-tag :type="row.status?'success':'info'" size="small">{{ row.status?'启用':'禁用' }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="140">
            <template #default="{ row }">
              <el-button link type="primary" @click="showPackageDialog(row)">编辑</el-button>
              <el-button link type="danger">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>

      <!-- 激活码 -->
      <el-tab-pane label="激活码" name="codes">
        <el-form inline style="margin-bottom:12px">
          <el-form-item label="套餐">
            <el-select v-model="codeForm.packageId" placeholder="选择套餐">
              <el-option v-for="p in packages" :key="p.id" :label="p.name" :value="p.id" />
            </el-select>
          </el-form-item>
          <el-form-item label="数量">
            <el-input-number v-model="codeForm.count" :min="1" :max="1000" />
          </el-form-item>
          <el-form-item label="有效期">
            <el-input-number v-model="codeForm.days" :min="1" /> 天
          </el-form-item>
          <el-form-item>
            <el-button type="primary">生成</el-button>
            <el-button>导出CSV</el-button>
          </el-form-item>
        </el-form>
        <el-table :data="codes" stripe>
          <el-table-column prop="code" label="激活码" width="240" />
          <el-table-column prop="packageName" label="关联套餐" />
          <el-table-column label="状态" width="100">
            <template #default="{ row }">
              <el-tag :type="row.status==='unused'?'success':row.status==='used'?'info':'danger'" size="small">
                {{ row.status==='unused'?'未使用':row.status==='used'?'已使用':'已过期' }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="usedBy" label="使用者" />
          <el-table-column prop="usedAt" label="使用时间" width="170" />
          <el-table-column prop="expiresAt" label="过期时间" width="170" />
        </el-table>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const activeTab = ref('rules')
const rules = ref({ register: 100, dailyCheckin: 10, dailyCheckinMax: 10, sessionComplete: 20, inviteFriend: 50, chatNormal: 10, chatPremium: 30, tts: 5 })
const packages = ref([
  { id: 1, name: '体验套餐', description: '新用户体验', points: 500, price: 9.9, duration: 7, status: true },
  { id: 2, name: '月度套餐', description: '月度会员', points: 2000, price: 29.9, duration: 30, status: true },
  { id: 3, name: '年度套餐', description: '年度会员', points: 30000, price: 199, duration: 365, status: true },
])
const codes = ref([
  { code: 'TLF-ABCD-1234-EFGH', packageName: '月度套餐', status: 'unused', usedBy: '', usedAt: '', expiresAt: '2026-06-28' },
  { code: 'TLF-5678-IJKL-9012', packageName: '体验套餐', status: 'used', usedBy: '用户A', usedAt: '2026-05-27 10:30', expiresAt: '2026-06-03' },
])
const codeForm = ref({ packageId: '', count: 10, days: 30 })

const showPackageDialog = (row?: any) => {}
</script>

<style scoped>
.page-container { padding: 20px; }
.page-container h2 { color: #e0e0e0; font-size: 18px; margin-bottom: 16px; }
</style>
