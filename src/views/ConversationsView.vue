<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { adminApi } from '../api/admin'

interface Conversation {
  id: string
  userId: string
  userName: string
  characterId: string
  characterName: string
  messageCount: number
  lastMessage: string
  lastMessageTime: string
  createdAt: string
}

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  time: string
}

const loading = ref(false)
const searchQuery = ref('')
const currentPage = ref(1)
const pageSize = ref(20)
const total = ref(0)
const conversations = ref<Conversation[]>([])
const drawerVisible = ref(false)
const selectedConversation = ref<Conversation | null>(null)
const messagesLoading = ref(false)
const messages = ref<Message[]>([])

const filteredConversations = computed(() => {
  if (!searchQuery.value) return conversations.value
  const q = searchQuery.value.toLowerCase()
  return conversations.value.filter(
    c => c.userName.toLowerCase().includes(q) || c.characterName.toLowerCase().includes(q)
  )
})

const fetchConversations = async () => {
  loading.value = true
  try {
    const res = await adminApi.getConversations({
      page: currentPage.value,
      pageSize: pageSize.value,
      search: searchQuery.value,
    }) as any
    if (res?.data) {
      conversations.value = res.data
      total.value = res.total ?? res.data.length
    }
  } catch {
    // Mock data
    conversations.value = [
      { id: 'conv_001', userId: 'u1', userName: '张三', characterId: 'c1', characterName: '阿甘', messageCount: 32, lastMessage: '生活就像一盒巧克力...', lastMessageTime: '5 分钟前', createdAt: '2025-05-25 14:30' },
      { id: 'conv_002', userId: 'u2', userName: '李四', characterId: 'c2', characterName: '杰克船长', messageCount: 18, lastMessage: '嘿，你这个小麻雀...', lastMessageTime: '20 分钟前', createdAt: '2025-05-25 10:15' },
      { id: 'conv_003', userId: 'u3', userName: '王五', characterId: 'c3', characterName: '尤达大师', messageCount: 45, lastMessage: '做，或者不做，没有试试看...', lastMessageTime: '1 小时前', createdAt: '2025-05-24 16:00' },
      { id: 'conv_004', userId: 'u1', userName: '张三', characterId: 'c4', characterName: '钢铁侠', messageCount: 12, lastMessage: '我是钢铁侠', lastMessageTime: '2 小时前', createdAt: '2025-05-24 09:30' },
      { id: 'conv_005', userId: 'u4', userName: '赵六', characterId: 'c5', characterName: '赫敏', messageCount: 27, lastMessage: '这是基础魔法...', lastMessageTime: '3 小时前', createdAt: '2025-05-23 20:00' },
    ]
    total.value = conversations.value.length
  } finally {
    loading.value = false
  }
}

const handleSearch = () => {
  currentPage.value = 1
}

const handleRowClick = (row: Conversation) => {
  selectedConversation.value = row
  drawerVisible.value = true
  loadMessages(row.id)
}

const loadMessages = async (conversationId: string) => {
  messagesLoading.value = true
  // Mock messages
  setTimeout(() => {
    messages.value = [
      { id: 'm1', role: 'user', content: '你好，阿甘！', time: '14:30' },
      { id: 'm2', role: 'assistant', content: '你好！我妈妈总是说，人生就像一盒巧克力，你永远不知道下一颗是什么味道。', time: '14:30' },
      { id: 'm3', role: 'user', content: '说得好，你今天做了什么？', time: '14:31' },
      { id: 'm4', role: 'assistant', content: '我今天跑了很远很远，就像我以前横穿美国那样。跑的时候什么都不用想，感觉特别好。', time: '14:31' },
      { id: 'm5', role: 'user', content: '你跑步的时候会想什么？', time: '14:32' },
      { id: 'm6', role: 'assistant', content: '我不太会想事情。我妈妈说，做傻事的人才是傻瓜。我觉得跑步的时候不用想太多，跑就对了。', time: '14:32' },
    ]
    messagesLoading.value = false
  }, 300)
}

const handlePageChange = (page: number) => {
  currentPage.value = page
  fetchConversations()
}

