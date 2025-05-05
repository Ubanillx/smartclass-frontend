<template>
  <div class="message-list" ref="messageList">
    <div
      v-for="message in messages"
      :key="message.id"
      class="message-item-container"
    >
      <!-- 只有当AI消息有内容或用户消息时才显示消息项 -->
      <div
        v-if="
          message.type === 'user' ||
          (message.type === 'ai' && message.content.trim())
        "
        :class="['message-item', message.type]"
      >
        <!-- 好友消息头像在左侧 -->
        <div v-if="message.type === 'ai'" class="avatar left-avatar">
          <van-image :src="assistantAvatar" round width="40" height="40" />
        </div>

        <div class="message-content">
          <div v-if="message.type === 'ai'">{{ message.content }}</div>
          <div v-else>{{ message.content }}</div>
          
          <!-- 消息已读状态，仅在用户消息且已读状态已定义时显示 -->
          <div 
            v-if="message.type === 'user' && message.isRead !== undefined" 
            class="message-status"
          >
            <span v-if="message.isRead === 1" class="read-status">已读</span>
            <span v-else class="unread-status">未读</span>
          </div>
        </div>

        <!-- 用户消息头像在右侧 -->
        <div v-if="message.type === 'user'" class="avatar right-avatar">
          <van-image :src="userAvatar" round width="40" height="40" />
        </div>
      </div>
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
  isRead?: number; // 添加已读状态属性
}

// 定义props
const props = defineProps<{
  messages: Message[];
  assistantAvatar: string;
  userAvatar: string;
  loading?: boolean;
}>();

const messageList = ref<HTMLElement | null>(null);

// 滚动到底部
const scrollToBottom = (): void => {
  if (messageList.value) {
    messageList.value.scrollTop = messageList.value.scrollHeight;
  }
};

// 监听消息变化，自动滚动到底部
watch(
  () => props.messages.length,
  () => {
    setTimeout(scrollToBottom, 100);
  },
);

// 监听加载状态变化
watch(
  () => props.loading,
  (newVal, oldVal) => {
    if (oldVal && !newVal) {
      // 从加载状态切换到非加载状态时，滚动到底部
      setTimeout(scrollToBottom, 100);
    }
  }
);

// 组件挂载和更新后滚动到底部
onMounted(scrollToBottom);
onUpdated(scrollToBottom);
</script>

<style scoped>
.message-list {
  flex: 1;
  padding: 16px 10px;
  padding-bottom: 60px;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
}

.message-item-container {
  margin-bottom: 28px;
  position: relative;
}

.message-item {
  display: flex;
  flex-direction: row;
  width: 100%;
  align-items: flex-start;
}

.message-item.user {
  justify-content: flex-end;
}

.message-item.ai {
  justify-content: flex-start;
}

.avatar {
  flex-shrink: 0;
  margin: 0 10px;
}

.left-avatar {
  margin-right: 6px;
}

.right-avatar {
  margin-left: 6px;
}

.message-content {
  padding: 10px 14px;
  border-radius: 12px;
  max-width: 70%;
  min-width: 10px;
  word-break: break-word;
  line-height: 1.5;
  font-size: 15px;
  position: relative;
}

.message-item.user .message-content {
  background-color: #1989fa;
  color: white;
  margin-right: 6px;
  border-top-right-radius: 4px;
}

.message-item.ai .message-content {
  background-color: #f2f2f2;
  color: #333;
  margin-left: 6px;
  border-top-left-radius: 4px;
}

/* 消息状态样式 */
.message-status {
  display: flex;
  justify-content: flex-end;
  font-size: 12px;
  margin-top: 4px;
  text-align: right;
  position: absolute;
  right: 0;
  bottom: -22px;
}

.read-status {
  color: #8c8c8c;
}

.unread-status {
  color: #969799;
}

/* Loading 样式 */
.typing-indicator {
  padding: 10px 14px;
  background-color: #f2f2f2;
  border-radius: 12px;
  max-width: 70%;
  display: flex;
  align-items: center;
  margin-left: 56px;
}

.typing-dot {
  width: 8px;
  height: 8px;
  background-color: #999;
  border-radius: 50%;
  margin: 0 3px;
  animation: typing-animation 1.5s infinite ease-in-out;
}

.typing-dot:nth-child(1) {
  animation-delay: 0s;
}

.typing-dot:nth-child(2) {
  animation-delay: 0.3s;
}

.typing-dot:nth-child(3) {
  animation-delay: 0.6s;
}

@keyframes typing-animation {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-5px);
  }
}
</style> 