<template>
  <van-cell-group inset class="achievements">
    <van-cell title="我的成就">
      <template #right-icon>
        <span class="more-link" @click="onViewAll">查看全部</span>
      </template>
    </van-cell>
    <div class="badge-scroll-container">
      <van-grid :column-num="4" :border="false" class="badge-grid">
        <van-grid-item v-for="badge in badges" :key="badge.id">
          <template #icon>
            <div class="badge-icon-wrapper" :class="badge.bgClass">
              <van-icon :name="badge.icon" :color="badge.color" size="24" />
            </div>
          </template>
          <template #text>
            <span class="badge-name">{{ badge.name }}</span>
          </template>
        </van-grid-item>
      </van-grid>
    </div>
  </van-cell-group>
</template>

<script setup lang="ts">
interface Badge {
  id: number;
  name: string;
  icon: string;
  color: string;
  bgClass: string;
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

.badge-scroll-container {
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none; /* Firefox */
}

.badge-scroll-container::-webkit-scrollbar {
  display: none; /* Chrome, Safari, Edge */
}

.badge-grid {
  padding: 4px 0 10px;
  width: max-content;
  min-width: 100%;
}

.badge-icon-wrapper {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  margin-bottom: 2px;
  transition: all 0.3s ease;
}

.badge-icon-wrapper:hover {
  transform: scale(1.05);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
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