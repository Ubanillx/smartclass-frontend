<template>
  <div class="profile">
    <!-- 用户基本信息卡片 -->
    <van-cell-group inset class="user-card">
      <van-row>
        <van-col span="6">
          <van-image
            round
            width="4rem"
            height="4rem"
            :src="userInfo.avatar"
          />
        </van-col>
        <van-col span="16">
          <div class="user-info">
            <h3>{{ userInfo.username }}</h3>
            <p class="nickname">昵称：{{ userInfo.nickname }}</p>
            <div class="level-info">
              <van-tag type="primary">等级 {{ userInfo.level }}</van-tag>
              <span class="exp-text">距离下一级还需 {{ userInfo.nextLevelExp }} 经验</span>
            </div>
          </div>
        </van-col>
        <van-col span="2">
          <van-icon 
            name="setting-o" 
            size="24" 
            class="settings-icon"
            @click="router.push('/settings')"
          />
        </van-col>
      </van-row>
    </van-cell-group>

    <!-- 学习数据展示 -->
    <van-grid :column-num="4" :border="false" class="study-stats">
      <van-grid-item>
        <template #icon>
          <van-icon name="clock" color="#1989fa" size="24" />
        </template>
        <template #text>
          <span class="stat-number">{{ userStats.daysLearned }}</span>
          <span class="stat-label">学习天数</span>
        </template>
      </van-grid-item>
      <van-grid-item>
        <template #icon>
          <van-icon name="fire" color="#ff976a" size="24" />
        </template>
        <template #text>
          <span class="stat-number">{{ userStats.streakDays }}</span>
          <span class="stat-label">连续打卡</span>
        </template>
      </van-grid-item>
      <van-grid-item>
        <template #icon>
          <van-icon name="star" color="#ffcd32" size="24" />
        </template>
        <template #text>
          <span class="stat-number">{{ userStats.stars }}</span>
          <span class="stat-label">获得星星</span>
        </template>
      </van-grid-item>
      <van-grid-item>
        <template #icon>
          <van-icon name="medal-o" color="#7232dd" size="24" />
        </template>
        <template #text>
          <span class="stat-number">{{ userStats.badges }}</span>
          <span class="stat-label">获得徽章</span>
        </template>
      </van-grid-item>
    </van-grid>

    <!-- 今日学习目标 -->
    <van-cell-group inset class="today-goals">
      <van-cell title="今日学习目标">
        <template #label>
          <van-progress 
            :percentage="todayProgress" 
            :pivot-text="`${todayProgress}%`"
            color="#1989fa"
          />
        </template>
      </van-cell>
      <div class="goal-items">
        <div class="goal-item" :class="{ completed: goal.completed }" v-for="goal in todayGoals" :key="goal.id">
          <van-icon :name="goal.completed ? 'checked' : 'circle'" />
          <span>{{ goal.text }}</span>
        </div>
      </div>
    </van-cell-group>

    <!-- 我的成就墙 -->
    <van-cell-group inset class="achievements">
      <van-cell title="我的成就">
        <template #right-icon>
          <span class="more-link" @click="router.push('/achievements')">查看全部</span>
        </template>
      </van-cell>
      <van-grid :column-num="4" :border="false">
        <van-grid-item v-for="badge in recentBadges" :key="badge.id">
          <template #icon>
            <van-image :src="badge.icon" width="2.5rem" height="2.5rem" />
          </template>
          <template #text>
            <span class="badge-name">{{ badge.name }}</span>
          </template>
        </van-grid-item>
      </van-grid>
    </van-cell-group>

    <!-- 最近学习 -->
    <van-cell-group inset class="recent-learning">
      <van-cell title="最近学习" />
      <div class="learning-list">
        <div v-for="item in recentLearning" :key="item.id" class="learning-item">
          <van-image :src="item.icon" width="2rem" height="2rem" />
          <div class="learning-info">
            <div class="learning-name">{{ item.name }}</div>
            <div class="learning-progress">
              <van-progress :percentage="item.progress" size="small" />
            </div>
          </div>
        </div>
      </div>
    </van-cell-group>

    <!-- 学习历史记录 -->
    <van-cell-group inset class="learning-history">
      <van-cell title="学习历史记录">
        <template #right-icon>
          <span class="more-link" @click="router.push('/history')">查看全部</span>
        </template>
      </van-cell>
      <div class="history-list">
        <div v-for="item in learningHistory" :key="item.id" class="history-item">
          <div class="history-date">{{ item.date }}</div>
          <div class="history-content">
            <van-icon :name="item.icon" class="history-icon" />
            <div class="history-info">
              <div class="history-title">{{ item.title }}</div>
              <div class="history-desc">{{ item.description }}</div>
            </div>
            <div class="history-time">{{ item.time }}</div>
          </div>
        </div>
      </div>
    </van-cell-group>

    <!-- 退出登录按钮 -->
    <div class="logout-section">
      <van-button 
        block 
        class="logout-btn" 
        @click="showLogoutConfirm"
      >
        退出登录
      </van-button>
    </div>

    <van-dialog
      v-model:show="showLogoutDialog"
      title="退出登录"
      show-cancel-button
      @confirm="handleLogout"
    >
      <div class="logout-dialog-content">
        确定要退出登录吗？
      </div>
    </van-dialog>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { showToast } from 'vant';

