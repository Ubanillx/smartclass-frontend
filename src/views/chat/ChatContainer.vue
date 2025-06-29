<template>
  <div class="chat-container has-tabbar">
    <!-- 固定头部区域 -->
    <div class="fixed-header">
      <!-- 页面标题区域 -->
      <div class="header">
        <div class="page-title">
          <van-icon name="chat-o" class="title-icon" />
          <span>聊天</span>
        </div>
        <div class="header-actions">
          <van-badge dot :content="friendRequestCount > 0 ? friendRequestCount : ''" :max="99">
            <van-icon name="friends-o" class="action-icon" @click="handleFriendRequests" />
          </van-badge>
          <van-icon name="search" class="action-icon" @click="handleSearch" />
        </div>
      </div>

      <!-- 导航栏 -->
      <div class="nav-tabs">
        <div
          :class="['nav-tab', { active: activeTab === 'history' }]"
          @click="switchTab('history')"
        >
          历史对话
        </div>
        <div
          :class="['nav-tab', { active: activeTab === 'friends' }]"
          @click="switchTab('friends')"
        >
          好友
          <van-badge v-if="totalUnreadCount > 0" :content="totalUnreadCount" :max="99" class="nav-badge" />
        </div>
        <div
          :class="['nav-tab', { active: activeTab === 'intelligence' }]"
          @click="switchTab('intelligence')"
        >
          智慧体中心
        </div>
      </div>
    </div>

    <!-- 可滚动内容区域 -->
    <div class="scrollable-content">
      <!-- 内容区域 -->
      <div class="tab-content">
        <!-- 历史对话内容 -->
        <div v-show="activeTab === 'history'" class="tab-pane">
          <div class="content-container">
            <chat-history-content @select="handleChatSelect" />
          </div>
        </div>
        
        <!-- 好友内容 -->
        <div v-show="activeTab === 'friends'" class="tab-pane">
          <div class="content-container">
            <div class="content-wrapper">
              <div v-if="friendsLoading" class="loading-container">
                <van-loading type="spinner" size="32" color="#1989fa" />
                <p>正在加载好友列表...</p>
              </div>
              <chat-list 
                v-else-if="friends.length > 0" 
                :chats="friends" 
                :show-status="true" 
                @select="handleFriendSelect" 
              />
              <div v-else class="empty-container">
                <van-empty description="暂无好友数据" />
              </div>
            </div>
          </div>
        </div>

        <!-- 智慧体中心内容 -->
        <div v-show="activeTab === 'intelligence'" class="tab-pane">
          <div class="content-container">
            <intelligence-center-content @select="handleAssistantSelect" />
          </div>
        </div>
      </div>
    </div>

    <!-- 新建对话按钮 -->
    <van-button
      v-show="activeTab === 'history'"
      class="new-chat-btn"
      type="primary"
      round
      icon="plus"
      @click="switchTab('intelligence')"
    >
      新建对话
    </van-button>

    <!-- 添加好友按钮 -->
    <van-button
      v-show="activeTab === 'friends'"
      class="new-chat-btn"
      type="primary"
      round
      icon="plus"
      @click="handleAddFriend"
    >
      添加好友
    </van-button>

    <!-- 添加智慧体按钮 -->
    <van-button
      v-show="activeTab === 'intelligence'"
      class="new-chat-btn"
      type="primary"
      round
      icon="plus"
      @click="handleAddIntelligence"
    >
      添加智慧体
    </van-button>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { showToast, showLoadingToast, closeToast } from 'vant';
import { ChatHistoryContent, IntelligenceCenterContent } from '../../components/Chat';
import { ChatList } from '../../components/Dialogue';
import { FriendRelationshipControllerService } from '../../services/services/FriendRelationshipControllerService';
import { ChatControllerService } from '../../services/services/ChatControllerService';
import { FriendRelationshipVO } from '../../services/models/FriendRelationshipVO';
import { PrivateMessageVO } from '../../services/models/PrivateMessageVO';
import { formatTimeAgo } from '../../utils/timeUtils';
import { FriendRequestControllerService } from '../../services/services/FriendRequestControllerService';

const router = useRouter();
const route = useRoute();
const activeTab = ref('history'); // 默认显示历史对话
const friendRequestCount = ref(0); // 好友请求数量，后续从API获取
const friendsLoading = ref(false);
const recentMessagesLoading = ref(false);
const friendRelationships = ref<FriendRelationshipVO[]>([]);
const recentMessages = ref<PrivateMessageVO[]>([]);
const totalUnreadCount = ref(0); // 添加总未读消息数量

// 好友列表数据
const friends = ref<any[]>([]);

