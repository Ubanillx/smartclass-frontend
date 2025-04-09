<template>
  <div class="profile">
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

      <!-- 退出登录按钮 -->
      <component :is="LogoutButtonRaw" @logout="handleLogout" />
    </van-pull-refresh>
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
  LogoutButton,
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
const refreshing = ref(false);

// 用户基本信息
const userInfo = ref({
  username: '',
  nickname: '',
  phone: '',
  avatar:
    'https://img.zcool.cn/community/01a0d45d145963a8012187f447cfef.jpg@1280w_1l_2o_100sh.jpg',
  level: 1,
  nextLevelExp: 100,
});

// 学习统计数据
const userStats = ref({
  daysLearned: 0,
  streakDays: 0,
  stars: 0,
  badges: 0,
});

// 今日目标
const todayProgress = ref(0);
const todayGoals = ref([
  markRaw({ id: 1, text: '完成每日单词打卡', completed: false }),
  markRaw({ id: 2, text: '听力练习15分钟', completed: false }),
  markRaw({ id: 3, text: '完成一节口语课程', completed: false }),
  markRaw({ id: 4, text: '阅读英语文章一篇', completed: false }),
  markRaw({ id: 5, text: '复习昨日语法知识点', completed: false }),
]);

// 最近获得的徽章
const recentBadges = ref([
  markRaw({
    id: 1,
    name: '单词达人',
    icon: 'award',
    color: '#1989fa',
    bgClass: 'bg-blue',
  }),
  markRaw({
    id: 2,
    name: '坚持不懈',
    icon: 'fire',
    color: '#ff976a',
    bgClass: 'bg-orange',
  }),
  markRaw({
    id: 3,
    name: '听力小子',
    icon: 'music',
    color: '#07c160',
    bgClass: 'bg-green',
  }),
  markRaw({
    id: 4,
    name: '初级达成',
    icon: 'star',
    color: '#ffcd32',
    bgClass: 'bg-yellow',
  }),
  markRaw({
    id: 5,
    name: '阅读能手',
    icon: 'bookmark',
    color: '#ee0a24',
    bgClass: 'bg-red',
  }),
  markRaw({
    id: 6,
    name: '语法专家',
    icon: 'edit',
    color: '#7232dd',
    bgClass: 'bg-purple',
  }),
  markRaw({
    id: 7,
    name: '口语达人',
    icon: 'chat',
    color: '#00ced1',
    bgClass: 'bg-cyan',
  }),
  markRaw({
    id: 8,
    name: '写作高手',
    icon: 'records',
    color: '#ff69b4',
    bgClass: 'bg-pink',
  }),
]);

// 最近学习记录
const recentLearning = ref([
  markRaw({
    id: 1,
    name: '基础发音课程',
    icon: 'volume-o',
    color: '#1989fa',
    bgClass: 'bg-blue',
    progress: 80,
  }),
  markRaw({
    id: 2,
    name: '日常对话练习',
    icon: 'chat-o',
    color: '#ff976a',
    bgClass: 'bg-orange',
    progress: 45,
  }),
  markRaw({
    id: 3,
    name: '趣味单词记忆',
    icon: 'label-o',
    color: '#07c160',
    bgClass: 'bg-green',
    progress: 60,
  }),
]);

// 学习历史记录数据
const learningHistory = ref([
  markRaw({
    id: 1,
    date: '今天',
    title: '完成单词测试',
    description: '正确率 85%',
    time: '14:30',
    icon: 'records',
  }),
  markRaw({
    id: 2,
    date: '昨天',
    title: '观看视频课程',
    description: '《英语口语进阶》第3课',
    time: '16:45',
    icon: 'play-circle-o',
  }),
  markRaw({
    id: 3,
    date: '昨天',
    title: '完成听力练习',
    description: '得分 90分',
    time: '10:20',
    icon: 'music-o',
  }),
]);

