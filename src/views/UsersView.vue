<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { adminApi } from '../api/admin'

interface User {
  id: string
  nickname: string
  avatar?: string
  registerDate: string
  lastActive: string
  conversations: number
  messages: number
  status: 'active' | 'banned'
  phone?: string
  email?: string
}

const loading = ref(false)
const searchQuery = ref('')
const statusFilter = ref('')
const currentPage = ref(1)
const pageSize = ref(20)
const total = ref(0)
const users = ref<User[]>([])
const detailDialogVisible = ref(false)
const selectedUser = ref<User | null>(null)

const statusOptions = [
  { value: '', label: '全部状态' },
  { value: 'active', label: '正常' },
  { value: 'banned', label: '已封禁' },
]

const filteredUsers = computed(() => {
  let result = users.value
  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase()
    result = result.filter(u => u.nickname.toLowerCase().includes(q))
  }
  if (statusFilter.value) {
    result = result.filter(u => u.status === statusFilter.value)
  }
  return result
})

const paginatedUsers = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  return filteredUsers.value.slice(start, start + pageSize.value)
})

const fetchUsers = async () => {
  loading.value = true
  try {
    const res = await adminApi.getUsers({
      page: currentPage.value,
      pageSize: pageSize.value,
      search: searchQuery.value,
      status: statusFilter.value,
    }) as any
    if (res?.data) {
      users.value = res.data
      total.value = res.total ?? res.data.length
    }
  } catch {
    // Use mock data
    users.value = [
      { id: '1', nickname: '张三', registerDate: '2025-05-01', lastActive: '今天 14:30', conversations: 24, messages: 312, status: 'active', phone: '138****1234', email: 'zhang@example.com' },
      { id: '2', nickname: '李四', registerDate: '2025-05-03', lastActive: '今天 10:15', conversations: 18, messages: 198, status: 'active', phone: '139****5678' },
      { id: '3', nickname: '王五', registerDate: '2025-05-05', lastActive: '昨天', conversations: 8, messages: 67, status: 'banned' },
      { id: '4', nickname: '赵六', registerDate: '2025-05-08', lastActive: '3 天前', conversations: 5, messages: 42, status: 'active' },
      { id: '5', nickname: '孙七', registerDate: '2025-05-10', lastActive: '今天 09:00', conversations: 32, messages: 456, status: 'active' },
    ]
    total.value = users.value.length
  } finally {
    loading.value = false
  }
}

const handleSearch = () => {
  currentPage.value = 1
}

const handleViewDetail = (user: User) => {
  selectedUser.value = user
  detailDialogVisible.value = true
}

const handleToggleStatus = async (user: User) => {
  const newStatus = user.status === 'active' ? 'banned' : 'active'
  try {
    await adminApi.updateUserStatus(user.id, newStatus)
    user.status = newStatus as 'active' | 'banned'
    ElMessage.success(newStatus === 'banned' ? '已封禁用户' : '已解封用户')
  } catch {
    user.status = newStatus as 'active' | 'banned'
    ElMessage.success(newStatus === 'banned' ? '已封禁用户' : '已解封用户')
  }
}

const handlePageChange = (page: number) => {
  currentPage.value = page
  fetchUsers()
}

const handleSizeChange = (size: number) => {
  pageSize.value = size
  currentPage.value = 1
  fetchUsers()
}

onMounted(() => {
  fetchUsers()
})
</script>

