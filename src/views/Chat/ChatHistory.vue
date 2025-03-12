<template>
  <div class="chat-history has-tabbar">

    <!-- 搜索栏 -->
    <search-bar
      v-model="searchText"
      placeholder="搜索对话记录"
      @search="onSearch"
    />

    <!-- AI助手分类 -->
    <assistant-type-selector 
      :types="assistantTypes" 
      v-model="activeType"
    />

    <!-- 对话记录列表 -->
    <chat-list 
      :chats="filteredChatHistory"
      @select="handleChatSelect"
    />

    <!-- 新建对话按钮 -->
    <van-button 
      class="new-chat-btn" 
      type="primary" 
      round 
      icon="plus"
      @click="router.push('/assistants')"
    >
      新建对话
    </van-button>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import SearchBar from '../../components/SearchBar.vue';
import { AssistantTypeSelector, ChatList } from '../../components/Dialogue';

interface ChatItem {
  id: number;
  assistantId: number;
  assistantName: string;
  avatar: string;
  lastMessage: string;
  lastTime: string;
  online?: boolean;
  tags?: string[];
  type: number;
}

const router = useRouter();
const searchText = ref('');
const activeType = ref(0);

// AI助手分类
const assistantTypes = [
  { id: 0, name: '全部' },
  { id: 1, name: '语法' },
  { id: 2, name: '口语' },
  { id: 3, name: '写作' }
];

// Mock 对话历史数据
const chatHistory = ref<ChatItem[]>([
  {
    id: 1,
    assistantId: 1,
    assistantName: '英语教师 Emma',
    avatar: 'https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg',
    lastMessage: '你好！我是你的英语老师Emma，有什么我可以帮助你的吗？',
    lastTime: '10:30',
    online: true,
    tags: ['语法', '口语'],
    type: 1
  },
  {
    id: 2,
    assistantId: 2,
    assistantName: '口语伙伴 Mike',
    avatar: 'https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg',
    lastMessage: '嗨！准备好今天的口语练习了吗？',
    lastTime: '昨天',
    online: false,
    tags: ['口语', '日常对话'],
    type: 2
  },
  {
    id: 3,
    assistantId: 3,
    assistantName: '写作助手 Sarah',
    avatar: 'https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg',
    lastMessage: '我已经帮你修改了这篇文章，你可以查看一下修改建议。',
    lastTime: '周一',
    online: true,
    tags: ['写作', '润色'],
    type: 3
  }
]);

// 根据搜索文本和选中的类型过滤对话历史
const filteredChatHistory = computed(() => {
  let result = chatHistory.value;
  
  // 按类型过滤
  if (activeType.value !== 0) {
    result = result.filter(chat => chat.type === activeType.value);
  }
  
  // 按搜索文本过滤
  if (searchText.value) {
    const keyword = searchText.value.toLowerCase();
    result = result.filter(chat => 
      chat.assistantName.toLowerCase().includes(keyword) || 
      chat.lastMessage.toLowerCase().includes(keyword)
    );
  }
  
  return result;
});

// 处理对话选择
const handleChatSelect = (chat: ChatItem) => {
  router.push(`/chat-detail?assistantId=${chat.assistantId}`);
};

// 搜索处理
const onSearch = (text: string) => {
  console.log('搜索:', text);
  // 实际应用中这里可能需要从服务器获取搜索结果
};
</script>

<style scoped>
.chat-history {
  padding: 16px;
  padding-bottom: 66px;
}

.search-bar {
  margin-bottom: 16px;
}

.new-chat-btn {
  position: fixed;
  bottom: 80px;
  right: 20px;
  width: auto;
  padding: 0 20px;
  height: 40px;
  z-index: 10;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.empty-state {
  margin-top: 100px;
}

:deep(.van-button__text) {
  font-weight: 700 !important;
  font-family: 'Noto Sans SC', sans-serif !important;
  font-size: var(--font-size-md, 14px) !important;
}
</style> 