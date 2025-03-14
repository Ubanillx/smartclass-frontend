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
  margin-bottom: 12px;
  padding: 12px;
  background-color: #ffffff;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(100, 101, 102, 0.08);
}

.user-info {
  padding-left: 12px;
}

.user-info h3 {
  margin: 0 0 6px;
  font-size: var(--font-size-lg);
  font-weight: 600;
  color: #323233;
}

.phone {
  margin: 0 0 6px;
  font-size: var(--font-size-base);
  color: #646566;
}

.level-info {
  display: flex;
  align-items: center;
  flex-wrap: nowrap;
  white-space: nowrap;
  overflow: hidden;
}

:deep(.van-tag) {
  font-size: var(--font-size-sm);
  padding: 0 6px;
  height: 18px;
  line-height: 18px;
  font-weight: 500;
  border-radius: 4px;
}

.exp-text {
  margin-left: 6px;
  font-size: var(--font-size-sm);
  color: #969799;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.settings-icon {
  margin-top: 4px;
  color: #323233;
  padding: 4px;
  border-radius: 50%;
  background-color: #f7f8fa;
}

:deep(.van-cell-group__inset) {
  margin: 0;
  background-color: transparent;
  border: none;
}

:deep(.van-cell-group__inset) .van-cell::after {
  border-bottom: none;
}

:deep(.van-image__img) {
  object-fit: cover;
  border: 2px solid #ffffff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}
</style> 