const handleSizeChange = (size: number) => {
  pageSize.value = size
  currentPage.value = 1
  fetchConversations()
}

onMounted(() => {
  fetchConversations()
})
</script>

<template>
  <div class="conversations-view">
    <!-- Toolbar -->
    <el-card shadow="hover" class="mb-4">
      <div class="flex items-center gap-3">
        <el-input
          v-model="searchQuery"
          placeholder="搜索用户或角色名称..."
          clearable
          style="width: 300px"
          @input="handleSearch"
          @clear="handleSearch"
        >
          <template #prefix>
            <el-icon><Search /></el-icon>
          </template>
        </el-input>
        <div class="ml-auto text-xs text-gray-500">
          共 {{ filteredConversations.length }} 条对话
        </div>
      </div>
    </el-card>

    <!-- Table -->
    <el-card shadow="hover">
      <el-table
        :data="filteredConversations.slice((currentPage - 1) * pageSize, currentPage * pageSize)"
        v-loading="loading"
        stripe
        style="width: 100%"
        row-key="id"
        highlight-current-row
        @row-click="handleRowClick"
      >
        <el-table-column prop="userName" label="用户" min-width="100">
          <template #default="{ row }">
            <div class="flex items-center gap-2">
              <el-avatar :size="24">{{ row.userName[0] }}</el-avatar>
              <span class="text-sm">{{ row.userName }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="characterName" label="角色" width="120">
          <template #default="{ row }">
            <el-tag type="primary" size="small" effect="plain">{{ row.characterName }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="messageCount" label="消息数" width="90" align="center">
          <template #default="{ row }">
            <el-badge :value="row.messageCount" :max="99" type="primary" />
          </template>
        </el-table-column>
        <el-table-column prop="lastMessage" label="最后消息" min-width="200" show-overflow-tooltip />
        <el-table-column prop="lastMessageTime" label="最后消息时间" width="120" />
        <el-table-column prop="createdAt" label="创建时间" width="160" />
      </el-table>

      <!-- Pagination -->
      <div class="flex justify-end mt-4">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :total="filteredConversations.length"
          :page-sizes="[10, 20, 50, 100]"
          layout="total, sizes, prev, pager, next, jumper"
          @current-change="handlePageChange"
          @size-change="handleSizeChange"
        />
      </div>
    </el-card>

    <!-- Detail Drawer -->
    <el-drawer
      v-model="drawerVisible"
      :title="selectedConversation ? `${selectedConversation.userName} × ${selectedConversation.characterName}` : '对话详情'"
      size="420px"
      direction="rtl"
    >
      <template v-if="selectedConversation">
        <el-descriptions :column="1" size="small" border class="mb-4">
          <el-descriptions-item label="对话ID">{{ selectedConversation.id }}</el-descriptions-item>
          <el-descriptions-item label="用户">{{ selectedConversation.userName }}</el-descriptions-item>
          <el-descriptions-item label="角色">{{ selectedConversation.characterName }}</el-descriptions-item>
          <el-descriptions-item label="消息总数">{{ selectedConversation.messageCount }}</el-descriptions-item>
          <el-descriptions-item label="创建时间">{{ selectedConversation.createdAt }}</el-descriptions-item>
        </el-descriptions>

        <el-divider content-position="left">对话记录</el-divider>

        <div v-loading="messagesLoading" class="space-y-3 max-h-[500px] overflow-y-auto pr-1">
          <div
            v-for="msg in messages"
            :key="msg.id"
            :class="['flex', msg.role === 'user' ? 'justify-end' : 'justify-start']"
          >
            <div
              :class="[
                'max-w-[80%] rounded-lg px-3 py-2 text-sm',
                msg.role === 'user'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
              ]"
            >
              <div>{{ msg.content }}</div>
              <div
                :class="[
                  'text-xs mt-1',
                  msg.role === 'user' ? 'text-blue-100' : 'text-gray-400'
                ]"
              >
                {{ msg.time }}
              </div>
            </div>
          </div>
          <el-empty v-if="!messagesLoading && messages.length === 0" description="暂无消息记录" :image-size="60" />
        </div>
      </template>
    </el-drawer>
  </div>
</template>
