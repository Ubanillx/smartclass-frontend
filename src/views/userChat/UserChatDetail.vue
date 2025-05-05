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
      />
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
import { ref, onMounted, onBeforeUnmount, watch } from 'vue';
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
import {
  UserControllerService
} from '../../services';
import type { UserInfo, Message } from '../../components/Dialogue/ChatMessageHandler';
import { ChatControllerService } from '../../services/services/ChatControllerService';

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
  
  // 加载目标用户信息
  try {
    await loadTargetUserInfo();
  } catch (error) {
    // 已经设置了默认值，不需要额外处理
  }
  
  // 加载历史消息
  try {
    await loadChatHistory();
  } catch (error) {
    // 错误已在函数内部处理
  }
};

// 标记消息为已读
const markMessageAsRead = async (messageId?: number) => {
  // 如果没有提供有效的消息ID，直接返回
  if (!messageId || typeof messageId !== 'number') {
    return;
  }
  
  try {
    await ChatControllerService.markMessageAsReadUsingPost(messageId);
  } catch (error) {
    // 忽略错误
  }
};

// 加载历史消息
const loadChatHistory = async () => {
  if (!targetUser.value.id) return;

  try {
    const response = await ChatControllerService.getMessagesBetweenUsersUsingGet(
      targetUser.value.id,
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
      
      // 标记消息为已读
      if (response.data.records && response.data.records.length > 0) {
        const unreadMessages = response.data.records.filter(msg => 
          msg && msg.isRead === 0 && msg.senderId === targetUser.value.id
        );
        
        if (unreadMessages.length > 0) {
          const messageIds = unreadMessages.map(msg => msg.id).filter(Boolean) as number[];
          if (messageIds.length > 0) {
            try {
              await ChatControllerService.markMessagesAsReadUsingPost(messageIds);
              
              // 更新本地消息的已读状态
              unreadMessages.forEach(unreadMsg => {
                if (unreadMsg && unreadMsg.id) {
                  const msgIndex = messages.value.findIndex(m => m.id === unreadMsg.id);
                  if (msgIndex !== -1 && messages.value[msgIndex]) {
                    messages.value[msgIndex].isRead = 1;
                  }
                }
              });
            } catch (error) {
              // 忽略错误
            }
          }
        }
      }
      
      // 滚动到底部
      scrollToBottom();
    }
  } catch (error) {
    showToast('获取历史消息失败');
  }
};

