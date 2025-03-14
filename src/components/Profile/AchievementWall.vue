<template>
  <van-cell-group inset class="achievements">
    <van-cell title="我的成就">
      <template #right-icon>
        <span class="more-link" @click="onViewAll">查看全部</span>
      </template>
    </van-cell>
    <van-grid :column-num="4" :border="false" class="badge-grid">
      <van-grid-item v-for="badge in badges" :key="badge.id">
        <template #icon>
          <div class="badge-icon-wrapper">
            <van-image :src="badge.icon" width="2.8rem" height="2.8rem" />
          </div>
        </template>
        <template #text>
          <span class="badge-name">{{ badge.name }}</span>
        </template>
      </van-grid-item>
    </van-grid>
  </van-cell-group>
</template>

<script setup lang="ts">
interface Badge {
  id: number;
  name: string;
  icon: string;
}

defineProps<{
  badges: Badge[];
}>();

const emit = defineEmits<{
  (e: 'view-all'): void;
}>();

const onViewAll = (): void => {
  emit('view-all');
};
</script>

<style scoped>
.achievements {
  margin-bottom: 12px;
  border-radius: 12px;
  overflow: hidden;
  background-color: #ffffff;
  box-shadow: 0 2px 12px rgba(100, 101, 102, 0.08);
}

.badge-grid {
  padding: 4px 0 10px;
}

.badge-icon-wrapper {
  background-color: #f7f8fa;
  border-radius: 12px;
  padding: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 2px;
}

.badge-name {
  font-size: var(--font-size-sm);
  color: #323233;
  font-family: 'Noto Sans SC', sans-serif;
  font-weight: 500;
  margin-top: 4px;
}

.more-link {
  color: #1989fa;
  font-size: var(--font-size-base);
  font-weight: 500;
  padding: 3px 6px;
  border-radius: 4px;
  background-color: rgba(25, 137, 250, 0.1);
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

:deep(.van-grid-item__content) {
  padding: 6px;
}
</style> 