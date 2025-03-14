<template>
  <div class="search-bar">
    <van-search
      v-model="searchValue"
      :placeholder="placeholder"
      shape="round"
      background="#f7f8fa"
      :clearable="true"
      input-align="center"
      @search="onSearch"
    >
      <template #left-icon>
        <van-icon name="search" size="18" color="#1989fa"/>
      </template>
      <template #right-icon>
        <slot name="right-icon"></slot>
      </template>
    </van-search>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';

const props = defineProps<{
  placeholder?: string;
  modelValue?: string;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void;
  (e: 'search', text: string): void;
}>();

const searchValue = ref(props.modelValue || '');

watch(searchValue, (newVal) => {
  emit('update:modelValue', newVal);
});

const onSearch = (): void => {
  emit('search', searchValue.value);
};
</script>

<style scoped>
.search-bar {
  position: sticky;
  top: 0;
  z-index: 999;
  background: #f7f8fa;
  padding: 16px 16px;
  margin: -18px -16px 0 -16px;
}

:deep(.van-search) {
  padding: 4px 0;
}

:deep(.van-search__content) {
  background: #ffffff;
  border: 1px solid #ebedf0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

:deep(.van-field__left-icon) {
  margin-right: 6px;
}

:deep(.van-field__right-icon) {
  margin-right: 6px;
}
</style> 