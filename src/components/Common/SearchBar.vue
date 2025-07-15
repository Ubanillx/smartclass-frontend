<template>
  <div class="search-bar">
    <van-search
      v-model="searchValue"
      :placeholder="placeholder"
      shape="round"
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


:deep(.search-icon) {
  color: #1989fa;
  font-weight: bold;
  transition: all 0.3s ease;
}

:deep(.van-search__content:hover .search-icon) {
  transform: scale(1.1);
}

</style>
