<template>
  <div class="chat-history-content">
    <div class="history-container">
      <transition-group name="chat-fade" tag="div">
        <!-- 对话记录列表 -->
        <chat-list 
          v-if="!loading && !error && total > 0"
          :key="'chat-list-' + currentPage" 
          :chats="transformedChatHistory" 
          :show-status="false" 
          @select="handleChatSelect" 
          @long-press="handleLongPress"
        />
      </transition-group>
      
      <!-- 分页控件 -->
      <div class="pagination-container" v-if="total > 0 && !loading && !error">
        <!-- 统一使用大屏幕分页样式 -->
        <van-pagination 
          v-model="currentPage" 
          :total-items="total" 
          :items-per-page="pageSize" 
          :show-page-size="5"
          force-ellipses
          @change="handlePageChange"
          class="custom-pagination"
        >
          <template #prev-text>
            <van-icon name="arrow-left" />
          </template>
          <template #next-text>
            <van-icon name="arrow" />
          </template>
          <template #page-desc>
            <span class="page-desc-text">{{ currentPage }}/{{ totalPages }} 页</span>
          </template>
        </van-pagination>
      </div>
      
      <!-- 空状态提示 -->
      <van-empty 
        v-if="total === 0 && !loading && !error" 
        description="暂无对话记录"
        class="empty-state"
      />
      
      <!-- 加载状态 -->
      <div v-if="loading" class="loading-container">
        <van-loading type="spinner" size="32" color="#1989fa" />
        <p>正在加载对话记录，可能需要一段时间...</p>
      </div>

      <!-- 错误状态 -->
      <network-error 
        v-if="error" 
        :message="error" 
        :loading="retryLoading"
        @retry="retryLoadData"
      />
    </div>
    
    <!-- 操作菜单 -->
    <van-action-sheet
      v-model:show="showActionSheet"
      :actions="actionOptions"
      cancel-text="取消"
      close-on-click-action
      @select="handleActionSelect"
      @cancel="showActionSheet = false"
    />

    <!-- 删除确认弹窗 -->
    <van-dialog
      v-model:show="showDeleteConfirm"
      title="删除对话"
      :message="`确定要删除这条对话记录吗？该操作不可恢复。`"
      theme="round-button"
      confirm-button-color="#1989fa"
      cancel-button-color="#7d7e80"
      show-cancel-button
      @confirm="confirmDelete"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { ChatList } from '../../../components/Dialogue';
import { NetworkError } from '../../../components/Common';
import { AiAvatarChatControllerService } from '../../../services/services/AiAvatarChatControllerService.ts';
import type { ChatMessageVO } from '../../../services/models/ChatMessageVO.ts';
import { showToast, showSuccessToast } from 'vant';

// 定义聊天项类型
interface ChatItemType {
  id: number;
  sessionId?: any;
  assistantId: number;
  assistantName: string;
  avatar: string;
  lastMessage: string;
  summary?: string;
  lastTime: string;
  online?: boolean;
  tags?: string[];
  type: number;
}

// 定义操作菜单项类型
interface ActionOption {
  name: string;
  color?: string;
  className?: string;
}

// 定义事件
const emit = defineEmits(['select']);

// 分页相关状态
const currentPage = ref(1);
const pageSize = ref(10);
const total = ref(0);
const totalPages = ref(0);
const loading = ref(false);
const retryLoading = ref(false);
const error = ref('');

// 操作菜单相关状态
const showActionSheet = ref(false);
const showDeleteConfirm = ref(false);
const chatToDelete = ref<ChatItemType | null>(null);

// 定义操作菜单选项
const actionOptions = [
  { name: '删除对话', color: '#ee0a24' }
];

// 存储从API获取的聊天历史
const chatMessages = ref<ChatMessageVO[]>([]);

