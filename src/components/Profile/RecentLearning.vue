<template>
  <van-cell-group inset class="recent-learning">
    <van-cell title="最近学习" />
    <div class="learning-list">
      <div v-for="item in learningItems" :key="item.id" class="learning-item">
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
</template>

<script setup>
import { defineProps } from 'vue';

const props = defineProps({
  learningItems: {
    type: Array,
    required: true
  }
});
</script>

<style scoped>
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
  font-size: var(--font-size-base, 14px);
  color: #323233;
  margin-bottom: 8px;
  font-weight: 700;
  font-family: 'Noto Sans SC', sans-serif;
}

.learning-progress {
  width: 100%;
}

:deep(.van-cell__title) {
  font-weight: 700 !important;
  font-family: 'Noto Sans SC', sans-serif !important;
  font-size: var(--font-size-md, 16px) !important;
}
</style> 