// 获取好友列表
const fetchFriends = async () => {
  friendsLoading.value = true;
  try {
    const response = await FriendRelationshipControllerService.listUserFriendsUsingGet();
    
    if (response.code === 0 && response.data) {
      friendRelationships.value = response.data;
      await fetchRecentMessages();
    } else {
      showToast('获取好友列表失败：' + (response.message || '未知错误'));
    }
  } catch (error) {
    console.error('获取好友列表出错：', error);
    showToast('获取好友列表出错');
  } finally {
    friendsLoading.value = false;
  }
};

// 获取最新消息
const fetchRecentMessages = async () => {
  recentMessagesLoading.value = true;
  try {
    const response = await ChatControllerService.listUserSessionsUsingGet();
    
    if (response.code === 0 && response.data) {
      // 存储完整的会话数据，以便后续使用
      const chatSessions = response.data;
      const recentMessageList = chatSessions.map(session => session.lastMessage || {});
      recentMessages.value = recentMessageList;
      
      // 计算总未读消息数量
      let unreadMessages = 0;
      chatSessions.forEach(session => {
        if (session.unreadCount) {
          unreadMessages += session.unreadCount;
        }
      });
      totalUnreadCount.value = unreadMessages;
      
      // 显示未读消息数量小红点
      if (totalUnreadCount.value > 0) {
        document.title = `(${totalUnreadCount.value}) 智云星课`;
      } else {
        document.title = '智云星课';
      }
      
      // 处理数据
      processFriendsAndMessages(chatSessions);
    } else {
      showToast('获取最新消息失败：' + (response.message || '未知错误'));
    }
  } catch (error) {
    console.error('获取最新消息出错：', error);
    showToast('获取最新消息出错');
  } finally {
    recentMessagesLoading.value = false;
  }
};

// 处理好友和消息数据
const processFriendsAndMessages = (chatSessions: any[] = []) => {
  if (!friendRelationships.value.length) return;
  
  // 将好友关系和最新消息整合到一起
  const friendsList = friendRelationships.value.map(relationship => {
    // 确保friendUser存在
    if (!relationship.friendUser) return null;
    
    // 查找与该好友相关的最新消息
    const lastMessage = recentMessages.value.find(
      msg => 
        (msg.senderId === relationship.friendUser?.id && msg.receiverId === relationship.userId1) || 
        (msg.receiverId === relationship.friendUser?.id && msg.senderId === relationship.userId1)
    );
    
    // 设置中文标签
    const userRoleTags = [];
    if (relationship.friendUser.userRole) {
      const roleMap: Record<string, string> = {
        'STUDENT': '学生',
        'TEACHER': '老师',
        'ADMIN': '管理员',
        'USER': '普通用户'
      };
      userRoleTags.push(roleMap[relationship.friendUser.userRole] || relationship.friendUser.userRole);
    }
    
    // 查找当前会话信息，获取未读消息数量
    const session = chatSessions.find(
      session => 
        (session.userId1 === relationship.userId1 && session.userId2 === relationship.friendUser?.id) ||
        (session.userId2 === relationship.userId1 && session.userId1 === relationship.friendUser?.id)
    );
    
    const unreadCount = session?.unreadCount || 0;
    
    return {
      id: relationship.id,
      assistantId: relationship.friendUser.id,
      assistantName: relationship.friendUser.userName || '未命名用户',
      avatar: relationship.friendUser.userAvatar || 'https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg',
      // 使用最新消息或默认文本
      lastMessage: lastMessage?.content || '暂无消息',
      // 格式化消息时间
      lastTime: lastMessage?.createTime ? formatTimeAgo(new Date(lastMessage.createTime)) : '',
      // 去掉在线状态
      tags: userRoleTags,
      type: 1, // 好友类型
      unreadCount: unreadCount, // 添加未读消息数量
      isLastMessageUnread: lastMessage?.senderId === relationship.friendUser?.id && lastMessage?.isRead === 0, // 最后一条消息是否未读
    };
  }).filter(Boolean) as any[];
  
  friends.value = friendsList;
};

// 监听标签页变化，当切换到好友标签时加载数据
watch(activeTab, (newTab) => {
  if (newTab === 'friends' && friends.value.length === 0) {
    fetchFriends();
  }
});

// 搜索功能
const handleSearch = () => {
  router.push('/search');
};

// 更多功能
const handleMore = () => {
  showToast('更多功能开发中');
};

// 处理好友选择
const handleFriendSelect = (chat: any) => {
  router.push({
    name: 'user-chat-detail',
    params: {
      userId: chat.assistantId
    }
  });
};

// 处理添加好友
const handleAddFriend = () => {
  router.push('/friends/add');
};

// 处理好友请求
const handleFriendRequests = () => {
  router.push('/friends/requests');
};

// 处理添加智慧体
const handleAddIntelligence = () => {
  showToast('添加智慧体功能开发中');
};

