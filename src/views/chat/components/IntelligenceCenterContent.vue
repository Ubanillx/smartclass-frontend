<template>
  <div class="intelligence-center-content">
    <!-- 智能助手列表 -->
    <chat-list 
      :chats="filteredAssistants"
      @select="handleAssistantSelect"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, defineProps, defineEmits } from 'vue';
import { ChatList } from '../../../components/Dialogue';

interface Assistant {
  id: number;
  assistantId: number;
  assistantName: string;
  avatar: string;
  lastMessage: string;
  summary?: string;
  lastTime: string;
  online?: boolean;
  tags?: string[];
  type: number;
}

const props = defineProps<{
  searchText: string;
}>();

const emit = defineEmits<{
  (e: 'select', assistantId: number): void;
}>();

// 智能助手数据
const assistants = ref<Assistant[]>([
  {
    id: 1,
    assistantId: 1,
    assistantName: '英语教师 Emma',
    avatar: 'https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg',
    lastMessage: '',
    summary: '专业英语教学，语法讲解，口语指导',
    lastTime: '在线',
    online: true,
    tags: ['语法', '口语', '教学'],
    type: 1
  },
  {
    id: 2,
    assistantId: 2,
    assistantName: '口语伙伴 Mike',
    avatar: 'https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg',
    lastMessage: '',
    summary: '日常英语对话，地道表达，场景练习',
    lastTime: '在线',
    online: true,
    tags: ['口语', '日常对话', '场景练习'],
    type: 2
  },
  {
    id: 3,
    assistantId: 3,
    assistantName: '写作助手 Sarah',
    avatar: 'https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg',
    lastMessage: '',
    summary: '作文指导，文章润色，写作技巧',
    lastTime: '在线',
    online: true,
    tags: ['写作', '润色', '技巧'],
    type: 3
  },
  {
    id: 4,
    assistantId: 4,
    assistantName: '考试辅导员 Jack',
    avatar: 'https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg',
    lastMessage: '',
    summary: '考试技巧，备考指导，模拟测试',
    lastTime: '在线',
    online: true,
    tags: ['考试', '备考', '技巧'],
    type: 4
  },
  {
    id: 5,
    assistantId: 5,
    assistantName: '商务英语专家 Lisa',
    avatar: 'https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg',
    lastMessage: '',
    summary: '商务邮件，会议对话，职场英语',
    lastTime: '在线',
    online: true,
    tags: ['商务', '职场', '邮件'],
    type: 5
  }
]);

// 根据搜索文本过滤智能助手
const filteredAssistants = computed(() => {
  let result = assistants.value;
  
  // 按搜索文本过滤
  if (props.searchText) {
    const keyword = props.searchText.toLowerCase();
    result = result.filter(assistant => 
      assistant.assistantName.toLowerCase().includes(keyword) || 
      assistant.summary?.toLowerCase().includes(keyword) ||
      assistant.tags?.some(tag => tag.toLowerCase().includes(keyword))
    );
  }
  
  return result;
});

// 处理助手选择
const handleAssistantSelect = (assistant: Assistant) => {
  emit('select', assistant.assistantId);
};
</script>

<style scoped>
.intelligence-center-content {
  width: 100%;
}
</style> 