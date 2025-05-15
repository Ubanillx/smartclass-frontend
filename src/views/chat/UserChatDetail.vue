<template>
  <div class="user-chat-detail">
    <!-- 头部导航 -->
    <chat-header :title="targetUser.name" />

    <!-- 消息列表区域 -->
    <div class="message-container">
      <friend-message-list
        :messages="messages"
        :assistant-avatar="targetUser.avatar"
        :user-avatar="userInfo?.avatar || ''"
        :loading="isSending"
        @update-read-status="handleReadStatusUpdate"
      />
      
      <!-- SSE连接状态调试信息 -->
      <div v-if="isDevelopment" class="debug-panel">
        <p>SSE状态: {{ sseConnected ? '已连接' : '未连接' }}</p>
        <p>会话ID: {{ sessionId }}</p>
        <div class="debug-buttons">
          <button @click="reconnectSSE">重连SSE</button>
          <button @click="togglePolling">{{ pollingInterval ? '停止轮询' : '启动轮询' }}</button>
          <button @click="checkMessageReadStatus">检查已读状态</button>
        </div>
      </div>
    </div>

    <!-- 底部输入框 -->
    <chat-input-area
      v-model="inputMessage"
      :is-loading="isSending"
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
      :is-loading="isSending"
      @send="sendFullscreenMessage"
      @emoji="showEmojiPicker = true"
      @image="uploadImage"
      @voice="startVoiceRecord"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch, nextTick } from 'vue';
import { useRoute } from 'vue-router';
import { showToast } from 'vant';
import { 
  FriendMessageList, 
  ChatHeader, 
  EmojiPicker, 
  FullscreenInput, 
  ChatInputArea
} from '../../components/Dialogue';
import { useUserStore } from '../../stores/userStore';
import type { UserInfo, Message } from '../../components/Dialogue/ChatMessageHandler';
import { ChatControllerService } from '../../services/services/ChatControllerService';
import { fetchEventSource } from '@microsoft/fetch-event-source';
import { OpenAPI } from '../../services/core/OpenAPI.ts';

// 生成UUID函数
function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

const route = useRoute();
const userStore = useUserStore();
const inputMessage = ref('');
const showEmojiPicker = ref(false);
const showFullscreenInput = ref(false);
const isSending = ref(false);
const currentPage = ref(1);
const pageSize = ref(20);
const hasMoreMessages = ref(true);
const loadingUserInfo = ref(false);
const DEFAULT_USER_AVATAR = userStore.DEFAULT_USER_AVATAR;
const lastMessageTime = ref<string | null>(null);

// 开发环境标志
const isDevelopment = process.env.NODE_ENV === 'development';

// SSE连接相关变量
let sseEventSource: AbortController | null = null;
const sseConnected = ref(false);

// 消息列表
const messages = ref<Message[]>([]);

// 用户信息
const userInfo = ref<UserInfo>({
  id: 0,
  name: '',
  avatar: '',
});

// 目标用户（对话对象）信息
const targetUser = ref<UserInfo>({
  id: Number(route.params.userId) || 0,
  name: '',
  avatar: '',
});

// 会话ID
const sessionId = ref<number | null>(null);

// 在组件挂载时设置定时检查已读状态
let readStatusCheckInterval: number | null = null;
let healthCheckInterval: number | null = null;

// 手动重连SSE
const reconnectSSE = () => {
  stopSSEConnection();
  setTimeout(() => {
    startSSEConnection();
  }, 100);
};

// 切换轮询状态
const togglePolling = () => {
  if (pollingInterval) {
    stopPolling();
  } else {
    startPolling();
  }
};

// 替换滚动到底部方法
const scrollToBottom = () => {
  setTimeout(() => {
    const messageList = document.querySelector('.message-list');
    if (messageList instanceof HTMLElement) {
      messageList.scrollTop = messageList.scrollHeight;
    }
  }, 100);
};

/**
 * 初始化对话
 */
const initializeChat = async () => {
  // 更新目标用户ID
  targetUser.value.id = Number(route.params.userId) || 0;
  
  if (!targetUser.value.id) {
    showToast('无效的用户ID');
    return;
  }
  
  // 先设置一个临时名称，避免页面显示空白
  targetUser.value.name = `用户${targetUser.value.id}`;
  targetUser.value.avatar = DEFAULT_USER_AVATAR;
  
  // 加载历史消息 (同时会获取对方用户信息)
  try {
    await loadChatHistory();
  } catch (error) {
    // 错误已在函数内部处理
  }
  
  // 建立SSE连接，替换轮询
  startSSEConnection();
};

// 播放消息提示音
const playMessageTone = () => {
  try {
    const audio = new Audio('/audio/message.mp3');
    audio.volume = 0.5;
    audio.play().catch(e => console.log('无法播放提示音:', e));
  } catch (e) {
    console.log('提示音播放失败:', e);
  }
};

