<template>
  <div class="error-block">
    <div class="error-container">
      <van-icon :name="icon" size="48" :color="iconColor" class="error-icon" />
      <div class="error-title">{{ title }}</div>
      <div class="error-message">{{ message }}</div>
      <van-button
        v-if="showRetry"
        type="primary"
        size="small"
        round
        :loading="loading"
        class="retry-button"
        @click="$emit('retry')"
      >
        {{ retryText }}
      </van-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';

defineEmits(['retry']);

const props = defineProps({
  title: {
    type: String,
    default: '加载失败',
  },
  message: {
    type: String,
    default: '网络连接出错，请检查网络后重试',
  },
  icon: {
    type: String,
    default: 'warning-o',
  },
  iconColor: {
    type: String,
    default: '#ff976a', // 橙色警告
  },
  showRetry: {
    type: Boolean,
    default: true,
  },
  retryText: {
    type: String,
    default: '重试',
  },
  loading: {
    type: Boolean,
    default: false,
  },
});
</script>

<style scoped>
.error-block {
  width: 100%;
  padding: 32px 0;
  display: flex;
  justify-content: center;
  align-items: center;
}

.error-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  max-width: 80%;
  text-align: center;
}

.error-icon {
  margin-bottom: 12px;
}

.error-title {
  font-size: 18px;
  font-weight: 700;
  color: #323233;
  margin-bottom: 8px;
  font-family: 'Noto Sans SC', sans-serif;
}

.error-message {
  font-size: 14px;
  color: #969799;
  margin-bottom: 16px;
  line-height: 1.5;
  font-family: 'Noto Sans SC', sans-serif;
}

.retry-button {
  min-width: 120px;
  font-weight: 500;
}
</style>
