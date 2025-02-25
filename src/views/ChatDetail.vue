<template>
  <div class="chat-detail">
    <!-- 顶部导航栏 -->
    <van-nav-bar
      :title="assistant.name"
      left-arrow
      @click-left="router.back()"
    />

    <!-- 消息列表区域 -->
    <div class="message-list" ref="messageList">
      <div 
        v-for="message in messages" 
        :key="message.id"
        :class="['message-item', message.type]"
      >
        <div class="avatar">
          <van-image
            :src="message.type === 'ai' ? assistant.avatar : userInfo.avatar"
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

    <!-- 底部输入框 -->
    <div class="input-area">
      <van-field
        v-model="inputMessage"
        placeholder="输入消息..."
        :border="false"
        type="textarea"
        autosize
        :disabled="loading"
        @keypress.enter.prevent="handleEnterPress"
      >
        <template #button>
          <van-button 
            size="normal" 
            type="primary" 
            :disabled="!inputMessage.trim() || loading"
            @click="sendMessage"
          >
            发送
          </van-button>
        </template>
      </van-field>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { marked } from 'marked';
import DOMPurify from 'dompurify';
import { showToast } from 'vant';

const route = useRoute();
const router = useRouter();
const messageList = ref(null);
const inputMessage = ref('');
const loading = ref(false);

// Mock 数据
const assistant = ref({
  id: route.query.assistantId,
  name: '英语教师 Emma',
  avatar: 'https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg'
});

const userInfo = ref({
  avatar: 'https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg'
});

const messages = ref([
  {
    id: 1,
    type: 'ai',
    content: '你好！我是你的英语老师Emma。让我们开始今天的学习吧！\n\n以下是我们今天的重点：\n- 语法讲解\n- 口语练习\n- 听力训练',
    timestamp: Date.now() - 60000
  },
  {
    id: 2,
    type: 'user',
    content: '好的，我们开始吧！',
    timestamp: Date.now()
  }
]);

// 格式化时间
const formatTime = (timestamp) => {
  const date = new Date(timestamp);
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
};

// 格式化消息内容（Markdown to HTML）
const formatMessage = (content) => {
  const html = marked(content);
  return DOMPurify.sanitize(html);
};

// 处理回车键按下
const handleEnterPress = (e) => {
  if (e.shiftKey) {
    return; // Shift + Enter 换行
  }
  sendMessage();
};

// 发送消息
const sendMessage = async () => {
  if (!inputMessage.value.trim() || loading.value) return;

  loading.value = true;
  // 添加用户消息
  messages.value.push({
    id: Date.now(),
    type: 'user',
    content: inputMessage.value,
    timestamp: Date.now()
  });

  // 清空输入框
  inputMessage.value = '';

  // 滚动到底部
  await nextTick();
  scrollToBottom();

  // 模拟AI回复
  try {
    setTimeout(() => {
      messages.value.push({
        id: Date.now() + 1,
        type: 'ai',
        content: '这是一个示例回复，支持 Markdown 格式：\n\n## 重点内容\n1. 第一点\n2. 第二点\n\n```javascript\nconsole.log("Hello!");\n```',
        timestamp: Date.now()
      });
      loading.value = false;
      scrollToBottom();
    }, 1000);
  } catch (error) {
    showToast('发送消息失败，请重试');
    loading.value = false;
  }
};

// 滚动到底部
const scrollToBottom = () => {
  if (messageList.value) {
    messageList.value.scrollTop = messageList.value.scrollHeight;
  }
};

// 监听消息变化，自动滚动到底部
watch(messages, () => {
  nextTick(() => {
    scrollToBottom();
  });
});

onMounted(() => {
  scrollToBottom();
});
</script>

<style scoped>
.chat-detail {
  height: calc(100vh - 50px);
  display: flex;
  flex-direction: column;
  background: #f7f8fa;
  padding-bottom: 60px;
}

.message-list {
  flex: 1;
  overflow-y: auto;
}

.message-item {
  display: flex;
  margin-bottom: 16px;
}

.message-item.user {
  flex-direction: row-reverse;
}

.avatar {
  margin: 0 12px;
}

.message-content {
  max-width: 70%;
  padding: 12px;
  border-radius: 8px;
  background: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.user .message-content {
  background: #1989fa;
  color: #fff;
}

.input-area {
  padding: 8px 16px;
  background: #fff;
  border-top: 1px solid #ebedf0;
}

:deep(.van-field__button) {
  margin-left: 8px;
}

/* Markdown 样式 */
.markdown-body {
  font-size: 14px;
  line-height: 1.6;
}

.markdown-body h1,
.markdown-body h2,
.markdown-body h3 {
  margin: 8px 0;
  font-size: 16px;
}

.markdown-body ul,
.markdown-body ol {
  padding-left: 20px;
  margin: 8px 0;
}

.markdown-body code {
  background: #f5f5f5;
  padding: 2px 4px;
  border-radius: 4px;
}

.markdown-body pre {
  background: #f5f5f5;
  padding: 12px;
  border-radius: 4px;
  overflow-x: auto;
}

.message-time {
  font-size: 12px;
  color: #969799;
  margin-top: 4px;
  text-align: right;
}

.loading-indicator {
  display: flex;
  justify-content: center;
  padding: 16px 0;
}

.message-item.user .message-content {
  background: #1989fa;
  color: #fff;
}

.message-item.user .message-time {
  color: rgba(255, 255, 255, 0.8);
}

:deep(.markdown-body) {
  font-size: 14px;
  line-height: 1.6;
}

:deep(.markdown-body pre) {
  background: #f7f8fa;
  padding: 12px;
  border-radius: 4px;
  overflow-x: auto;
}

:deep(.van-field__control) {
  min-height: 20px;
  max-height: 100px;
  padding: 8px 0;
}
</style> 