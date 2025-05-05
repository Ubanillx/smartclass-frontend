import { ref } from 'vue';
import { showToast } from 'vant';
import { marked } from 'marked';
import DOMPurify from 'dompurify';
import katex from 'katex';
import { OpenAPI } from '../../services/core/OpenAPI';
import { fetchEventSource } from '@microsoft/fetch-event-source';
import { useUserStore } from '../../stores/userStore';
import { useRouter } from 'vue-router';
import { WebSocketService, WebSocketMessage } from '../../services/websocket/WebSocketService';
import { ChatControllerService } from '../../services/services/ChatControllerService';

export interface UserInfo {
  id: number;
  name: string;
  avatar: string;
}

export interface Assistant {
  id: number;
  name: string;
  avatar: string;
  description: string;
  status?: number;
}

export interface Message {
  id: number;
  type: 'user' | 'ai';
  content: string;
  timestamp: number;
  isRead?: number;
}

export function useChatMessages(assistant: Assistant) {
  const router = useRouter();
  const userStore = useUserStore();
  const messages = ref<Message[]>([]);
  const isAITyping = ref<boolean>(false);
  const currentAIMessageId = ref<number | null>(null);
  const sessionId = ref<string | undefined>(undefined);
  
  // 控制请求的变量
  let currentEventSource: EventSource | null = null;
  let currentStreamController: AbortController | null = null;

  // 配置DOMPurify允许KaTeX相关标签和属性
  DOMPurify.addHook('afterSanitizeAttributes', function (node) {
    // 如果是KaTeX生成的元素，保留所有属性
    if (
      node.classList &&
      (node.classList.contains('katex') ||
        node.classList.contains('katex-html') ||
        node.classList.contains('katex-mathml'))
    ) {
      node.setAttribute('data-katex-processed', 'true');
    }
  });

  // 格式化消息内容（处理Markdown和LaTeX）
  const formatMessage = (content: string): string => {
    try {
      // 处理块级公式 $$...$$
      let processedContent = content.replace(
        /\$\$([\s\S]+?)\$\$/g,
        (match, formula) => {
          try {
            return `<div class="katex-block">${katex.renderToString(
              formula.trim(),
              {
                displayMode: true,
                throwOnError: false,
              },
            )}</div>`;
          } catch (err) {
            console.error('LaTeX块级公式解析错误:', err);
            return match;
          }
        },
      );

      // 处理行内公式 $...$，但排除可能的货币符号 ($10, 10$等)
      const inlineFormulaRegex = /\$([^\$\n]+?)\$/g;
      processedContent = processedContent.replace(
        inlineFormulaRegex,
        (match, formula) => {
          // 检查是否为货币符号
          if (/^\$\d/.test(match) || /\d\$$/.test(match)) {
            return match;
          }

          try {
            return katex.renderToString(formula.trim(), {
              displayMode: false,
              throwOnError: false,
            });
          } catch (err) {
            console.error('LaTeX行内公式解析错误:', err);
            return match;
          }
        },
      );

      // 使用Marked解析Markdown
      const html = marked.parse(processedContent, { async: false });

      // 配置DOMPurify
      const purifyConfig = {
        ADD_TAGS: [
          'math',
          'mrow',
          'mi',
          'mo',
          'mn',
          'msup',
          'msub',
          'mfrac',
          'mspace',
          'mtext',
          'annotation',
          'semantics',
          'svg',
          'line',
          'path',
          'g',
        ],
        ADD_ATTR: [
          'xlink:href',
          'href',
          'fill',
          'stroke',
          'stroke-width',
          'stroke-linecap',
          'stroke-linejoin',
          'd',
          'width',
          'height',
          'viewBox',
          'style',
          'data-katex-processed',
          'class',
        ],
        ALLOW_DATA_ATTR: true,
      };

      // 净化HTML防止XSS攻击
      return DOMPurify.sanitize(html, purifyConfig);
    } catch (error) {
      console.error('内容解析失败:', error);
      return content;
    }
  };

  // 添加欢迎消息
  const addWelcomeMessage = () => {
    if (assistant.name) {
      const welcomeMessage: Message = {
        id: Date.now(),
        type: 'ai',
        content: `你好！我是${assistant.name}。${assistant.description ? assistant.description : '有什么我可以帮助你的吗？'}`,
        timestamp: Date.now(),
      };
      messages.value = [welcomeMessage];
    }
  };

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

    isAITyping.value = false;
    currentAIMessageId.value = null;
  };

  // 发送消息函数
  const sendMessage = async (text: string, regenerate = false) => {
    if (!text.trim() || isAITyping.value) return;

    // 如果有正在进行的请求，先停止
    if (currentEventSource || currentStreamController) {
      await stopStreamingResponse();
    }

    // 添加用户消息（仅在非重新生成模式下）
    if (!regenerate) {
      const userMessage: Message = {
        id: Date.now(),
        type: 'user',
        content: text,
        timestamp: Date.now(),
      };
      messages.value.push(userMessage);
    }

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
      // 准备消息请求
      const messageRequest: any = {
        aiAvatarId: assistant.id,
        content: text,
        sessionId: sessionId.value ? sessionId.value : '',
        messageType: 'user',
      };

      // 如果是重新生成，增加regenerate标记
      if (regenerate) {
        messageRequest.regenerate = true;
      }

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
          if (
            response.ok &&
            response.headers.get('content-type')?.includes('text/event-stream')
          ) {
            return; // 连接成功
          } else if (response.status === 401 || response.status === 403) {
            // 未授权或禁止访问（未登录）
            showToast('登录已过期，请重新登录');

            // 清除本地登录状态
            userStore.logout();

            // 重定向到登录页面，可以保存当前路径用于登录后返回
            router.push({
              path: '/login',
              query: { redirect: router.currentRoute.value.fullPath },
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
              if (
                data.message === 'SSE连接已建立' ||
                data.content === 'SSE连接已建立' ||
                data.data === '会话已创建' ||
                data.message === '会话已创建' ||
                data.content === '会话已创建' ||
                data.message === '流式响应已完成' ||
                data.content === '流式响应已完成' ||
                data.data === '流式响应已完成' ||
                /流式响应已完成/.test(JSON.stringify(data)) ||
                /SSE连接已建立/.test(JSON.stringify(data)) ||
                /会话已创建/.test(JSON.stringify(data))
              ) {
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
                  } else if (
                    data.choices[0].message &&
                    data.choices[0].message.content
                  ) {
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
            const lastMessage = messages.value.find(
              (m) => m.id === currentAIMessageId.value,
            );
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
        },
      });
    } catch (error) {
      // 处理发送过程中的错误
      isAITyping.value = false;
      showToast('发送消息失败，请重试');

      // 如果有错误，添加错误提示到AI消息中
      if (currentAIMessageId.value && messages.value.length > 0) {
        const lastMessage = messages.value.find(
          (m) => m.id === currentAIMessageId.value,
        );
        if (lastMessage) {
          lastMessage.content = '抱歉，发送消息时遇到了问题，请重试。';
        }
        currentAIMessageId.value = null;
      }
    }
  };

  // 重新生成回答
  const regenerateResponse = async (messageId: number) => {
    // 如果当前正在生成回答，先停止
    if (isAITyping.value) {
      await stopStreamingResponse();
    }

    // 找到对应消息的前一条用户消息
    const aiMessageIndex = messages.value.findIndex(msg => msg.id === messageId);
    if (aiMessageIndex <= 0) {
      showToast('无法找到相关消息');
      return;
    }
    
    // 查找AI消息之前的最近一条用户消息
    let userMessageIndex = -1;
    for (let i = aiMessageIndex - 1; i >= 0; i--) {
      if (messages.value[i]?.type === 'user') {
        userMessageIndex = i;
        break;
      }
    }

    if (userMessageIndex === -1) {
      showToast('无法找到相关问题');
      return;
    }

    // 确保用户消息存在
    const userMessage = messages.value[userMessageIndex];
    if (!userMessage) {
      showToast('无法找到相关问题');
      return;
    }
    
    // 移除AI回复消息
    messages.value.splice(aiMessageIndex, 1);
    
    // 以重新生成模式发送消息
    await sendMessage(userMessage.content, true);
  };

  return {
    messages,
    isAITyping,
    sessionId,
    addWelcomeMessage,
    stopStreamingResponse,
    sendMessage,
    regenerateResponse,
    formatMessage
  };
}

