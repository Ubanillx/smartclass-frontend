<template>
  <van-cell-group inset class="chat-list">
    <div 
      v-for="chat in chats" 
      :key="chat.id" 
      class="chat-item"
      @click="$emit('select', chat)"
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
</template>

<script setup lang="ts">
interface Chat {
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

// 定义props
const props = defineProps<{
  chats: Chat[];
}>();

// 定义事件
defineEmits<{
  (e: 'select', chat: Chat): void;
}>();
</script>

<style scoped>
.chat-list {
  margin: 16px;
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

.last-message {
  font-size: var(--font-size-base, 14px);
  color: #646566;
  margin-bottom: 4px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-family: 'Noto Sans SC', sans-serif;
}

.chat-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

.tag {
  font-size: var(--font-size-sm, 10px);
  color: #1989fa;
  background-color: #ecf5ff;
  padding: 2px 6px;
  border-radius: 4px;
  font-family: 'Noto Sans SC', sans-serif;
}

:deep(.van-cell-group__title) {
  font-weight: 700 !important;
  font-family: 'Noto Sans SC', sans-serif !important;
  font-size: var(--font-size-md, 16px) !important;
}
</style> 