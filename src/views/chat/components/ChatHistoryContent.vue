<template>
  <div class="chat-history-content">
    <div class="history-container">
      <!-- 内容容器 -->
      <div class="content-wrapper">
        <!-- 对话记录列表 -->
        <div v-show="!loading && !error && total > 0" class="chat-list-container">
          <chat-list
            :chats="transformedChatHistory"
            :show-status="false"
            @select="handleChatSelect"
            @long-press="handleLongPress"
          />
        </div>

        <!-- 空状态提示 -->
        <van-empty
          v-show="total === 0 && !loading && !error"
          description="暂无对话记录"
          class="empty-state"
        />

        <!-- 加载状态 -->
        <div v-show="loading" class="loading-container">
          <van-loading type="spinner" size="32" color="#1989fa" />
          <p>正在加载对话记录，可能需要一段时间...</p>
        </div>

        <!-- 错误状态 -->
        <network-error
          v-show="error"
          :message="error"
          :loading="retryLoading"
          @retry="retryLoadData"
        />
      </div>
    </div>

    <!-- 固定在底部的分页组件 -->
    <div class="fixed-pagination" v-show="total > 0 && !loading && !error">
      <chat-pagination
        :total-items="total"
        :page-size="pageSize"
        :total-pages="totalPages"
        :initial-page="currentPage"
        @page-change="handlePageChange"
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
import { ChatList, ChatPagination } from '../../../components/Dialogue';
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
const actionOptions = [{ name: '删除对话', color: '#ee0a24' }];

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
      lastTime: message.createTime
        ? formatTime(message.createTime)
        : '未知时间',
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
      return (
        date.getHours().toString().padStart(2, '0') +
        ':' +
        date.getMinutes().toString().padStart(2, '0')
      );
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
    const response =
      await AiAvatarChatControllerService.getUserHistoryPageUsingGet(
        undefined,
        currentPage.value,
        undefined
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
  // 避免重复加载当前页
  if (page === currentPage.value) return;
  
  // 先设置loading状态，但不清空现有数据
  loading.value = true;
  error.value = '';
  
  // 异步加载新页面数据
  AiAvatarChatControllerService.getUserHistoryPageUsingGet(
    undefined,
    page,
    undefined
  )
    .then(response => {
      if (response.code === 0 && response.data) {
        // 更新分页参数
        total.value = parseInt(String(response.data.total || '0'));
        pageSize.value = parseInt(String(response.data.size || '10'));
        totalPages.value = parseInt(String(response.data.pages || '1'));
        
        // 先更新数据，再更新页码，保证视觉连续性
        chatMessages.value = response.data.records || [];
        currentPage.value = page;
      } else {
        error.value = '获取聊天历史失败，请检查网络连接';
        showToast('获取聊天历史失败: ' + (response.message || '未知错误'));
      }
    })
    .catch(err => {
      error.value = '网络连接失败，请检查网络设置后重试';
      showToast('加载聊天历史出错');
    })
    .finally(() => {
      loading.value = false;
    });
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

    const response =
      await AiAvatarChatControllerService.deleteSessionUsingPost(sessionId);

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
  min-height: calc(100vh - 250px);
  padding-bottom: 80px; /* 为固定在底部的分页组件留出空间 */
}

.history-container {
  max-width: 800px;
  margin: 0 auto;
  width: 100%;
  padding: 0 8px;
  box-sizing: border-box;
  position: relative;
}

/* 内容容器 */
.content-wrapper {
  position: relative;
  min-height: 200px;
  padding-bottom: 20px;
}

.chat-list-container {
  width: 100%;
}

/* 固定在底部的分页组件 */
.fixed-pagination {
  position: fixed;
  bottom: 70px;
  left: 0;
  right: 0;
  width: 100%;
  background-color: rgba(242, 247, 253, 0.95);
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
  z-index: 90;
  padding: 10px 0;
}

@media (max-width: 768px) {
  .history-container {
    padding: 0 4px;
  }
  
  .fixed-pagination {
    bottom: 65px;
  }
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 0;
  width: 100%;
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
</style>
