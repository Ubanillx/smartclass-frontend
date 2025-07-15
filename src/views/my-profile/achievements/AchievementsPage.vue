<template>
  <div class="achievements-page">
    <!-- 返回按钮 -->
    <back-button title="我的成就" />

    <!-- 成就统计信息 -->
    <div class="stats-card">
      <div class="stats-item">
        <div class="stats-value">{{ totalAchievements }}</div>
        <div class="stats-label">已获得成就</div>
      </div>
      <div class="stats-item">
        <div class="stats-value">{{ nextLevelNeeded }}</div>
        <div class="stats-label">距离下一等级</div>
      </div>
      <div class="stats-item">
        <div class="stats-value">{{ completionPercentage }}%</div>
        <div class="stats-label">完成度</div>
      </div>
    </div>

    <!-- 分类标签页 -->
    <div class="tab-container">
      <van-tabs v-model:active="activeTab" class="custom-tabs">
        <van-tab title="全部成就" name="all"></van-tab>
        <van-tab title="最近获得" name="recent"></van-tab>
      </van-tabs>
    </div>

    <!-- 成就列表 -->
    <div class="achievement-grid">
      <div
        v-for="badge in filteredBadges"
        :key="badge.id"
        class="achievement-item"
        @click="showBadgeDetail(badge)"
      >
        <div class="badge-icon-wrapper" :class="badge.bgClass">
          <van-icon :name="badge.icon" :color="badge.color" size="24" />
        </div>
        <div class="badge-details">
          <span class="badge-name">{{ badge.name }}</span>
          <span class="badge-description">{{ badge.description }}</span>
          <span class="badge-date">获得于 {{ badge.date }}</span>
        </div>
      </div>
    </div>

    <!-- 成就弹窗详情 -->
    <van-popup
      v-model:show="showDetail"
      round
      position="bottom"
      :style="{ height: '60%' }"
    >
      <div class="badge-detail-popup" v-if="selectedBadge">
        <div class="popup-header">
          <van-icon
            name="cross"
            @click="showDetail = false"
            class="close-icon"
          />
          <h3 class="popup-title">成就详情</h3>
        </div>

        <div class="badge-detail-content">
          <div class="badge-icon-large" :class="selectedBadge.bgClass">
            <van-icon
              :name="selectedBadge.icon"
              :color="selectedBadge.color"
              size="64"
            />
          </div>

          <h2 class="badge-title">{{ selectedBadge.name }}</h2>
          <p class="badge-full-description">{{ selectedBadge.description }}</p>
          <p class="badge-earn-date">获得于 {{ selectedBadge.date }}</p>

          <div class="badge-criteria">
            <h4>获得条件</h4>
            <p>{{ selectedBadge.criteria }}</p>
          </div>

          <div class="share-button">
            <van-button type="primary" block>分享成就</van-button>
          </div>
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { BackButton } from '../../../components/Common';

interface BadgeDetail {
  id: number;
  name: string;
  icon: string;
  color: string;
  bgClass: string;
  description: string;
  date: string;
  criteria: string;
  category: string;
}

const router = useRouter();
const showDetail = ref(false);
const selectedBadge = ref<BadgeDetail | null>(null);
const activeTab = ref('all');

// 成就统计
const totalAchievements = ref(8);
const nextLevelNeeded = ref(2);
const completionPercentage = ref(62);

// 成就数据
const badges = ref<BadgeDetail[]>([
  {
    id: 1,
    name: '单词达人',
    icon: 'award',
    color: '#1989fa',
    bgClass: 'bg-blue',
    description: '背诵单词超过1000个',
    date: '2023-10-15',
    criteria: '背诵单词达到1000个',
    category: 'skill',
  },
  {
    id: 5,
    name: '阅读能手',
    icon: 'bookmark',
    color: '#ee0a24',
    bgClass: 'bg-red',
    description: '阅读20篇英语文章',
    date: '2023-10-12',
    criteria: '阅读英语文章达到20篇',
    category: 'skill',
  },
  {
    id: 3,
    name: '听力小子',
    icon: 'music',
    color: '#07c160',
    bgClass: 'bg-green',
    description: '完成50个听力练习',
    date: '2023-10-05',
    criteria: '完成听力练习50次',
    category: 'skill',
  },
  {
    id: 7,
    name: '口语达人',
    icon: 'chat',
    color: '#00ced1',
    bgClass: 'bg-cyan',
    description: '完成30次口语练习',
    date: '2023-10-02',
    criteria: '完成口语练习累计30次',
    category: 'skill',
  },
  {
    id: 2,
    name: '坚持不懈',
    icon: 'fire',
    color: '#ff976a',
    bgClass: 'bg-orange',
    description: '连续学习超过30天',
    date: '2023-09-28',
    criteria: '连续学习达到30天',
    category: 'persistence',
  },
  {
    id: 8,
    name: '写作高手',
    icon: 'records',
    color: '#ff69b4',
    bgClass: 'bg-pink',
    description: '完成15篇英语作文',
    date: '2023-09-20',
    criteria: '提交并批改英语作文15篇',
    category: 'skill',
  },
  {
    id: 6,
    name: '语法专家',
    icon: 'edit',
    color: '#7232dd',
    bgClass: 'bg-purple',
    description: '语法测试满分5次',
    date: '2023-09-15',
    criteria: '语法测试得满分累计5次',
    category: 'skill',
  },
  {
    id: 4,
    name: '初级达成',
    icon: 'star',
    color: '#ffcd32',
    bgClass: 'bg-yellow',
    description: '达到初级学习阶段',
    date: '2023-08-18',
    criteria: '完成初级课程并通过测试',
    category: 'learning',
  },
]);

