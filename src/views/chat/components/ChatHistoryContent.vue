<template>
  <div class="chat-history-content">
    <!-- 对话记录列表 -->
    <chat-list 
      :chats="filteredChatHistory"
      @select="handleChatSelect"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, defineProps, defineEmits } from 'vue';
import { ChatList } from '../../../components/Dialogue';

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

const props = defineProps<{
  searchText: string;
}>();

const emit = defineEmits<{
  (e: 'select', chatId: number, assistantId: number): void;
}>();

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

// 根据搜索文本过滤对话历史
const filteredChatHistory = computed(() => {
  let result = chatHistory.value;
  
  // 按搜索文本过滤
  if (props.searchText) {
    const keyword = props.searchText.toLowerCase();
    result = result.filter(chat => 
      chat.assistantName.toLowerCase().includes(keyword) || 
      chat.lastMessage.toLowerCase().includes(keyword)
    );
  }
  
  return result;
});

// 处理对话选择
const handleChatSelect = (chat: ChatItem) => {
  emit('select', chat.id, chat.assistantId);
};
</script>

<style scoped>
.chat-history-content {
  width: 100%;
}
</style> 