// 将API返回的数据转换为UI组件需要的格式，只保留每个sessionId的最后一条消息
const transformedChatHistory = computed(() => {
  const result: Array<{
    id: number;
    sessionId: any;
    assistantId: number;
    assistantName: string;
    avatar: string;
    lastMessage: string;
    summary?: string;
    lastTime: string;
    online?: boolean;
    tags?: string[];
    type: number;
  }> = [];
  
  // 直接使用接口返回的数据，不做筛选
  for (const message of chatMessages.value) {
    const content = message.content || '';
    const messageType = message.messageType || '对话';
    const sessionId = message.sessionId || String(message.id || '0');
    
    result.push({
      id: message.id || 0,
      sessionId: sessionId,
      assistantId: message.aiAvatarId || 0,
      assistantName: message.aiAvatarName || '未知助手',
      avatar: message.aiAvatarImgUrl || '/default.jpg',
      lastMessage: content,
      summary: content.substring(0, 50) + (content.length > 50 ? '...' : ''),
      lastTime: message.createTime ? formatTime(message.createTime) : '未知时间',
      online: false,
      tags: [messageType],
      type: 1,
    });
  }
  
  return result;
});

// 重试加载数据
const retryLoadData = () => {
  retryLoading.value = true;
  loadChatHistory().finally(() => {
    retryLoading.value = false;
  });
};

// 格式化时间显示
const formatTime = (timeStr: string | undefined): string => {
  if (!timeStr) return '未知时间';
  
  try {
    const date = new Date(timeStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return date.getHours().toString().padStart(2, '0') + ':' + 
             date.getMinutes().toString().padStart(2, '0');
    } else if (diffDays === 1) {
      return '昨天';
    } else if (diffDays < 7) {
      const days = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
      return days[date.getDay()] || '未知时间';
    } else {
      return `${date.getMonth() + 1}月${date.getDate()}日`;
    }
  } catch (e) {
    return timeStr || '未知时间';
  }
};

// 加载聊天历史数据
const loadChatHistory = async () => {
  loading.value = true;
  error.value = '';
  try {
    const response = await AiAvatarChatControllerService.getUserHistoryPageUsingGet(
      undefined,
      currentPage.value,
      pageSize.value
    );
    
    if (response.code === 0 && response.data) {
      // 使用接口返回的分页参数
      total.value = parseInt(String(response.data.total || '0'));
      pageSize.value = parseInt(String(response.data.size || '10'));
      currentPage.value = parseInt(String(response.data.current || '1'));
      totalPages.value = parseInt(String(response.data.pages || '1'));
      
      // 直接使用API返回的记录，不做任何筛选
      chatMessages.value = response.data.records || [];
    } else {
      error.value = '获取聊天历史失败，请检查网络连接';
      showToast('获取聊天历史失败: ' + (response.message || '未知错误'));
    }
  } catch (err) {
    error.value = '网络连接失败，请检查网络设置后重试';
    showToast('加载聊天历史出错');
  } finally {
    loading.value = false;
  }
};

// 处理页码变化
const handlePageChange = (page: number) => {
  currentPage.value = page;
  loadChatHistory();
};

// 处理对话选择
const handleChatSelect = (chat: ChatItemType) => {
  const sessionIdToUse = chat.sessionId || String(chat.id);
  emit('select', sessionIdToUse, chat.assistantId);
};

// 处理长按事件，显示操作菜单
const handleLongPress = (chat: ChatItemType) => {
  chatToDelete.value = chat;
  showActionSheet.value = true;
};

// 处理操作菜单选择
const handleActionSelect = (action: ActionOption) => {
  if (action.name === '删除对话') {
    showDeleteConfirm.value = true;
  }
};