// 根据筛选条件过滤徽章
const filteredBadges = computed(() => {
  let result = [...badges.value];

  // 根据标签页过滤
  if (activeTab.value === 'recent') {
    // 最近获得，按日期排序获取最近5个
    return result
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5);
  }

  return result;
});

// 显示徽章详情
const showBadgeDetail = (badge: BadgeDetail) => {
  selectedBadge.value = badge;
  showDetail.value = true;
};
</script>

<style scoped>
.achievements-page {
  padding: 0 0 16px 0;
  background-color: #f2f7fd;
  min-height: 100vh;
}

.stats-card {
  display: flex;
  justify-content: space-between;
  padding: 16px;
  background-color: #ffffff;
  border-radius: 0px;
  margin: 0 0 8px 0;
}

.stats-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
}

.stats-value {
  font-size: 24px;
  font-weight: bold;
  color: #323233;
  margin-bottom: 4px;
}

.stats-label {
  font-size: 14px;
  color: #969799;
}

.tab-container {
  background-color: #ffffff;
  margin-bottom: 8px;
}

.custom-tabs :deep(.van-tabs__wrap) {
  padding: 0 16px;
}

.custom-tabs :deep(.van-tabs__line) {
  background-color: #1989fa;
}

.achievement-grid {
  padding: 0 16px;
}

.achievement-item {
  display: flex;
  align-items: center;
  padding: 16px;
  background-color: #ffffff;
  border-radius: 12px;
  margin-bottom: 8px;
  box-shadow: 0 2px 8px rgba(100, 101, 102, 0.05);
}

.badge-icon-wrapper {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  margin-right: 16px;
  flex-shrink: 0;
}

.badge-details {
  display: flex;
  flex-direction: column;
  flex: 1;
}

.badge-name {
  font-size: 16px;
  font-weight: bold;
  color: #323233;
  margin-bottom: 4px;
}

.badge-description {
  font-size: 14px;
  color: #646566;
  margin-bottom: 4px;
}

.badge-date {
  font-size: 12px;
  color: #969799;
}

.badge-detail-popup {
  padding: 20px;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.popup-header {
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  margin-bottom: 24px;
}

.close-icon {
  position: absolute;
  left: 0;
  font-size: 18px;
}

.popup-title {
  font-size: 18px;
  font-weight: bold;
  margin: 0;
}

.badge-detail-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
}

.badge-icon-large {
  width: 120px;
  height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 24px;
  margin-bottom: 20px;
}

.badge-title {
  font-size: 22px;
  font-weight: bold;
  margin-bottom: 8px;
  text-align: center;
}

.badge-full-description {
  font-size: 16px;
  color: #323233;
  text-align: center;
  margin-bottom: 8px;
}

.badge-earn-date {
  font-size: 14px;
  color: #969799;
  margin-bottom: 24px;
}

.badge-criteria {
  width: 100%;
  background-color: #f7f8fa;
  padding: 16px;
  border-radius: 8px;
  margin-bottom: 24px;
}

.badge-criteria h4 {
  font-size: 16px;
  margin-top: 0;
  margin-bottom: 8px;
  color: #323233;
}

.badge-criteria p {
  font-size: 14px;
  color: #646566;
  margin: 0;
}

.share-button {
  width: 100%;
  margin-top: auto;
}

/* 成就背景颜色 */
.bg-blue {
  background-color: rgba(25, 137, 250, 0.1);
}

.bg-orange {
  background-color: rgba(255, 151, 106, 0.1);
}

.bg-green {
  background-color: rgba(7, 193, 96, 0.1);
}

.bg-purple {
  background-color: rgba(114, 50, 221, 0.1);
}

.bg-red {
  background-color: rgba(238, 10, 36, 0.1);
}

.bg-yellow {
  background-color: rgba(255, 205, 50, 0.1);
}

.bg-cyan {
  background-color: rgba(0, 206, 209, 0.1);
}

.bg-pink {
  background-color: rgba(255, 105, 180, 0.1);
}
</style>
