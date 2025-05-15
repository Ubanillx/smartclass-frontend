<template>
  <div class="add-friend has-backbutton">
    <!-- 使用BackButton替换van-nav-bar -->
    <back-button title="添加好友" />

    <!-- 添加扫码按钮，右上角位置 -->
    <div class="action-button" @click="handleScanQRCode">
      <van-icon name="qr" size="24" />
    </div>

    <!-- 搜索框 -->
    <div class="search-container">
      <van-search
        v-model="searchText"
        shape="round"
        placeholder="输入用户名、ID或邮箱搜索"
        @search="handleSearch"
        @clear="resetSearchResults"
        :clearable="true"
        :show-action="false"
        input-align="center"
        background="transparent"
      >
        <template #left-icon>
          <van-icon name="search" size="18" class="search-icon" />
        </template>
      </van-search>
    </div>

    <!-- 搜索结果 -->
    <div class="search-results" v-if="searchActive">
      <div class="section-title">搜索结果</div>
      <van-loading v-if="searchLoading" size="24px" vertical class="loading-container">加载中...</van-loading>
      <template v-else-if="searchResults.length > 0">
        <div
          v-for="user in searchResults"
          :key="user.id"
          class="user-item"
          @click="handleViewUserProfile(user.id)"
        >
          <div class="avatar-container">
            <van-image round width="48" height="48" :src="user.userAvatar || 'https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg'" />
          </div>
          <div class="user-info">
            <div class="user-name">{{ user.userName || '未知用户' }}</div>
            <div class="user-meta">ID: {{ user.id }}</div>
          </div>
          <div class="user-action">
            <van-button 
              v-if="!user.isFriend && !user.requestSent" 
              size="small" 
              type="primary" 
              @click.stop="showRequestDialog(user.id)"
              :loading="user.loading"
            >
              加为好友
            </van-button>
            <span v-else-if="user.isFriend" class="friend-status">已是好友</span>
            <span v-else-if="user.requestSent" class="friend-status">已发送请求</span>
          </div>
        </div>
      </template>
      <van-empty v-else description="无搜索结果" />
    </div>

    <!-- 推荐好友 -->
    <div class="recommend-container" v-if="!searchActive || searchText === ''">
      <div class="section-title">推荐好友</div>
      <van-loading v-if="recommendLoading" size="24px" vertical class="loading-container">加载中...</van-loading>
      <template v-else-if="recommendUsers.length > 0">
        <div
          v-for="user in recommendUsers"
          :key="user.id"
          class="user-item"
          @click="handleViewUserProfile(user.id)"
        >
          <div class="avatar-container">
            <van-image round width="48" height="48" :src="user.userAvatar || 'https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg'" />
          </div>
          <div class="user-info">
            <div class="user-name">{{ user.userName || '未知用户' }}</div>
            <div class="user-meta">{{ user.description || '推荐用户' }}</div>
          </div>
          <div class="user-action">
            <van-button 
              v-if="!user.isFriend && !user.requestSent"
              size="small" 
              type="primary" 
              @click.stop="showRequestDialog(user.id)"
              :loading="user.loading"
            >
              加为好友
            </van-button>
            <span v-else-if="user.isFriend" class="friend-status">已是好友</span>
            <span v-else-if="user.requestSent" class="friend-status">已发送请求</span>
          </div>
        </div>
      </template>
      <van-empty v-else description="暂无推荐好友" />
    </div>

    <!-- 二维码扫描入口 -->
    <div class="other-methods">
      <div class="section-title">其他添加方式</div>
      <div class="methods-container">
        <div class="method-item" @click="handleScanQRCode">
          <van-icon name="qr" class="method-icon" />
          <div class="method-name">扫一扫</div>
        </div>
        <div class="method-item" @click="handleShowMyQRCode">
          <van-icon name="contact" class="method-icon" />
          <div class="method-name">我的二维码</div>
        </div>
      </div>
    </div>

    <!-- 添加好友请求对话框 -->
    <van-dialog
      v-model:show="showDialog"
      title="发送好友申请"
      show-cancel-button
      @confirm="handleSendRequest"
      confirm-button-text="确认"
      cancel-button-text="取消"
      @cancel="handleDialogCancel"
    >
      <div class="dialog-content">
        <div class="dialog-user-info" v-if="selectedUser">
          <van-image round width="48" height="48" :src="selectedUser.userAvatar || 'https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg'" />
          <span class="dialog-username">{{ selectedUser.userName }}</span>
        </div>
        <div class="message-input-container">
          <van-field
            v-model="requestMessage"
            type="textarea"
            placeholder="请输入添加好友的理由"
            rows="3"
            autosize
            maxlength="100"
            show-word-limit
            class="message-input"
          />
        </div>
      </div>
    </van-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { showToast, showSuccessToast, showLoadingToast } from 'vant';
