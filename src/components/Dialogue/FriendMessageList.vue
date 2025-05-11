<template>
  <div class="message-list" ref="messageList">
    <div
      v-for="message in messages"
      :key="message.id"
      class="message-item-container"
    >
      <!-- 只有当消息有内容时才显示消息项 -->
      <div
        v-if="message.content.trim()"
        :class="['message-item', message.type]"
      >
        <!-- 好友消息头像在左侧 -->
        <div v-if="message.type === 'ai'" class="avatar left-avatar">
          <van-image :src="assistantAvatar" round width="40" height="40" />
        </div>

        <div class="message-content">
          <div class="message-text">{{ message.content }}</div>
          
          <!-- 使用新的已读状态组件 -->
          <message-read-status
            v-if="message.type === 'user' && message.isRead !== undefined"
            :message-id="message.id"
            :is-read="message.isRead === 1"
            @update:is-read="(value) => updateMessageReadStatus(message.id, value ? 1 : 0)"
            class="message-read-status-wrapper"
          />

          <!-- 消息发送时间 -->
          <div class="message-time" :class="message.type">
            {{ formatMessageTime(message.timestamp) }}
          </div>
        </div>

        <!-- 用户消息头像在右侧 -->
        <div v-if="message.type === 'user'" class="avatar right-avatar">
          <van-image :src="userAvatar" round width="40" height="40" />
        </div>
      </div>
    </div>
    
    <!-- 加载指示器 -->
    <div v-if="loading" class="loading-container">
      <div class="typing-indicator">
        <span class="typing-dot"></span>
        <span class="typing-dot"></span>
        <span class="typing-dot"></span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUpdated, watch } from 'vue';
import MessageReadStatus from './MessageReadStatus.vue';

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

// 格式化消息时间
const formatMessageTime = (timestamp: number): string => {
  if (!timestamp) return '';
  
  const messageDate = new Date(timestamp);
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  
  // 今天的消息只显示时间
  if (messageDate >= today) {
    return messageDate.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
  }
  
  // 昨天的消息显示"昨天"和时间
  if (messageDate >= yesterday) {
    return `昨天 ${messageDate.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}`;
  }
  
  // 今年的消息显示月日和时间
  if (messageDate.getFullYear() === now.getFullYear()) {
    return messageDate.toLocaleDateString('zh-CN', { month: 'numeric', day: 'numeric' }) + 
           ' ' + 
           messageDate.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
  }
  
  // 往年的消息显示完整日期
  return messageDate.toLocaleDateString('zh-CN', { year: 'numeric', month: 'numeric', day: 'numeric' }) + 
         ' ' + 
         messageDate.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
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

// 添加updateMessageReadStatus函数
const emit = defineEmits<{
  (e: 'updateReadStatus', messageId: number, isRead: number): void;
}>();

// 更新消息已读状态
const updateMessageReadStatus = (messageId: number, isRead: number) => {
  emit('updateReadStatus', messageId, isRead);
};
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

.message-text {
  width: 100%;
}

.message-time {
  font-size: 11px;
  color: #a0a0a0;
  margin-top: 4px;
  position: absolute;
  bottom: -20px;
  width: calc(100% + 28px); /* 包含padding的宽度 */
}

.message-time.user {
  text-align: right;
  right: -14px; /* 对齐右侧padding */
}

.message-time.ai {
  text-align: left;
  left: -14px; /* 对齐左侧padding */
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

/* 调整消息状态样式 */
.message-read-status-wrapper {
  position: absolute;
  left: 0;
  bottom: -22px;
  z-index: 1;
  transition: all 0.3s ease;
}

/* 更新已读/未读状态样式 */
:deep(.read-text) {
  animation: fadeIn 0.5s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-5px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 移除旧的消息状态样式 */
.message-status {
  display: none;
}

/* Loading 样式 */
.loading-container {
  display: flex;
  justify-content: flex-start;
  margin-left: 56px;
  margin-top: 8px;
}

.typing-indicator {
  padding: 10px 14px;
  background-color: #f2f2f2;
  border-radius: 12px;
  display: flex;
  align-items: center;
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