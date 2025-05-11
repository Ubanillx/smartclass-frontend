<template>
  <div class="post-detail">
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
// 仅包装样式的容器组件
</script>

<style scoped>
.post-detail {
  background-color: var(--background-primary);
  min-height: 100vh;
  padding-bottom: 60px; /* 为底部输入框留出空间 */
}
</style> 