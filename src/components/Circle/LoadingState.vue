<template>
  <div class="loading-state">
    <van-loading type="spinner" color="#1989fa" size="36px" />
    <div class="loading-text">加载中...</div>
  </div>
</template>

<script setup lang="ts">
// 纯展示型组件
</script>

<style scoped>
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 300px;
}

.loading-text {
  margin-top: 16px;
  font-size: var(--font-size-md);
  color: #969799;
}
</style> 