import { BackButton } from '../../../components/Common';
import { UserControllerService } from '../../../services/services/UserControllerService';
import { FriendRequestControllerService } from '../../../services/services/FriendRequestControllerService';
import { FriendRelationshipControllerService } from '../../../services/services/FriendRelationshipControllerService';
import { useUserStore } from '../../../stores/userStore';
import type { UserVO } from '../../../services/models/UserVO';
import type { ToastWrapperInstance } from 'vant/es/toast/types';

// 定义用户扩展接口，添加前端需要的状态字段
interface ExtendedUserVO extends UserVO {
  isFriend: boolean;
  requestSent: boolean;
  loading: boolean;
  description?: string;
}

const router = useRouter();
const userStore = useUserStore();
const searchText = ref('');
const searchActive = ref(false);
const searchLoading = ref(false);
const recommendLoading = ref(false);

// 好友请求对话框相关变量
const showDialog = ref(false);
const requestMessage = ref('我想添加你为好友');
const selectedUserId = ref<number | undefined>(undefined);
const selectedUser = computed(() => {
  if (!selectedUserId.value) return null;
  return searchResults.value.find(user => user.id === selectedUserId.value) ||
         recommendUsers.value.find(user => user.id === selectedUserId.value) ||
         null;
});

// 搜索结果
const searchResults = ref<ExtendedUserVO[]>([]);

// 推荐好友
const recommendUsers = ref<ExtendedUserVO[]>([]);

// 获取推荐好友列表
const fetchRecommendFriends = async () => {
  recommendLoading.value = true;
  try {
    // 使用用户查询接口获取推荐用户
    const response = await UserControllerService.listUserVoByPageUsingPost({
      pageSize: 5,
      current: 1,
      // 不使用当前用户自己的ID
      id: userStore.userInfo?.id ? -userStore.userInfo.id : undefined
    });

    if (response.code === 0 && response.data?.records) {
      // 将用户数据转换为扩展格式
      const users = await Promise.all(response.data.records.map(async (user: UserVO) => {
        const extendedUser: ExtendedUserVO = {
          ...user,
          isFriend: false,
          requestSent: false,
          loading: false,
          description: '推荐用户'
        };

        // 如果已登录，检查是否是好友
        if (userStore.userInfo?.id && user.id) {
          try {
            const isFriendResponse = await FriendRelationshipControllerService.getFriendRelationshipUsingGet(
              undefined,
              user.id
            );
            if (isFriendResponse.code === 0) {
              extendedUser.isFriend = !!isFriendResponse.data;
            }
          } catch (error) {
            console.error('检查好友关系失败', error);
          }
        }

        return extendedUser;
      }));

      recommendUsers.value = users;
    } else {
      showToast('获取推荐好友失败：' + (response.message || '未知错误'));
    }
  } catch (error) {
    console.error('获取推荐好友出错', error);
    showToast('获取推荐好友出错');
  } finally {
    recommendLoading.value = false;
  }
};

// 处理搜索
const handleSearch = async () => {
  if (!searchText.value.trim()) {
    searchActive.value = false;
    searchResults.value = [];
    return;
  }
  
  searchActive.value = true;
  searchLoading.value = true;
  
  try {
    // 根据搜索文本查询用户
    const queryParams = {
      userName: searchText.value,
      current: 1,
      pageSize: 10
    };
    
    const response = await UserControllerService.listUserVoByPageUsingPost(queryParams);
    
    if (response.code === 0 && response.data?.records) {
      // 将结果转换为前端需要的格式，并检查好友状态
      const users = await Promise.all(response.data.records.map(async (user: UserVO) => {
        const extendedUser: ExtendedUserVO = {
          ...user,
          isFriend: false,
          requestSent: false,
          loading: false
        };
        
        // 检查是否是好友关系
        if (userStore.userInfo?.id && user.id) {
          try {
            const isFriendResponse = await FriendRelationshipControllerService.getFriendRelationshipUsingGet(
              undefined,
              user.id
            );
            if (isFriendResponse.code === 0) {
              extendedUser.isFriend = !!isFriendResponse.data;
            }
            
            // 检查是否已发送好友请求
            // 这里简化处理，在实际情况中应该查询已发送的请求列表
            const sentRequests = await FriendRequestControllerService.getSentFriendRequestsUsingGet('pending');
            if (sentRequests.code === 0 && sentRequests.data) {
              extendedUser.requestSent = sentRequests.data.some(
                request => request.receiverId === user.id
              );
            }
          } catch (error) {
            console.error('检查好友状态失败', error);
          }
        }
        
        return extendedUser;
      }));
      
      searchResults.value = users;
    } else {
      searchResults.value = [];
      if (response.code !== 0) {
        showToast('搜索失败：' + (response.message || '未知错误'));
      }
    }
  } catch (error) {
    console.error('搜索用户出错', error);
    showToast('搜索用户出错');
    searchResults.value = [];
  } finally {
    searchLoading.value = false;
  }
};

