<template>
  <div class="user-profile">
    <!-- 使用统一的返回栏 -->
    <back-button title="用户主页" />

    <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
      <!-- 用户基本信息卡片 -->
      <div class="user-card">
        <div class="user-card-header">
          <van-image
            round
            width="80"
            height="80"
            :src="userInfo.avatar || DEFAULT_USER_AVATAR"
            :error-content="DEFAULT_USER_AVATAR"
            class="user-avatar"
          />
          <div class="user-info">
            <div class="user-name">
              {{ userInfo.nickname || userInfo.username }}
              <van-tag v-if="userInfo.isVip" type="primary" round>VIP</van-tag>
            </div>
            <div class="user-id">ID: {{ userInfo.userId }}</div>
            <div class="user-level">
              <van-tag round type="warning">Lv.{{ userInfo.level }}</van-tag>
            </div>
          </div>
        </div>
        
        <div class="user-meta">
          <div class="meta-item" v-if="userInfo.age">
            <van-icon name="birthday-cake-o" />
            <span>{{ userInfo.age }}岁</span>
          </div>
          <div class="meta-item" v-if="userInfo.birthday">
            <van-icon name="calendar-o" />
            <span>{{ formatBirthday(userInfo.birthday) }}</span>
          </div>
          <div class="meta-item" v-if="userInfo.region">
            <van-icon name="location-o" />
            <span>{{ userInfo.region }}</span>
          </div>
        </div>
        
        <div class="user-description">
          <div class="description-title">个人简介</div>
          <div class="description-content">{{ userInfo.profile || '这个人很懒，什么都没有留下' }}</div>
        </div>
        
        <!-- 操作按钮 -->
        <div class="user-actions">
          <van-button
            v-if="!isSelf"
            type="primary"
            size="small"
            icon="plus"
            :loading="addingFriend"
            @click="handleAddFriend"
            :disabled="isFriend"
            class="action-btn"
          >
            {{ isFriend ? '已是好友' : '加为好友' }}
          </van-button>
          
          <van-button
            v-if="!isSelf"
            type="default"
            size="small"
            icon="chat-o"
            @click="handleSendMessage"
            class="action-btn"
          >
            发送消息
          </van-button>
        </div>
      </div>

      <!-- 用户数据统计 -->
      <van-grid :column-num="4" :border="false" class="stats-grid">
        <van-grid-item>
          <template #text>
            <div class="stat-value">{{ userStats.daysLearned }}</div>
            <div class="stat-label">学习天数</div>
          </template>
        </van-grid-item>
        <van-grid-item>
          <template #text>
            <div class="stat-value">{{ userStats.streakDays }}</div>
            <div class="stat-label">连续打卡</div>
          </template>
        </van-grid-item>
        <van-grid-item>
          <template #text>
            <div class="stat-value">{{ userStats.stars }}</div>
            <div class="stat-label">获得星星</div>
          </template>
        </van-grid-item>
        <van-grid-item>
          <template #text>
            <div class="stat-value">{{ userStats.badges }}</div>
            <div class="stat-label">徽章数</div>
          </template>
        </van-grid-item>
      </van-grid>

      <!-- 用户成就展示 -->
      <div class="section-container">
        <div class="section-header">
          <div class="section-title">成就徽章</div>
        </div>
        <div class="badges-container">
          <div v-for="badge in recentBadges" :key="badge.id" class="badge-item">
            <div :class="['badge-icon', badge.bgClass]">
              <van-icon :name="badge.icon" :color="badge.color" size="24" />
            </div>
            <div class="badge-name">{{ badge.name }}</div>
          </div>
          <div v-if="recentBadges.length === 0" class="empty-badge">
            暂无成就徽章
          </div>
        </div>
      </div>

      <!-- 最近学习记录 -->
      <div class="section-container">
        <div class="section-header">
          <div class="section-title">最近学习</div>
        </div>
        <div v-if="recentLearning.length > 0" class="learning-list">
          <div
            v-for="item in recentLearning"
            :key="item.id"
            class="learning-item"
          >
            <div :class="['learning-icon', item.bgClass]">
              <van-icon :name="item.icon" :color="item.color" size="24" />
            </div>
            <div class="learning-info">
              <div class="learning-name">{{ item.name }}</div>
              <van-progress
                :percentage="item.progress"
                :pivot-text="`${item.progress}%`"
                color="#1989fa"
                track-color="#e1f0ff"
              />
            </div>
          </div>
        </div>
        <van-empty v-else description="暂无学习记录" />
      </div>
    </van-pull-refresh>

    <!-- 添加好友成功弹窗 -->
    <van-dialog
      v-model:show="showAddFriendSuccess"
      title="添加好友成功"
      message="现在可以和TA聊天了"
      confirm-button-text="开始聊天"
      confirm-button-color="#1989fa"
      @confirm="handleChatAfterAdd"
      class="custom-dialog"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { showToast, showSuccessToast } from 'vant';