// 标记消息为已读时添加验证
const markMessageAsRead = async (messageId?: number) => {
  // 如果没有提供有效的消息ID，直接返回
  if (!messageId || typeof messageId !== 'number' || !sessionId.value) {
    console.error('无效的消息ID或会话ID', { messageId, sessionId: sessionId.value });
    return;
  }
  
  try {
    // 验证这是对方发送的消息，只有对方消息才能被标记为已读
    const message = messages.value.find(msg => msg.id === messageId);
    if (!message || message.type !== 'ai') {
      console.log(`尝试标记自己的消息为已读，被拒绝: ${messageId}`);
      return;
    }
    
    console.log(`尝试标记消息 ${messageId} 为已读，会话ID: ${sessionId.value}`);
    const response = await ChatControllerService.markMessageAsReadUsingPost(messageId, sessionId.value.toString());
    
    if (response && response.code === 0) {
      console.log(`成功标记消息 ${messageId} 为已读`);
      // 更新本地已读状态
      updateMessageReadStatus(messageId, 1);
    } else {
      console.error('标记消息已读API返回错误:', response);
    }
  } catch (error) {
    // 记录详细错误
    console.error('标记消息已读失败:', error);
  }
};

// 批量标记消息为已读
const markMessagesAsRead = async (messageIds: number[]) => {
  if (!messageIds || messageIds.length === 0 || !sessionId.value) {
    console.error('无效的消息ID数组或会话ID', { messageIds, sessionId: sessionId.value });
    return;
  }
  
  try {
    console.log(`尝试批量标记消息为已读: ${messageIds.join(',')}, 会话ID: ${sessionId.value}`);
    const response = await ChatControllerService.markMessagesAsReadUsingPost(messageIds, sessionId.value.toString());
    
    if (response && response.code === 0) {
      console.log(`成功批量标记消息为已读: ${messageIds.join(',')}`);
      // 更新本地已读状态
      updateMessagesReadStatus(messageIds, 1);
    } else {
      console.error('批量标记消息已读API返回错误:', response);
    }
  } catch (error) {
    console.error('批量标记消息已读失败:', error);
  }
};

// 优化检查消息已读状态函数，增加服务器验证
const checkMessageReadStatus = async () => {
  if (!sessionId.value || messages.value.length === 0) return;
  
  // 获取当前未读的用户消息ID
  const unreadUserMessageIds = messages.value
    .filter(msg => msg.type === 'user' && msg.isRead === 0)
    .map(msg => msg.id);
  
  if (unreadUserMessageIds.length === 0) return;
  
  console.log(`主动检查以下消息的已读状态: ${unreadUserMessageIds.join(',')}`);
  
  try {
    // 从服务器获取最新消息状态
    const response = await ChatControllerService.listSessionMessagesUsingGet(
      sessionId.value,
      1,
      50 // 获取更多消息以确保覆盖未读消息
    );
    
    if (response.code === 0 && response.data && response.data.records) {
      // 检查这些消息在服务器上是否已读
      for (const localMsgId of unreadUserMessageIds) {
        const serverMsg = response.data.records.find(msg => msg.id === localMsgId);
        
        // 只有服务器消息存在且已读时才更新本地状态 - 这是关键条件
        if (serverMsg && serverMsg.isRead === 1) {
          console.log(`服务器确认消息已读: ${localMsgId}`);
          updateMessageReadStatus(localMsgId, 1);
        }
      }
    }
  } catch (error) {
    console.error('主动检查消息已读状态失败:', error);
  }
};

// 增强更新消息已读状态函数，确保UI更新，并添加额外验证
const updateMessageReadStatus = (messageId: number, isRead: number) => {
  const messageIndex = messages.value.findIndex(msg => msg.id === messageId);
  if (messageIndex !== -1) {
    console.log(`更新消息 ${messageId} 已读状态为: ${isRead}`);
    
    // 安全地获取消息对象
    const oldMessage = messages.value[messageIndex];
    if (!oldMessage) return;
    
    // 如果状态已经是最新的，不重复更新
    if (oldMessage.isRead === isRead) return;
    
    // 执行用户消息到已读状态的额外验证 - 确保发送方消息只有在服务器确认已读时才显示已读
    if (oldMessage.type === 'user' && isRead === 1) {
      console.log(`用户消息 ${messageId} 设置为已读，当前状态: ${oldMessage.isRead}`);
      // 可以添加额外的服务器验证逻辑
    }
    
    // 创建新消息对象，保留所有原始字段并更新isRead
    const updatedMessage: Message = {
      ...oldMessage,
      isRead: isRead
    };
    
    // 更新消息数组，强制Vue重新渲染
    const newMessages = [...messages.value];
    newMessages[messageIndex] = updatedMessage;
    messages.value = newMessages;
    
    // 通知UI更新已读状态 (使用nextTick确保在下一个渲染周期更新)
    nextTick(() => {
      const messageElements = document.querySelectorAll('.message-item.user');
      if (messageElements && messageElements.length > 0) {
        console.log('强制更新消息已读状态UI');
      }
    });
  }
};

