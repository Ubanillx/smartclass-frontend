<template>
  <van-cell-group inset class="chat-list">
    <div
      v-for="chat in chats"
      :key="chat.id"
      class="chat-item"
      @click="$emit('select', chat)"
      @touchstart="startTouch(chat)"
      @touchend="endTouch"
      @touchmove="cancelTouch"
      @touchcancel="cancelTouch"
    >
      <div class="chat-avatar">
        <van-image :src="chat.avatar" round width="50" height="50" />
        <div v-if="showStatus" class="online-status" :class="{ online: chat.online }"></div>
      </div>
      <div class="chat-info">
        <div class="chat-header">
          <span class="assistant-name">{{ chat.assistantName }}</span>
          <span class="chat-time">{{ chat.lastTime }}</span>
        </div>
        <div v-if="chat.summary" class="chat-summary">{{ chat.summary }}</div>
        <div v-if="showStatus && chat.tags && chat.tags.length > 0" class="chat-tags">
          <span v-for="tag in chat.tags" :key="tag" class="tag">{{ tag }}</span>
        </div>
      </div>
    </div>
  </van-cell-group>
</template>

<script setup lang="ts">
import { ref } from 'vue';

interface Chat {
  id: number;
  sessionId?: string;
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

// 定义props并设置默认值
const props = withDefaults(defineProps<{
  chats: Chat[];
  showStatus?: boolean;
}>(), {
  showStatus: true
});

// 定义事件
const emit = defineEmits<{
  (e: 'select', chat: Chat): void;
  (e: 'long-press', chat: Chat): void;
}>();

// 长按处理相关变量
const touchTimeout = ref<number | null>(null);
const touchedChat = ref<Chat | null>(null);
const longPressDuration = 600; // 长按判定时间（毫秒）

// 触摸开始事件
const startTouch = (chat: Chat) => {
  touchedChat.value = chat;
  
  // 清除可能存在的旧定时器
  if (touchTimeout.value !== null) {
    clearTimeout(touchTimeout.value);
  }
  
  // 设置新的定时器
  touchTimeout.value = window.setTimeout(() => {
    if (touchedChat.value) {
      emit('long-press', touchedChat.value);
    }
    endTouch(); // 触发长按后清理状态
  }, longPressDuration);
};

// 触摸结束事件
const endTouch = () => {
  if (touchTimeout.value !== null) {
    clearTimeout(touchTimeout.value);
    touchTimeout.value = null;
  }
  touchedChat.value = null;
};

// 触摸移动或取消时取消长按
const cancelTouch = () => {
  endTouch();
};
</script>

<style scoped>
.chat-list {
  margin: 8px 0 16px;
  background-color: transparent;
}

.chat-item {
  display: flex;
  padding: 16px;
  margin-bottom: 8px;
  border-bottom: 1px solid rgba(235, 237, 240, 0.5);
  cursor: pointer;
  background-color: rgba(255, 255, 255, 0.7);
  border-radius: 12px;
  transition: all 0.3s ease;
  -webkit-tap-highlight-color: transparent; /* 避免移动端点击出现蓝色背景 */
  user-select: none; /* 防止选中文本 */
  touch-action: pan-y; /* 允许垂直滚动，但阻止其他默认行为 */
}

.chat-item:active {
  background-color: rgba(245, 245, 245, 0.9);
}

.chat-item:hover {
  background-color: rgba(255, 255, 255, 0.85);
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
}

.chat-item:last-child {
  border-bottom: none;
}

.chat-avatar {
  position: relative;
  margin-right: 12px;
}

.online-status {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: #969799;
  border: 2px solid #fff;
}

.online-status.online {
  background-color: #07c160;
}

.chat-info {
  flex: 1;
  overflow: hidden;
}

.chat-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 4px;
}

.assistant-name {
  font-size: var(--font-size-md, 16px);
  font-weight: 700;
  color: #323233;
  font-family: 'Noto Sans SC', sans-serif;
}

.chat-time {
  font-size: var(--font-size-sm, 12px);
  color: #969799;
  font-family: 'Noto Sans SC', sans-serif;
}

.chat-summary {
  font-size: var(--font-size-sm, 12px);
  color: #969799;
  margin-bottom: 4px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-family: 'Noto Sans SC', sans-serif;
  font-style: italic;
}

.chat-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

.tag {
  font-size: var(--font-size-sm, 10px);
  color: #1989fa;
  background-color: rgba(236, 245, 255, 0.8);
  padding: 2px 6px;
  border-radius: 4px;
  font-family: 'Noto Sans SC', sans-serif;
}

:deep(.van-cell-group) {
  background-color: transparent !important;
  box-shadow: none !important;
}

:deep(.van-cell-group__title) {
  font-weight: 700 !important;
  font-family: 'Noto Sans SC', sans-serif !important;
  font-size: var(--font-size-md, 16px) !important;
}
</style>
