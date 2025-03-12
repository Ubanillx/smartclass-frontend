<template>
  <div class="app">
    <router-view />
    <van-tabbar v-model="active" v-if="showTabbar">
      <van-tabbar-item icon="home-o" to="/">主页</van-tabbar-item>
      <van-tabbar-item icon="chat-o" to="/chat-history">对话</van-tabbar-item>
      <van-tabbar-item icon="orders-o" to="/courses">课程</van-tabbar-item>
      <van-tabbar-item icon="user-o" to="/profile">我的</van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useUserStore } from './stores/userStore';
import { useSettingsStore } from './stores/settingsStore';

const route = useRoute();
const userStore = useUserStore();
const settingsStore = useSettingsStore();
const active = ref(0);

// 计算是否显示底部导航栏
const showTabbar = computed(() => {
  const noTabbarRoutes = ['/login', '/register', '/forgot-password'];
  return !noTabbarRoutes.includes(route.path);
});

// 在应用启动时获取当前登录用户信息
onMounted(async () => {
  if (userStore.isLoggedIn) {
    try {
      await userStore.fetchCurrentUser();
    } catch (error) {
      console.error('Failed to fetch user info:', error);
    }
  }
});
</script>

<style>
/* 全局样式 */
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@400;500;700&display=swap');

body {
  margin: 0;
  padding: 0;
  font-family: 'Noto Sans SC', -apple-system, BlinkMacSystemFont, 'Helvetica Neue', Helvetica,
    Segoe UI, Arial, Roboto, 'PingFang SC', 'miui', 'Hiragino Sans GB', 'Microsoft Yahei',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* 有底部标签栏的页面 */
.has-tabbar {
  padding-bottom: 60px !important;
}

.app {
  min-height: 100vh;
  background: #f7f8fa;
}

/* 统一的页面容器样式 */
.page-container {
  min-height: 100vh;
  background: #f7f8fa;
  padding-bottom: 60px;
}

/* 统一的内容区域样式 */
.content-area {
  padding: 16px;
}

/* 统一的卡片样式 */
.card {
  background: #fff;
  border-radius: 8px;
  margin-bottom: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

/* 底部导航栏样式 */
.van-tabbar-item__text {
  font-weight: 700 !important;
  font-family: 'Noto Sans SC', sans-serif !important;
  font-size: 14px;
}

/* 组件标题样式 */
.van-cell__title {
  font-weight: 700 !important;
  font-family: 'Noto Sans SC', sans-serif !important;
}

/* 卡片标题样式 */
.van-cell-group__title {
  font-weight: 700 !important;
  font-family: 'Noto Sans SC', sans-serif !important;
}

/* 标签页标题样式 */
.van-tab {
  font-weight: 700 !important;
  font-family: 'Noto Sans SC', sans-serif !important;
}

/* 按钮文字样式 */
.van-button__text {
  font-weight: 700 !important;
  font-family: 'Noto Sans SC', sans-serif !important;
}

/* 更多链接样式 */
.more-link {
  font-weight: 700 !important;
  font-family: 'Noto Sans SC', sans-serif !important;
}

/* 卡片内标题样式 */
h2, h3, h4 {
  font-weight: 700 !important;
  font-family: 'Noto Sans SC', sans-serif !important;
}

/* 公告标题样式 */
.van-cell__title span {
  font-weight: 700 !important;
  font-family: 'Noto Sans SC', sans-serif !important;
}

/* 全局字体大小控制 */
.font-small {
  --font-size-base: 12px;
  --font-size-sm: 10px;
  --font-size-md: 12px;
  --font-size-lg: 14px;
  --font-size-xl: 16px;
}

.font-medium {
  --font-size-base: 14px;
  --font-size-sm: 12px;
  --font-size-md: 14px;
  --font-size-lg: 16px;
  --font-size-xl: 18px;
}

.font-large {
  --font-size-base: 16px;
  --font-size-sm: 14px;
  --font-size-md: 16px;
  --font-size-lg: 18px;
  --font-size-xl: 20px;
}

/* 应用字体大小变量 */
body {
  font-size: var(--font-size-base);
}

.van-cell__title {
  font-size: var(--font-size-md) !important;
}

.van-cell__value {
  font-size: var(--font-size-md) !important;
}

.van-field__label {
  font-size: var(--font-size-md) !important;
}

.van-field__control {
  font-size: var(--font-size-md) !important;
}

.van-button {
  font-size: var(--font-size-md) !important;
}

.van-tab {
  font-size: var(--font-size-md) !important;
}

.van-tabbar-item__text {
  font-size: var(--font-size-sm) !important;
}

h2 {
  font-size: var(--font-size-xl) !important;
}

h3 {
  font-size: var(--font-size-lg) !important;
}

h4 {
  font-size: var(--font-size-md) !important;
}

p {
  font-size: var(--font-size-base) !important;
}
</style>

<!-- 全局样式，确保所有组件标题都能正确加粗 -->
<style>
.van-cell__title,
.van-cell__title span,
.van-tab__text,
.van-tabbar-item__text,
.van-nav-bar__title,
.van-button__text,
.more-link,
.van-cell-group__title {
  font-weight: 700 !important;
  font-family: 'Noto Sans SC', sans-serif !important;
}
</style>