import { useUserStore } from '../../stores/userStore';
import { UserControllerService } from '../../services';
import { BackButton } from '../../components/Common';

// 路由相关
const route = useRoute();
const router = useRouter();
const userStore = useUserStore();
const DEFAULT_USER_AVATAR = userStore.DEFAULT_USER_AVATAR;

// 状态定义
const userId = computed(() => route.params.id as string);
const refreshing = ref(false);
const isFriend = ref(false);
const addingFriend = ref(false);
const showAddFriendSuccess = ref(false);

// 用户信息
const userInfo = ref({
  username: '',
  nickname: '',
  userId: '',
  avatar: DEFAULT_USER_AVATAR,
  isVip: false,
  level: 1,
  profile: '',
  age: '',
  birthday: '',
  region: '',
});

// 用户数据统计
const userStats = ref({
  daysLearned: 0,
  streakDays: 0,
  stars: 0,
  badges: 0,
});

// 计算年龄的工具函数
const calculateAge = (birthday: string): string => {
  if (!birthday) return '';
  
  try {
    const birthDate = new Date(birthday);
    if (isNaN(birthDate.getTime())) return '';
    
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    // 如果今年的生日还没过，年龄减1
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age.toString();
  } catch (error) {
    console.error('计算年龄出错:', error);
    return '';
  }
};

// 格式化生日显示
const formatBirthday = (birthday: string): string => {
  if (!birthday) return '';
  
  try {
    const date = new Date(birthday);
    if (isNaN(date.getTime())) return birthday;
    
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    
    return `${month}-${day}`;
  } catch (error) {
    console.error('格式化生日出错:', error);
    return birthday;
  }
};

// 成就徽章
const recentBadges = ref([
  {
    id: 1,
    name: '单词达人',
    icon: 'award',
    color: '#1989fa',
    bgClass: 'bg-blue',
  },
  {
    id: 2,
    name: '坚持不懈',
    icon: 'fire',
    color: '#ff976a',
    bgClass: 'bg-orange',
  },
  {
    id: 3,
    name: '听力小子',
    icon: 'music',
    color: '#07c160',
    bgClass: 'bg-green',
  },
]);

// 学习记录
const recentLearning = ref([
  {
    id: 1,
    name: '基础发音课程',
    icon: 'volume-o',
    color: '#1989fa',
    bgClass: 'bg-blue',
    progress: 80,
  },
  {
    id: 2,
    name: '日常对话练习',
    icon: 'chat-o',
    color: '#ff976a',
    bgClass: 'bg-orange',
    progress: 45,
  },
]);

// 计算是否为自己的主页
const isSelf = computed(() => {
  return userStore.userInfo?.id === Number(userId.value);
});

// 加载用户数据
const fetchUserData = async () => {
  refreshing.value = true;

  try {
    if (!userId.value) {
      showToast('用户ID不存在');
      return;
    }

    // 获取用户信息
    const response = await UserControllerService.getUserByIdUsingGet(
      Number(userId.value),
    );

    if (response.code === 0 && response.data) {
      const userData = response.data;

      // 计算地区信息
      const regionParts = [];
      if (userData.province) regionParts.push(userData.province);
      if (userData.city && userData.city !== userData.province) regionParts.push(userData.city);
      if (userData.district) regionParts.push(userData.district);
      const regionText = regionParts.join(' ');

      // 计算年龄
      const ageText = calculateAge(userData.birthday || '');

      userInfo.value = {
        username: userData.userName || '',
        nickname: userData.userName || '',
        userId: String(userData.id || ''),
        avatar: userData.userAvatar || DEFAULT_USER_AVATAR,
        isVip: userData.userRole === 'admin',
        level: 3,
        profile: userData.userProfile || '',
        age: ageText,
        birthday: userData.birthday || '',
        region: regionText,
      };

      // 模拟数据，实际项目中应该从API获取
      userStats.value = {
        daysLearned: 15,
        streakDays: 7,
        stars: 128,
        badges: 8,
      };

      // 这里判断是否已经是好友，实际项目中应该从API获取
      isFriend.value = false;
    } else {
      showToast(response.message || '获取用户详细信息失败');
    }
  } catch (error) {
    console.error('获取用户数据失败:', error);
    showToast('获取用户数据失败，请重试');
  } finally {
    refreshing.value = false;
  }
};

// 下拉刷新
const onRefresh = () => {
  fetchUserData();
};

