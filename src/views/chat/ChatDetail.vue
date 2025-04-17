<template>
  <div class="chat-detail">
    <!-- 返回按钮 -->
    <back-button :title="assistant.name" class="back-button" />

    <!-- 消息列表区域 -->
    <div class="message-container">
      <message-list
        :messages="messages"
        :assistant-avatar="assistant.avatar"
        :user-avatar="userInfo?.avatar || ''"
        :loading="isAITyping"
        :custom-format-message="formatMessage"
      />
    </div>

    <!-- 底部输入框 -->
    <div class="input-container">
      <chat-input
        v-model="inputMessage"
        :disabled="isAITyping"
        @send="sendMessage"
        @emoji="showEmojiPicker = true"
        @image="uploadImage"
        @voice="startVoiceRecord"
        @fullscreen="showFullscreenInput = true"
      />
    </div>

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

    <!-- 全屏输入框 -->
    <van-popup
      v-model:show="showFullscreenInput"
      position="bottom"
      :style="{ height: '80%' }"
      round
    >
      <div class="fullscreen-input">
        <div class="fullscreen-header">
          <span class="title">编辑消息</span>
          <van-icon name="cross" size="20" @click="showFullscreenInput = false" />
        </div>
        <div class="fullscreen-content">
          <div class="textarea-container">
            <textarea
              v-model="inputMessage"
              placeholder="输入消息..."
              class="custom-textarea"
              rows="12"
            ></textarea>
          </div>
        </div>
        <div class="fullscreen-footer">
          <div class="footer-left">
            <div class="action-icons">
              <van-icon name="smile-o" size="20" @click="showEmojiPicker = true" />
              <van-icon name="photograph" size="20" @click="uploadImage" />
              <van-icon name="records" size="20" @click="startVoiceRecord" />
            </div>
          </div>
          <van-button 
            size="mini" 
            type="primary" 
            :disabled="!inputMessage.trim()"
            @click="sendFullscreenMessage"
            class="send-button"
          >
            发送
          </van-button>
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { showToast } from 'vant';
import { marked } from 'marked';
import DOMPurify from 'dompurify';
import katex from 'katex';
import 'katex/dist/katex.min.css';
import { MessageList, ChatInput } from '../../components/Dialogue';
import { BackButton } from '../../components/Common';
import { useUserStore } from '../../stores/userStore';
import { AiAvatarControllerService, AiAvatarChatControllerService } from '../../services';
import { OpenAPI } from '../../services/core/OpenAPI';
import type { AiAvatarBriefVO } from '../../services/models/AiAvatarBriefVO';
import type { ChatMessageAddRequest } from '../../services/models/ChatMessageAddRequest';
import type { StopStreamingRequest } from '../../services/models/StopStreamingRequest';
import { fetchEventSource } from '@microsoft/fetch-event-source';

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
  status?: number;
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
const showEmojiPicker = ref(false);
const showFullscreenInput = ref(false);
const userStore = useUserStore();

// 配置marked选项
marked.setOptions({
  breaks: true, // 启用换行符
  gfm: true, // 启用GitHub风格的Markdown
});

// 表情列表
const emojiList = ref([
  '😀',
  '😄',
  '😁',
  '😆',
  '😅',
  '😂',
  '🤣',
  '😊',
  '😇',
  '🙂',
  '🙃',
  '😉',
  '😌',
  '😍',
  '🥰',
  '😘',
  '😋',
  '😝',
  '🤔',
  '🤫',
  '🤐',
  '🤨',
  '😐',
  '😑',
  '😶',
  '😏',
  '😒',
  '🙄',
  '😬',
  '🤥',
  '😔',
]);

// 用户信息
const userInfo = ref<UserInfo>({
  id: 1,
  name: '用户',
  avatar: userStore.DEFAULT_USER_AVATAR,
});

// 助手信息
const assistant = ref<Assistant>({
  id: Number(route.params.assistantId) || 1,
  name: 'AI助手',
  avatar: '/default.jpg',
  description: '智能AI助手，可回答各类问题',
});

