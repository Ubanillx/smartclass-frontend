<template>
  <div class="chat-detail">
    <!-- 头部导航 -->
    <chat-header :title="assistant.name" />

    <!-- 消息列表区域 -->
    <div class="message-container">
      <message-list
        :messages="messages"
        :assistant-avatar="assistant.avatar"
        :user-avatar="userInfo?.avatar || ''"
        :loading="isAITyping"
        :custom-format-message="formatMessage"
        @regenerate="handleRegenerateResponse"
      />
    </div>

    <!-- 停止响应按钮 -->
    <stop-response-button :show="isAITyping" @stop="stopStreamingResponse" />

    <!-- 底部输入框 -->
    <chat-input-area
      v-model="inputMessage"
      :is-loading="isAITyping"
      @send="sendMessage"
      @emoji="showEmojiPicker = true"
      @image="uploadImage"
      @voice="startVoiceRecord"
      @fullscreen="showFullscreenInput = true"
    />

    <!-- 表情选择器 -->
    <emoji-picker 
      v-model:show="showEmojiPicker" 
      @select="selectEmoji" 
    />

    <!-- 全屏输入框 -->
    <fullscreen-input
      v-model:show="showFullscreenInput"
      v-model="inputMessage"
      :is-loading="isAITyping"
      @send="sendFullscreenMessage"
      @emoji="showEmojiPicker = true"
      @image="uploadImage"
      @voice="startVoiceRecord"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { useRoute } from 'vue-router';
import { showToast } from 'vant';
import 'katex/dist/katex.min.css';
import { 
  MessageList, 
  ChatHeader, 
  EmojiPicker, 
  FullscreenInput, 
  StopResponseButton,
  ChatInputArea,
  useChatMessages 
} from '../../components/Dialogue';
import { useUserStore } from '../../stores/userStore';
import {
  AiAvatarControllerService,
  AiAvatarChatControllerService,
} from '../../services';
import type { UserInfo, Assistant, Message } from '../../components/Dialogue/ChatMessageHandler';

const route = useRoute();
const userStore = useUserStore();
const inputMessage = ref('');
const showEmojiPicker = ref(false);
const showFullscreenInput = ref(false);

// 用户信息
const userInfo = ref<UserInfo>({
  id: 0,
  name: '',
  avatar: '',
});

// 助手信息
const assistant = ref<Assistant>({
  id: Number(route.params.assistantId) || 0,
  name: '',
  avatar: '',
  description: '',
});

// 使用聊天消息处理逻辑
const {
  messages,
  isAITyping,
  sessionId,
  addWelcomeMessage,
  stopStreamingResponse,
  sendMessage,
  regenerateResponse,
  formatMessage
} = useChatMessages(assistant.value);

// 初始化会话
const initializeChat = async () => {
  try {
    // 创建新会话
    const aiAvatarId = Number(route.params.assistantId) || 1;
    const response =
      await AiAvatarChatControllerService.createSessionUsingPost(aiAvatarId);

    if (response.code === 0 && response.data) {
      sessionId.value = response.data;
    } else {
      showToast('创建会话失败');
    }
  } catch (error) {
    showToast('创建会话失败');
  }
};

// 获取AI分身信息
const loadAiAvatarInfo = async () => {
  try {
    const aiAvatarId = Number(route.params.assistantId) || 0;
    const response =
      await AiAvatarControllerService.getAiAvatarByIdUsingGet(aiAvatarId);

    if (response.code === 0 && response.data) {
      // 更新AI助手信息
      assistant.value = {
        id: response.data.id || aiAvatarId,
        name: response.data.name || '',
        avatar: response.data.avatarImgUrl || '',
        description: response.data.description || '',
        status: response.data.status,
      };

      // 如果已经有欢迎消息，更新它
      if (messages.value.length > 0 && messages.value[0]?.type === 'ai') {
        messages.value[0].content = `你好！我是${assistant.value.name}。${assistant.value.description ? assistant.value.description : '有什么我可以帮助你的吗？'}`;
      }
    }
  } catch (error) {
    // 处理错误情况
  }
};

// 加载历史消息
const loadChatHistory = async () => {
  if (!sessionId.value) return;

  try {
    const response =
      await AiAvatarChatControllerService.getChatHistoryUsingGet(
        sessionId.value,
      );

    if (response.code === 0 && response.data) {
      // 转换消息格式并显示历史消息
      messages.value = response.data.map((msg: any) => ({
        id: msg.id || Date.now(),
        type: msg.messageType === 'user' ? 'user' : 'ai',
        content: msg.content || '',
        timestamp: msg.createTime
          ? new Date(msg.createTime).getTime()
          : Date.now(),
      }));
    } else {
      // 显示欢迎消息
      addWelcomeMessage();
    }
  } catch (error) {
    // 错误处理时显示欢迎消息
    addWelcomeMessage();
  }
};

// 发送全屏输入框消息
const sendFullscreenMessage = () => {
  if (inputMessage.value.trim()) {
    sendMessage(inputMessage.value);
    showFullscreenInput.value = false;
  }
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

// 处理重新生成响应
const handleRegenerateResponse = (messageId: number) => {
  regenerateResponse(messageId);
};

// 初始化
onMounted(async () => {
  // 如果用户信息不存在，尝试获取
  if (!userStore.userInfo) {
    await userStore.fetchCurrentUser();
  }

  // 更新用户信息
  if (userStore.userInfo) {
    userInfo.value = {
      id: userStore.userInfo.id || 0,
      name: userStore.userInfo.userName || '',
      avatar: userStore.userInfo.userAvatar || userStore.DEFAULT_USER_AVATAR,
    };
  }

  // 获取路由中的会话ID参数
  const routeSessionId = route.query.sessionId as string;

  // 加载AI分身信息
  await loadAiAvatarInfo();

  if (routeSessionId) {
    // 如果URL中有sessionId参数，说明是从历史对话列表进入
    sessionId.value = routeSessionId;
    // 加载历史消息
    await loadChatHistory();
  } else {
    // 如果没有sessionId参数，创建新会话并显示欢迎消息
    await initializeChat();
    addWelcomeMessage();
  }
});

// 组件销毁前停止所有请求
onBeforeUnmount(() => {
  if (sessionId.value) {
    stopStreamingResponse();
  }
});
</script>

<style scoped>
.chat-detail {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: #f7f8fa;
  overflow: hidden;
  position: relative;
}

.message-container {
  flex: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  margin-top: 52px;
  margin-bottom: 120px;
  padding: 0;
  width: 100%;
  box-sizing: border-box;
}

/* 确保消息列表占据整个容器 */
:deep(.message-list) {
  flex: 1;
  padding: 8px 10px;
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
  overflow-y: auto;
}

/* 调整AI消息样式 */
:deep(.message-item.ai) {
  width: 100%;
  margin-right: 0;
}

:deep(.message-item.ai .message-content) {
  background-color: #ffffff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  padding: 10px 12px;
  max-width: 90%;
  width: auto;
  margin-left: 6px;
  box-sizing: border-box;
}
</style>
