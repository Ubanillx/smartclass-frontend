<template>
  <van-cell-group inset class="recent-learning">
    <van-cell title="最近学习" />
    <div class="learning-list">
      <div v-for="item in learningItems" :key="item.id" class="learning-item">
        <div class="image-container" :class="item.bgClass">
          <van-icon :name="item.icon" :color="item.color" size="24" />
        </div>
        <div class="learning-info">
          <div class="learning-name">{{ item.name }}</div>
          <div class="learning-progress">
            <van-progress 
              :percentage="item.progress" 
              size="small" 
              :stroke-width="6"
              :pivot-text="`${item.progress}%`"
            />
          </div>
        </div>
      </div>
    </div>
  </van-cell-group>
</template>

<script setup lang="ts">
interface LearningItem {
  id: number;
  name: string;
  icon: string;
  color: string;
  bgClass: string;
  progress: number;
}

defineProps<{
  learningItems: LearningItem[];
}>();
</script>

<style scoped>
.recent-learning {
  margin-bottom: 12px;
  border-radius: 12px;
  overflow: hidden;
  background-color: #ffffff;
  box-shadow: 0 2px 12px rgba(100, 101, 102, 0.08);
}

.learning-list {
  padding: 4px 16px 10px;
}

.learning-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 0;
  border-bottom: 1px solid #f5f5f5;
  transition: all 0.3s ease;
}

.learning-item:last-child {
  border-bottom: none;
}

.image-container {
  width: 48px;
  height: 48px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.image-container:hover {
  transform: scale(1.05);
}

.learning-info {
  flex: 1;
}

.learning-name {
  font-size: var(--font-size-md);
  color: #323233;
  margin-bottom: 6px;
  font-weight: 600;
  font-family: 'Noto Sans SC', sans-serif;
}

.learning-progress {
  width: 100%;
}

:deep(.van-cell__title) {
  font-weight: 600 !important;
  font-family: 'Noto Sans SC', sans-serif !important;
  font-size: var(--font-size-md) !important;
  color: #323233;
}

:deep(.van-cell) {
  padding: 10px 16px;
}

:deep(.van-progress__pivot) {
  background-color: #1989fa;
  color: #ffffff;
  font-weight: 500;
  font-size: var(--font-size-sm);
}

/* 背景颜色类 */
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
</style> 