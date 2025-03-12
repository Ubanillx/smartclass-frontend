<template>
  <van-cell-group inset class="learning-history">
    <van-cell title="学习历史记录">
      <template #right-icon>
        <span class="more-link" @click="onViewAll">查看全部</span>
      </template>
    </van-cell>
    <div class="history-list">
      <div v-for="item in historyItems" :key="item.id" class="history-item">
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
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';

const props = defineProps({
  historyItems: {
    type: Array,
    required: true
  }
});

const emit = defineEmits(['view-all']);

const onViewAll = () => {
  emit('view-all');
};
</script>

<style scoped>
.learning-history {
  margin-bottom: 16px;
}

.more-link {
  color: #1989fa;
  font-size: var(--font-size-base, 14px);
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
  font-size: var(--font-size-sm, 12px);
  color: #969799;
  margin-bottom: 8px;
  font-family: 'Noto Sans SC', sans-serif;
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
  font-size: var(--font-size-base, 14px);
  color: #323233;
  margin-bottom: 4px;
  font-weight: 700;
  font-family: 'Noto Sans SC', sans-serif;
}

.history-desc {
  font-size: var(--font-size-sm, 12px);
  color: #969799;
  font-family: 'Noto Sans SC', sans-serif;
}

.history-time {
  font-size: var(--font-size-sm, 12px);
  color: #969799;
  font-family: 'Noto Sans SC', sans-serif;
}

:deep(.van-cell__title) {
  font-weight: 700 !important;
  font-family: 'Noto Sans SC', sans-serif !important;
  font-size: var(--font-size-md, 16px) !important;
}
</style> 