// 加好友
const handleAddFriend = async () => {
  if (isFriend.value) return;
  
  addingFriend.value = true;
  try {
    // 实际项目中应调用添加好友的API
    await new Promise(resolve => setTimeout(resolve, 1000)); // 模拟API请求
    
    isFriend.value = true;
    showAddFriendSuccess.value = true;
  } catch (error) {
    showToast('添加好友失败，请稍后再试');
  } finally {
    addingFriend.value = false;
  }
};

// 处理发送消息
const handleSendMessage = () => {
  router.push({
    name: 'user-chat-detail',
    params: {
      userId: userId.value
    }
  });
};

// 添加好友后聊天
const handleChatAfterAdd = () => {
  handleSendMessage();
};

// 页面加载时获取数据
onMounted(() => {
  fetchUserData();
});
</script>

<style scoped>
.user-profile {
  padding-bottom: 16px;
  background-color: #f2f7fd;
  min-height: 100vh;
  font-family: 'Noto Sans SC', sans-serif;
}

.user-card {
  background-color: #ffffff;
  margin: 16px;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.user-card-header {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
}

.user-avatar {
  border: 3px solid rgba(25, 137, 250, 0.1);
}

.user-info {
  margin-left: 16px;
  flex: 1;
}

.user-name {
  font-size: var(--font-size-lg);
  font-weight: bold;
  color: var(--text-color-primary);
  margin-bottom: 4px;
  display: flex;
  align-items: center;
}

.user-name .van-tag {
  margin-left: 8px;
}

.user-id {
  font-size: var(--font-size-sm);
  color: var(--text-color-secondary);
  margin-bottom: 4px;
}

.user-level {
  display: flex;
  align-items: center;
}

.user-meta {
  display: flex;
  gap: 16px;
  margin-bottom: 12px;
}

.meta-item {
  display: flex;
  align-items: center;
  font-size: var(--font-size-sm);
  color: var(--text-color-secondary);
}

.meta-item .van-icon {
  margin-right: 4px;
  font-size: 16px;
  color: #969799;
}

.user-description {
  margin: 12px 0;
  font-size: var(--font-size-md);
  color: var(--text-color-regular);
  line-height: 1.5;
  padding: 12px;
  border-radius: 8px;
  background-color: #f7f8fa;
}

.description-title {
  font-size: var(--font-size-md);
  font-weight: 500;
  color: var(--text-color-primary);
  margin-bottom: 8px;
}

.description-content {
  font-size: var(--font-size-md);
  color: var(--text-color-regular);
  line-height: 1.6;
}

.user-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 16px;
}

.action-btn {
  border-radius: 20px;
  font-weight: 500;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
  transition: all 0.2s ease;
}

.action-btn:active {
  transform: scale(0.96);
}

.stats-grid {
  margin: 16px;
  background-color: #ffffff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  padding: 16px 0;
}

.stat-value {
  font-size: var(--font-size-xl);
  font-weight: bold;
  color: var(--primary-color);
}

.stat-label {
  font-size: var(--font-size-sm);
  color: var(--text-color-secondary);
  margin-top: 4px;
}

.section-container {
  margin: 16px;
  background-color: #ffffff;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  border-bottom: 1px solid rgba(235, 237, 240, 0.8);
  padding-bottom: 8px;
}

.section-title {
  font-size: var(--font-size-lg);
  font-weight: bold;
  color: var(--text-color-primary);
  position: relative;
  padding-left: 12px;
}

.section-title::before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 4px;
  height: 16px;
  background-color: var(--primary-color);
  border-radius: 2px;
}

.badges-container {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  padding: 8px 0;
}

.badge-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: calc(25% - 12px);
}

.badge-icon {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 8px;
}

.badge-name {
  font-size: var(--font-size-sm);
  color: var(--text-color-regular);
  text-align: center;
}

.learning-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.learning-item {
  display: flex;
  align-items: center;
  padding: 8px;
  border-radius: 8px;
  background-color: rgba(247, 248, 250, 0.6);
}

.learning-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 12px;
  flex-shrink: 0;
}

.learning-info {
  flex: 1;
}

.learning-name {
  font-size: var(--font-size-md);
  color: var(--text-color-regular);
  margin-bottom: 8px;
  font-weight: 500;
}

.empty-badge {
  width: 100%;
  text-align: center;
  color: var(--text-color-secondary);
  padding: 16px 0;
}

.custom-dialog {
  --van-dialog-border-radius: 12px;
  --van-dialog-background: #ffffff;
}

/* 背景色样式 */
.bg-blue {
  background-color: rgba(25, 137, 250, 0.1);
}

.bg-orange {
  background-color: rgba(255, 151, 106, 0.1);
}

.bg-green {
  background-color: rgba(7, 193, 96, 0.1);
}

.bg-yellow {
  background-color: rgba(255, 205, 50, 0.1);
}
</style> 