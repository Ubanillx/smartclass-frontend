<template>
  <div class="friend-requests has-backbutton">
    <!-- 使用BackButton替换van-nav-bar -->
    <back-button title="好友请求" />
    
    <!-- 单独放置添加按钮，不占用BackButton的框 -->
    <div class="action-button" @click="handleAddFriend">
      <van-icon name="friends-o" size="24" />
    </div>

    <!-- 标签页 -->
    <van-tabs v-model:active="activeTab" animated swipeable color="#1989fa">
      <van-tab title="收到的请求">
        <div class="requests-container">
          <van-loading v-if="loading" size="24px" vertical>加载中...</van-loading>
          <template v-else-if="receivedRequests.length > 0">
            <div v-for="request in receivedRequests" :key="request.id" class="request-item">
              <div class="avatar-container">
                <van-image
                  round
                  width="50"
                  height="50"
                  :src="request.senderUser?.userAvatar || 'https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg'"
                />
              </div>
              <div class="request-info">
                <div class="request-user">
                  <span class="username">{{ request.senderUser?.userName }}</span>
                  <span class="time">{{ formatTime(request.createTime) }}</span>
                </div>
                <div class="request-message">{{ request.message || '想添加你为好友' }}</div>
                <!-- 保留状态显示 -->
                <div class="request-status" :class="request.status?.toLowerCase()">
                  {{ getStatusText(request.status) }}
                </div>
                <div class="request-actions" v-if="request.status?.toLowerCase() === 'pending'">
                  <van-button 
                    size="small" 
                    type="primary" 
                    @click="handleAccept(request.id)"
                    :loading="request.loading"
                  >
                    接受
                  </van-button>
                  <van-button 
                    size="small" 
                    plain 
                    @click="handleReject(request.id)"
                    :disabled="request.loading"
                  >
                    拒绝
                  </van-button>
                </div>
              </div>
            </div>
          </template>
          <van-empty v-else description="暂无好友请求" />
        </div>
      </van-tab>
      <van-tab title="发出的请求">
        <div class="requests-container">
          <van-loading v-if="loading" size="24px" vertical>加载中...</van-loading>
          <template v-else-if="sentRequests.length > 0">
            <div v-for="request in sentRequests" :key="request.id" class="request-item">
              <div class="avatar-container">
                <van-image
                  round
                  width="50"
                  height="50"
                  :src="request.receiverUser?.userAvatar || 'https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg'"
                />
              </div>
              <div class="request-info">
                <div class="request-user">
                  <span class="username">{{ request.receiverUser?.userName }}</span>
                  <span class="time">{{ formatTime(request.createTime) }}</span>
                </div>
                <div class="request-message">{{ request.message || '你发送了好友请求' }}</div>
                <div class="request-status" :class="request.status?.toLowerCase()">
                  {{ getStatusText(request.status) }}
                </div>
                <div class="request-actions" v-if="request.status?.toLowerCase() === 'pending'">
                  <van-button 
                    size="small" 
                    plain 
                    @click="handleCancel(request.id)"
                  >
                    取消
                  </van-button>
                </div>
              </div>
            </div>
          </template>
          <van-empty v-else description="暂无发出的好友请求" />
        </div>
      </van-tab>
    </van-tabs>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import { showToast, showSuccessToast, showLoadingToast } from 'vant';
import { BackButton } from '../../../components/Common';
import { FriendRequestControllerService } from '../../../services/services/FriendRequestControllerService';
import { useUserStore } from '../../../stores/userStore';
import type { FriendRequestVO } from '../../../services/models/FriendRequestVO';
import type { ToastWrapperInstance } from 'vant/es/toast/types';

// 扩展FriendRequestVO类型，添加loading属性
interface ExtendedFriendRequestVO extends FriendRequestVO {
  loading?: boolean;
}

const router = useRouter();
const userStore = useUserStore();
const activeTab = ref(0);

// 加载状态
const loading = ref(false);

// 收到的好友请求
const receivedRequests = ref<ExtendedFriendRequestVO[]>([]);

// 发出的好友请求
const sentRequests = ref<FriendRequestVO[]>([]);

// 监听标签页切换
watch(activeTab, (newValue) => {
  if (newValue === 0) {
    fetchReceivedRequests();
  } else {
    fetchSentRequests();
  }
});

