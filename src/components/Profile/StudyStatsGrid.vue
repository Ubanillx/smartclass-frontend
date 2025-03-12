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

<script setup>
import { defineProps } from 'vue';

const props = defineProps({
  stats: {
    type: Object,
    required: true
  }
});
</script>

<style scoped>
.study-stats {
  margin-bottom: 16px;
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
</style> 