// 增强批量更新消息已读状态函数
const updateMessagesReadStatus = (messageIds: number[], isRead: number) => {
  if (!messageIds || messageIds.length === 0) return;
  
  console.log(`批量更新消息已读状态: ${messageIds.join(',')} -> ${isRead}`);
  
  let hasUpdates = false;
  messageIds.forEach(id => {
    const index = messages.value.findIndex(msg => msg.id === id);
    if (index !== -1 && messages.value[index] && messages.value[index].isRead !== isRead) {
      hasUpdates = true;
    }
    updateMessageReadStatus(id, isRead);
  });
  
  // 如果有更新，强制刷新界面
  if (hasUpdates) {
    nextTick(() => {
      console.log('批量更新后强制刷新界面');
    });
  }
};

// 标记整个会话已读
const markSessionAsRead = async () => {
  if (!sessionId.value) {
    console.error('无法标记会话已读：会话ID不存在');
    return;
  }
  
  try {
    console.log(`尝试标记会话 ${sessionId.value} 中的所有消息为已读`);
    const response = await ChatControllerService.markSessionMessagesAsReadUsingPost(sessionId.value);
    
    if (response && response.code === 0) {
      console.log(`成功标记会话 ${sessionId.value} 中的所有消息为已读`);
      
      // 更新本地消息的已读状态
      const targetUserMessageIds = messages.value
        .filter(msg => msg.type === 'ai' && msg.isRead === 0)
        .map(msg => msg.id);
      
      if (targetUserMessageIds.length > 0) {
        updateMessagesReadStatus(targetUserMessageIds, 1);
      }
    } else {
      console.error('标记会话所有消息已读API返回错误:', response);
    }
  } catch (error) {
    console.error('标记会话所有消息已读失败:', error);
  }
};

// 加载历史消息
const loadChatHistory = async () => {
  if (!targetUser.value.id) return;

  try {
    // 首先尝试获取或创建会话
    if (!sessionId.value) {
      const sessionResponse = await ChatControllerService.getSessionWithUserUsingGet(
        targetUser.value.id
      );
      
      if (sessionResponse.code === 0 && sessionResponse.data) {
        sessionId.value = sessionResponse.data.id || null;
        
        // 从会话中获取对方用户信息
        if (sessionResponse.data.targetUser) {
          targetUser.value = {
            id: targetUser.value.id,
            name: sessionResponse.data.targetUser.userName || `用户${targetUser.value.id}`,
            avatar: sessionResponse.data.targetUser.userAvatar || DEFAULT_USER_AVATAR,
          };
          console.log('从会话中获取到目标用户信息:', targetUser.value);
        }
      } else {
        // 如果会话不存在，可能需要创建会话
        showToast('无法获取会话信息');
        return;
      }
    }

    // 确保会话ID存在
    if (!sessionId.value) {
      showToast('无法获取会话信息');
      return;
    }

    // 有了会话ID后，获取消息列表
    const response = await ChatControllerService.listSessionMessagesUsingGet(
      sessionId.value,
      currentPage.value,
      pageSize.value
    );

    if (response.code === 0 && response.data) {
      // 检查是否有更多消息
      hasMoreMessages.value = response.data.records && response.data.records.length >= pageSize.value ? true : false;
      
      // 转换消息格式
      const historyMessages: Message[] = [];
      
      response.data.records?.forEach(msg => {
        if (!msg) return;
        
        historyMessages.push({
          id: msg.id || Date.now(),
          type: msg.senderId === userInfo.value.id ? 'user' : 'ai', // 'ai'类型用于对方消息
          content: msg.content || '',
          timestamp: msg.createTime ? new Date(msg.createTime).getTime() : Date.now(),
          isRead: msg.isRead, // 添加已读状态
        });
        
        // 记录最后一条消息的时间
        if (msg.createTime) {
          lastMessageTime.value = msg.createTime;
        }
      });
      
      // 第一页时直接替换，否则添加到现有消息前面
      if (currentPage.value === 1) {
        messages.value = historyMessages.reverse(); // 逆序排列，最新的在最下面
      } else {
        messages.value = [...historyMessages.reverse(), ...messages.value];
      }
      
      // 替换原来的单条消息标记逻辑，直接标记整个会话已读
      const hasUnreadMessages = response.data.records?.some(msg => 
        msg && msg.isRead === 0 && msg.senderId === targetUser.value.id
      );
      
      if (hasUnreadMessages && sessionId.value) {
        // 标记整个会话为已读
        await markSessionAsRead();
      }
      
      // 滚动到底部
      scrollToBottom();
    }
  } catch (error) {
    showToast('获取历史消息失败');
    console.error('加载历史消息失败:', error);
  }
};

// 加载更多历史消息
const loadMoreHistory = async () => {
  if (!hasMoreMessages.value) return;
  
  currentPage.value++;
  await loadChatHistory();
};

// 停止SSE连接
const stopSSEConnection = () => {
  if (sseEventSource) {
    sseEventSource.abort();
    sseEventSource = null;
  }
  sseConnected.value = false;
};

// 轮询相关变量
let pollingInterval: number | null = null;
const POLLING_INTERVAL = 5000; // 5秒轮询一次