// 消息列表
const messages = ref<Message[]>([]);

// 添加AI消息正在输入的状态
const isAITyping = ref<boolean>(false);
const currentAIMessageId = ref<number | null>(null);

// 会话ID
const sessionId = ref<string | undefined>(undefined);

// 保存当前的EventSource，以便在需要时关闭
let currentEventSource: EventSource | null = null;

// 保存当前的stream控制器，以便在需要时中断
let currentStreamController: AbortController | null = null;

// 更新AI消息内容的辅助函数
const updateAIMessage = (content: string) => {
  const messageIndex = messages.value.findIndex(
    (msg) => msg && msg.id === currentAIMessageId.value,
  );
  if (messageIndex !== -1 && messages.value[messageIndex]) {
    messages.value[messageIndex].content = content;
    
    // 自动滚动到底部
    const messagesContainer = document.querySelector('.message-list');
    if (messagesContainer instanceof HTMLElement) {
      setTimeout(() => {
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
      }, 0);
    }
  }
};

// 发送全屏输入框消息
const sendFullscreenMessage = () => {
  if (inputMessage.value.trim()) {
    sendMessage(inputMessage.value);
    showFullscreenInput.value = false;
  }
};

// 加载历史消息
const loadChatHistory = async () => {
  if (!sessionId.value) return;
  
  try {
    const response = await AiAvatarChatControllerService.getUserHistoryPageUsingGet(
      assistant.value.id,
      1,
      50
    );
    
    if (response.code === 0 && response.data) {
      // 不再替换现有消息，始终保持欢迎消息
    } else {
      // 处理失败情况
    }
  } catch (error) {
    // 处理错误情况
  }
};

