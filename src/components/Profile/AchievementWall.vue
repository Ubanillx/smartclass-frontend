<template>
  <div class="achievements">
    <div class="achievements-header">
      <h3 class="section-title">我的成就</h3>
      <span class="more-link" @click="onViewAll">查看全部</span>
    </div>
    <div class="badge-container">
      <div class="badge-grid">
        <div v-for="badge in badges" :key="badge.id" class="badge-item">
          <div class="badge-icon-wrapper" :class="badge.bgClass">
            <van-icon :name="badge.icon" :color="badge.color" size="24" />
          </div>
          <span class="badge-name">{{ badge.name }}</span>
        </div>
      </div>
    </div>
  </div>
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
  padding: 16px;
}

.achievements-header {
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

.badge-container {
  width: 100%;
}

.badge-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px 8px;
}

.badge-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.badge-icon-wrapper {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  margin-bottom: 4px;
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
}

.more-link {
  color: #1989fa;
  font-size: var(--font-size-sm);
  font-weight: 500;
  padding: 3px 6px;
  border-radius: 4px;
  background-color: rgba(25, 137, 250, 0.1);
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