// 更新SSE连接函数，添加心跳处理
const startSSEConnection = async () => {
  // 如果已经有连接，先关闭
  stopSSEConnection();
  
  if (!userInfo.value.id || !targetUser.value.id) {
    console.error('用户信息缺失，无法建立SSE连接');
    return;
  }

  // 确保用户已登录
  if (!userStore.userInfo?.id) {
    console.error('用户未登录，无法建立SSE连接');
    showToast('请先登录后再聊天');
    return;
  }
  
  try {
    // 创建AbortController来控制连接
    const controller = new AbortController();
    sseEventSource = controller;
    
    // 建立SSE连接 - 直接连接到SSE端点
    console.log('正在建立SSE连接...');
    const sseUrl = `${OpenAPI.BASE}/api/private-chat/connect`;
    
    // 设置连接检测器，更频繁检查连接状态
    let lastSSEEventTime = Date.now();
    const connectionChecker = setInterval(() => {
      const now = Date.now();
      if (now - lastSSEEventTime > 30000) { // 30秒无消息则认为连接可能已断开
        console.log('SSE连接超过30秒未收到消息，尝试重连');
        clearInterval(connectionChecker);
        reconnectSSE();
        
        // 重连后立即检查消息状态
        checkMessageReadStatus();
      }
    }, 15000); // 每15秒检查一次
    
    await fetchEventSource(sseUrl, {
      method: 'GET',
      headers: {
        'Accept': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
      signal: controller.signal,
      credentials: 'include',
      
      // 处理连接打开事件
      async onopen(response) {
        if (
          response.ok &&
          response.headers.get('content-type')?.includes('text/event-stream')
        ) {
          sseConnected.value = true;
          console.log('SSE连接已成功建立', response);
          
          // 连接成功时，停止轮询
          stopPolling();
          return; // 连接成功
        } else if (response.status === 401 || response.status === 403) {
          // 未授权或禁止访问
          console.error(`SSE连接失败: 未授权 ${response.status}`);
          showToast('登录已过期，请重新登录');
          // 启动轮询备选方案
          startPolling();
          throw new Error(`未登录: ${response.status}`);
        } else {
          // 其他错误
          console.error(`SSE连接失败: ${response.status}`, response);
          // 启动轮询备选方案
          startPolling();
          throw new Error(`SSE连接失败: ${response.status}`);
        }
      },
      
      // 处理消息事件
      onmessage(event) {
        // 更新最后事件时间，使用非ref变量
        lastSSEEventTime = Date.now();
        
        console.log('收到SSE事件:', {
          event: event.event, 
          id: event.id, 
          data: event.data,
          retry: event.retry
        });
        
        try {
          // 检查数据是否为空
          if (!event.data || event.data.trim() === '') {
            console.log('SSE事件数据为空，可能是心跳包');
            return;
          }
          
          // 根据事件类型处理
          const eventType = event.event || 'message';
          console.log(`处理事件类型: ${eventType}`);
          
          // 处理已读状态更新事件 - 优化这部分逻辑，确保只在服务器确认已读时更新
          if (eventType === 'read_status' || eventType === 'message_read') {
            console.log('处理已读状态更新事件:', event.data);
            
            try {
              const readData = JSON.parse(event.data);
              console.log('解析的已读状态数据:', readData);
              
              // 验证这是针对当前会话的状态更新
              if (readData.sessionId && readData.sessionId.toString() !== sessionId.value?.toString()) {
                console.log(`收到的已读状态更新不是当前会话: ${readData.sessionId} vs ${sessionId.value}`);
                return;
              }
              
              // 处理单条消息已读 - 只处理用户自己发送的消息
              if (readData.messageId) {
                // 查找消息是否是用户自己发送的
                const userMsg = messages.value.find(
                  msg => msg.id === readData.messageId && msg.type === 'user'
                );
                
                if (userMsg) {
                  console.log(`接收到用户消息已读通知: ${readData.messageId}`);
                  updateMessageReadStatus(readData.messageId, 1);
                } else {
                  console.log(`忽略非用户发送消息的已读通知: ${readData.messageId}`);
                }
              }
              
              // 处理批量消息已读 - 过滤只保留用户自己发送的消息
              if (readData.messageIds && Array.isArray(readData.messageIds)) {
                // 过滤出用户自己发送的消息
                const userMessageIds = readData.messageIds.filter((id: any) => {
                  return messages.value.some(msg => msg.id === id && msg.type === 'user');
                });
                
                if (userMessageIds.length > 0) {
                  console.log(`接收到批量用户消息已读通知: ${userMessageIds.join(',')}`);
                  updateMessagesReadStatus(userMessageIds, 1);
                }
              }
              
              // 处理会话全部已读
              if (readData.sessionId && (readData.isAllRead || readData.allRead)) {
                console.log(`接收到会话 ${readData.sessionId} 全部已读通知`);
                // 检查是否是当前会话
                if (readData.sessionId.toString() === sessionId.value?.toString()) {
                  console.log('当前会话所有消息已标记为已读');
                  // 找到当前会话中所有用户发送的消息并标记为已读
                  const userMessageIds = messages.value
                    .filter(msg => msg.type === 'user' && msg.isRead === 0)
                    .map(msg => msg.id);
                  
                  if (userMessageIds.length > 0) {
                    console.log(`更新所有用户消息为已读: ${userMessageIds.join(',')}`);
                    updateMessagesReadStatus(userMessageIds, 1);
                  }
                }
              }
              
              // 检查发送者和接收者 - 确保只处理对方已读用户消息的通知
              if (readData.type === 'read_status' || readData.event === 'message_read') {
                console.log('处理一般形式的已读通知:', readData);
                
                // 确认是针对当前会话的通知
                if (readData.receiverId === userInfo.value?.id && 
                    readData.senderId === targetUser.value?.id) {
                  console.log('接收到当前对话的已读通知');
                  
                  // 处理单条消息已读
                  if (readData.messageId) {
                    // 确认是用户发出的消息
                    const userMsg = messages.value.find(
                      msg => msg.id === readData.messageId && msg.type === 'user'
                    );
                    
                    if (userMsg) {
                      updateMessageReadStatus(readData.messageId, 1);
                    }
                  }
                }
              }
              
              // 避免过多重复检查，只在收到已读通知后延迟检查一次
              setTimeout(checkMessageReadStatus, 1000);
            } catch (readError) {
              console.error('解析已读状态数据失败:', readError, '原始数据:', event.data);
            }
            return;
          }
          
          // 处理聊天消息
          if (eventType === 'chat' || eventType === 'private_message') {
            console.log(`处理聊天事件: ${eventType}，原始数据:`, event.data);
            try {
              // 尝试解析事件数据
              const chatData = JSON.parse(event.data);
              
              // 检查是否是已读通知
              if (chatData.type === 'read_status' || chatData.event === 'message_read') {
                console.log('处理已读通知:', chatData);
                
                // 处理单个消息已读
                if (chatData.messageId) {
                  updateMessageReadStatus(chatData.messageId, 1);
                  return;
                }
                
                // 处理批量消息已读
                if (chatData.messageIds && Array.isArray(chatData.messageIds)) {
                  updateMessagesReadStatus(chatData.messageIds, 1);
                  return;
                }
                
                // 处理会话全部已读
                if (chatData.sessionId === sessionId.value && (chatData.isAllRead || chatData.allRead)) {
                  const userMessageIds = messages.value
                    .filter(msg => msg.type === 'user' && msg.isRead === 0)
                    .map(msg => msg.id);
                  
                  if (userMessageIds.length > 0) {
                    updateMessagesReadStatus(userMessageIds, 1);
                  }
                  return;
                }
              }
              
              // 检查是否包含正确的发送者ID
              if (chatData.senderId === targetUser.value.id) {
                // 构建消息对象
                const newMessage: Message = {
                  id: chatData.id || Date.now(),
                  type: 'ai',
                  content: chatData.content || '',
                  timestamp: chatData.createTime ? new Date(chatData.createTime).getTime() : Date.now(),
                  isRead: 1,
                };
                
                // 检查消息是否已存在
                const messageExists = messages.value.some(msg => msg.id === newMessage.id);
                if (!messageExists) {
                  console.log(`添加${eventType}事件消息:`, newMessage);
                  messages.value.push(newMessage);
                  playMessageTone();
                  scrollToBottom();
                  
                  // 自动标记会话为已读，而不是单条消息
                  if (sessionId.value) {
                    console.log(`准备标记会话 ${sessionId.value} 为已读`);
                    markSessionAsRead();
                  }
                }
              }
              return;
            } catch (chatError) {
              console.error(`解析${eventType}事件数据失败:`, chatError);
            }
          }
          
          // 常规消息处理
          try {
            // 解析消息数据
            const data = JSON.parse(event.data);
            console.log('解析后的消息数据:', data);
            
            // 检查是否是已读状态更新
            if (data.type === 'read_status' || data.type === 'message_read' || data.event === 'read_status' || data.event === 'message_read') {
              console.log('处理已读状态更新:', data);
              
              // 更新单个消息的已读状态
              if (data.messageId) {
                updateMessageReadStatus(data.messageId, 1);
              }
              
              // 批量更新已读状态
              if (data.messageIds && Array.isArray(data.messageIds)) {
                updateMessagesReadStatus(data.messageIds, 1);
              }
              
              return;
            }
            
            // 判断消息类型
            if (data.type === 'message' || data.content) {
              // 只处理来自目标用户的消息
              if (data.senderId === targetUser.value.id) {
                console.log('接收到目标用户消息:', data);
                
                // 检查消息是否已存在（防止重复）
                const messageExists = messages.value.some(msg => msg.id === data.id);
                if (messageExists) {
                  console.log('消息已存在，跳过', data.id);
                  return;
                }
                
                // 添加新消息
                const newMessage: Message = {
                  id: data.id || Date.now(),
                  type: 'ai', // 对方发来的消息
                  content: data.content || '',
                  timestamp: data.createTime ? new Date(data.createTime).getTime() : Date.now(),
                  isRead: 1, // 自动标记为已读
                };
                
                console.log('添加新消息到界面:', newMessage);
                messages.value.push(newMessage);
                
                // 更新最后消息时间
                if (data.createTime && (!lastMessageTime.value || new Date(data.createTime) > new Date(lastMessageTime.value))) {
                  lastMessageTime.value = data.createTime;
                }
                
                // 播放提示音
                playMessageTone();
                
                // 滚动到底部
                scrollToBottom();
                
                // 标记会话为已读，而不是单条消息
                if (sessionId.value) {
                  console.log(`准备标记会话 ${sessionId.value} 为已读`);
                  markSessionAsRead();
                }
              } else {
                console.log('收到其他用户的消息，忽略:', data);
              }
            }
          } catch (parseError) {
            console.error('解析常规消息数据失败:', parseError, '原始数据:', event.data);
          }
        } catch (error) {
          console.error('SSE消息处理错误:', error, '原始数据:', event.data);
        }
      },
      
      // 处理连接错误
      onerror(error) {
        console.error('SSE连接错误:', error);
        sseConnected.value = false;
        clearInterval(connectionChecker);
        
        // 启动轮询备选方案
        startPolling();
        
        // 尝试重新连接
        setTimeout(() => {
          if (!sseConnected.value) {
            console.log('尝试重新建立SSE连接...');
            startSSEConnection();
          }
        }, 15000); // 15秒后重试
      },
      
      // 处理连接关闭
      onclose() {
        console.log('SSE连接已关闭');
        sseConnected.value = false;
        clearInterval(connectionChecker);
        
        // 启动轮询备选方案
        startPolling();
      }
    });
  } catch (error) {
    console.error('建立SSE连接失败:', error);
    sseConnected.value = false;
    
    // 启动轮询备选方案
    startPolling();
  }
};

// 修改轮询函数，也处理已读状态
const startPolling = () => {
  // 如果已经在轮询，则不重复启动
  if (pollingInterval !== null) return;
  
  console.log('启动消息轮询备选方案');
  
  // 设置定时器定期获取新消息
  pollingInterval = window.setInterval(async () => {
    if (!sessionId.value || !targetUser.value.id) return;
    
    try {
      // 获取最新消息
      const response = await ChatControllerService.listSessionMessagesUsingGet(
        sessionId.value,
        1, // 只获取第一页
        10 // 限制条数，减少数据量
      );
      
      if (response.code === 0 && response.data && response.data.records) {
        // 更新已读状态 - 检查用户发送的消息是否被标记为已读
        if (response.data.records) {
          // 获取本地未读的用户消息
          const localUnreadUserMessages = messages.value.filter(
            msg => msg.type === 'user' && msg.isRead === 0
          );
          
          if (localUnreadUserMessages.length > 0) {
            // 检查这些消息在服务器上是否已读
            for (const localMsg of localUnreadUserMessages) {
              const serverMsg = response.data.records.find(
                msg => msg.id === localMsg.id
              );
              
              // 如果服务器上消息已读，更新本地状态
              if (serverMsg && serverMsg.isRead === 1) {
                console.log(`轮询发现消息已读状态更新: ${localMsg.id}`);
                updateMessageReadStatus(localMsg.id, 1);
              }
            }
          }
        }
        
        // 过滤出尚未显示的对方消息
        const newMessageRecords = response.data.records.filter(msg => 
          msg && 
          msg.senderId === targetUser.value.id && 
          !messages.value.some(existingMsg => existingMsg.id === msg.id)
        );
        
        // 转换为前端消息格式
        if (newMessageRecords.length > 0) {
          const newMessages: Message[] = newMessageRecords.map(msg => ({
            id: msg.id || Date.now(),
            type: 'ai', // 使用字面量类型
            content: msg.content || '',
            timestamp: msg.createTime ? new Date(msg.createTime).getTime() : Date.now(),
            isRead: 1, // 自动标记为已读
          }));
          
          // 按时间顺序添加新消息
          messages.value.push(...newMessages.sort((a, b) => a.timestamp - b.timestamp));
          
          // 播放提示音
          playMessageTone();
          
          // 滚动到底部
          scrollToBottom();
          
          // 标记会话为已读，而不是单条消息
          if (sessionId.value) {
            try {
              console.log(`准备标记会话 ${sessionId.value} 为已读`);
              markSessionAsRead();
            } catch (error) {
              console.error('标记轮询消息为已读失败:', error);
            }
          }
        }
        
        // 检查会话未读消息数
        try {
          const unreadCountResponse = await ChatControllerService.getSessionUnreadCountUsingGet(sessionId.value);
          if (unreadCountResponse.code === 0 && unreadCountResponse.data === 0) {
            // 如果没有未读消息，可能所有消息都已读，更新本地状态
            const userMessageIds = messages.value
              .filter(msg => msg.type === 'user' && msg.isRead === 0)
              .map(msg => msg.id);
            
            if (userMessageIds.length > 0) {
              console.log('轮询发现会话所有消息已读，更新本地状态');
              updateMessagesReadStatus(userMessageIds, 1);
            }
          }
        } catch (error) {
          console.error('获取会话未读消息数失败:', error);
        }
      }
    } catch (error) {
      console.error('轮询获取消息失败:', error);
    }
  }, POLLING_INTERVAL);
};

// 停止轮询
const stopPolling = () => {
  if (pollingInterval !== null) {
    window.clearInterval(pollingInterval);
    pollingInterval = null;
    console.log('已停止消息轮询');
  }
};

// 发送消息
const sendMessage = async (text: string) => {
  if (!text.trim() || isSending.value) return;
  
  // 确保目标用户ID存在
  if (!targetUser.value.id) {
    showToast('无法发送消息：未指定接收用户');
    return;
  }
  
  // 生成临时消息ID
  const tempMessageId = Date.now();
  
  // 添加用户消息到列表
  const userMessage: Message = {
    id: tempMessageId,
    type: 'user',
    content: text,
    timestamp: Date.now(),
    isRead: 0, // 默认为未读状态
  };
  messages.value.push(userMessage);
  
  // 清空输入框
  inputMessage.value = '';
  
  // 设置发送状态
  isSending.value = true;
  
  try {
    // 准备消息请求
    const messageRequest = {
      content: text,
      receiverId: targetUser.value.id
    };
    
    // 记录发送时间，避免重复获取
    const sendTime = new Date();
    
    // 使用HTTP API发送
    const response = await ChatControllerService.sendMessageUsingPost1(messageRequest);
    
    if (response.code === 0) {
      // 获取实际的消息ID
      const realMessageId = response.data;
      console.log(`消息发送成功，服务器返回ID: ${realMessageId}，临时ID: ${tempMessageId}`);
      
      // 更新本地消息
      const messageIndex = messages.value.findIndex(msg => msg.id === tempMessageId);
      
      if (messageIndex !== -1) {
        // 更新消息，使用服务器返回的ID替换临时ID，保持未读状态
        const updatedMessage: Message = {
          id: realMessageId,  // 确保使用服务器返回的ID
          type: 'user',
          content: text,
          timestamp: Date.now(),
          isRead: 0, // 保持未读状态，直到接收到服务器确认
        };
        
        // 使用数组替换方式更新，确保响应式更新
        const newMessages = [...messages.value];
        newMessages[messageIndex] = updatedMessage;
        messages.value = newMessages;
        
        // 更新最后消息时间
        if (sendTime > new Date(lastMessageTime.value || 0)) {
          lastMessageTime.value = sendTime.toISOString();
        }
      }
      
      // 成功发送，获取会话信息
      if (!sessionId.value) {
        try {
          const sessionResponse = await ChatControllerService.getSessionWithUserUsingGet(
            targetUser.value.id
          );
          
          if (sessionResponse.code === 0 && sessionResponse.data) {
            sessionId.value = sessionResponse.data.id || null;
          }
        } catch (error) {
          console.error('获取会话ID失败:', error);
        }
      }
      
      // 发送成功后，开始定期检查该消息的已读状态，但不要自动标记为已读
      const checkThisMessageInterval = setInterval(() => {
        // 检查消息是否存在且未读
        const sentMessage = messages.value.find(msg => msg.id === realMessageId);
        if (sentMessage && sentMessage.isRead === 0) {
          // 调用检查函数，但不自动标记为已读
          checkMessageReadStatus();
        } else {
          // 如果消息已标记为已读或不存在，停止检查
          clearInterval(checkThisMessageInterval);
        }
      }, 2000); // 每2秒检查一次
      
      // 30秒后无论如何停止检查，避免无限检查
      setTimeout(() => {
        clearInterval(checkThisMessageInterval);
      }, 30000);
    } else {
      throw new Error(response.message || '未知错误');
    }
    
    // 确保SSE连接已建立
    if (!sseConnected.value) {
      startSSEConnection();
    }
    
    // 滚动到底部
    scrollToBottom();
  } catch (error) {
    showToast(`发送失败: ${error instanceof Error ? error.message : '未知错误'}`);
    // 移除失败的消息
    const failedIndex = messages.value.findIndex(msg => msg.id === tempMessageId);
    if (failedIndex !== -1) {
      messages.value.splice(failedIndex, 1);
    }
  } finally {
    isSending.value = false;
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

// 监听消息容器滚动，实现上拉加载更多历史消息
const setupScrollListener = () => {
  const messageList = document.querySelector('.message-list');
  if (!messageList) return;
  
  messageList.addEventListener('scroll', () => {
    if ((messageList as HTMLElement).scrollTop <= 50 && hasMoreMessages.value && !isSending.value) {
      loadMoreHistory();
    }
  });
};

// 监听输入框回车事件
const handleKeyDown = (event: KeyboardEvent) => {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault();
    sendMessage(inputMessage.value);
  }
};

// 点击发送按钮
const handleSend = () => {
  sendMessage(inputMessage.value);
};

// 发送表情符号
const handleEmojiSelect = (emoji: string) => {
  inputMessage.value += emoji;
  showEmojiPicker.value = false;
};

// 输入框获取焦点时
const handleInputFocus = () => {
  // 关闭表情选择器
  showEmojiPicker.value = false;
};

// 切换表情选择器
const toggleEmojiPicker = () => {
  showEmojiPicker.value = !showEmojiPicker.value;
};

// 切换全屏输入模式
const toggleFullscreenInput = () => {
  showFullscreenInput.value = !showFullscreenInput.value;
};

// 发送全屏输入框消息
const handleFullscreenSubmit = (text: string) => {
  showFullscreenInput.value = false;
  if (text.trim()) {
    sendMessage(text);
  }
};

// 添加处理已读状态更新的方法
const handleReadStatusUpdate = (messageId: number, isRead: number) => {
  console.log(`UI触发更新消息 ${messageId} 的已读状态为: ${isRead}`);
  if (isRead === 1) {
    // 如果消息变为已读，调用API标记为已读
    markMessageAsRead(messageId);
  }
};

// 在组件挂载时添加额外的状态检查
onMounted(async () => {
  // 设置当前用户信息
  if (userStore.userInfo) {
    userInfo.value = {
      id: userStore.userInfo.id || 0,
      name: userStore.userInfo.userName || '',
      avatar: userStore.userInfo.userAvatar || DEFAULT_USER_AVATAR,
    };
  } else {
    // 用户未登录，尝试重新获取用户信息
    try {
      const currentUser = await userStore.fetchCurrentUser();
      if (currentUser) {
        userInfo.value = {
          id: currentUser.id || 0,
          name: currentUser.userName || '',
          avatar: currentUser.userAvatar || DEFAULT_USER_AVATAR,
        };
      } else {
        showToast('请先登录');
        return;
      }
    } catch (error) {
      console.error('获取当前用户信息失败:', error);
      showToast('请先登录');
      return;
    }
  }
  
  console.log('组件挂载，初始化对话，当前用户ID:', userInfo.value.id);
  
  // 初始化对话
  await initializeChat();
  
  // 设置消息滚动监听
  setupScrollListener();
  
  // 确保创建SSE连接
  setTimeout(() => {
    if (!sseConnected.value) {
      console.log('挂载后SSE未连接，尝试重新连接');
      reconnectSSE();
    }
  }, 2000);
  
  // 设置定时检查消息已读状态
  readStatusCheckInterval = window.setInterval(checkMessageReadStatus, 3000); // 每3秒检查一次
  
  // 初始化后立即检查一次
  setTimeout(checkMessageReadStatus, 1000);
  
  // 设置定期健康检查
  healthCheckInterval = window.setInterval(async () => {
    if (sseConnected.value && sessionId.value) {
      try {
        // 检查SSE连接健康状态
        const statusResponse = await ChatControllerService.getChatStatusUsingGet();
        console.log('SSE连接健康状态:', statusResponse);
        
        // 如果连接异常，尝试重连
        if (statusResponse?.data?.connected === false) {
          console.log('SSE连接状态异常，尝试重新连接');
          reconnectSSE();
        }
        
        // 检查消息已读状态
        await checkMessageReadStatus();
      } catch (error) {
        console.error('健康检查失败:', error);
      }
    }
  }, 10000); // 10秒检查一次
});

// 当路由参数改变时重新初始化对话
watch(() => route.params.userId, async (newUserId) => {
  if (newUserId && Number(newUserId) !== targetUser.value.id) {
    targetUser.value.id = Number(newUserId);
    messages.value = [];
    currentPage.value = 1;
    lastMessageTime.value = null;
    sessionId.value = null; // 重置会话ID
    // 停止当前SSE连接并创建新连接
    stopSSEConnection();
    await initializeChat();
  }
});

// 组件销毁前清理资源
onBeforeUnmount(() => {
  // 清除SSE连接
  stopSSEConnection();
  
  // 停止轮询
  stopPolling();
  
  // 断开SSE连接
  try {
    ChatControllerService.disconnectUsingPost();
  } catch (error) {
    console.error('断开SSE连接失败:', error);
  }
  
  // 清除定时检查已读状态的定时器
  if (readStatusCheckInterval !== null) {
    window.clearInterval(readStatusCheckInterval);
    readStatusCheckInterval = null;
  }
  
  // 清理健康检查定时器
  if (healthCheckInterval !== null) {
    window.clearInterval(healthCheckInterval);
    healthCheckInterval = null;
  }
});
</script>

<style scoped>
.user-chat-detail {
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
  padding-bottom: 60px;
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
  overflow-y: auto;
}

/* 调整收到的消息样式 */
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

/* 调试面板样式 */
.debug-panel {
  position: fixed;
  bottom: 130px;
  right: 10px;
  background-color: rgba(0, 0, 0, 0.7);
  color: #fff;
  border-radius: 8px;
  padding: 10px;
  font-size: 12px;
  z-index: 1000;
  max-width: 200px;
}

.debug-panel p {
  margin: 5px 0;
  word-break: break-all;
}

.debug-buttons {
  display: flex;
  gap: 5px;
  margin-top: 8px;
}

.debug-buttons button {
  background-color: #1989fa;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 5px 8px;
  font-size: 12px;
  cursor: pointer;
}

.debug-buttons button:active {
  background-color: #0e71d8;
}
</style> 