// 初始化对话
const initializeChat = async () => {
  try {
    // 创建新会话
    const aiAvatarId = Number(route.params.assistantId) || 1;
    const response = await AiAvatarChatControllerService.createSessionUsingPost(aiAvatarId);
    
    if (response.code === 0 && response.data) {
      sessionId.value = response.data;
      // 不再加载历史消息，确保欢迎消息始终显示
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
    const aiAvatarId = Number(route.params.assistantId) || 1;
    const response = await AiAvatarControllerService.getAiAvatarByIdUsingGet(aiAvatarId);
    
    if (response.code === 0 && response.data) {
      // 更新AI助手信息
      assistant.value = {
        id: response.data.id || aiAvatarId,
        name: response.data.name || 'AI助手',
        avatar: response.data.avatarImgUrl || '/default.jpg',
        description: response.data.description || '智能AI助手，可回答各类问题',
        status: response.data.status,
      };
      
      // 如果已经有欢迎消息，更新它
      if (messages.value.length > 0 && messages.value[0]?.type === 'ai') {
        messages.value[0].content = `你好！我是${assistant.value.name}。${assistant.value.description}`;
      }
    }
  } catch (error) {
    // 处理错误情况
  }
};

// 初始化用户信息
onMounted(async () => {
  // 如果用户信息不存在，尝试获取
  if (!userStore.userInfo) {
    await userStore.fetchCurrentUser();
  }

  // 更新用户头像
  if (userStore.userInfo && userStore.userInfo.userAvatar) {
    userInfo.value.avatar = userStore.userInfo.userAvatar;
  } else {
    userInfo.value.avatar = userStore.DEFAULT_USER_AVATAR;
  }
  
  // 获取路由中的会话ID参数
  const routeSessionId = route.query.sessionId as string;
  
  // 加载AI分身信息
  await loadAiAvatarInfo();

  if (routeSessionId) {
    // 如果URL中有sessionId参数，说明是从历史对话列表进入
    sessionId.value = routeSessionId;
    
    // 获取历史消息
    try {
      const response = await AiAvatarChatControllerService.getChatHistoryUsingGet(sessionId.value);
      
      if (response.code === 0 && response.data) {
        // 转换消息格式并显示历史消息
        messages.value = response.data.map((msg: any) => ({
          id: msg.id || Date.now(),
          type: msg.messageType === 'user' ? 'user' : 'ai',
          content: msg.content || '',
          timestamp: msg.createTime ? new Date(msg.createTime).getTime() : Date.now(),
        }));
      } else {
        // 显示欢迎消息作为后备
        const welcomeMessage: Message = {
          id: Date.now(),
          type: 'ai',
          content: `你好！我是${assistant.value.name}。${assistant.value.description || '有什么我可以帮助你的吗？'}`,
          timestamp: Date.now(),
        };
        messages.value = [welcomeMessage];
      }
    } catch (error) {
      // 显示欢迎消息作为后备
      const welcomeMessage: Message = {
        id: Date.now(),
        type: 'ai',
        content: `你好！我是${assistant.value.name}。${assistant.value.description || '有什么我可以帮助你的吗？'}`,
        timestamp: Date.now(),
      };
      messages.value = [welcomeMessage];
    }
  } else {
    // 如果没有sessionId参数，说明是新建对话
    
    // 立即显示欢迎消息，不等待任何网络请求
    const welcomeMessage: Message = {
      id: Date.now(),
      type: 'ai',
      content: `你好！我是${assistant.value.name}。${assistant.value.description || '有什么我可以帮助你的吗？'}`,
      timestamp: Date.now(),
    };
    messages.value = [welcomeMessage];
    
    // 创建新会话
    initializeChat();
  }
});

// 停止流式响应
const stopStreamingResponse = async () => {
  // 中断当前的SSE连接
  if (currentStreamController) {
    currentStreamController.abort();
    currentStreamController = null;
  }
  
  // 关闭现有的EventSource连接
  if (currentEventSource) {
    currentEventSource.close();
    currentEventSource = null;
  }
  
  if (sessionId.value) {
    try {
      // 调用API停止流式响应
      const stopRequest: StopStreamingRequest = {
        aiAvatarId: assistant.value.id
      };
      await AiAvatarChatControllerService.stopStreamingResponseUsingPost(stopRequest);
    } catch (error) {
      isAITyping.value = false;
      currentAIMessageId.value = null;
    } finally {
      isAITyping.value = false;
      currentAIMessageId.value = null;
    }
  } else {
    isAITyping.value = false;
    currentAIMessageId.value = null;
  }
};

// 发送消息
const sendMessage = async (text: string) => {
  if (!text.trim() || isAITyping.value) return;

  // 如果有正在进行的请求，先停止
  if (currentEventSource || currentStreamController) {
    await stopStreamingResponse();
  }

  // 添加用户消息
  const userMessage: Message = {
    id: Date.now(),
    type: 'user',
    content: text,
    timestamp: Date.now(),
  };
  messages.value.push(userMessage);

  // 清空输入框
  inputMessage.value = '';
  
  // 设置AI正在输入状态
  isAITyping.value = true;
  
  // 创建AI消息占位
  const aiMessageId = Date.now() + 1;
  currentAIMessageId.value = aiMessageId;
  const aiMessage: Message = {
    id: aiMessageId,
    type: 'ai',
    content: '',
    timestamp: Date.now(),
  };
  messages.value.push(aiMessage);

  try {
    // 创建会话（如果尚未创建）
    if (!sessionId.value) {
      const sessionResponse = await AiAvatarChatControllerService.createSessionUsingPost(assistant.value.id);
      if (sessionResponse.code === 0 && sessionResponse.data) {
        sessionId.value = sessionResponse.data;
      } else {
        throw new Error('创建会话失败');
      }
    }
    
    // 准备消息请求
    const messageRequest: ChatMessageAddRequest = {
      aiAvatarId: assistant.value.id,
      content: text,
      sessionId: sessionId.value || '',
      messageType: 'user',
    };
    
    // 创建控制器
    const controller = new AbortController();
    currentStreamController = controller;
    
    // 保存消息内容变量
    let content = '';
    
    // 获取API基础URL
    const apiUrl = `${OpenAPI.BASE}/api/chat/message/stream`;
    
    // 使用fetchEventSource发起POST请求获取SSE流
    await fetchEventSource(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(messageRequest),
      signal: controller.signal,
      credentials: 'include', // 包含cookies，确保会话认证信息被发送
      
      // 处理连接打开事件
      async onopen(response) {
        // 判断是否连接成功
        if (response.ok && response.headers.get('content-type')?.includes('text/event-stream')) {
          return; // 连接成功
        } else if (response.status === 401 || response.status === 403) {
          // 未授权或禁止访问（未登录）
          showToast('登录已过期，请重新登录');
          
          // 清除本地登录状态
          userStore.logout();
          
          // 重定向到登录页面，可以保存当前路径用于登录后返回
          router.push({
            path: '/login',
            query: { redirect: router.currentRoute.value.fullPath }
          });
          
          throw new Error(`未登录: ${response.status}`);
        } else if (response.status === 404) {
          // 会话不存在，需要重新创建会话
          // 将sessionId设为undefined，使下次发送消息时创建新会话
          sessionId.value = undefined;
          
          throw new Error('会话不存在，请重新发送消息');
        } else {
          // 其他错误
          throw new Error(`SSE连接失败: ${response.status}`);
        }
      },
      
      // 处理消息事件
      onmessage(event) {
        try {
          // 检查数据是否为空
          if (!event.data || event.data.trim() === '') {
            return;
          }
          
          // 解析消息数据
          const data = JSON.parse(event.data);
          
          // 根据消息格式提取内容
          if (data) {
            // 检查是否包含会话ID信息，如果有则更新会话ID
            if (data.event === 'message_end' && data.conversation_id) {
              if (data.conversation_id !== sessionId.value) {
                sessionId.value = data.conversation_id;
              }
              return; // message_end 事件不包含内容，直接返回
            }

            // 跳过系统消息类型，如"SSE连接已建立"等提示信息
            if (data.message === "SSE连接已建立" || data.content === "SSE连接已建立" || 
                data.data === "会话已创建" || data.message === "会话已创建" || 
                data.content === "会话已创建" || data.message === "流式响应已完成" || 
                data.content === "流式响应已完成" || data.data === "流式响应已完成" ||
                /流式响应已完成/.test(JSON.stringify(data)) || /SSE连接已建立/.test(JSON.stringify(data)) ||
                /会话已创建/.test(JSON.stringify(data))) {
              return;
            }
            
            // 检查message事件的各种可能格式
            if (data.event === 'message') {
              if (data.answer) {
                content += data.answer;
              } else if (data.content) {
                content += data.content;
              } else if (data.data) {
                content += data.data;
              } else if (data.choices && data.choices.length > 0) {
                // OpenAI格式
                if (data.choices[0].delta && data.choices[0].delta.content) {
                  content += data.choices[0].delta.content;
                } else if (data.choices[0].message && data.choices[0].message.content) {
                  content += data.choices[0].message.content;
                }
              } else if (typeof data === 'string') {
                content += data;
              }
            }
            
            // 更新消息内容（如果有变化）
            if (content) {
              updateAIMessage(content);
            }
          }
        } catch (err: any) {
          // 处理错误，可能是JSON解析错误或其他异常
          showToast('处理消息时发生错误');
        }
      },
      
      // 处理错误事件
      onerror(err: Error) {
        // 处理连接错误
        showToast('连接服务器失败，请重试');
        
        // 尝试恢复UI状态
        isAITyping.value = false;
        
        // 添加错误消息
        if (currentAIMessageId.value && messages.value.length > 0) {
          const lastMessage = messages.value.find(m => m.id === currentAIMessageId.value);
          if (lastMessage) {
            lastMessage.content = '抱歉，我遇到了一些问题，请重试。';
          }
          currentAIMessageId.value = null;
        }
      },
      
      // 处理连接关闭事件
      onclose() {
        // 连接关闭，更新UI状态
        isAITyping.value = false;
        currentAIMessageId.value = null;
        currentEventSource = null;
        currentStreamController = null;
      }
    });
  } catch (error) {
    // 处理发送过程中的错误
    isAITyping.value = false;
    showToast('发送消息失败，请重试');
    
    // 如果有错误，添加错误提示到AI消息中
    if (currentAIMessageId.value && messages.value.length > 0) {
      const lastMessage = messages.value.find(m => m.id === currentAIMessageId.value);
      if (lastMessage) {
        lastMessage.content = '抱歉，发送消息时遇到了问题，请重试。';
      }
      currentAIMessageId.value = null;
    }
  }
};

