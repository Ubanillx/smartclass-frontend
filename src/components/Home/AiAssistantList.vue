<template>
  <div>
    <!-- AI助手列表 -->
    <van-cell-group inset class="ai-assistant-module">
      <van-cell title="AI智慧体">
        <template #right-icon>
          <span class="more-link" @click="$emit('more')">更多</span>
        </template>
      </van-cell>
      
      <div class="assistant-list">
        <div 
          v-for="assistant in assistants" 
          :key="assistant.id" 
          class="assistant-item"
          @click="$emit('chat', assistant)"
        >
          <van-image
            :src="assistant.avatar"
            round
            width="50"
            height="50"
          />
          <div class="assistant-info">
            <div class="assistant-name">{{ assistant.name }}</div>
            <div class="assistant-desc">{{ assistant.description }}</div>
          </div>
          <van-icon name="chat-o" class="chat-icon" />
        </div>
      </div>
    </van-cell-group>
  </div>
</template>

<script setup lang="ts">
interface Assistant {
  id: number;
  name: string;
  description: string;
  avatar: string;
}

// 定义props
const props = defineProps<{
  assistants: Assistant[];
}>();

// 定义事件
defineEmits<{
  (e: 'chat', assistant: Assistant): void;
  (e: 'more'): void;
}>();
</script>

<style scoped>
.ai-assistant-module {
  margin-bottom: 16px;
  background: #fff;
}

.more-link {
  color: #1989fa;
  font-size: 14px;
}

.assistant-list {
  padding: 8px 16px;
}

.assistant-item {
  display: flex;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #ebedf0;
  cursor: pointer;
}

.assistant-item:last-child {
  border-bottom: none;
}

.assistant-info {
  flex: 1;
  margin-left: 12px;
}

.assistant-name {
  font-size: var(--font-size-md, 16px);
  color: #323233;
  margin-bottom: 4px;
  font-weight: 700;
  font-family: 'Noto Sans SC', sans-serif;
}

.assistant-desc {
  font-size: var(--font-size-base, 14px);
  color: #969799;
  font-family: 'Noto Sans SC', sans-serif;
}

.chat-icon {
  font-size: 20px;
  color: #1989fa;
}

:deep(.van-cell__title) {
  font-weight: 700 !important;
  font-family: 'Noto Sans SC', sans-serif !important;
  font-size: var(--font-size-md, 16px) !important;
}
</style> 