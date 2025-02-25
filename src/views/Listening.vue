<template>
  <div class="listening">
    <!-- 搜索栏 -->
    <search-bar
      v-model="searchText"
      placeholder="搜索对话记录"
      @search="onSearch"
    />

    <!-- 对话记录列表 -->
    <van-cell-group inset class="chat-list">
      <div 
        v-for="chat in chatHistory" 
        :key="chat.id" 
        class="chat-item"
        @click="router.push(`/chat?assistantId=${chat.assistantId}`)"
      >
        <van-image
          :src="chat.avatar"
          round
          width="50"
          height="50"
        />
        <div class="chat-info">
          <div class="chat-header">
            <span class="assistant-name">{{ chat.assistantName }}</span>
            <span class="chat-time">{{ chat.lastTime }}</span>
          </div>
          <div class="last-message">{{ chat.lastMessage }}</div>
        </div>
      </div>
    </van-cell-group>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import SearchBar from '../components/SearchBar.vue';

const router = useRouter();
const searchText = ref('');

// Mock 对话历史数据
const chatHistory = ref([
  {
    id: 1,
    assistantId: 1,
    assistantName: '英语教师 Emma',
    avatar: 'https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg',
    lastMessage: '好的，让我们继续讨论这个语法点...',
    lastTime: '14:30'
  },
  {
    id: 2,
    assistantId: 2,
    assistantName: '口语伙伴 Mike',
    avatar: 'https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg',
    lastMessage: 'That\'s a great pronunciation! Keep practicing.',
    lastTime: '昨天'
  },
  {
    id: 3,
    assistantId: 3,
    assistantName: '写作助手 Sarah',
    avatar: 'https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg',
    lastMessage: '这篇文章的结构可以这样优化...',
    lastTime: '周一'
  }
]);

const onSearch = (text) => {
  console.log('搜索:', text);
  // 实现搜索逻辑
};
</script>

<style scoped>
.listening {
  padding: 16px;
  padding-bottom: 66px;
}

.chat-list {
  margin-top: 16px;
}

.chat-item {
  display: flex;
  padding: 16px;
  border-bottom: 1px solid #ebedf0;
  cursor: pointer;
}

.chat-item:last-child {
  border-bottom: none;
}

.chat-info {
  flex: 1;
  margin-left: 12px;
  overflow: hidden;
}

.chat-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4px;
}

.assistant-name {
  font-size: 16px;
  color: #323233;
}

.chat-time {
  font-size: 12px;
  color: #969799;
}

.last-message {
  font-size: 14px;
  color: #646566;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style> 