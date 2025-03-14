<template>
  <van-cell-group inset class="study-stats">
    <van-grid :column-num="4" :border="false">
      <van-grid-item>
        <template #icon>
          <van-icon name="clock" color="#1989fa" size="24" />
        </template>
        <template #text>
          <span class="stat-number">{{ stats.daysLearned }}</span>
          <span class="stat-label">学习天数</span>
        </template>
      </van-grid-item>
      <van-grid-item>
        <template #icon>
          <van-icon name="fire" color="#ff976a" size="24" />
        </template>
        <template #text>
          <span class="stat-number">{{ stats.streakDays }}</span>
          <span class="stat-label">连续打卡</span>
        </template>
      </van-grid-item>
      <van-grid-item>
        <template #icon>
          <van-icon name="star" color="#ffcd32" size="24" />
        </template>
        <template #text>
          <span class="stat-number">{{ stats.stars }}</span>
          <span class="stat-label">获得星星</span>
        </template>
      </van-grid-item>
      <van-grid-item>
        <template #icon>
          <van-icon name="medal-o" color="#7232dd" size="24" />
        </template>
        <template #text>
          <span class="stat-number">{{ stats.badges }}</span>
          <span class="stat-label">获得徽章</span>
        </template>
      </van-grid-item>
    </van-grid>
  </van-cell-group>
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
  padding: 10px 8px;
  background-color: #ffffff;
}

:deep(.van-grid-item__icon) {
  font-size: var(--font-size-xl);
}

:deep(.van-icon) {
  background-color: rgba(25, 137, 250, 0.1);
  padding: 6px;
  border-radius: 50%;
}

:deep(.van-icon-clock) {
  background-color: rgba(25, 137, 250, 0.1);
}

:deep(.van-icon-fire) {
  background-color: rgba(255, 151, 106, 0.1);
}

:deep(.van-icon-star) {
  background-color: rgba(255, 205, 50, 0.1);
}

:deep(.van-icon-medal-o) {
  background-color: rgba(114, 50, 221, 0.1);
}
</style> 