// 获取好友请求数量
const fetchFriendRequestCount = async () => {
  try {
    const response = await FriendRequestControllerService.getPendingRequestCountUsingGet();
    if (response.code === 0 && response.data !== undefined) {
      friendRequestCount.value = Number(response.data);
    }
  } catch (error) {
    console.error('获取好友请求数量出错：', error);
  }
};

// 检查URL参数，决定默认显示哪个标签页
onMounted(() => {
  const tab = route.query.tab as string;
  if (tab === 'intelligence' || tab === 'history' || tab === 'friends') {
    activeTab.value = tab;
    if (tab === 'friends') {
      fetchFriends();
    }
  } else {
    // 如果URL没有有效的tab参数，设置为默认标签并更新URL
    activeTab.value = 'history';
    router.replace({
      path: route.path,
      query: { ...route.query, tab: 'history' },
    });
  }
  
  // 获取好友请求数量
  fetchFriendRequestCount();
});

// 切换标签页
const switchTab = (tab: string) => {
  activeTab.value = tab;

  // 如果切换到好友标签，加载好友数据
  if (tab === 'friends' && friends.value.length === 0) {
    fetchFriends();
  }

  // 更新URL参数，但不触发页面刷新
  const query = { ...route.query };
  query.tab = tab; // 设置tab参数为当前标签页

  router.replace({
    path: route.path,
    query,
  });
};

// 处理对话选择
const handleChatSelect = (messageId: string, assistantId: number) => {
  router.push(`/chat/detail/${assistantId}?sessionId=${messageId}`);
};

// 处理智能助手选择
const handleAssistantSelect = (assistantId: number) => {
  router.push(`/chat/detail/${assistantId}`);
};
</script>

<style scoped>
.chat-container {
  display: flex;
  flex-direction: column;
  padding-bottom: 130px; /* 减小底部间距，避免过多空白 */
  background-color: #f2f7fd;
  min-height: 100vh;
  position: relative;
  overflow-x: hidden; /* 防止水平滚动条出现 */
}

.fixed-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  background-color: #f2f7fd;
  padding: 16px 16px 0;
}

.scrollable-content {
  flex: 1;
  overflow-y: auto;
  padding: 0 16px;
  margin-top: 150px; /* 顶部边距，确保内容不会与导航栏重叠 */
  padding-bottom: 100px; /* 增加底部内边距，确保分页组件有足够空间 */
  position: relative;
  will-change: transform; /* 优化滚动性能 */
  overflow-x: hidden; /* 防止水平滚动条 */
  height: calc(100vh - 150px); /* 设置固定高度 */
  box-sizing: border-box;
}

.tab-content {
  min-height: 300px; /* 调整为更合理的高度 */
  position: relative;
  display: flex; 
  flex-direction: column;
}

.tab-pane {
  width: 100%;
  position: relative;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 12px;
  padding: 12px 12px;
}

.page-title {
  display: flex;
  align-items: center;
  font-size: var(--font-size-xl);
  font-weight: 700;
  color: #323233;
  font-family: 'Noto Sans SC', sans-serif;
}

.title-icon {
  margin-right: 6px;
  color: #1989fa;
  font-size: var(--font-size-xl);
}

.header-actions {
  display: flex;
  align-items: center;
}

.action-icon {
  font-size: 24px;
  color: #323233;
  margin-left: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s;
  opacity: 0.85;
}

.action-icon:active {
  opacity: 0.6;
  transform: scale(0.95);
}

.nav-tabs {
  display: flex;
  margin-top: 0;
  margin-bottom: 16px;
  border-bottom: 1px solid #ebedf0;
  background-color: transparent;
  border-radius: 0;
  box-shadow: none;
  overflow: hidden;
}

.nav-tab {
  flex: 1;
  text-align: center;
  padding: 12px 0;
  font-size: var(--font-size-md);
  font-weight: 500;
  color: #969799;
  position: relative;
  cursor: pointer;
}

.nav-badge {
  position: absolute;
  top: 5px;
  right: 15%;
  transform: translateX(50%);
}

.nav-tab.active {
  color: #1989fa;
  background-color: transparent;
}

.nav-tab.active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 40%;
  height: 3px;
  background-color: #1989fa;
  border-radius: 3px 3px 0 0;
}

.new-chat-btn {
  position: fixed;
  right: 16px;
  bottom: 130px; /* 将按钮显示在分页组件上方 */
  z-index: 99;
}

.content-container {
  width: 100%;
  position: relative;
  min-height: calc(100vh - 250px);
  padding-bottom: 40px;
}

.content-wrapper {
  position: relative;
  min-height: 200px;
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  padding: 0 4px;
  box-sizing: border-box;
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 0;
  margin-top: 20px;
}

.loading-container p {
  margin-top: 12px;
  color: #666;
  font-size: var(--font-size-md);
  font-family: 'Noto Sans SC', sans-serif;
}

.empty-container {
  padding: 40px 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-top: 20px;
}
</style>