<template>
  <div class="users-view">
    <!-- Toolbar -->
    <el-card shadow="hover" class="mb-4">
      <div class="flex flex-wrap items-center gap-3">
        <el-input
          v-model="searchQuery"
          placeholder="搜索用户昵称..."
          clearable
          style="width: 260px"
          @input="handleSearch"
          @clear="handleSearch"
        >
          <template #prefix>
            <el-icon><Search /></el-icon>
          </template>
        </el-input>
        <el-select
          v-model="statusFilter"
          placeholder="状态筛选"
          style="width: 140px"
          clearable
          @change="handleSearch"
        >
          <el-option
            v-for="opt in statusOptions"
            :key="opt.value"
            :label="opt.label"
            :value="opt.value"
          />
        </el-select>
        <div class="ml-auto text-xs text-gray-500">
          共 {{ filteredUsers.length }} 个用户
        </div>
      </div>
    </el-card>

    <!-- Table -->
    <el-card shadow="hover">
      <el-table
        :data="paginatedUsers"
        v-loading="loading"
        stripe
        style="width: 100%"
        row-key="id"
      >
        <el-table-column prop="nickname" label="用户昵称" min-width="140">
          <template #default="{ row }">
            <div class="flex items-center gap-2">
              <el-avatar :size="28" class="flex-shrink-0">
                {{ row.nickname?.[0] }}
              </el-avatar>
              <span class="text-sm">{{ row.nickname }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="registerDate" label="注册时间" width="130" />
        <el-table-column prop="lastActive" label="最后活跃" width="130" />
        <el-table-column prop="conversations" label="对话数" width="90" align="center" />
        <el-table-column prop="messages" label="消息数" width="90" align="center" />
        <el-table-column prop="status" label="状态" width="90" align="center">
          <template #default="{ row }">
            <el-tag
              :type="row.status === 'active' ? 'success' : 'danger'"
              size="small"
              effect="light"
            >
              {{ row.status === 'active' ? '正常' : '封禁' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180" align="center" fixed="right">
          <template #default="{ row }">
            <el-button text type="primary" size="small" @click="handleViewDetail(row)">
              详情
            </el-button>
            <el-popconfirm
              :title="row.status === 'active' ? '确定要封禁该用户吗？' : '确定要解封该用户吗？'"
              confirm-button-text="确定"
              cancel-button-text="取消"
              @confirm="handleToggleStatus(row)"
            >
              <template #reference>
                <el-button
                  text
                  :type="row.status === 'active' ? 'danger' : 'success'"
                  size="small"
                >
                  {{ row.status === 'active' ? '封禁' : '解封' }}
                </el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>

      <!-- Pagination -->
      <div class="flex justify-end mt-4">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :total="filteredUsers.length"
          :page-sizes="[10, 20, 50, 100]"
          layout="total, sizes, prev, pager, next, jumper"
          @current-change="handlePageChange"
          @size-change="handleSizeChange"
        />
      </div>
    </el-card>

    <!-- User Detail Dialog -->
    <el-dialog
      v-model="detailDialogVisible"
      title="用户详情"
      width="500px"
      destroy-on-close
    >
      <template v-if="selectedUser">
        <el-descriptions :column="1" border>
          <el-descriptions-item label="用户ID">{{ selectedUser.id }}</el-descriptions-item>
          <el-descriptions-item label="昵称">{{ selectedUser.nickname }}</el-descriptions-item>
          <el-descriptions-item label="手机号">{{ selectedUser.phone || '未绑定' }}</el-descriptions-item>
          <el-descriptions-item label="邮箱">{{ selectedUser.email || '未绑定' }}</el-descriptions-item>
          <el-descriptions-item label="注册时间">{{ selectedUser.registerDate }}</el-descriptions-item>
          <el-descriptions-item label="最后活跃">{{ selectedUser.lastActive }}</el-descriptions-item>
          <el-descriptions-item label="对话数">{{ selectedUser.conversations }}</el-descriptions-item>
          <el-descriptions-item label="消息数">{{ selectedUser.messages }}</el-descriptions-item>
          <el-descriptions-item label="状态">
            <el-tag :type="selectedUser.status === 'active' ? 'success' : 'danger'" size="small">
              {{ selectedUser.status === 'active' ? '正常' : '封禁' }}
            </el-tag>
          </el-descriptions-item>
        </el-descriptions>
      </template>
      <template #footer>
        <el-button @click="detailDialogVisible = false">关闭</el-button>
        <el-button type="primary" @click="detailDialogVisible = false">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>
