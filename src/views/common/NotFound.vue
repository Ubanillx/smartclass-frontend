<template>
  <div class="not-found-page">
    <back-button title="返回首页" customPath="/" />
    
    <div class="content">
      <div class="error-code">404</div>
      <div class="error-message">页面未找到</div>
      <van-image
        :src="errorImageUrl"
        width="200"
        height="200"
        fit="contain"
        class="error-image"
      />
      <div class="error-description">
        您访问的页面不存在或已被移除
      </div>
      <van-button
        type="primary"
        size="normal"
        class="home-button"
        @click="goToHome"
      >
        返回首页
      </van-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import BackButton from '../../components/Common/BackButton.vue';

const router = useRouter();

// 可以根据实际项目提供的错误图片更改
const errorImageUrl = computed(() => {
  return 'https://img01.yzcdn.cn/vant/empty-image-default.png';
});

const goToHome = () => {
  router.push('/');
};
</script>

<style scoped>
.not-found-page {
  min-height: 100vh;
  background-color: var(--background-primary, #f7f8fa);
  padding-bottom: 40px;
  display: flex;
  flex-direction: column;
}

.content {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 24px;
  margin-top: 40px;
}

.error-code {
  font-size: 72px;
  font-weight: 700;
  color: var(--primary-color, #1989fa);
  margin-bottom: 16px;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
}

.error-message {
  font-size: 24px;
  font-weight: 600;
  color: var(--text-color-primary, #323233);
  margin-bottom: 24px;
}

.error-image {
  margin-bottom: 24px;
}

.error-description {
  font-size: var(--font-size-md, 14px);
  color: var(--text-color-secondary, #969799);
  text-align: center;
  margin-bottom: 32px;
  line-height: 1.6;
}

.home-button {
  width: 160px;
  border-radius: 20px;
  font-weight: 500;
  box-shadow: 0 2px 8px rgba(25, 137, 250, 0.2);
}
</style> 