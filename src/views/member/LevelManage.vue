<template>
  <div class="page-container">
    <div class="page-header">
      <h2>会员等级管理</h2>
    </div>

    <el-table :data="levels" stripe>
      <el-table-column prop="name" label="等级名称" width="120">
        <template #default="{ row }">
          <div style="display:flex;align-items:center;gap:8px">
            <span style="font-size:24px">{{ row.icon }}</span>
            <span>{{ row.name }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="pointsRequired" label="所需积分" width="120" />
      <el-table-column prop="discount" label="折扣" width="100">
        <template #default="{ row }">{{ row.discount }}折</template>
      </el-table-column>
      <el-table-column prop="description" label="描述" />
      <el-table-column prop="features" label="专属功能">
        <template #default="{ row }">
          <el-tag v-for="f in row.features" :key="f" size="small" style="margin:2px">{{ f }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="100">
        <template #default="{ row }">
          <el-button link type="primary" @click="showEdit(row)">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog v-model="editVisible" title="编辑等级" width="500px">
      <el-form label-width="100px" v-if="editForm">
        <el-form-item label="等级名称">
          <el-input v-model="editForm.name" />
        </el-form-item>
        <el-form-item label="图标">
          <el-input v-model="editForm.icon" style="width:80px" />
        </el-form-item>
        <el-form-item label="所需积分">
          <el-input-number v-model="editForm.pointsRequired" :min="0" />
        </el-form-item>
        <el-form-item label="折扣">
          <el-input-number v-model="editForm.discount" :min="1" :max="10" :step="0.5" /> 折
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="editForm.description" type="textarea" />
        </el-form-item>
        <el-form-item label="专属功能">
          <el-input v-model="editForm.featuresStr" placeholder="用逗号分隔" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="editVisible=false">取消</el-button>
        <el-button type="primary" @click="saveLevel">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage } from 'element-plus'

const levels = ref([
  { id: 1, name: '普通会员', icon: '👤', pointsRequired: 0, discount: 10, description: '注册即为普通会员', features: ['基础对话'] },
  { id: 2, name: '银卡会员', icon: '🥈', pointsRequired: 1000, discount: 9.5, description: '累计1000积分自动升级', features: ['基础对话', '高级角色'] },
  { id: 3, name: '金卡会员', icon: '🥇', pointsRequired: 5000, discount: 8.5, description: '累计5000积分自动升级', features: ['基础对话', '高级角色', 'TTS语音'] },
  { id: 4, name: '钻石会员', icon: '💎', pointsRequired: 20000, discount: 7, description: '累计20000积分自动升级', features: ['基础对话', '高级角色', 'TTS语音', '无限对话', '专属客服'] },
])

const editVisible = ref(false)
const editForm = ref<any>(null)

const showEdit = (row: any) => {
  editForm.value = { ...row, featuresStr: row.features.join(',') }
  editVisible.value = true
}
const saveLevel = () => {
  ElMessage.success('保存成功')
  editVisible.value = false
}
</script>

<style scoped>
.page-container { padding: 20px; }
.page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
.page-header h2 { color: #e0e0e0; font-size: 18px; }
</style>
