<template>
  <van-cell-group inset class="user-card">
    <van-row>
      <van-col span="6">
        <van-image
          round
          width="4rem"
          height="4rem"
          :src="userInfo.avatar"
        />
      </van-col>
      <van-col span="16">
        <div class="user-info">
          <h3>{{ userInfo.nickname }}</h3>
          <p class="phone">手机号：{{ formatPhone(userInfo.phone) }}</p>
          <div class="level-info">
            <van-tag type="primary">等级 {{ userInfo.level }}</van-tag>
            <span class="exp-text">距离下一级还需 {{ userInfo.nextLevelExp }} 经验</span>
          </div>
        </div>
      </van-col>
      <van-col span="2">
        <van-icon 
          name="setting-o" 
          size="24" 
          class="settings-icon"
          @click="goToSettings"
        />
      </van-col>
    </van-row>
  </van-cell-group>
</template>

<script setup lang="ts">
interface UserInfo {
  avatar: string;
  nickname: string;
  phone: string;
  level: number;
  nextLevelExp: number;
}

defineProps<{
  userInfo: UserInfo;
}>();

const emit = defineEmits<{
  (e: 'settings'): void;
}>();

const goToSettings = (): void => {
  emit('settings');
};

// 格式化手机号，中间4位显示为*
const formatPhone = (phone: string): string => {
  if (!phone) return '未设置';
  return phone.toString().replace(/(\d{3})(\d{4})(\d{4})/, '$1****$3');
};
</script>

<style scoped>
.user-card {
  margin-bottom: 16px;
  padding: 16px;
  background-color: #f7f8fa;
  border-radius: 8px;
}

.user-info {
  padding-left: 16px;
}

.user-info h3 {
  margin: 0 0 8px;
  font-size: 18px;
  font-weight: 500;
}

.phone {
  margin: 0 0 8px;
  font-size: 14px;
  color: #646566;
}

.level-info {
  display: flex;
  align-items: center;
}

.exp-text {
  margin-left: 8px;
  font-size: 12px;
  color: #969799;
}

.settings-icon {
  margin-top: 8px;
  color: #969799;
}

:deep(.van-cell-group__inset) {
  margin: 0;
  background-color: #f7f8fa;
}

:deep(.van-cell-group__inset) .van-cell::after {
  border-bottom: none;
}
</style> 