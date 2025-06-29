<template>
  <div class="message-read-status" :class="{ 'is-read': isRead }">
    <span v-if="isRead" class="read-text">已读</span>
    <span v-else class="unread-text">未读</span>
  </div>
</template>

<script setup lang="ts">
import { watch, onMounted } from 'vue';

const props = defineProps<{
  messageId: number;
  isRead: boolean;
}>();

// 当isRead属性变化时触发事件
watch(() => props.isRead, (newValue) => {
  console.log(`消息 ${props.messageId} 已读状态变更为: ${newValue ? '已读' : '未读'}`);
});

onMounted(() => {
  console.log(`消息 ${props.messageId} 当前状态: ${props.isRead ? '已读' : '未读'}`);
});
</script>

<style scoped>
.message-read-status {
  font-size: 12px;
  padding: 4px 0;
  color: #999;
  text-align: right;
}

.read-text {
  color: #07c160;
}

.unread-text {
  color: #969799;
}
</style> 