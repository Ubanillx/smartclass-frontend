<template>
  <div class="profile has-tabbar">
    <!-- 错误提示 -->
    <van-empty v-if="loadError" description="加载失败" class="error-container">
      <template #image>
        <van-icon name="warning-o" size="48" color="#ee0a24" />
      </template>
      <van-button round type="danger" size="small" @click="retryFetch">重新加载</van-button>
    </van-empty>
    
    <van-pull-refresh v-else v-model="refreshing" @refresh="onRefresh">
      <!-- 用户基本信息卡片 -->
      <component 
        :is="UserInfoCardRaw" 
        :user-info="userInfo" 
        @settings="router.push('/settings')"
      />

      <!-- 学习数据展示 -->
      <component :is="StudyStatsGridRaw" :stats="userStats" />

      <!-- 今日学习目标 -->
      <component 
        :is="TodayGoalsRaw" 
        :progress="todayProgress" 
        :goals="todayGoals" 
      />

      <!-- 我的成就墙 -->
      <component 
        :is="AchievementWallRaw" 
        :badges="recentBadges" 
        @view-all="router.push('/achievements')"
      />

      <!-- 最近学习 -->
      <component :is="RecentLearningRaw" :learning-items="recentLearning" />

      <!-- 学习历史记录 -->
      <component 
        :is="LearningHistoryRaw" 
        :history-items="learningHistory" 
        @view-all="router.push('/history')"
      />

      <!-- 退出登录按钮 -->
      <component :is="LogoutButtonRaw" @logout="handleLogout" />
    </van-pull-refresh>
    
    <!-- 加载中提示 -->
    <van-overlay :show="loading" z-index="9999">
      <div class="loading-wrapper">
        <van-loading type="spinner" color="#1989fa" size="36px" />
        <p class="loading-text">加载中...</p>
      </div>
    </van-overlay>
  </div>
</template>