// 组件销毁前停止所有请求
onBeforeUnmount(() => {
  if (currentEventSource) {
    currentEventSource.close();
    currentEventSource = null;
  }
  
  if (sessionId.value) {
    stopStreamingResponse();
  }
});

// 格式化时间
const formatTime = (timestamp: number): string => {
  const date = new Date(timestamp);
  return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
};

// 配置DOMPurify允许KaTeX相关标签和属性
DOMPurify.addHook('afterSanitizeAttributes', function(node) {
  // 如果是KaTeX生成的元素，保留所有属性
  if (node.classList && (
    node.classList.contains('katex') || 
    node.classList.contains('katex-html') ||
    node.classList.contains('katex-mathml')
  )) {
    node.setAttribute('data-katex-processed', 'true');
  }
});

// 格式化消息内容（处理Markdown和LaTeX）
const formatMessage = (content: string): string => {
  try {
    // 处理块级公式 $$...$$
    let processedContent = content.replace(/\$\$([\s\S]+?)\$\$/g, (match, formula) => {
      try {
        return `<div class="katex-block">${katex.renderToString(formula.trim(), {
          displayMode: true,
          throwOnError: false
        })}</div>`;
      } catch (err) {
        console.error('LaTeX块级公式解析错误:', err);
        return match;
      }
    });

    // 处理行内公式 $...$，但排除可能的货币符号 ($10, 10$等)
    const inlineFormulaRegex = /\$([^\$\n]+?)\$/g;
    processedContent = processedContent.replace(inlineFormulaRegex, (match, formula) => {
      // 检查是否为货币符号
      if (/^\$\d/.test(match) || /\d\$$/.test(match)) {
        return match;
      }
      
      try {
        return katex.renderToString(formula.trim(), {
          displayMode: false,
          throwOnError: false
        });
      } catch (err) {
        console.error('LaTeX行内公式解析错误:', err);
        return match;
      }
    });

    // 使用Marked解析Markdown
    const html = marked.parse(processedContent, { async: false });
    
    // 配置DOMPurify
    const purifyConfig = {
      ADD_TAGS: ['math', 'mrow', 'mi', 'mo', 'mn', 'msup', 'msub', 'mfrac', 'mspace', 'mtext', 'annotation', 'semantics', 'svg', 'line', 'path', 'g'],
      ADD_ATTR: ['xlink:href', 'href', 'fill', 'stroke', 'stroke-width', 'stroke-linecap', 'stroke-linejoin', 'd', 'width', 'height', 'viewBox', 'style', 'data-katex-processed', 'class'],
      ALLOW_DATA_ATTR: true
    };
    
    // 净化HTML防止XSS攻击
    return DOMPurify.sanitize(html, purifyConfig);
  } catch (error) {
    console.error('内容解析失败:', error);
    return content;
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
</script>

<style scoped>
.chat-detail {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: #f7f8fa;
  position: relative;
}

.back-button {
  flex-shrink: 0;
}

.message-container {
  flex: 1;
  overflow: hidden;
  position: relative;
  padding-bottom: 0;
}

.input-container {
  flex-shrink: 0;
  position: sticky;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: #fff;
  z-index: 10;
  padding-bottom: 8px;
}

/* 消息列表样式覆盖 */
:deep(.message-list) {
  height: 100%;
  overflow-y: auto;
  padding-bottom: 30px;
}

/* 全屏输入框样式 */
.fullscreen-input {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.fullscreen-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid #ebedf0;
}

.fullscreen-header .title {
  font-size: var(--font-size-md, 16px);
  font-weight: 700;
  font-family: 'Noto Sans SC', sans-serif;
}

.fullscreen-content {
  flex: 1;
  padding: 16px;
  overflow: hidden;
}

.fullscreen-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  border-top: 1px solid #ebedf0;
}

.fullscreen-footer .action-icons {
  display: flex;
  gap: 24px;
  color: #969799;
}

.fullscreen-footer .send-button {
  border-radius: 4px;
  padding: 0 14px;
  height: 32px;
  font-size: 14px;
}

.textarea-container {
  height: 100%;
  width: 100%;
}

.custom-textarea {
  width: 100%;
  height: 100%;
  min-height: 400px;
  background-color: #f5f5f5;
  border-radius: 8px;
  border: none;
  padding: 12px;
  font-size: 16px;
  line-height: 1.5;
  resize: none;
  font-family: inherit;
  outline: none;
  box-sizing: border-box;
  overflow-y: auto;
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

/* 自定义AI消息样式 */
:deep(.message-item.ai .message-content) {
  background-color: #ffffff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  padding: 4px;
}

/* 增强Markdown样式 */
:deep(.markdown-body) {
  font-size: 14px;
  line-height: 1.6;
  margin: 0;
}

:deep(.markdown-body h1),
:deep(.markdown-body h2),
:deep(.markdown-body h3),
:deep(.markdown-body h4),
:deep(.markdown-body h5),
:deep(.markdown-body h6) {
  margin-top: 16px;
  margin-bottom: 8px;
  font-weight: 600;
  line-height: 1.25;
}

:deep(.markdown-body h1) {
  font-size: 18px;
}

:deep(.markdown-body h2) {
  font-size: 16px;
}

:deep(.markdown-body h3) {
  font-size: 15px;
}

:deep(.markdown-body p) {
  margin: 8px;
}

:deep(.markdown-body ul),
:deep(.markdown-body ol) {
  padding-left: 20px;
  margin: 8px 0;
}

:deep(.markdown-body li) {
  margin: 4px 0;
}

:deep(.markdown-body blockquote) {
  padding: 0 8px;
  color: #6a737d;
  border-left: 3px solid #dfe2e5;
  margin: 8px 0;
}

:deep(.markdown-body code) {
  font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace;
  background-color: rgba(0, 0, 0, 0.05);
  padding: 2px 4px;
  border-radius: 3px;
  font-size: 13px;
}

:deep(.markdown-body pre) {
  background-color: rgba(0, 0, 0, 0.05);
  padding: 12px;
  border-radius: 4px;
  overflow-x: auto;
  margin: 8px 0;
}

:deep(.markdown-body pre code) {
  background-color: transparent;
  padding: 0;
}

:deep(.markdown-body table) {
  border-collapse: collapse;
  width: 100%;
  margin: 8px 0;
}

:deep(.markdown-body table th),
:deep(.markdown-body table td) {
  border: 1px solid #dfe2e5;
  padding: 6px 12px;
  text-align: left;
}

:deep(.markdown-body table th) {
  background-color: #f6f8fa;
}

:deep(.markdown-body img) {
  max-width: 100%;
  height: auto;
}

:deep(.markdown-body a) {
  color: #1989fa;
  text-decoration: none;
}

:deep(.markdown-body a:hover) {
  text-decoration: underline;
}

:deep(.markdown-body hr) {
  height: 1px;
  background-color: #dfe2e5;
  border: none;
  margin: 16px 0;
}

:deep(.markdown-body strong) {
  font-weight: 600;
}

:deep(.markdown-body em) {
  font-style: italic;
}

/* KaTeX公式块样式 */
:deep(.katex-block) {
  display: block;
  margin: 12px 0;
  overflow-x: auto;
  overflow-y: hidden;
  padding: 8px 0;
  text-align: center;
}

/* 确保LaTeX公式在暗模式下也可见 */
:deep(.katex) {
  font-size: 1.1em;
}

:deep(.katex-display) {
  margin: 0.5em 0;
  overflow-x: auto;
  overflow-y: hidden;
}

/* 移动设备适配 */
@media (max-width: 767px) {
  :deep(.katex-block) {
    font-size: 0.9em;
  }
  
  :deep(.katex) {
    font-size: 1em;
  }
}
</style>

