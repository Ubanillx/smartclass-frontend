<template>
  <div class="search-bar">
    <van-search
      v-model="searchValue"
      :placeholder="placeholder"
      shape="round"
      background="transparent"
      :clearable="true"
      input-align="center"
      @search="onSearch"
      :readonly="!disableRedirect"
      @click="!disableRedirect && goToSearchPage()"
    >
      <template #left-icon>
        <van-icon name="search" size="18" class="search-icon" />
      </template>
      <template #right-icon>
        <slot name="right-icon"></slot>
      </template>
    </van-search>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { useRouter } from 'vue-router';

const props = defineProps<{
  placeholder?: string;
  modelValue?: string;
  disableRedirect?: boolean;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void;
  (e: 'search', text: string): void;
}>();

const router = useRouter();
const searchValue = ref(props.modelValue || '');

watch(searchValue, (newVal) => {
  emit('update:modelValue', newVal);
});

const onSearch = (): void => {
  emit('search', searchValue.value);
};

const goToSearchPage = (): void => {
  router.push('/search');
};
</script>

<style scoped>
.search-bar {
  position: sticky;
  top: 0;
  z-index: 999;
  background: transparent;
  padding: 8px 0;
  margin: -10px 0 16px 0;
}

:deep(.van-search) {
  padding: 4px 0;
  background: transparent;
}

:deep(.van-search__content) {
  background: rgba(255, 255, 255, 0.8);
  border-radius: 20px;
  padding: 0 6px;
  height: 40px;
  box-shadow: none;
  transition: all 0.3s ease;
  border: none;
  display: flex;
  align-items: center;
}

:deep(.van-search__content:hover) {
  box-shadow: none;
  transform: translateY(-1px);
  background: rgba(255, 255, 255, 0.9);
}

:deep(.van-cell) {
  background-color: transparent !important;
  padding: 8px 8px !important;
  line-height: 24px;
}

:deep(.van-field__left-icon) {
  margin-right: 6px;
  display: flex;
  align-items: center;
  height: 100%;
}

:deep(.van-field__right-icon) {
  margin-right: 6px;
  display: flex;
  align-items: center;
  height: 100%;
}

:deep(.van-field__control) {
  color: #323233;
  font-size: var(--font-size-md);
  font-family: 'Noto Sans SC', sans-serif;
}

:deep(.van-field__control::placeholder) {
  color: #969799;
  font-size: var(--font-size-md);
  text-align: center;
}

:deep(.van-search--focus .van-search__content) {
  background: rgba(255, 255, 255, 0.95);
  box-shadow: none;
  border: none;
}

:deep(.search-icon) {
  color: #1989fa;
  font-weight: bold;
  transition: all 0.3s ease;
}

:deep(.van-search__content:hover .search-icon) {
  transform: scale(1.1);
}

:deep(.van-field) {
  padding: 0;
  height: 100%;
  display: flex;
  align-items: center;
}

:deep(.van-field__body) {
  display: flex;
  align-items: center;
  height: 100%;
}
</style>