// 重置搜索结果
const resetSearchResults = () => {
  searchActive.value = false;
  searchResults.value = [];
};

// 处理查看用户资料
const handleViewUserProfile = (userId?: number) => {
  if (!userId) {
    showToast('用户ID无效');
    return;
  }
  router.push(`/user/profile/${userId}`);
};

// 显示好友申请对话框
const showRequestDialog = (userId?: number) => {
  if (!userId) {
    showToast('用户ID无效');
    return;
  }
  
  // 检查用户是否登录
  if (!userStore.userInfo?.id) {
    showToast('请先登录');
    router.push('/user/login');
    return;
  }
  
  // 保存当前选择的用户ID
  selectedUserId.value = userId;
  // 重置默认消息
  requestMessage.value = '我想添加你为好友';
  // 显示对话框
  showDialog.value = true;
};

// 处理发送好友请求
const handleSendRequest = async () => {
  if (!selectedUserId.value) {
    showToast('用户ID无效');
    return;
  }
  
  // 检查用户是否登录
  if (!userStore.userInfo?.id) {
    showToast('请先登录');
    router.push('/user/login');
    return;
  }
  
  // 查找用户，可能在搜索结果或推荐用户列表中
  const userInSearch = searchResults.value.find(user => user.id === selectedUserId.value);
  const userInRecommend = recommendUsers.value.find(user => user.id === selectedUserId.value);
  const user = userInSearch || userInRecommend;
  
  if (!user || user.isFriend || user.requestSent) {
    showDialog.value = false;
    return;
  }
  
  user.loading = true;
  
  const loadingToastInstance = showLoadingToast({
    message: '发送请求中...',
    forbidClick: true,
  }) as ToastWrapperInstance;
  
  try {
    // 调用API发送好友请求，使用用户输入的消息
    const requestData = {
      senderId: userStore.userInfo.id,
      receiverId: selectedUserId.value,
      message: requestMessage.value.trim() || '我想添加你为好友',
      status: 'pending'
    };
    
    const response = await FriendRequestControllerService.addFriendRequestUsingPost(requestData);
    
    if (response.code === 0 && response.data) {
      user.requestSent = true;
      showSuccessToast('好友请求已发送');
    } else {
      showToast('发送请求失败：' + (response.message || '未知错误'));
    }
  } catch (error) {
    console.error('发送好友请求出错', error);
    showToast('发送请求失败，请稍后再试');
  } finally {
    loadingToastInstance.close();
    user.loading = false;
    showDialog.value = false;
  }
};

// 处理扫描二维码
const handleScanQRCode = () => {
  showToast('正在开发中');
};

// 处理显示我的二维码
const handleShowMyQRCode = () => {
  showToast('正在开发中');
};

// 处理对话框关闭
const handleDialogClose = (action: string, done: () => void) => {
  // 重置对话框状态
  requestMessage.value = '我想添加你为好友';
  selectedUserId.value = undefined;
  done();
};

// 处理对话框取消
const handleDialogCancel = () => {
  // 重置对话框状态
  requestMessage.value = '我想添加你为好友';
  selectedUserId.value = undefined;
};

// 页面加载时获取推荐好友
onMounted(() => {
  fetchRecommendFriends();
});
</script>

