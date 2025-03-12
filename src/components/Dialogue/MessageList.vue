<template>
  <div class="message-list" ref="messageList">
    <div 
      v-for="message in messages" 
      :key="message.id"
      :class="['message-item', message.type]"
    >
      <div class="avatar">
        <van-image
          :src="message.type === 'ai' ? assistantAvatar : userAvatar"
          round
          width="40"
          height="40"
        />
      </div>
      <div class="message-content">
        <div 
          v-if="message.type === 'ai'" 
          v-html="formatMessage(message.content)" 
          class="markdown-body"
        ></div>
        <div v-else>{{ message.content }}</div>
        <div class="message-time">{{ formatTime(message.timestamp) }}</div>
      </div>
    </div>
    <div v-if="loading" class="loading-indicator">
      <van-loading type="spinner" size="24px" vertical>正在思考...</van-loading>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUpdated, watch } from 'vue';

interface Message {
  id: number;
  type: 'ai' | 'user';
  content: string;
  timestamp: number;
}

// 定义props
const props = defineProps<{
  messages: Message[];
  assistantAvatar: string;
  userAvatar: string;
  loading?: boolean;
}>();

const messageList = ref<HTMLElement | null>(null);

// 格式化消息内容（可以处理markdown等格式）
const formatMessage = (content: string): string => {
  // 这里可以添加markdown解析等逻辑
  return content;
};

// 格式化时间
const formatTime = (timestamp: number): string => {
  const date = new Date(timestamp);
  return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
};

// 滚动到底部
const scrollToBottom = (): void => {
  if (messageList.value) {
    messageList.value.scrollTop = messageList.value.scrollHeight;
  }
};

// 监听消息变化，自动滚动到底部
watch(() => props.messages.length, () => {
  setTimeout(scrollToBottom, 100);
});

// 组件挂载和更新后滚动到底部
onMounted(scrollToBottom);
onUpdated(scrollToBottom);
</script>

<style scoped>
.message-list {
  flex: 1;
  padding: 16px;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
}

.message-item {
  display: flex;
  margin-bottom: 16px;
}

.message-item.user {
  flex-direction: row-reverse;
}

.avatar {
  margin: 0 8px;
  flex-shrink: 0;
}

.message-content {
  max-width: 70%;
  padding: 12px;
  border-radius: 8px;
  position: relative;
}

.message-item.ai .message-content {
  background-color: #f7f8fa;
  color: #323233;
}

.message-item.user .message-content {
  background-color: #1989fa;
  color: #fff;
  text-align: right;
}

.message-time {
  font-size: 12px;
  color: #969799;
  margin-top: 4px;
}

.message-item.user .message-time {
  color: #e1f0ff;
}

.loading-indicator {
  display: flex;
  justify-content: center;
  margin: 16px 0;
}

/* Markdown样式 */
.markdown-body {
  font-size: 14px;
  line-height: 1.6;
}

.markdown-body p {
  margin: 8px 0;
}

.markdown-body code {
  background-color: rgba(0, 0, 0, 0.05);
  padding: 2px 4px;
  border-radius: 4px;
  font-family: monospace;
}

.markdown-body pre {
  background-color: rgba(0, 0, 0, 0.05);
  padding: 8px;
  border-radius: 4px;
  overflow-x: auto;
}
</style> 