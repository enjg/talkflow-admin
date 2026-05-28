<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { getPointsConsumeRules, updatePointsConsumeRule } from '@/api/config'

const loading = ref(false)
const tableData = ref([
  { id: 1, name: '普通对话', points: 10, memberOnly: false, minLevel: '', enabled: true },
  { id: 2, name: '高级角色对话', points: 30, memberOnly: true, minLevel: 'silver', enabled: true },
  { id: 3, name: 'TTS语音合成', points: 5, memberOnly: false, minLevel: '', enabled: true },
  { id: 4, name: 'STT语音识别', points: 5, memberOnly: false, minLevel: '', enabled: true },
  { id: 5, name: 'AI翻译', points: 8, memberOnly: false, minLevel: '', enabled: true },
  { id: 6, name: '语法纠错', points: 5, memberOnly: false, minLevel: '', enabled: true },
  { id: 7, name: '情景模拟', points: 20, memberOnly: true, minLevel: 'gold', enabled: true },
  { id: 8, name: '学习报告导出', points: 15, memberOnly: true, minLevel: 'silver', enabled: false },
])

const levelOptions = [
  { label: '普通会员', value: 'normal' },
  { label: '银卡会员', value: 'silver' },
  { label: '金卡会员', value: 'gold' },
  { label: '钻石会员', value: 'diamond' },
]

const handlePointsChange = async (row: any, val: number) => {
  row.points = val
  try {
    await updatePointsConsumeRule(row.id, { points: val })
  } catch {}
  ElMessage.success('积分已更新')
}

const handleMemberOnlyChange = async (row: any) => {
  try {
    await updatePointsConsumeRule(row.id, { memberOnly: row.memberOnly })
  } catch {}
  ElMessage.success(row.memberOnly ? '已设为会员专属' : '已取消会员专属')
}

const handleLevelChange = async (row: any) => {
  try {
    await updatePointsConsumeRule(row.id, { minLevel: row.minLevel })
  } catch {}
  ElMessage.success('等级要求已更新')
}

const handleEnabledChange = async (row: any) => {
  try {
    await updatePointsConsumeRule(row.id, { enabled: row.enabled })
  } catch {}
  ElMessage.success(row.enabled ? '已启用' : '已禁用')
}

onMounted(() => {
  loading.value = true
  setTimeout(() => { loading.value = false }, 300)
})
</script>

<template>
  <div class="p-4 space-y-4">
    <el-card shadow="never" class="!bg-[#111118] !border-white/5">
      <template #header>
        <div class="flex items-center justify-between">
          <span class="text-white font-medium">积分消耗规则</span>
          <el-tag type="info" size="small">修改后实时生效</el-tag>
        </div>
      </template>

      <el-table :data="tableData" v-loading="loading" stripe style="width: 100%">
        <el-table-column prop="id" label="ID" width="60" />
        <el-table-column prop="name" label="功能名称" width="160">
          <template #default="{ row }">
            <span class="text-white font-medium">{{ row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="points" label="消耗积分" width="180">
          <template #default="{ row }">
            <el-input-number
              v-model="row.points"
              :min="0"
              :max="999"
              size="small"
              @change="(val: number) => handlePointsChange(row, val)"
            />
          </template>
        </el-table-column>
        <el-table-column prop="memberOnly" label="仅会员" width="120" align="center">
          <template #default="{ row }">
            <el-switch
              v-model="row.memberOnly"
              @change="handleMemberOnlyChange(row)"
              active-text="是"
              inactive-text="否"
              inline-prompt
            />
          </template>
        </el-table-column>
        <el-table-column prop="minLevel" label="最低会员等级" width="180">
          <template #default="{ row }">
            <el-select
              v-model="row.minLevel"
              placeholder="不限"
              clearable
              size="small"
              :disabled="!row.memberOnly"
              @change="handleLevelChange(row)"
            >
              <el-option v-for="item in levelOptions" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </template>
        </el-table-column>
        <el-table-column prop="enabled" label="状态" width="100" align="center">
          <template #default="{ row }">
            <el-switch
              v-model="row.enabled"
              @change="handleEnabledChange(row)"
              active-text="启用"
              inactive-text="禁用"
              inline-prompt
            />
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>
