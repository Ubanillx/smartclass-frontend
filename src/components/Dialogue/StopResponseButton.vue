<template>
  <van-button
    v-if="show"
    class="stop-response-btn"
    size="small"
    type="default"
    @click="$emit('stop')"
  >
    <van-icon name="pause-circle-o" style="margin-right: 4px; vertical-align: -2px;" />
    停止响应
  </van-button>
</template>

<script setup lang="ts">
// 定义props
const props = defineProps<{
  show: boolean;
}>();

// 定义emit
const emit = defineEmits<{
  (e: 'stop'): void;
}>();
</script>

<style scoped>
.stop-response-btn {
  position: fixed;
  left: 50%;
  transform: translateX(-50%);
  bottom: 140px;
  z-index: 999;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border-radius: 16px;
  padding: 0 12px;
  height: 32px;
  background-color: #fff;
  color: #333;
  border: 1px solid #eaeaea;
  font-size: 14px;
  transition: all 0.3s;
}

.stop-response-btn:active {
  background-color: #f2f3f5;
}
</style> 