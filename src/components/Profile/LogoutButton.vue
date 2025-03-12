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
  margin: 20px 16px;
}

.logout-btn {
  height: 44px;
  font-size: 16px;
  color: #ee0a24;
  background: white;
  border: none;
}

.logout-dialog-content {
  padding: 0 20px 20px;
  text-align: center;
  color: #646566;
}
</style> 