<template>
  <div class="user-card">
    <div class="user-card-content">
      <div class="avatar-container">
        <van-image 
          round 
          width="4rem" 
          height="4rem" 
          :src="userInfo.avatar" 
          class="avatar-image"
          @click="goToUserProfile"
        />
      </div>
      <div class="user-info">
        <h3 class="nickname">{{ userInfo.nickname }}</h3>
        <p class="phone">手机号：{{ formatPhone(userInfo.phone) }}</p>
        <div class="level-info">
          <van-tag type="primary">等级 {{ userInfo.level }}</van-tag>
          <span class="id-text" v-if="userInfo.userId"
            >ID: {{ userInfo.userId }}</span
          >
          <span class="exp-text"
            >距离下一级还需 {{ userInfo.nextLevelExp }} 经验</span
          >
        </div>
      </div>
      <div class="settings-container">
        <van-icon
          name="setting-o"
          size="24"
          class="settings-icon"
          @click="goToSettings"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';

interface UserInfo {
  avatar: string;
  nickname: string;
  phone: string;
  level: number;
  nextLevelExp: number;
  userId?: string | number;
}

const props = defineProps<{
  userInfo: UserInfo;
}>();

const emit = defineEmits<{
  (e: 'settings'): void;
}>();

const router = useRouter();

const goToSettings = (): void => {
  emit('settings');
};

const goToUserProfile = (): void => {
  if (props.userInfo.userId) {
    router.push(`/users/${props.userInfo.userId}`);
  }
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
  padding: 0 0 12px;
  border-radius: 0;
}

.user-card-content {
  display: flex;
  align-items: center;
}

.avatar-container {
  flex-shrink: 0;
  margin-right: 12px;
}

.avatar-image {
  cursor: pointer;
  transition: transform 0.2s ease;
}

.avatar-image:active {
  transform: scale(0.95);
}

.user-info {
  flex: 1;
  min-width: 0; /* 确保文字可以正确截断 */
  display: flex;
  flex-direction: column;
}

.nickname {
  margin: 0 0 4px;
  font-size: var(--font-size-lg);
  font-weight: 600;
  color: #323233;
}

.phone {
  margin: 0 0 4px;
  font-size: var(--font-size-sm);
  color: #646566;
}

.level-info {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 2px;
}

.id-text {
  font-size: var(--font-size-sm);
  color: #909399;
  background-color: rgba(240, 240, 245, 0.8);
  padding: 2px 6px;
  border-radius: 10px;
  display: inline-block;
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
  font-size: var(--font-size-sm);
  color: #969799;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.settings-container {
  flex-shrink: 0;
  margin-left: auto;
}

.settings-icon {
  color: #323233;
  padding: 4px;
  border-radius: 50%;
  background-color: #f7f8fa;
}

:deep(.van-image__img) {
  object-fit: cover;
  border: 2px solid #ffffff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}
</style>
