<template>
  <error-block
    title="网络连接失败"
    message="加载聊天记录失败，请检查网络连接后重试"
    icon="wifi-off"
    icon-color="#ff4d4f"
    :show-retry="true"
    retry-text="重新连接"
    :loading="loading"
    @retry="$emit('retry')"
  />
</template>

<script setup lang="ts">
import { ref, defineEmits } from 'vue';
import { ErrorBlock } from './index';

defineEmits(['retry']);

const props = defineProps({
  message: {
    type: String,
    default: '加载聊天记录失败，请检查网络连接后重试',
  },
  loading: {
    type: Boolean,
    default: false,
  },
});
</script>

<style scoped>
/* 可以在这里添加额外的自定义样式 */
</style>