<script setup>
import { ref, markRaw, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { showToast, showSuccessToast } from 'vant';
import { 
  UserInfoCard, 
  StudyStatsGrid, 
  TodayGoals, 
  AchievementWall, 
  RecentLearning, 
  LearningHistory, 
  LogoutButton 
} from '../components/Profile';
import { useUserStore } from '../stores/userStore';
import { UserControllerService } from '../services/services/UserControllerService';

// 使用markRaw包装组件，防止被转换为响应式对象
const UserInfoCardRaw = markRaw(UserInfoCard);
const StudyStatsGridRaw = markRaw(StudyStatsGrid);
const TodayGoalsRaw = markRaw(TodayGoals);
const AchievementWallRaw = markRaw(AchievementWall);
const RecentLearningRaw = markRaw(RecentLearning);
const LearningHistoryRaw = markRaw(LearningHistory);
const LogoutButtonRaw = markRaw(LogoutButton);

const router = useRouter();
const userStore = useUserStore();
const loading = ref(false);
const refreshing = ref(false);
const loadError = ref(false);

// 用户基本信息
const userInfo = ref({
  username: '',
  nickname: '',
  phone: '',
  avatar: 'https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg',
  level: 1,
  nextLevelExp: 100
});

// 学习统计数据
const userStats = ref({
  daysLearned: 0,
  streakDays: 0,
  stars: 0,
  badges: 0
});

// 今日目标
const todayProgress = ref(0);
const todayGoals = ref([
  { id: 1, text: '完成每日单词打卡', completed: false },
  { id: 2, text: '听力练习15分钟', completed: false },
  { id: 3, text: '完成一节口语课程', completed: false }
]);

// 最近获得的徽章
const recentBadges = ref([
  {
    id: 1,
    name: '单词达人',
    icon: 'https://fastly.jsdelivr.net/npm/@vant/assets/medal.png'
  },
  {
    id: 2,
    name: '坚持不懈',
    icon: 'https://fastly.jsdelivr.net/npm/@vant/assets/fire.png'
  },
  {
    id: 3,
    name: '听力小子',
    icon: 'https://fastly.jsdelivr.net/npm/@vant/assets/music.png'
  },
  {
    id: 4,
    name: '初级达成',
    icon: 'https://fastly.jsdelivr.net/npm/@vant/assets/star.png'
  }
]);

// 最近学习记录
const recentLearning = ref([
  {
    id: 1,
    name: '基础发音课程',
    icon: 'https://fastly.jsdelivr.net/npm/@vant/assets/book.png',
    progress: 80
  },
  {
    id: 2,
    name: '日常对话练习',
    icon: 'https://fastly.jsdelivr.net/npm/@vant/assets/chat.png',
    progress: 45
  },
  {
    id: 3,
    name: '趣味单词记忆',
    icon: 'https://fastly.jsdelivr.net/npm/@vant/assets/smile.png',
    progress: 60
  }
]);

// 学习历史记录数据
const learningHistory = ref([
  {
    id: 1,
    date: '今天',
    title: '完成单词测试',
    description: '正确率 85%',
    time: '14:30',
    icon: 'records'
  },
  {
    id: 2,
    date: '昨天',
    title: '观看视频课程',
    description: '《英语口语进阶》第3课',
    time: '16:45',
    icon: 'play-circle-o'
  },
  {
    id: 3,
    date: '昨天',
    title: '完成听力练习',
    description: '得分 90分',
    time: '10:20',
    icon: 'music-o'
  }
]);

// 获取用户数据
const fetchUserData = async (showLoading = true) => {
  if (showLoading) {
    loading.value = true;
  }
  
  loadError.value = false;
  
  try {
    // 1. 获取当前登录用户基本信息
    await userStore.fetchCurrentUser();
    
    if (userStore.userInfo) {
      console.log('获取到的用户基本信息:', userStore.userInfo);
      
      // 2. 获取用户详细信息
      if (userStore.userInfo.id) {
        const response = await UserControllerService.getUserVoByIdUsingGet(userStore.userInfo.id);
        
        if (response.code === 0 && response.data) {
          const userData = response.data;
          console.log('获取到的用户详细信息:', userData);
          
          // 更新用户基本信息
          userInfo.value = {
            username: userData.userName || '',
            nickname: userData.userName || '',
            phone: userData.userPhone || '',
            avatar: userData.userAvatar || 'https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg',
            level: 3, // 这里可以根据实际情况从后端获取或计算
            nextLevelExp: 100 // 这里可以根据实际情况从后端获取或计算
          };
          
          // 这里可以添加获取其他数据的逻辑，如学习统计、成就等
          // 目前使用模拟数据，实际应用中应该从后端API获取
          
          // 模拟获取学习统计数据
          userStats.value = {
            daysLearned: 15,
            streakDays: 7,
            stars: 128,
            badges: 8
          };
          
          // 模拟获取今日目标数据
          todayProgress.value = 60;
          todayGoals.value = [
            { id: 1, text: '完成每日单词打卡', completed: true },
            { id: 2, text: '听力练习15分钟', completed: true },
            { id: 3, text: '完成一节口语课程', completed: false }
          ];
        } else {
          showToast(response.message || '获取用户详细信息失败');
          loadError.value = true;
        }
      }
    } else {
      // 未登录或获取用户信息失败
      showToast('请先登录');
      setTimeout(() => {
        router.push('/login');
      }, 1500);
    }
  } catch (error) {
    console.error('获取用户数据失败:', error);
    showToast('获取用户数据失败，请重试');
    loadError.value = true;
  } finally {
    if (showLoading) {
      loading.value = false;
    }
    refreshing.value = false;
  }
};

// 重试获取数据
const retryFetch = () => {
  console.log('重试获取用户数据');
  fetchUserData();
};

// 下拉刷新
const onRefresh = () => {
  console.log('下拉刷新，重新获取用户数据');
  fetchUserData(false);
};

// 退出登录
const handleLogout = async () => {
  try {
    await userStore.logout();
    showSuccessToast({
      message: '已退出登录',
      onClose: () => {
        router.push('/login');
      }
    });
  } catch (error) {
    console.error('退出登录失败:', error);
    showToast('退出登录失败，请重试');
  }
};

// 页面加载时获取用户数据
onMounted(() => {
  console.log('Profile页面加载，开始获取用户数据');
  fetchUserData();
});
</script>

<style scoped>
.profile {
  padding: 16px;
  padding-bottom: 66px;
}

/* 在二级页面中不需要为底部导航栏预留空间 */
:deep(.has-tabbar) {
  padding-bottom: 60px;
}

.loading-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
}

.loading-text {
  margin-top: 12px;
  color: #fff;
  font-size: 14px;
}

.error-container {
  padding: 40px 0;
}
</style> 