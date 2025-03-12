<template>
  <div class="profile has-tabbar">
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
  </div>
</template>

<script setup>
import { ref, markRaw } from 'vue';
import { useRouter } from 'vue-router';
import { showToast } from 'vant';
import { 
  UserInfoCard, 
  StudyStatsGrid, 
  TodayGoals, 
  AchievementWall, 
  RecentLearning, 
  LearningHistory, 
  LogoutButton 
} from '../components/Profile';

// 使用markRaw包装组件，防止被转换为响应式对象
const UserInfoCardRaw = markRaw(UserInfoCard);
const StudyStatsGridRaw = markRaw(StudyStatsGrid);
const TodayGoalsRaw = markRaw(TodayGoals);
const AchievementWallRaw = markRaw(AchievementWall);
const RecentLearningRaw = markRaw(RecentLearning);
const LearningHistoryRaw = markRaw(LearningHistory);
const LogoutButtonRaw = markRaw(LogoutButton);

const router = useRouter();

// Mock 数据
const userInfo = ref({
  username: '小明',
  nickname: '小明',
  phone: '13812345678',
  avatar: 'https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg',
  level: 3,
  nextLevelExp: 100
});

const userStats = ref({
  daysLearned: 15,
  streakDays: 7,
  stars: 128,
  badges: 8
});

// 今日目标
const todayProgress = ref(60);
const todayGoals = ref([
  { id: 1, text: '完成每日单词打卡', completed: true },
  { id: 2, text: '听力练习15分钟', completed: true },
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

const handleLogout = () => {
  localStorage.removeItem('isLoggedIn');
  localStorage.removeItem('userInfo');
  
  showToast({
    type: 'success',
    message: '已退出登录',
    onClose: () => {
      router.push('/login');
    }
  });
};
</script>

<style scoped>
.profile {
  padding: 16px;
  padding-bottom: 66px;
}
</style> 