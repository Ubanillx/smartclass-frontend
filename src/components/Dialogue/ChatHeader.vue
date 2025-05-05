<template>
  <div class="chat-header">
    <back-button :title="title" class="back-button" />
  </div>
</template>

<script setup lang="ts">
import { BackButton } from '../Common';

// 定义props
const props = defineProps<{
  title: string;
}>();
</script>

<style scoped>
.chat-header {
  flex-shrink: 0;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 10;
  background-color: #fff;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
  width: 100%;
}
</style> 