// 获取用户数据
const fetchUserData = async (showLoading = true) => {
  console.log('开始获取用户数据');
  refreshing.value = true;

  try {
    // 1. 获取当前登录用户基本信息
    await userStore.fetchCurrentUser();

    if (userStore.userInfo) {
      console.log('获取到的用户基本信息:', userStore.userInfo);

      // 2. 获取用户详细信息
      if (userStore.userInfo.id) {
        const response = await UserControllerService.getUserVoByIdUsingGet(
          userStore.userInfo.id,
        );

        if (response.code === 0 && response.data) {
          const userData = response.data;
          console.log('获取到的用户详细信息:', userData);

          // 更新用户基本信息
          userInfo.value = {
            username: userData.userName || '',
            nickname: userData.userName || '',
            phone: userData.userPhone || '',
            avatar:
              userData.userAvatar ||
              'https://img.zcool.cn/community/01a0d45d145963a8012187f447cfef.jpg@1280w_1l_2o_100sh.jpg',
            level: 3, // 这里可以根据实际情况从后端获取或计算
            nextLevelExp: 100, // 这里可以根据实际情况从后端获取或计算
          };

          // 这里可以添加获取其他数据的逻辑，如学习统计、成就等
          // 目前使用模拟数据，实际应用中应该从后端API获取

          // 模拟获取学习统计数据
          userStats.value = {
            daysLearned: 15,
            streakDays: 7,
            stars: 128,
            badges: 8,
          };

          // 模拟获取今日目标数据
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
      // 未登录或获取用户信息失败
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

// 下拉刷新
const onRefresh = () => {
  console.log('下拉刷新，重新获取用户数据');
  // 模拟网络请求延迟
  setTimeout(() => {
    showSuccessToast('刷新成功');
    refreshing.value = false;
  }, 1000);
};

// 添加新的学习目标
const addGoal = (goalText) => {
  // 生成新的ID (简单实现，实际应用中可能需要更复杂的ID生成逻辑)
  const newId =
    todayGoals.value.length > 0
      ? Math.max(...todayGoals.value.map((goal) => goal.id)) + 1
      : 1;

  // 添加新目标
  todayGoals.value.push(
    markRaw({
      id: newId,
      text: goalText,
      completed: false,
    }),
  );

  // 更新进度
  updateProgress();

  // 实际应用中，这里应该调用API将新目标保存到后端
  showToast('已添加新的学习目标');
};

// 切换目标完成状态
const toggleGoalStatus = (goalId) => {
  const goalIndex = todayGoals.value.findIndex((goal) => goal.id === goalId);
  if (goalIndex !== -1) {
    // 切换状态
    todayGoals.value[goalIndex].completed =
      !todayGoals.value[goalIndex].completed;

    // 更新进度
    updateProgress();

    // 实际应用中，这里应该调用API将状态变更保存到后端
    if (todayGoals.value[goalIndex].completed) {
      showToast('恭喜完成学习目标！');
    }
  }
};

// 更新进度
const updateProgress = () => {
  if (todayGoals.value.length === 0) {
    todayProgress.value = 0;
    return;
  }

  const completedCount = todayGoals.value.filter(
    (goal) => goal.completed,
  ).length;
  todayProgress.value = Math.round(
    (completedCount / todayGoals.value.length) * 100,
  );
};

// 退出登录
const handleLogout = async () => {
  try {
    await userStore.logout();
    showSuccessToast({
      message: '已退出登录',
      onClose: () => {
        router.push('/login');
      },
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

  // 初始化进度
  updateProgress();
});
</script>

<style scoped>
.profile {
  padding: 16px 16px 66px;
  background-color: #F2F7FD;
  min-height: 100vh;
}

/* 在二级页面中不需要为底部导航栏预留空间 */
:deep(.has-tabbar) {
  padding-bottom: 60px;
}

:deep(.van-pull-refresh) {
  min-height: calc(100vh - 32px);
}

:deep(.van-pull-refresh__track) {
  padding-bottom: 16px;
}
</style>
