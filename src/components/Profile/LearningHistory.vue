<template>
  <div class="learning-history">
    <div class="history-header">
      <h3 class="section-title">学习历史记录</h3>
      <span class="more-link" @click="onViewAll">查看全部</span>
    </div>
    <div class="history-list">
      <div v-for="item in historyItems" :key="item.id" class="history-item">
        <div class="history-date">{{ item.date }}</div>
        <div class="history-content">
          <div class="icon-wrapper">
            <van-icon :name="item.icon" class="history-icon" />
          </div>
          <div class="history-info">
            <div class="history-title">{{ item.title }}</div>
            <div class="history-desc">{{ item.description }}</div>
          </div>
          <div class="history-time">{{ item.time }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface HistoryItem {
  id: number;
  date: string;
  time: string;
  icon: string;
  title: string;
  description: string;
}

defineProps<{
  historyItems: HistoryItem[];
}>();

const emit = defineEmits<{
  (e: 'view-all'): void;
}>();

const onViewAll = (): void => {
  emit('view-all');
};
</script>

<style scoped>
.learning-history {
  margin-bottom: 12px;
  border-radius: 12px;
  overflow: hidden;
  background-color: #ffffff;
  box-shadow: 0 2px 12px rgba(100, 101, 102, 0.08);
  padding: 16px;
}

.history-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.section-title {
  font-weight: 600;
  font-family: 'Noto Sans SC', sans-serif;
  font-size: var(--font-size-md);
  color: #323233;
  margin: 0;
}

.more-link {
  color: #1989fa;
  font-size: var(--font-size-sm);
  font-weight: 500;
  padding: 3px 6px;
  border-radius: 4px;
  background-color: rgba(25, 137, 250, 0.1);
}

.history-list {
  padding: 0;
}

.history-item {
  padding: 10px 0;
  border-bottom: 1px solid #f5f5f5;
}

.history-item:last-child {
  border-bottom: none;
}

.history-date {
  font-size: var(--font-size-sm);
  color: #969799;
  margin-bottom: 6px;
  font-family: 'Noto Sans SC', sans-serif;
  font-weight: 500;
}

.history-content {
  display: flex;
  align-items: center;
  gap: 10px;
}

.icon-wrapper {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: rgba(25, 137, 250, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
}

.history-icon {
  font-size: var(--font-size-lg);
  color: #1989fa;
}

.history-info {
  flex: 1;
}

.history-title {
  font-size: var(--font-size-md);
  color: #323233;
  margin-bottom: 4px;
  font-weight: 600;
  font-family: 'Noto Sans SC', sans-serif;
}

.history-desc {
  font-size: var(--font-size-sm);
  color: #646566;
  font-family: 'Noto Sans SC', sans-serif;
}

.history-time {
  font-size: var(--font-size-sm);
  color: #969799;
  font-family: 'Noto Sans SC', sans-serif;
  background-color: #f7f8fa;
  padding: 2px 6px;
  border-radius: 4px;
}

:deep(.van-cell__title) {
  font-weight: 600 !important;
  font-family: 'Noto Sans SC', sans-serif !important;
  font-size: var(--font-size-md) !important;
  color: #323233;
}

:deep(.van-cell) {
  padding: 10px 0 !important;
  border-radius: 0 !important;
  background-color: transparent !important;
  margin: 0 !important;
}

:deep(.van-cell:hover) {
  background-color: transparent !important;
}

:deep(.van-cell::after) {
  display: none !important;
}
</style>
