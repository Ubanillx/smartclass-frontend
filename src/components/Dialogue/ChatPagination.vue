<template>
  <div class="chat-pagination" v-if="totalPages > 0">
    <van-pagination
      v-model="currentPage"
      :total-items="totalItems"
      :items-per-page="pageSize"
      :show-page-size="5"
      force-ellipses
      @change="handlePageChange"
      class="custom-pagination"
    >
      <template #prev-text>
        <van-icon name="arrow-left" />
      </template>
      <template #next-text>
        <van-icon name="arrow" />
      </template>
      <template #page-desc>
        <span class="page-desc-text"
          >{{ currentPage }}/{{ totalPages }} 页</span
        >
      </template>
    </van-pagination>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';

const props = defineProps<{
  totalItems: number;
  pageSize: number;
  totalPages: number;
  initialPage?: number;
}>();

const emit = defineEmits(['page-change']);

const currentPage = ref(props.initialPage || 1);

// 监听当前页码变化
watch(
  () => props.initialPage,
  (newVal) => {
    if (newVal) {
      currentPage.value = newVal;
    }
  },
);

// 处理页码变化
const handlePageChange = (page: number) => {
  currentPage.value = page;
  emit('page-change', page);
};
</script>

<style scoped>
.chat-pagination {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 5px 0;
  box-sizing: border-box;
}

/* 自定义分页样式 */
:deep(.custom-pagination) {
  --van-pagination-height: 36px;
  --van-pagination-item-width: 36px;
  --van-pagination-item-margin: 0 3px;
  --van-pagination-item-default-color: #1989fa;
  --van-pagination-item-font-size: 14px;
  --van-pagination-item-border-width: 0;
  --van-pagination-background-color: transparent;
  width: 100%;
  display: flex;
  justify-content: center;
  margin: 0;
}

:deep(.custom-pagination .van-pagination__item) {
  border-radius: 8px;
  background-color: #e0f1fe;
  transition: all 0.2s ease;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

:deep(.custom-pagination .van-pagination__item--active) {
  background-color: #1989fa;
  color: white;
  font-weight: bold;
  box-shadow: 0 2px 6px rgba(25, 137, 250, 0.3);
}

:deep(.custom-pagination .van-pagination__prev),
:deep(.custom-pagination .van-pagination__next) {
  background-color: #e0f1fe;
  color: #666;
  border-radius: 8px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

:deep(.custom-pagination .van-pagination__prev:disabled),
:deep(.custom-pagination .van-pagination__next:disabled) {
  opacity: 0.5;
  background-color: #f5f5f5;
}

:deep(.custom-pagination .van-pagination__prev:active),
:deep(.custom-pagination .van-pagination__next:active),
:deep(.custom-pagination .van-pagination__item:active) {
  transform: scale(0.95);
  opacity: 0.8;
}

:deep(.custom-pagination .van-pagination__page-desc) {
  color: #666;
  font-size: 12px;
  margin: 0 6px;
}

.page-desc-text {
  font-family: 'Noto Sans SC', sans-serif;
  color: #666;
}
</style>
