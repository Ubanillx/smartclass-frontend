<template>
  <div class="study-stats">
    <div class="stats-grid">
      <div class="stat-item">
        <div class="stat-icon-wrapper clock-bg">
          <van-icon name="clock" color="#1989fa" size="24" />
        </div>
        <span class="stat-number">{{ stats.daysLearned }}</span>
        <span class="stat-label">学习天数</span>
      </div>
      <div class="stat-item">
        <div class="stat-icon-wrapper fire-bg">
          <van-icon name="fire" color="#ff976a" size="24" />
        </div>
        <span class="stat-number">{{ stats.streakDays }}</span>
        <span class="stat-label">连续打卡</span>
      </div>
      <div class="stat-item">
        <div class="stat-icon-wrapper star-bg">
          <van-icon name="star" color="#ffcd32" size="24" />
        </div>
        <span class="stat-number">{{ stats.stars }}</span>
        <span class="stat-label">获得星星</span>
      </div>
      <div class="stat-item">
        <div class="stat-icon-wrapper medal-bg">
          <van-icon name="medal-o" color="#7232dd" size="24" />
        </div>
        <span class="stat-number">{{ stats.badges }}</span>
        <span class="stat-label">获得徽章</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface StudyStats {
  daysLearned: number;
  streakDays: number;
  stars: number;
  badges: number;
}

defineProps<{
  stats: StudyStats;
}>();
</script>

<style scoped>
.study-stats {
  margin-bottom: 12px;
  border-radius: 12px;
  overflow: hidden;
  background-color: #ffffff;
  box-shadow: 0 2px 12px rgba(100, 101, 102, 0.08);
  padding: 16px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.stat-icon-wrapper {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  margin-bottom: 8px;
  transition: all 0.3s ease;
}

.stat-icon-wrapper:hover {
  transform: scale(1.05);
}

.clock-bg {
  background-color: rgba(25, 137, 250, 0.1);
}

.fire-bg {
  background-color: rgba(255, 151, 106, 0.1);
}

.star-bg {
  background-color: rgba(255, 205, 50, 0.1);
}

.medal-bg {
  background-color: rgba(114, 50, 221, 0.1);
}

.stat-number {
  display: block;
  font-size: var(--font-size-xl);
  font-weight: bold;
  color: #323233;
  margin-top: 4px;
}

.stat-label {
  display: block;
  font-size: var(--font-size-sm);
  color: #969799;
  margin-top: 2px;
}

:deep(.van-grid-item__content) {
  padding: 16px 8px;
  background-color: #ffffff;
}

:deep(.van-grid-item__icon) {
  font-size: var(--font-size-xl);
}
</style>