// 确认删除对话
const confirmDelete = async () => {
  if (!chatToDelete.value) return;
  
  loading.value = true;
  error.value = '';
  try {
    // 确保sessionId是字符串类型，并且不为undefined
    let sessionId = '';
    if (typeof chatToDelete.value.sessionId === 'string') {
      sessionId = chatToDelete.value.sessionId;
    } else if (chatToDelete.value.sessionId) {
      sessionId = String(chatToDelete.value.sessionId);
    } else {
      sessionId = String(chatToDelete.value.id);
    }
    
    const response = await AiAvatarChatControllerService.deleteSessionUsingPost(sessionId);
    
    if (response.code === 0 && response.data) {
      showSuccessToast('删除成功');
      // 刷新列表
      loadChatHistory();
    } else {
      error.value = '删除失败，请稍后再试';
      showToast('删除失败: ' + (response.message || '未知错误'));
    }
  } catch (err) {
    error.value = '网络连接失败，请检查网络设置后重试';
    showToast('删除失败，请稍后重试');
  } finally {
    loading.value = false;
    chatToDelete.value = null;
  }
};

// 组件挂载时加载数据
onMounted(() => {
  loadChatHistory();
});
</script>

<style scoped>
.chat-history-content {
  width: 100%;
  position: relative;
  min-height: 200px;
  padding-bottom: 16px;
}

.history-container {
  max-width: 800px;
  margin: 0 auto;
  width: 100%;
  padding: 0 8px;
  box-sizing: border-box;
}

@media (max-width: 768px) {
  .history-container {
    padding: 0 4px;
  }
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 0;
}

.loading-container p {
  margin-top: 12px;
  color: #666;
  font-size: 14px;
  font-family: 'Noto Sans SC', sans-serif;
}

.empty-state {
  padding: 40px 0;
}

/* 列表切换动画 */
.chat-fade-enter-active,
.chat-fade-leave-active {
  transition: all 0.5s ease;
}

.chat-fade-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.chat-fade-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}

.pagination-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 16px 8px;
  padding: 10px 15px;
  background-color: rgba(255, 255, 255, 0.5);
  border-radius: 12px;
  backdrop-filter: blur(5px);
  max-width: 600px;
  box-sizing: border-box;
  align-self: center;
  margin-left: auto;
  margin-right: auto;
}

/* 响应式设计调整 */
@media (max-width: 480px) {
  .pagination-container {
    max-width: 95%;
    margin: 12px auto;
    padding: 8px 12px;
  }
}

@media (min-width: 481px) {
  .pagination-container {
    max-width: 600px;
    margin: 16px auto;
  }
}

/* 自定义分页样式 */
:deep(.custom-pagination) {
  --van-pagination-height: 40px;
  --van-pagination-item-width: 40px;
  --van-pagination-item-margin: 0 5px;
  --van-pagination-item-default-color: #1989fa;
  --van-pagination-item-font-size: 15px;
  --van-pagination-item-border-width: 0;
  --van-pagination-background-color: transparent;
  margin-top: 8px;
  width: 100%;
  display: flex;
  justify-content: center;
}

:deep(.custom-pagination .van-pagination__item) {
  border-radius: 8px;
  background-color: rgba(234, 240, 246, 0.7);
  transition: all 0.3s ease;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

:deep(.custom-pagination .van-pagination__item--active) {
  background-color: #1989fa;
  color: white;
  font-weight: bold;
  box-shadow: 0 2px 8px rgba(25, 137, 250, 0.3);
  transform: scale(1.05);
}

:deep(.custom-pagination .van-pagination__prev),
:deep(.custom-pagination .van-pagination__next) {
  background-color: rgba(234, 240, 246, 0.7);
  color: #666;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

:deep(.custom-pagination .van-pagination__prev:active),
:deep(.custom-pagination .van-pagination__next:active),
:deep(.custom-pagination .van-pagination__item:active) {
  transform: scale(0.95);
  opacity: 0.8;
}

:deep(.custom-pagination .van-pagination__page-desc) {
  color: #666;
  font-size: 13px;
  margin: 0 10px;
}

.page-desc-text {
  font-family: 'Noto Sans SC', sans-serif;
  color: #666;
}

/* 平滑切换效果 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
