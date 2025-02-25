<template>
  <div class="app">
    <router-view />
    <van-tabbar v-model="active" v-if="showTabbar">
      <van-tabbar-item icon="home-o" to="/">主页</van-tabbar-item>
      <van-tabbar-item icon="chat-o" to="/listening">对话</van-tabbar-item>
      <van-tabbar-item icon="orders-o" to="/courses">课程</van-tabbar-item>
      <van-tabbar-item icon="user-o" to="/profile">我的</van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

import { useRoute } from 'vue-router';

const route = useRoute();
const active = ref(0);

// 计算是否显示底部导航栏
const showTabbar = computed(() => {
  const noTabbarRoutes = ['/login', '/register', '/forgot-password'];
  return !noTabbarRoutes.includes(route.path);
});
</script>

<style>
/* 全局样式 */
body {
  margin: 0;
  padding: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Helvetica Neue', Helvetica,
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

/* 统一的标题样式 */
.section-title {
  font-size: 16px;
  font-weight: 600;
  color: #323233;
  margin: 16px 0 12px;
}

/* 统一的次要文本样式 */
.text-secondary {
  font-size: 14px;
  color: #969799;
}
</style>
