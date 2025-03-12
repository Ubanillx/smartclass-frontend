<template>
  <div class="chat-detail">
    <!-- 返回按钮 -->
    <back-button :title="assistant.name" />

    <!-- 消息列表区域 -->
    <message-list
      :messages="messages"
      :assistant-avatar="assistant.avatar"
      :user-avatar="userInfo.avatar"
      :loading="loading"
    />

    <!-- 底部输入框 -->
    <chat-input
      v-model="inputMessage"
      :disabled="loading"
      @send="sendMessage"
      @emoji="showEmojiPicker = true"
      @image="uploadImage"
      @voice="startVoiceRecord"
    />

    <!-- 表情选择器 -->
    <van-popup
      v-model:show="showEmojiPicker"
      position="bottom"
      :style="{ height: '30%' }"
      round
    >
      <div class="emoji-picker">
        <div class="emoji-header">
          <span class="title">选择表情</span>
          <van-icon name="cross" @click="showEmojiPicker = false" />
        </div>
        <div class="emoji-grid">
          <span 
            v-for="emoji in emojiList" 
            :key="emoji"
            class="emoji-item"
            @click="selectEmoji(emoji)"
          >
            {{ emoji }}
          </span>
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { showToast } from 'vant';
import { MessageList, ChatInput } from '../../components/Dialogue';
import { BackButton } from '../../components/common';

interface UserInfo {
  id: number;
  name: string;
  avatar: string;
}

interface Assistant {
  id: number;
  name: string;
  avatar: string;
  description: string;
}

interface Message {
  id: number;
  type: 'user' | 'ai';
  content: string;
  timestamp: number;
}

const router = useRouter();
const route = useRoute();
const inputMessage = ref('');
const loading = ref(false);
const showEmojiPicker = ref(false);

// 表情列表
const emojiList = ['😀', '😃', '😄', '😁', '😆', '😅', '😂', '🤣', '😊', '😇', '🙂', '🙃', '😉', '😌', '😍', '🥰', '😘', '😗', '😙', '😚', '😋', '😛', '😝', '😜', '🤪', '🤨', '🧐', '🤓', '😎', '🤩', '🥳'];

// 用户信息
const userInfo = ref<UserInfo>({
  id: 1,
  name: '用户',
  avatar: 'https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg'
});

// 助手信息
const assistant = ref<Assistant>({
  id: Number(route.query.assistantId) || 1,
  name: '英语教师 Emma',
  avatar: 'https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg',
  description: '专业英语教学，语法讲解，口语指导'
});

// 消息列表
const messages = ref<Message[]>([
  {
    id: 1,
    type: 'ai',
    content: '你好！我是你的英语老师Emma。今天我们要学习什么呢？',
    timestamp: Date.now() - 3600000
  },
  {
    id: 2,
    type: 'user',
    content: '你好！我想学习一些日常英语对话。',
    timestamp: Date.now() - 3500000
  },
  {
    id: 3,
    type: 'ai',
    content: '太好了！日常对话是提高英语实用能力的好方法。我们可以从简单的问候开始，然后逐渐学习更复杂的对话场景。你有特别想学习的场景吗？比如餐厅点餐、购物或者旅游？',
    timestamp: Date.now() - 3400000
  }
]);

// 发送消息
const sendMessage = async (text: string) => {
  if (!text.trim()) return;
  
  // 添加用户消息
  const userMessage: Message = {
    id: messages.value.length + 1,
    type: 'user',
    content: text,
    timestamp: Date.now()
  };
  messages.value.push(userMessage);
  
  // 模拟AI回复
  loading.value = true;
  try {
    // 这里可以添加实际的API调用
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const aiMessage: Message = {
      id: messages.value.length + 1,
      type: 'ai',
      content: `这是对"${text}"的回复。在实际应用中，这里会是AI生成的回复内容。`,
      timestamp: Date.now()
    };
    messages.value.push(aiMessage);
  } catch (error) {
    showToast('发送失败，请重试');
    console.error('发送消息失败:', error);
  } finally {
    loading.value = false;
  }
};

// 格式化时间
const formatTime = (timestamp: number): string => {
  const date = new Date(timestamp);
  return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
};

// 格式化消息内容
const formatMessage = (content: string): string => {
  // 这里可以添加markdown解析等逻辑
  return content;
};

// 选择表情
const selectEmoji = (emoji: string): void => {
  inputMessage.value += emoji;
  showEmojiPicker.value = false;
};

// 上传图片
const uploadImage = (): void => {
  showToast('图片上传功能开发中');
};

// 开始语音录制
const startVoiceRecord = (): void => {
  showToast('语音录制功能开发中');
};
</script>

<style scoped>
.chat-detail {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: #f7f8fa;
}

.emoji-picker {
  padding: 16px;
}

.emoji-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.emoji-header .title {
  font-size: var(--font-size-md, 16px);
  font-weight: 700;
  font-family: 'Noto Sans SC', sans-serif;
}

.emoji-grid {
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  gap: 12px;
}

.emoji-item {
  font-size: 24px;
  text-align: center;
  cursor: pointer;
  user-select: none;
}
</style> 