// 获取收到的好友请求
const fetchReceivedRequests = async () => {
  loading.value = true;
  try {
    // 使用API获取收到的好友请求
    const response = await FriendRequestControllerService.getReceivedFriendRequestsUsingGet();
    if (response.code === 0 && response.data) {
      receivedRequests.value = response.data.map((item: FriendRequestVO) => ({
        ...item,
        loading: false,
      }));
    } else {
      showToast('获取收到的好友请求失败：' + (response.message || '未知错误'));
      receivedRequests.value = [];
    }
  } catch (error) {
    console.error('获取收到的好友请求出错', error);
    showToast('获取收到的好友请求出错');
    receivedRequests.value = [];
  } finally {
    loading.value = false;
  }
};

// 获取发出的好友请求
const fetchSentRequests = async () => {
  loading.value = true;
  try {
    // 使用API获取发出的好友请求，不传status参数获取所有请求
    const response = await FriendRequestControllerService.getSentFriendRequestsUsingGet();
    if (response.code === 0 && response.data) {
      sentRequests.value = response.data.map((item: FriendRequestVO) => ({
        ...item,
        loading: false,
      }));
    } else {
      showToast('获取发出的好友请求失败：' + (response.message || '未知错误'));
      sentRequests.value = [];
    }
  } catch (error) {
    console.error('获取发出的好友请求出错', error);
    showToast('获取发出的好友请求出错');
    sentRequests.value = [];
  } finally {
    loading.value = false;
  }
};

// 格式化时间
const formatTime = (timeString?: string) => {
  if (!timeString) return '';
  
  const now = new Date();
  const time = new Date(timeString);
  const diffInSeconds = Math.floor((now.getTime() - time.getTime()) / 1000);
  
  if (diffInSeconds < 60) {
    return '刚刚';
  } else if (diffInSeconds < 3600) {
    return `${Math.floor(diffInSeconds / 60)}分钟前`;
  } else if (diffInSeconds < 86400) {
    return `${Math.floor(diffInSeconds / 3600)}小时前`;
  } else if (diffInSeconds < 604800) {
    return `${Math.floor(diffInSeconds / 86400)}天前`;
  } else {
    const year = time.getFullYear();
    const month = time.getMonth() + 1;
    const day = time.getDate();
    return `${year}-${month < 10 ? '0' + month : month}-${day < 10 ? '0' + day : day}`;
  }
};

// 状态文本映射
const getStatusText = (status?: string) => {
  if (!status) return '';
  
  switch (status.toLowerCase()) {
    case 'pending':
      return '等待验证';
    case 'accepted':
      return '已接受';
    case 'rejected':
      return '已拒绝';
    default:
      return '';
  }
};

// 处理添加好友
const handleAddFriend = () => {
  router.push('/friends/add');
};

// 处理接受请求
const handleAccept = async (id?: number) => {
  if (!id) return;
  
  const request = receivedRequests.value.find(req => req.id === id);
  if (!request) return;
  
  // 设置当前请求的loading状态
  request.loading = true;
  
  const loadingToastInstance = showLoadingToast({
    message: '处理中...',
    forbidClick: true,
  }) as ToastWrapperInstance;
  
  try {
    const response = await FriendRequestControllerService.acceptFriendRequestUsingPost(id);
    if (response.code === 0 && response.data) {
      // 更新请求状态，保留在列表中显示
      if (request) {
        request.status = 'accepted';
      }
      showSuccessToast('已添加为好友');
    } else {
      showToast('接受好友请求失败：' + (response.message || '未知错误'));
    }
  } catch (error) {
    console.error('接受好友请求出错', error);
    showToast('操作失败，请稍后再试');
  } finally {
    loadingToastInstance.close();
    if (request) {
      request.loading = false;
    }
    // 重新获取列表
    fetchReceivedRequests();
  }
};