// 加载更多历史消息
const loadMoreHistory = async () => {
  if (!hasMoreMessages.value) return;
  
  currentPage.value++;
  await loadChatHistory();
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
    
    // 记录发送时间，避免轮询时重复获取
    const sendTime = new Date();
    
    // 发送消息到服务器
    const response = await ChatControllerService.sendMessageUsingPost1(messageRequest);
    
    if (response.code === 0 && response.data) {
      // 成功发送，用服务器返回的ID替换临时ID
      const messageId = Number(response.data);
      const messageIndex = messages.value.findIndex(msg => msg.id === tempMessageId);
      
      if (messageIndex !== -1) {
        // 检查是否存在重复消息
        const existingMessageIndex = messages.value.findIndex(msg => msg.id === messageId && msg.id !== tempMessageId);
        
        if (existingMessageIndex !== -1) {
          // 如果存在重复消息，删除临时消息
          messages.value.splice(messageIndex, 1);
        } else {
          // 否则，用新消息替换临时消息
          const updatedMessage: Message = {
            id: messageId,
            type: 'user',
            content: text,
            timestamp: Date.now(),
            isRead: 0, // 默认为未读状态
          };
          messages.value.splice(messageIndex, 1, updatedMessage);
        }
        
        // 更新最后消息时间
        if (sendTime > new Date(lastMessageTime.value || 0)) {
          lastMessageTime.value = sendTime.toISOString();
        }
      }
      
      // 滚动到底部
      scrollToBottom();
    } else {
      showToast('发送消息失败: ' + (response.message || '未知错误'));
      
      // 标记消息发送失败
      const messageIndex = messages.value.findIndex(msg => msg.id === tempMessageId);
      if (messageIndex !== -1) {
        const failedMessage: Message = {
          id: tempMessageId,
          type: 'user',
          content: text + ' (发送失败)',
          timestamp: Date.now(),
          isRead: 0, // 默认为未读状态
        };
        messages.value.splice(messageIndex, 1, failedMessage);
      }
    }
  } catch (error) {
    showToast('发送消息失败，请检查网络连接');
    
    // 标记消息发送失败
    const messageIndex = messages.value.findIndex(msg => msg.id === tempMessageId);
    if (messageIndex !== -1) {
      const failedMessage: Message = {
        id: tempMessageId,
        type: 'user',
        content: text + ' (发送失败)',
        timestamp: Date.now(),
        isRead: 0, // 默认为未读状态
      };
      messages.value.splice(messageIndex, 1, failedMessage);
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

// 加载目标用户信息
const loadTargetUserInfo = async () => {
  if (!targetUser.value.id) return;
  
  loadingUserInfo.value = true;
  try {
    // 尝试直接使用ID参数
    const response = await UserControllerService.getUserVoByIdUsingGet(targetUser.value.id);
    
    if (response.code === 0 && response.data) {
      targetUser.value = {
        id: response.data.id || 0,
        name: response.data.userName || '对话用户',
        avatar: response.data.userAvatar || DEFAULT_USER_AVATAR
      };
    } else {
      // 第一种方法失败，尝试使用列表查询
      try {
        const listResponse = await UserControllerService.listUserVoByPageUsingPost({
          id: targetUser.value.id,
          pageSize: 1,
          current: 1
        });
        
        if (listResponse.code === 0 && listResponse.data?.records && listResponse.data.records.length > 0) {
          const userData = listResponse.data.records[0];
          targetUser.value = {
            id: userData.id || 0,
            name: userData.userName || '对话用户',
            avatar: userData.userAvatar || DEFAULT_USER_AVATAR
          };
        } else {
          // 使用默认值
          targetUser.value.name = `用户${targetUser.value.id}`;
          targetUser.value.avatar = DEFAULT_USER_AVATAR;
          
          showToast('无法获取用户信息');
        }
      } catch (err) {
        // 使用默认值
        targetUser.value.name = `用户${targetUser.value.id}`;
        targetUser.value.avatar = DEFAULT_USER_AVATAR;
        
        showToast('无法获取用户信息');
      }
    }
  } catch (error) {
    // 使用默认值
    targetUser.value.name = `用户${targetUser.value.id}`;
    targetUser.value.avatar = DEFAULT_USER_AVATAR;
    
    showToast('获取用户信息失败，使用默认值');
  } finally {
    loadingUserInfo.value = false;
  }
};

// 组件挂载时的逻辑
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
      avatar: userStore.userInfo.userAvatar || DEFAULT_USER_AVATAR,
    };
  }

  // 如果目标用户ID是从路由中获取的，初始化对话
  if (route.params.userId) {
    await initializeChat();
  }
  
  // 设置滚动监听器用于加载更多历史消息
  setTimeout(setupScrollListener, 500);
});

// 路由参数变化时更新目标用户信息并加载新对话
watch(() => route.params.userId, async (newUserId) => {
  if (newUserId) {
    targetUser.value.id = Number(newUserId);
    
    // 重置分页状态
    currentPage.value = 1;
    hasMoreMessages.value = true;
    lastMessageTime.value = null;
    
    // 加载目标用户信息
    await loadTargetUserInfo();
    
    // 加载新对话历史
    await loadChatHistory();
  }
}, { immediate: false });

// 组件销毁前清理资源
onBeforeUnmount(() => {
  // 组件销毁时的清理工作
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
</style> 