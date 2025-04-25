<template>
  <div class="profile has-tabbar">
    <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
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
        @add-goal="addGoal"
        @toggle-goal="toggleGoalStatus"
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

      <!-- 内容导航栏组件 -->
      <component :is="ContentTabsRaw" />

      <!-- 退出登录按钮 -->
      <component :is="LogoutButtonRaw" @logout="handleLogout" />
    </van-pull-refresh>
  </div>
</template>

<script setup lang="ts">
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
  LogoutButton,
  ContentTabs,
} from '../components/Profile';
import { useUserStore } from '../stores/userStore';
import { UserControllerService } from '../services';

// 组件引用
const UserInfoCardRaw = markRaw(UserInfoCard);
const StudyStatsGridRaw = markRaw(StudyStatsGrid);
const TodayGoalsRaw = markRaw(TodayGoals);
const AchievementWallRaw = markRaw(AchievementWall);
const RecentLearningRaw = markRaw(RecentLearning);
const LearningHistoryRaw = markRaw(LearningHistory);
const LogoutButtonRaw = markRaw(LogoutButton);
const ContentTabsRaw = markRaw(ContentTabs);

const router = useRouter();
const userStore = useUserStore();
const refreshing = ref(false);

// 数据定义
const userInfo = ref({
  username: '',
  nickname: '',
  phone: '',
  avatar: userStore.DEFAULT_USER_AVATAR,
  level: 1,
  nextLevelExp: 100,
  userId: '' as string | number,
});

const userStats = ref({
  daysLearned: 0,
  streakDays: 0,
  stars: 0,
  badges: 0,
});

const todayProgress = ref(0);
const todayGoals = ref([
  { id: 1, text: '完成每日单词打卡', completed: false },
  { id: 2, text: '听力练习15分钟', completed: false },
  { id: 3, text: '完成一节口语课程', completed: false },
  { id: 4, text: '阅读英语文章一篇', completed: false },
  { id: 5, text: '复习昨日语法知识点', completed: false },
]);

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
  {
    id: 4,
    name: '初级达成',
    icon: 'star',
    color: '#ffcd32',
    bgClass: 'bg-yellow',
  },
]);

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
  {
    id: 3,
    name: '趣味单词记忆',
    icon: 'label-o',
    color: '#07c160',
    bgClass: 'bg-green',
    progress: 60,
  },
]);

const learningHistory = ref([
  {
    id: 1,
    date: '今天',
    title: '完成单词测试',
    description: '正确率 85%',
    time: '14:30',
    icon: 'records',
  },
  {
    id: 2,
    date: '昨天',
    title: '观看视频课程',
    description: '《英语口语进阶》第3课',
    time: '16:45',
    icon: 'play-circle-o',
  },
  {
    id: 3,
    date: '昨天',
    title: '完成听力练习',
    description: '得分 90分',
    time: '10:20',
    icon: 'music-o',
  },
]);

// 方法定义
const fetchUserData = async () => {
  refreshing.value = true;

  try {
    await userStore.fetchCurrentUser();

    if (userStore.userInfo) {
      if (userStore.userInfo.id) {
        // 尝试从API获取最新的用户数据
        const response = await UserControllerService.getUserVoByIdUsingGet(
          userStore.userInfo.id,
        );

        if (response.code === 0 && response.data) {
          const userData = response.data;

          userInfo.value = {
            username: userData.userName || '',
            nickname: userData.userName || '',
            phone: userData.userPhone || '',
            avatar: userData.userAvatar || userStore.DEFAULT_USER_AVATAR,
            level: 3,
            nextLevelExp: 100,
            userId: userData.id || '',
          };

          userStats.value = {
            daysLearned: 15,
            streakDays: 7,
            stars: 128,
            badges: 8,
          };

          todayProgress.value = 60;
          todayGoals.value = [
            { id: 1, text: '完成每日单词打卡', completed: true },
            { id: 2, text: '听力练习15分钟', completed: true },
            { id: 3, text: '完成一节口语课程', completed: false },
            { id: 4, text: '阅读英语文章一篇', completed: true },
            { id: 5, text: '复习昨日语法知识点', completed: false },
          ];
        } else {
          showToast(response.message || '获取用户详细信息失败');
        }
      }
    } else {
      showToast('请先登录');
      setTimeout(() => {
        router.push('/login');
      }, 1500);
    }
  } catch (error) {
    console.error('获取用户数据失败:', error);
    showToast('获取用户数据失败，请重试');
  } finally {
    refreshing.value = false;
  }
};

const onRefresh = () => {
  fetchUserData();
};

const addGoal = (goalText: string) => {
  const newId =
    todayGoals.value.length > 0
      ? Math.max(...todayGoals.value.map((g) => g.id)) + 1
      : 1;

  todayGoals.value.push({
    id: newId,
    text: goalText,
    completed: false,
  });

  updateProgress();
};

const toggleGoalStatus = (goalId: number) => {
  const goal = todayGoals.value.find((g) => g.id === goalId);
  if (goal) {
    goal.completed = !goal.completed;
    updateProgress();
  }
};

const updateProgress = () => {
  const totalGoals = todayGoals.value.length;
  if (totalGoals === 0) {
    todayProgress.value = 0;
    return;
  }

  const completedGoals = todayGoals.value.filter((g) => g.completed).length;
  todayProgress.value = Math.round((completedGoals / totalGoals) * 100);
};

const handleLogout = async () => {
  try {
    await userStore.logout();
    showSuccessToast('退出登录成功');
    router.push('/login');
  } catch (error) {
    console.error('退出登录失败:', error);
    showToast('退出登录失败，请重试');
  }
};

// 生命周期
onMounted(() => {
  fetchUserData();
  updateProgress();
});
</script>

<style scoped>
.profile {
  padding-bottom: 66px;
  background-color: #f2f7fd;
  min-height: 100vh;
}

:deep(.van-pull-refresh) {
  min-height: calc(100vh - 50px);
  padding: 12px 16px 0;
}

:deep(.van-pull-refresh__track) {
  padding-bottom: 16px;
}
</style>