const router = useRouter();
const showLogoutDialog = ref(false);

// Mock 数据
const userInfo = ref({
  username: '小明',
  nickname: '爱学习的小明',
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

const showLogoutConfirm = () => {
  showLogoutDialog.value = true;
};

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
  background: #f7f8fa;
}

.user-card {
  margin-bottom: 16px;
  padding: 16px;
  background: #fff;
  border-radius: 8px;
}

.user-info h3 {
  margin: 0 0 8px 0;
  font-size: 18px;
  color: #323233;
}

.nickname {
  margin: 0 0 8px 0;
  font-size: 14px;
  color: #969799;
}

.level-info {
  display: flex;
  align-items: center;
  gap: 8px;
}

.exp-text {
  font-size: 12px;
  color: #969799;
}

.settings-icon {
  color: #969799;
  padding: 8px;
  cursor: pointer;
}

.study-stats {
  margin-bottom: 16px;
  background: #fff;
  border-radius: 8px;
}

.stat-number {
  display: block;
  font-size: 18px;
  font-weight: bold;
  color: #323233;
}

.stat-label {
  display: block;
  font-size: 12px;
  color: #969799;
  margin-top: 4px;
}

.today-goals {
  margin-bottom: 16px;
}

.goal-items {
  padding: 12px 16px;
}

.goal-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 0;
  color: #323233;
}

.goal-item.completed {
  color: #1989fa;
}

.goal-item .van-icon {
  font-size: 18px;
}

.achievements {
  margin-bottom: 16px;
}

.badge-name {
  font-size: 12px;
  color: #646566;
}

.more-link {
  color: #1989fa;
  font-size: 14px;
}

.recent-learning {
  margin-bottom: 16px;
}

.learning-list {
  padding: 8px 16px;
}

.learning-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 0;
  border-bottom: 1px solid #ebedf0;
}

.learning-item:last-child {
  border-bottom: none;
}

.learning-info {
  flex: 1;
}

.learning-name {
  font-size: 14px;
  color: #323233;
  margin-bottom: 8px;
}

.learning-progress {
  width: 100%;
}

.learning-history {
  margin-bottom: 16px;
}

.history-list {
  padding: 0 16px;
}

.history-item {
  padding: 12px 0;
  border-bottom: 1px solid #ebedf0;
}

.history-item:last-child {
  border-bottom: none;
}

.history-date {
  font-size: 12px;
  color: #969799;
  margin-bottom: 8px;
}

.history-content {
  display: flex;
  align-items: center;
  gap: 12px;
}

.history-icon {
  font-size: 20px;
  color: #1989fa;
}

.history-info {
  flex: 1;
}

.history-title {
  font-size: 14px;
  color: #323233;
  margin-bottom: 4px;
}

.history-desc {
  font-size: 12px;
  color: #969799;
}

.history-time {
  font-size: 12px;
  color: #969799;
}

.logout-section {
  margin: 20px 16px;
}

.logout-btn {
  height: 44px;
  font-size: 16px;
  color: #ee0a24;
  background: white;
  border: none;
}

.logout-dialog-content {
  padding: 20px 16px;
  text-align: center;
  color: #323233;
}

:deep(.van-dialog__confirm) {
  color: #ee0a24 !important;
}
</style> 