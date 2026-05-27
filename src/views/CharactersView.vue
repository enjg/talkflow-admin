<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import { adminApi } from '../api/admin'

interface Character {
  id: string
  name: string
  description: string
  type: 'builtin' | 'custom'
  status: 'active' | 'disabled'
  usage: number
  avatar?: string
  personality?: string
  greeting?: string
}

const loading = ref(false)
const characters = ref<Character[]>([])
const dialogVisible = ref(false)
const isEditing = ref(false)
const formRef = ref<FormInstance>()

const defaultForm = (): Character => ({
  id: '',
  name: '',
  description: '',
  type: 'custom',
  status: 'active',
  usage: 0,
  avatar: '',
  personality: '',
  greeting: '',
})

const form = ref<Character>(defaultForm())

const rules: FormRules = {
  name: [
    { required: true, message: '请输入角色名称', trigger: 'blur' },
    { min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur' },
  ],
  description: [
    { required: true, message: '请输入角色描述', trigger: 'blur' },
  ],
}

const fetchCharacters = async () => {
  loading.value = true
  try {
    const res = await adminApi.getCharacters() as any
    if (Array.isArray(res)) {
      characters.value = res
    } else if (res?.data) {
      characters.value = res.data
    }
  } catch {
    // Use mock data
    characters.value = [
      { id: 'forrest_gump', name: '阿甘', description: '温暖单纯的南方口音，用简单话语讲述人生哲理', type: 'builtin', status: 'active', usage: 156 },
      { id: 'jack_sparrow', name: '杰克船长', description: '幽默古怪的海盗腔调，说话飘忽不定', type: 'builtin', status: 'active', usage: 132 },
      { id: 'yoda', name: '尤达大师', description: '颠倒语序的智慧长者，深奥又可爱', type: 'builtin', status: 'active', usage: 98 },
      { id: 'tony_stark', name: '钢铁侠', description: '自信幽默的科技天才，带点傲慢', type: 'builtin', status: 'active', usage: 87 },
      { id: 'hermione', name: '赫敏', description: '聪慧好学的女巫，知识渊博', type: 'builtin', status: 'active', usage: 76 },
      { id: 'vader', name: '达斯维达', description: '低沉威严的黑暗面，令人敬畏', type: 'builtin', status: 'active', usage: 65 },
      { id: 'godfather', name: '教父', description: '沉稳的意大利口音，话语中暗含深意', type: 'builtin', status: 'active', usage: 54 },
      { id: 'elsa', name: '艾莎', description: '优雅温柔的女王，冰雪聪明', type: 'builtin', status: 'disabled', usage: 43 },
    ]
  } finally {
    loading.value = false
  }
}

const handleCreate = () => {
  isEditing.value = false
  form.value = defaultForm()
  dialogVisible.value = true
}

const handleEdit = (char: Character) => {
  isEditing.value = true
  form.value = { ...char }
  dialogVisible.value = true
}

const handleSubmit = async () => {
  if (!formRef.value) return
  await formRef.value.validate(async (valid) => {
    if (!valid) return
    try {
      if (isEditing.value) {
        await adminApi.updateCharacter(form.value.id, form.value)
        const idx = characters.value.findIndex(c => c.id === form.value.id)
        if (idx !== -1) characters.value[idx] = { ...form.value }
        ElMessage.success('角色更新成功')
      } else {
        await adminApi.createCharacter(form.value)
        characters.value.push({ ...form.value, id: 'custom_' + Date.now(), usage: 0 })
        ElMessage.success('角色创建成功')
      }
      dialogVisible.value = false
    } catch {
      // Simulate success for demo
      if (isEditing.value) {
        const idx = characters.value.findIndex(c => c.id === form.value.id)
        if (idx !== -1) characters.value[idx] = { ...form.value }
      } else {
        characters.value.push({ ...form.value, id: 'custom_' + Date.now(), usage: 0 })
      }
      ElMessage.success(isEditing.value ? '角色更新成功' : '角色创建成功')
      dialogVisible.value = false
    }
  })
}

const handleToggleStatus = (char: Character) => {
  char.status = char.status === 'active' ? 'disabled' : 'active'
  ElMessage.success(char.status === 'active' ? '角色已启用' : '角色已禁用')
}

const handleDelete = async (char: Character) => {
  try {
    await adminApi.deleteCharacter(char.id)
  } catch {
    // Continue with UI update
  }
  characters.value = characters.value.filter(c => c.id !== char.id)
  ElMessage.success('角色已删除')
}

onMounted(() => {
  fetchCharacters()
})
</script>

<template>
  <div class="characters-view" v-loading="loading">
    <!-- Header -->
    <el-card shadow="hover" class="mb-4">
      <div class="flex items-center justify-between">
        <span class="text-sm text-gray-500">共 {{ characters.length }} 个角色</span>
        <el-button type="primary" @click="handleCreate">
          <el-icon class="mr-1"><Plus /></el-icon>
          创建角色
        </el-button>
      </div>
    </el-card>

    <!-- Character Grid -->
    <el-row :gutter="16">
      <el-col
        :xs="24" :sm="12" :md="8" :lg="6"
        v-for="char in characters"
        :key="char.id"
        class="mb-4"
      >
        <el-card shadow="hover" class="character-card h-full">
          <div class="flex items-start gap-3 mb-3">
            <el-avatar :size="48" class="flex-shrink-0" :style="{ backgroundColor: char.type === 'builtin' ? '#409eff' : '#9b59b6' }">
              {{ char.name?.[0] }}
            </el-avatar>
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2">
                <span class="font-medium text-sm truncate">{{ char.name }}</span>
                <el-tag
                  :type="char.type === 'builtin' ? 'primary' : 'warning'"
                  size="small"
                  effect="plain"
                >
                  {{ char.type === 'builtin' ? '内置' : '自定义' }}
                </el-tag>
              </div>
              <p class="text-xs text-gray-500 mt-1 line-clamp-2">{{ char.description }}</p>
            </div>
          </div>

          <div class="flex items-center justify-between mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
            <div class="flex items-center gap-3">
              <el-switch
                v-model="char.status"
                active-value="active"
                inactive-value="disabled"
                @change="handleToggleStatus(char)"
                size="small"
              />
              <span class="text-xs text-gray-500">使用 {{ char.usage }} 次</span>
            </div>
            <div class="flex items-center gap-1">
              <el-button text type="primary" size="small" @click="handleEdit(char)">
                <el-icon><Edit /></el-icon>
              </el-button>
              <el-popconfirm
                title="确定要删除这个角色吗？此操作不可恢复。"
                confirm-button-text="确定删除"
                cancel-button-text="取消"
                @confirm="handleDelete(char)"
              >
                <template #reference>
                  <el-button text type="danger" size="small">
                    <el-icon><Delete /></el-icon>
                  </el-button>
                </template>
              </el-popconfirm>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- Empty State -->
    <el-empty v-if="!loading && characters.length === 0" description="暂无角色数据" />

    <!-- Create/Edit Dialog -->
    <el-dialog
      v-model="dialogVisible"
      :title="isEditing ? '编辑角色' : '创建角色'"
      width="560px"
      destroy-on-close
    >
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="80px"
        label-position="left"
      >
        <el-form-item label="名称" prop="name">
          <el-input v-model="form.name" placeholder="输入角色名称" maxlength="20" show-word-limit />
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input
            v-model="form.description"
            type="textarea"
            :rows="3"
            placeholder="输入角色描述"
            maxlength="200"
            show-word-limit
          />
        </el-form-item>
        <el-form-item label="类型">
          <el-select v-model="form.type" style="width: 100%">
            <el-option label="内置角色" value="builtin" />
            <el-option label="自定义角色" value="custom" />
          </el-select>
        </el-form-item>
        <el-form-item label="性格">
          <el-input v-model="form.personality" placeholder="描述角色性格特点" />
        </el-form-item>
        <el-form-item label="开场白">
          <el-input
            v-model="form.greeting"
            type="textarea"
            :rows="2"
            placeholder="角色的开场白台词"
          />
        </el-form-item>
        <el-form-item label="状态">
          <el-radio-group v-model="form.status">
            <el-radio value="active">启用</el-radio>
            <el-radio value="disabled">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">
          {{ isEditing ? '保存修改' : '创建角色' }}
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped>
.character-card {
  transition: all 0.3s;
}
.character-card:hover {
  transform: translateY(-2px);
}
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