/**
 * WebSocket实时聊天消息处理Hook
 */
export function useWebSocketChat() {
  const userStore = useUserStore();
  const userId = ref<number>(0);
  const webSocketConnected = ref<boolean>(false);
  const unreadMessageCount = ref<number>(0);
  const chatSessions = ref<any[]>([]);
  const latestMessages = ref<Map<number, any>>(new Map()); // 用户ID -> 最新消息映射
  
  // WebSocket服务实例
  const webSocketService = WebSocketService.getInstance();
  
  // 初始化WebSocket连接
  const initializeWebSocket = async (): Promise<boolean> => {
    if (!userStore.userInfo || !userStore.userInfo.id) {
      console.error('无法初始化WebSocket：用户未登录');
      return false;
    }
    
    userId.value = userStore.userInfo.id;
    
    // 获取未读消息数量
    try {
      const response = await ChatControllerService.getTotalUnreadCountUsingGet();
      if (response.code === 0 && response.data !== undefined) {
        unreadMessageCount.value = response.data;
      }
    } catch (error) {
      console.error('获取未读消息数量失败', error);
    }
    
    // 初始化WebSocket服务
    const connected = await webSocketService.initialize(userId.value);
    webSocketConnected.value = connected;
    
    if (connected) {
      // 注册消息处理器
      webSocketService.addMessageHandler(handleWebSocketMessage);
      
      // 获取最近会话列表
      await refreshChatSessions();
    }
    
    return connected;
  };
  
  // 刷新聊天会话列表
  const refreshChatSessions = async () => {
    try {
      const response = await ChatControllerService.listUserSessionsUsingGet();
      if (response.code === 0 && response.data) {
        chatSessions.value = response.data;
        
        // 更新最新消息映射
        for (const session of response.data) {
          if (session.lastMessage) {
            const otherUserId = session.targetUser?.id;
            if (otherUserId) {
              latestMessages.value.set(otherUserId, session.lastMessage);
            }
          }
        }
      }
    } catch (error) {
      console.error('获取聊天会话列表失败', error);
    }
  };
  
  // 处理WebSocket消息
  const handleWebSocketMessage = (message: WebSocketMessage) => {
    // 根据消息类型进行处理
    const messageType = message.type;
    
    switch (messageType) {
      case 0: // 认证消息
        console.log('WebSocket认证成功');
        break;
        
      case 1: // 私聊消息
        handlePrivateChatMessage(message);
        break;
        
      case 2: // 好友请求
        handleFriendRequest(message);
        break;
        
      case 3: // 系统通知
        handleSystemNotification(message);
        break;
        
      case 99: // 错误消息
        handleErrorMessage(message);
        break;
        
      default:
        console.log('未知消息类型', message);
    }
  };
  
  // 处理私聊消息
  const handlePrivateChatMessage = (message: WebSocketMessage) => {
    // 判断是否是当前用户发送的消息
    const isSentByMe = message.senderId === userId.value;
    
    // 更新最新消息
    if (message.senderId && !isSentByMe) {
      latestMessages.value.set(message.senderId, message);
      
      // 增加未读消息计数
      unreadMessageCount.value++;
      
      // 显示通知
      if ('Notification' in window && Notification.permission === 'granted') {
        const senderName = message.senderName || `用户${message.senderId}`;
        const notificationContent = message.content || '新消息';
        
        new Notification('新消息', {
          body: `${senderName}: ${notificationContent}`,
          icon: '/favicon.ico'
        });
      }
    }
    
    // 更新会话列表中的最新消息
    const sessionIndex = chatSessions.value.findIndex(session => 
      (session.targetUser?.id === message.senderId) || 
      (session.targetUser?.id === message.receiverId && isSentByMe)
    );
    
    if (sessionIndex !== -1) {
      chatSessions.value[sessionIndex].lastMessage = message;
      // 如果是自己发的消息，计数不变；如果是收到的消息，未读数+1
      if (!isSentByMe) {
        chatSessions.value[sessionIndex].unreadCount = 
          (chatSessions.value[sessionIndex].unreadCount || 0) + 1;
      }
    } else {
      // 如果会话不存在，刷新会话列表
      refreshChatSessions();
    }
  };
  
  // 处理好友请求消息
  const handleFriendRequest = (message: WebSocketMessage) => {
    // 增加未读消息计数
    unreadMessageCount.value++;
    
    // 显示通知
    if ('Notification' in window && Notification.permission === 'granted') {
      const senderName = message.senderName || `用户${message.senderId}`;
      
      new Notification('好友请求', {
        body: `${senderName}向您发送了好友请求`,
        icon: '/favicon.ico'
      });
    }
    
    // 在这里可以更新好友请求列表或UI提示
    showToast('收到新的好友请求');
  };
  
  // 处理系统通知消息
  const handleSystemNotification = (message: WebSocketMessage) => {
    // 显示通知
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('系统通知', {
        body: message.content || '收到系统通知',
        icon: '/favicon.ico'
      });
    }
    
    // 在这里可以更新系统通知列表或UI提示
    showToast(message.content || '收到系统通知');
  };
  
  // 处理错误消息
  const handleErrorMessage = (message: WebSocketMessage) => {
    console.error('WebSocket错误信息', message);
    showToast(`WebSocket错误: ${message.message || message.content || '未知错误'}`);
  };
  
  // 发送私聊消息
  const sendPrivateMessage = (receiverId: number, content: string): boolean => {
    if (!webSocketConnected.value) {
      showToast('消息发送失败：WebSocket未连接');
      return false;
    }
    
    const message: WebSocketMessage = {
      type: 1, // 私聊消息类型
      senderId: userId.value,
      receiverId: receiverId,
      content: content,
      id: Date.now(), // 临时ID
      timestamp: Date.now(),
      sendTime: new Date().toISOString()
    };
    
    const success = webSocketService.sendMessage(message);
    
    if (success) {
      // 更新最新消息
      latestMessages.value.set(receiverId, message);
      
      // 更新会话列表
      const sessionIndex = chatSessions.value.findIndex(session => 
        session.targetUser?.id === receiverId
      );
      
      if (sessionIndex !== -1) {
        chatSessions.value[sessionIndex].lastMessage = message;
      } else {
        // 如果会话不存在，刷新会话列表
        refreshChatSessions();
      }
    }
    
    return success;
  };
  
  // 标记消息为已读
  const markMessageAsRead = async (messageId: number) => {
    try {
      await ChatControllerService.markMessageAsReadUsingPost(messageId);
      
      // 更新未读消息计数
      if (unreadMessageCount.value > 0) {
        unreadMessageCount.value--;
      }
    } catch (error) {
      console.error('标记消息为已读失败', error);
    }
  };
  
  // 标记会话所有消息为已读
  const markSessionMessagesAsRead = async (sessionId: number) => {
    try {
      await ChatControllerService.markSessionMessagesAsReadUsingPost(sessionId);
      
      // 获取最新未读消息计数
      try {
        const response = await ChatControllerService.getTotalUnreadCountUsingGet();
        if (response.code === 0 && response.data !== undefined) {
          unreadMessageCount.value = response.data;
        }
      } catch (countError) {
        console.error('获取未读消息数量失败', countError);
      }
      
      // 更新会话列表中的未读计数
      const sessionIndex = chatSessions.value.findIndex(session => 
        session.id === sessionId
      );
      
      if (sessionIndex !== -1) {
        chatSessions.value[sessionIndex].unreadCount = 0;
      }
    } catch (error) {
      console.error('标记会话消息为已读失败', error);
    }
  };
  
  // 请求通知权限
  const requestNotificationPermission = async () => {
    if ('Notification' in window) {
      if (Notification.permission !== 'granted' && Notification.permission !== 'denied') {
        await Notification.requestPermission();
      }
    }
  };
  
  // 组件销毁时清理
  const cleanUp = () => {
    if (webSocketService) {
      webSocketService.removeMessageHandler(handleWebSocketMessage);
    }
  };
  
  return {
    webSocketConnected,
    unreadMessageCount,
    chatSessions,
    latestMessages,
    initializeWebSocket,
    refreshChatSessions,
    sendPrivateMessage,
    markMessageAsRead,
    markSessionMessagesAsRead,
    requestNotificationPermission,
    cleanUp
  };
} 