<template>
  <van-cell-group inset class="achievements">
    <van-cell title="我的成就">
      <template #right-icon>
        <span class="more-link" @click="onViewAll">查看全部</span>
      </template>
    </van-cell>
    <van-grid :column-num="4" :border="false">
      <van-grid-item v-for="badge in badges" :key="badge.id">
        <template #icon>
          <van-image :src="badge.icon" width="2.5rem" height="2.5rem" />
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
  margin-bottom: 16px;
}

.badge-name {
  font-size: var(--font-size-sm, 12px);
  color: #646566;
  font-family: 'Noto Sans SC', sans-serif;
}

.more-link {
  color: #1989fa;
  font-size: var(--font-size-base, 14px);
}

:deep(.van-cell__title) {
  font-weight: 700 !important;
  font-family: 'Noto Sans SC', sans-serif !important;
  font-size: var(--font-size-md, 16px) !important;
}
</style> 