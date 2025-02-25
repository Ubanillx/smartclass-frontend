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
    </van-search>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
  placeholder: {
    type: String,
    default: '搜索'
  },
  modelValue: {
    type: String,
    default: ''
  }
});

const emit = defineEmits(['update:modelValue', 'search']);

const searchValue = ref(props.modelValue);

watch(searchValue, (newVal) => {
  emit('update:modelValue', newVal);
});

const onSearch = () => {
  emit('search', searchValue.value);
};
</script>

<style scoped>
.search-bar {
  position: sticky;
  top: 0;
  z-index: 999;
  background: #f7f8fa;
  padding: 8px 16px;
  margin: -16px -16px 16px -16px;
}

:deep(.van-search__content) {
  background: #ffffff;
  border: 1px solid #ebedf0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

:deep(.van-field__left-icon) {
  margin-right: 6px;
}
</style> 