// 处理拒绝请求
const handleReject = async (id?: number) => {
  if (!id) return;
  
  const request = receivedRequests.value.find(req => req.id === id);
  if (!request) return;
  
  // 设置当前请求的loading状态
  request.loading = true;
  
  const loadingToastInstance = showLoadingToast({
    message: '处理中...',
    forbidClick: true,
  }) as ToastWrapperInstance;
  
  try {
    const response = await FriendRequestControllerService.rejectFriendRequestUsingPost(id);
    if (response.code === 0 && response.data) {
      // 更新请求状态，保留在列表中显示
      if (request) {
        request.status = 'rejected';
      }
      showToast('已拒绝请求');
    } else {
      showToast('拒绝好友请求失败：' + (response.message || '未知错误'));
    }
  } catch (error) {
    console.error('拒绝好友请求出错', error);
    showToast('操作失败，请稍后再试');
  } finally {
    loadingToastInstance.close();
    if (request) {
      request.loading = false;
    }
    // 重新获取列表
    fetchReceivedRequests();
  }
};

// 处理取消请求
const handleCancel = async (id?: number) => {
  if (!id) return;
  
  const loadingToastInstance = showLoadingToast({
    message: '处理中...',
    forbidClick: true,
  }) as ToastWrapperInstance;
  
  try {
    // 直接使用id参数调用deleteFriendRequestUsingDelete方法
    const response = await FriendRequestControllerService.deleteFriendRequestUsingDelete(id);
    if (response.code === 0 && response.data) {
      // 从列表中移除该请求
      sentRequests.value = sentRequests.value.filter(req => req.id !== id);
      showToast('已取消请求');
    } else {
      showToast('取消好友请求失败：' + (response.message || '未知错误'));
    }
  } catch (error) {
    console.error('取消好友请求出错', error);
    showToast('操作失败，请稍后再试');
  } finally {
    loadingToastInstance.close();
    // 重新获取列表
    fetchSentRequests();
  }
};

// 初始化加载数据
onMounted(() => {
  fetchReceivedRequests();
});
</script>

<style scoped>
.friend-requests {
  padding-bottom: 20px;
  min-height: 100vh;
  background-color: #f2f7fd;
  position: relative;
}

.action-button {
  position: absolute;
  top: 12px;
  right: 16px;
  z-index: 101;
  width: 42px;
  height: 42px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #fff;
  border-radius: 50%;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: all 0.2s ease;
  color: #1989fa;
}

.action-button:active {
  transform: scale(0.92);
  background-color: #f2f7fd;
}

.requests-container {
  padding: 12px;
  max-width: 800px;
  margin: 0 auto;
}

.request-item {
  background-color: #fff;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 12px;
  display: flex;
  align-items: flex-start;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.avatar-container {
  margin-right: 12px;
}

.request-info {
  flex: 1;
  min-width: 0;
  position: relative;
}

.request-user {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4px;
}

.username {
  font-weight: 700;
  font-size: var(--font-size-md);
  color: #323233;
}

.time {
  font-size: var(--font-size-sm);
  color: #969799;
}

.request-message {
  font-size: var(--font-size-md);
  color: #646566;
  margin-bottom: 8px;
  word-break: break-word;
}

.request-status {
  font-size: var(--font-size-sm);
  border-radius: 10px;
  padding: 2px 8px;
  display: inline-block;
  margin-bottom: 8px;
}

.request-status.pending {
  color: #ff976a;
  background-color: rgba(255, 151, 106, 0.1);
}

.request-status.accepted {
  color: #07c160;
  background-color: rgba(7, 193, 96, 0.1);
}

.request-status.rejected {
  color: #969799;
  background-color: rgba(150, 151, 153, 0.1);
}

.request-actions {
  display: flex;
  flex-direction: row;
  gap: 8px;
  margin-top: 12px;
}

:deep(.van-button--small) {
  min-width: 60px;
  height: 32px;
  padding: 0 12px;
  font-size: var(--font-size-sm);
}

/* 平板和PC端样式 */
@media (min-width: 768px) {
  .requests-container {
    max-width: 650px;
    margin: 0 auto;
  }
  
  .request-item {
    display: flex;
    align-items: flex-start;
  }
  
  .request-info {
    flex: 1;
    padding-right: 0;
  }
}

:deep(.van-tab) {
  font-weight: bold;
  font-size: 16px;
}

:deep(.van-tabs__wrap) {
  padding-top: 8px;
}

:deep(.van-tabs__nav) {
  background: transparent;
}
</style> 