<style scoped>
.add-friend {
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
  width: 40px;
  height: 40px;
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

.search-container {
  position: sticky;
  top: 0;
  z-index: 998;
  background: transparent;
  padding: 8px 16px;
  margin: 0 0 16px 0;
  width: 100%;
  box-sizing: border-box;
}

.section-title {
  font-size: var(--font-size-md);
  font-weight: 700;
  color: #323233;
  margin: 16px 16px 8px;
}

.search-results,
.recommend-container,
.other-methods {
  background-color: #fff;
  border-radius: 8px;
  margin: 0 12px 16px;
  padding: 4px 0 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.user-item {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  position: relative;
  cursor: pointer;
}

.user-item:active {
  background-color: #f7f8fa;
}

.avatar-container {
  margin-right: 12px;
}

.user-info {
  flex: 1;
  overflow: hidden;
}

.user-name {
  font-weight: 700;
  font-size: var(--font-size-md);
  color: #323233;
  margin-bottom: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.user-meta {
  font-size: var(--font-size-sm);
  color: #969799;
}

.user-action {
  margin-left: 12px;
}

.friend-status {
  font-size: var(--font-size-sm);
  color: #969799;
}

.methods-container {
  display: flex;
  padding: 16px;
  justify-content: space-around;
}

.method-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
}

.method-icon {
  font-size: 28px;
  color: #1989fa;
  margin-bottom: 8px;
}

.method-name {
  font-size: var(--font-size-md);
  color: #323233;
}

/* 平板和PC端样式 */
@media (min-width: 768px) {
  .search-results,
  .recommend-container,
  .other-methods {
    max-width: 650px;
    margin-left: auto;
    margin-right: auto;
  }
  
  .search-container {
    max-width: 650px;
    margin-left: auto;
    margin-right: auto;
    padding: 8px 16px;
  }
}

/* 好友申请对话框样式 */
.dialog-content {
  padding: 20px 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.dialog-user-info {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

.dialog-username {
  margin-left: 12px;
  font-weight: 600;
  font-size: var(--font-size-lg);
}

.message-input-container {
  width: 100%;
  margin-top: 8px;
}

.message-input {
  width: 100%;
}

:deep(.van-field__control) {
  color: var(--text-color-primary);
  font-size: var(--font-size-md);
  font-family: 'Noto Sans SC', sans-serif;
  text-align: center;
}

:deep(.van-field__control::placeholder) {
  color: var(--text-color-secondary);
  font-size: var(--font-size-md);
  text-align: center;
}

:deep(.van-dialog__content) {
  padding: 0;
}

:deep(.van-dialog__header) {
  padding: 16px 0;
  font-weight: 600;
  font-size: var(--font-size-lg);
}

:deep(.van-dialog__footer) {
  padding: 8px 0;
}

:deep(.van-dialog__cancel), 
:deep(.van-dialog__confirm) {
  font-size: var(--font-size-md);
  font-weight: 500;
}

:deep(.van-field__word-limit) {
  text-align: right;
  width: 100%;
  margin-top: 4px;
  color: var(--text-color-secondary);
}

/* 搜索栏样式 */
:deep(.van-search) {
  padding: 4px 0;
  background: transparent;
}

:deep(.van-search__content) {
  background: rgba(255, 255, 255, 0.8);
  border-radius: 20px;
  padding: 0 6px;
  height: 40px;
  box-shadow: none;
  transition: all 0.3s ease;
  border: none;
  display: flex;
  align-items: center;
}

:deep(.van-search__content:hover) {
  box-shadow: none;
  transform: translateY(-1px);
  background: rgba(255, 255, 255, 0.9);
}

:deep(.van-cell) {
  background-color: transparent !important;
  padding: 8px 8px !important;
  line-height: 24px;
}

:deep(.van-field__left-icon) {
  margin-right: 6px;
  display: flex;
  align-items: center;
  height: 100%;
}

:deep(.van-search--focus .van-search__content) {
  background: rgba(255, 255, 255, 0.95);
  box-shadow: none;
  border: none;
}

:deep(.search-icon) {
  color: #1989fa;
  font-weight: bold;
  transition: all 0.3s ease;
}

:deep(.van-search__content:hover .search-icon) {
  transform: scale(1.1);
}

:deep(.van-field) {
  padding: 0;
  height: 100%;
  display: flex;
  align-items: center;
}

:deep(.van-field__body) {
  display: flex;
  align-items: center;
  height: 100%;
}

.loading-container {
  padding: 20px 0;
  display: flex;
  justify-content: center;
  width: 100%;
}
</style> 