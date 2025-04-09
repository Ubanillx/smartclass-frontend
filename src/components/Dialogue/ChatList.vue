<template>
  <van-cell-group inset class="chat-list">
    <div
      v-for="chat in chats"
      :key="chat.id"
      class="chat-item"
      @click="$emit('select', chat)"
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
defineEmits<{
  (e: 'select', chat: Chat): void;
}>();
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
