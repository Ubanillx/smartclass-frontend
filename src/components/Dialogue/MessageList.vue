<template>
  <div class="message-list" ref="messageList">
    <div
      v-for="message in messages"
      :key="message.id"
      class="message-item-container"
    >
      <!-- 只有当AI消息有内容或用户消息时才显示消息项 -->
      <div v-if="message.type === 'user' || (message.type === 'ai' && message.content.trim())" :class="['message-item', message.type]">
        <!-- AI消息头像在左侧 -->
        <div v-if="message.type === 'ai'" class="avatar left-avatar">
          <van-image
            :src="assistantAvatar"
            round
            width="40"
            height="40"
          />
        </div>
        
        <div class="message-content">
          <div
            v-if="message.type === 'ai'"
            v-html="
              customFormatMessage
                ? customFormatMessage(message.content)
                : defaultFormatMessage(message.content)
            "
            class="markdown-body"
          ></div>
          <div v-else>{{ message.content }}</div>
        </div>
        
        <!-- 用户消息头像在右侧 -->
        <div v-if="message.type === 'user'" class="avatar right-avatar">
          <van-image
            :src="userAvatar"
            round
            width="40"
            height="40"
          />
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
}

// 定义props
const props = defineProps<{
  messages: Message[];
  assistantAvatar: string;
  userAvatar: string;
  customFormatMessage?: (content: string) => string;
}>();

const messageList = ref<HTMLElement | null>(null);

// 默认的格式化消息内容方法
const defaultFormatMessage = (content: string): string => {
  // 默认不做任何处理，直接返回原始内容
  return content;
};

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

// 组件挂载和更新后滚动到底部
onMounted(scrollToBottom);
onUpdated(scrollToBottom);
</script>

<style scoped>
.message-list {
  flex: 1;
  padding: 16px 10px;
  padding-bottom: 30px;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
}

.message-item-container {
  margin-bottom: 20px;
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
  padding: 10px 12px;
  border-radius: 8px;
  min-height: 20px;
  min-width: 16px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  border: none;
  outline: none;
  width: auto;
  max-width: 75%;
}

.message-item.user .message-content {
  background-color: #1989fa;
  color: #fff;
  text-align: left;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border: none;
}

.message-item.user .message-content div {
  width: 100%;
  word-break: break-word;
  border: none;
  outline: none;
  line-height: 1.4;
}

.message-item.ai .message-content {
  background-color: #ffffff;
  color: #323233;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  border: none;
  width: auto;
}

/* 移除三角形样式 */

/* Markdown样式 */
.markdown-body {
  font-size: 14px;
  line-height: 1.5;
  margin: 0;
  word-break: break-word;
  width: 100%; /* 确保内容区域占满容器宽度 */
}

.markdown-body p {
  margin: 6px 0;
}

.markdown-body code {
  background-color: rgba(0, 0, 0, 0.05);
  padding: 2px 4px;
  border-radius: 4px;
  font-family: monospace;
  font-size: 13px;
  white-space: pre-wrap;
}

.markdown-body pre {
  background-color: rgba(0, 0, 0, 0.05);
  padding: 8px;
  border-radius: 4px;
  overflow-x: auto;
  margin: 8px 0;
  width: 100%; /* 确保代码块占满宽度 */
  box-sizing: border-box;
}

.markdown-body pre code {
  display: block;
  width: 100%;
}

.message-item.ai .message-content div:not(.markdown-body) {
  width: 100%;
  word-break: break-word;
  border: none;
  outline: none;
  line-height: 1.4;
}

/* LaTeX公式样式优化 */
:deep(.katex) {
  font-size: 1.15em;
  line-height: 1.5;
  font-family: KaTeX_Math, 'Times New Roman', Times, serif;
  white-space: normal; /* 允许公式自动换行 */
  text-align: center;
}

:deep(.katex-display) {
  display: block;
  margin: 0.5em 0;
  overflow: auto hidden;
  text-align: center;
}

:deep(.katex-display > .katex) {
  display: inline-block;
  text-align: center;
  max-width: 100%;
}

/* 确保公式在移动设备上也能正常显示 */
@media screen and (max-width: 600px) {
  :deep(.katex-display) {
    overflow-x: auto;
    overflow-y: hidden;
  }
  
  :deep(.katex) {
    font-size: 1.1em;
  }
}
</style>
