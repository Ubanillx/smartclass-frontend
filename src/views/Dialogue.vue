<template>
  <div class="dialogue has-tabbar">
    <!-- 顶部导航栏 -->
    <van-nav-bar title="对话" />

    <!-- 搜索栏 -->
    <div class="search-bar">
      <van-search
        v-model="searchText"
        placeholder="搜索对话记录"
        shape="round"
        background="#f7f8fa"
        :clearable="true"
        input-align="center"
        @search="onSearch"
      >
        <template #left-icon>
          <van-icon name="search" size="18" color="#1989fa"/>
        </template>
      </van-search>
    </div>

    <!-- AI助手分类 -->
    <div class="assistant-types">
      <div 
        v-for="type in assistantTypes" 
        :key="type.id"
        :class="['type-item', { active: activeType === type.id }]"
        @click="activeType = type.id"
      >
        {{ type.name }}
      </div>
    </div>

    <!-- 对话记录列表 -->
    <van-cell-group inset class="chat-list">
      <div 
        v-for="chat in filteredChatHistory" 
        :key="chat.id" 
        class="chat-item"
        @click="router.push(`/chat?assistantId=${chat.assistantId}`)"
      >
        <div class="chat-avatar">
          <van-image
            :src="chat.avatar"
            round
            width="50"
            height="50"
          />
          <div class="online-status" :class="{ online: chat.online }"></div>
        </div>
        <div class="chat-info">
          <div class="chat-header">
            <span class="assistant-name">{{ chat.assistantName }}</span>
            <span class="chat-time">{{ chat.lastTime }}</span>
          </div>
          <div class="last-message">{{ chat.lastMessage }}</div>
          <div class="chat-tags">
            <span v-for="tag in chat.tags" :key="tag" class="tag">{{ tag }}</span>
          </div>
        </div>
      </div>
    </van-cell-group>

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

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';

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
const chatHistory = ref([
  {
    id: 1,
    assistantId: 1,
    assistantName: '英语教师 Emma',
    avatar: 'https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg',
    lastMessage: '好的，让我们继续讨论这个语法点...',
    lastTime: '14:30',
    online: true,
    tags: ['语法', '初级']
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

// 根据搜索和分类过滤对话记录
const filteredChatHistory = computed(() => {
  return chatHistory.value.filter(chat => {
    const matchSearch = chat.assistantName.includes(searchText.value) ||
                       chat.lastMessage.includes(searchText.value);
    const matchType = activeType.value === 0 || chat.tags.includes(assistantTypes[activeType.value].name);
    return matchSearch && matchType;
  });
});

const onSearch = (text) => {
  console.log('搜索:', text);
  // 实现搜索逻辑
};
</script>

<style scoped>
.dialogue {
  padding: 16px;
  padding-bottom: 60px;
  background: #f7f8fa;
}

.search-bar {
  position: sticky;
  top: 46px; /* 导航栏高度 */
  z-index: 999;
  background: #f7f8fa;
  padding: 8px 16px;
  margin: -16px -16px 16px -16px;
}

.assistant-types {
  display: flex;
  gap: 12px;
  padding: 0 4px 16px;
  overflow-x: auto;
}

.type-item {
  padding: 6px 16px;
  border-radius: 16px;
  font-size: 14px;
  color: #646566;
  background: #fff;
  white-space: nowrap;
  cursor: pointer;
  transition: all 0.3s;
}

.type-item.active {
  color: #fff;
  background: #1989fa;
}

.chat-list {
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
}

.chat-item {
  display: flex;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid #ebedf0;
  cursor: pointer;
  transition: all 0.3s;
}

.chat-item:hover {
  background-color: #f7f8fa;
}

.chat-avatar {
  position: relative;
  margin-right: 12px;
}

.online-status {
  position: absolute;
  right: 0;
  bottom: 0;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: 2px solid #fff;
  background: #969799;
}

.online-status.online {
  background: #07c160;
}

.chat-info {
  flex: 1;
  min-width: 0;
}

.chat-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4px;
}

.assistant-name {
  font-size: 16px;
  font-weight: 500;
  color: #323233;
}

.chat-time {
  font-size: 12px;
  color: #969799;
}

.last-message {
  margin: 4px 0;
  font-size: 14px;
  color: #646566;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.chat-tags {
  display: flex;
  gap: 8px;
}

.tag {
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 12px;
  color: #1989fa;
  background: rgba(25, 137, 250, 0.1);
}

.new-chat-btn {
  position: fixed;
  right: 16px;
  bottom: 76px;
  width: auto;
  padding: 0 24px;
  height: 40px;
  box-shadow: 0 2px 8px rgba(25, 137, 250, 0.3);
}

:deep(.van-search__content) {
  background: #fff;
  border: none;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

:deep(.van-nav-bar) {
  background-color: transparent;
}

:deep(.van-nav-bar__title) {
  color: #323233;
  font-size: 16px;
  font-weight: 600;
}
</style> 