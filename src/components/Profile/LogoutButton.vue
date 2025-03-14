<template>
  <div class="logout-section">
    <van-button 
      block 
      class="logout-btn" 
      @click="showConfirm"
    >
      退出登录
    </van-button>

    <van-dialog
      v-model:show="showDialog"
      title="退出登录"
      show-cancel-button
      confirm-button-color="#ee0a24"
      cancel-button-color="#646566"
      @confirm="onLogout"
    >
      <div class="logout-dialog-content">
        确定要退出登录吗？
      </div>
    </van-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const emit = defineEmits<{
  (e: 'logout'): void;
}>();

const showDialog = ref(false);

const showConfirm = (): void => {
  showDialog.value = true;
};

const onLogout = (): void => {
  emit('logout');
};
</script>

<style scoped>
.logout-section {
  margin: 16px 16px;
}

.logout-btn {
  height: 40px;
  font-size: var(--font-size-md);
  font-weight: 500;
  color: #ee0a24;
  background: white;
  border: 1px solid rgba(238, 10, 36, 0.2);
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(238, 10, 36, 0.08);
  transition: all 0.3s ease;
}

.logout-btn:active {
  background-color: rgba(238, 10, 36, 0.05);
}

.logout-dialog-content {
  padding: 8px 16px 16px;
  text-align: center;
  color: #323233;
  font-size: var(--font-size-md);
}

:deep(.van-dialog__header) {
  font-weight: 600;
  padding-top: 16px;
}

:deep(.van-button--default) {
  border-radius: 4px;
}
</style> 