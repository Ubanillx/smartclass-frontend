<template>
  <div class="chat-history-content">
    <div class="history-container">
      <transition-group name="chat-fade" tag="div">
        <!-- 对话记录列表 -->
        <chat-list :key="'chat-list-' + currentPage" :chats="transformedChatHistory" :show-status="false" @select="handleChatSelect" />
      </transition-group>
      
      <!-- 分页控件 -->
      <div class="pagination-container" v-if="total > 0">
        <!-- 大屏幕显示完整分页 -->
        <van-pagination 
          v-model="currentPage" 
          :total-items="total" 
          :items-per-page="pageSize" 
          :show-page-size="5"
          force-ellipses
          @change="handlePageChange"
          class="custom-pagination desktop-pagination"
        >
          <template #prev-text>
            <van-icon name="arrow-left" />
          </template>
          <template #next-text>
            <van-icon name="arrow" />
          </template>
          <template #page-desc>
            <span class="page-desc-text">{{ currentPage }}/{{ Math.ceil(total / pageSize) }} 页</span>
          </template>
        </van-pagination>

        <!-- 小屏幕显示简化版分页 -->
        <div class="mobile-pagination">
          <van-button 
            :disabled="currentPage <= 1" 
            @click="handlePageChange(currentPage - 1)"
            class="page-btn prev-btn"
            icon="arrow-left"
            size="small"
          />
          
          <div class="page-indicator">{{ currentPage }}/{{ Math.ceil(total / pageSize) }}</div>
          
          <van-button 
            :disabled="currentPage >= Math.ceil(total / pageSize)" 
            @click="handlePageChange(currentPage + 1)"
            class="page-btn next-btn"
            icon="arrow"
            size="small"
          />
        </div>
      </div>
      
      <!-- 空状态提示 -->
      <van-empty v-if="total === 0" description="暂无对话记录" />
    </div>
    
    <!-- 加载状态 -->
    <div v-if="loading" class="loading-overlay">
      <van-loading type="spinner" color="#1989fa" class="loading" />
      <p class="loading-text">加载中...</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { ChatList } from '../../../components/Dialogue';
import { AiAvatarChatControllerService } from '../../../services/services/AiAvatarChatControllerService.ts';
import type { ChatMessageVO } from '../../../services/models/ChatMessageVO.ts';
import { showToast } from 'vant';

// 定义聊天项类型
interface ChatItemType {
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
}

// 定义事件
const emit = defineEmits(['select']);

// 分页相关状态
const currentPage = ref(1);
const pageSize = ref(10);
const total = ref(0);
const loading = ref(false);

// 存储从API获取的聊天历史
const chatMessages = ref<ChatMessageVO[]>([]);

// 将API返回的数据转换为UI组件需要的格式
const transformedChatHistory = computed(() => {
  return chatMessages.value.map(message => {
    const chatSessionId = message.sessionId || String(message.id || '0');
    const content = message.content || '';
    const messageType = message.messageType || '对话';
    
    return {
      id: message.id || 0,
      sessionId: chatSessionId as any,
      assistantId: message.aiAvatarId || 0,
      assistantName: message.aiAvatarName || '未知助手',
      avatar: message.aiAvatarImgUrl || 'https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg',
      lastMessage: content,
      summary: `对话内容: ${content.substring(0, 50)}${content.length > 50 ? '...' : ''}`,
      lastTime: message.createTime ? formatTime(message.createTime as string) : '未知时间',
      online: false,
      tags: [messageType],
      type: 1,
    };
  });
});

// 格式化时间显示
const formatTime = (timeStr: string): string => {
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
      return days[date.getDay()];
    } else {
      return `${date.getMonth() + 1}月${date.getDate()}日`;
    }
  } catch (e) {
    return timeStr;
  }
};

// 加载聊天历史数据
const loadChatHistory = async () => {
  loading.value = true;
  try {
    const response = await AiAvatarChatControllerService.getUserHistoryPageUsingGet(
      undefined,
      currentPage.value,
      pageSize.value
    );
    
    if (response.code === 0 && response.data) {
      chatMessages.value = (response.data.records || [])
        .filter(record => {
          return !(record.content && record.content.includes("会话已创建"));
        })
        .map(record => {
          if (!record.sessionId && record.id) {
            record.sessionId = String(record.id);
          } else if (!record.sessionId) {
            record.sessionId = '0';
          }
          return record;
        });
      
      total.value = chatMessages.value.length;
    } else {
      showToast('获取聊天历史失败: ' + (response.message || '未知错误'));
    }
  } catch (error) {
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
const handleChatSelect = (chat: any) => {
  const sessionIdToUse = chat.sessionId || String(chat.id);
  emit('select', sessionIdToUse, chat.assistantId);
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

/* 加载状态覆盖层 */
.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(3px);
  z-index: 10;
  border-radius: 12px;
}

.loading-text {
  margin-top: 10px;
  color: #1989fa;
  font-size: 14px;
  font-family: 'Noto Sans SC', sans-serif;
}

.loading {
  font-size: 24px;
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

/* 移动端分页样式 */
.mobile-pagination {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  max-width: 280px;
  padding: 8px 0;
}

.page-btn {
  margin: 0 5px;
  border-radius: 8px;
  background-color: rgba(234, 240, 246, 0.7);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
}

.page-btn:hover {
  background-color: rgba(220, 230, 240, 0.85);
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.08);
  transform: translateY(-2px);
}

.page-btn:active {
  transform: translateY(0) scale(0.95);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.page-btn.prev-btn:hover, 
.page-btn.next-btn:hover {
  color: #1989fa;
}

.prev-btn[disabled], 
.next-btn[disabled] {
  opacity: 0.5;
  background-color: rgba(234, 234, 234, 0.5);
  cursor: not-allowed;
  transform: none;
}

.page-indicator {
  font-family: 'Noto Sans SC', sans-serif;
  color: #666;
  padding: 0 10px;
  font-size: 14px;
  font-weight: 500;
  min-width: 60px;
  text-align: center;
}

/* 响应式设计 */
@media (max-width: 480px) {
  .mobile-pagination {
    max-width: 240px;
  }
  
  .mobile-pagination .page-btn {
    min-width: 32px;
    height: 32px;
  }
  
  .page-indicator {
    font-size: 13px;
    min-width: 50px;
  }
  
  .pagination-container {
    max-width: 95%;
    margin: 12px auto;
    padding: 6px 8px;
  }
  
  .desktop-pagination {
    display: none;
  }
  
  .mobile-pagination {
    display: flex;
  }
}

@media (min-width: 481px) {
  .desktop-pagination {
    display: flex;
  }
  
  .mobile-pagination {
    display: none;
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

/* 修改移动端按钮样式 */
.mobile-pagination .page-btn {
  min-width: 36px;
  height: 36px;
  padding: 0 8px;
}

/* 修改移动端分页按钮的图标大小 */
.mobile-pagination .van-icon {
  font-size: 16px;
}

@media (max-width: 480px) {
  .mobile-pagination {
    max-width: 240px;
  }
  
  .mobile-pagination .page-btn {
    min-width: 32px;
    height: 32px;
  }
  
  .page-indicator {
    font-size: 13px;
    min-width: 50px;
  }
}
</style>
