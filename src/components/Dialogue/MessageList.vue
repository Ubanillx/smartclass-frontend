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
          v-html="
            customFormatMessage
              ? customFormatMessage(message.content)
              : defaultFormatMessage(message.content)
          "
          class="markdown-body"
        ></div>
        <div v-else>{{ message.content }}</div>
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
  padding: 16px;
  padding-bottom: 30px;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
}

.message-item {
  display: flex;
  margin-bottom: 12px;
  align-items: flex-start;
}

.message-item.user {
  flex-direction: row-reverse;
}

.avatar {
  margin: 0 6px;
  flex-shrink: 0;
  align-self: flex-start;
  margin-top: 2px;
}

.message-content {
  max-width: 70%;
  padding: 8px 12px;
  border-radius: 8px;
  position: relative;
  min-height: 20px;
  min-width: 16px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  border: none;
  outline: none;
}

.message-item.user .message-content {
  background-color: #1989fa;
  color: #fff;
  text-align: left;
  position: relative;
  margin-right: 4px;
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
  position: relative;
  margin-left: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  border: none;
}

.message-item.ai .message-content::before {
  content: '';
  position: absolute;
  top: 12px;
  left: -8px;
  width: 0;
  height: 0;
  border-top: 6px solid transparent;
  border-right: 8px solid #ffffff;
  border-bottom: 6px solid transparent;
  z-index: 1;
}

.message-item.user .message-content::before {
  content: '';
  position: absolute;
  top: 12px;
  right: -8px;
  width: 0;
  height: 0;
  border-top: 6px solid transparent;
  border-left: 8px solid #1989fa;
  border-bottom: 6px solid transparent;
  z-index: 1;
}

/* Markdown样式 */
.markdown-body {
  font-size: 14px;
  line-height: 1.5;
  margin: 0;
  word-break: break-word;
}

.markdown-body p {
  margin: 4px 0;
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
  padding: 6px;
  border-radius: 4px;
  overflow-x: auto;
  margin: 6px 0;
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
