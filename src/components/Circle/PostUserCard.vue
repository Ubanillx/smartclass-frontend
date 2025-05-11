<template>
  <div class="user-card-detail">
    <div class="user-profile">
      <div class="user-info" @click="navigateToUserProfile">
        <van-image
          round
          width="50"
          height="50"
          :src="avatar || 'https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg'"
          class="avatar"
        />
        <div class="user-details">
          <div class="username">
            {{ username || '匿名用户' }}
            <span v-if="isVip" class="vip-tag">VIP</span>
          </div>
          <div class="post-time">{{ time || '未知时间' }} · {{ location || '未知位置' }}</div>
        </div>
      </div>
      <van-button
        class="follow-btn"
        size="small"
        :type="isFollowing ? 'default' : 'primary'"
        :text="isFollowing ? '已关注' : '关注'"
        @click="handleFollow"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';
import { useRouter } from 'vue-router';

interface UserCardProps {
  avatar?: string;
  username?: string;
  isVip?: boolean;
  time?: string;
  location?: string;
  isFollowing?: boolean;
  userId?: number | string;
}

const props = withDefaults(defineProps<UserCardProps>(), {
  avatar: 'https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg',
  username: '匿名用户',
  isVip: false,
  time: '未知时间',
  location: '未知位置',
  isFollowing: false,
  userId: '',
});

const router = useRouter();
const emit = defineEmits<{
  (e: 'follow'): void;
}>();

const handleFollow = () => {
  emit('follow');
};

const navigateToUserProfile = () => {
  if (props.userId) {
    router.push(`/users/${props.userId}`);
  }
};
</script>

<style scoped>
.user-card-detail {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
  margin: 16px 16px 0 16px;
  padding: 0;
  overflow: hidden;
}

.user-profile {
  padding: 20px 20px 20px 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.user-info {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.avatar {
  margin-right: 14px;
}

.user-details {
  display: flex;
  flex-direction: column;
}

.username {
  font-size: var(--font-size-md);
  font-weight: 700;
  color: #323233;
  display: flex;
  align-items: center;
}

.vip-tag {
  display: inline-block;
  margin-left: 6px;
  padding: 0 4px;
  font-size: 12px;
  line-height: 16px;
  color: #ee0a24;
  background-color: #ffe1e1;
  border-radius: 2px;
  transform: scale(0.8);
  transform-origin: left center;
}

.post-time {
  font-size: var(--font-size-sm);
  color: #b0b0b0;
  margin-top: 4px;
}

.follow-btn {
  border-radius: 16px;
  padding: 0 18px;
  height: 32px;
  line-height: 30px;
  font-size: 14px;
}
</style> 