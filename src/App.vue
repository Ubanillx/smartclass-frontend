<template>
  <div class="app">
    <router-view v-slot="{ Component }">
      <transition name="fade" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>
    <van-tabbar v-model="active" v-if="showTabbar" route>
      <van-tabbar-item to="/">
        <template #icon="props">
          <div class="tabbar-icon-container">
            <svg
              class="icon"
              :class="{ 'active-icon': props.active }"
              aria-hidden="true"
            >
              <use xlink:href="#icon-zhuye"></use>
            </svg>
          </div>
        </template>
        <span :class="{ 'active-text': active === 0 }">主页</span>
      </van-tabbar-item>
      <van-tabbar-item to="/chat">
        <template #icon="props">
          <div class="tabbar-icon-container">
            <svg
              class="icon"
              :class="{ 'active-icon': props.active }"
              aria-hidden="true"
            >
              <use xlink:href="#icon-duihua"></use>
            </svg>
          </div>
        </template>
        <span :class="{ 'active-text': active === 1 }">对话</span>
      </van-tabbar-item>
      <van-tabbar-item to="/circle">
        <template #icon="props">
          <div class="tabbar-icon-container">
            <svg
              class="icon"
              :class="{ 'active-icon': props.active }"
              aria-hidden="true"
            >
              <use xlink:href="#icon-quanzi"></use>
            </svg>
          </div>
        </template>
        <span :class="{ 'active-text': active === 2 }">圈子</span>
      </van-tabbar-item>
      <van-tabbar-item to="/courses">
        <template #icon="props">
          <div class="tabbar-icon-container">
            <svg
              class="icon"
              :class="{ 'active-icon': props.active }"
              aria-hidden="true"
            >
              <use xlink:href="#icon-kecheng"></use>
            </svg>
          </div>
        </template>
        <span :class="{ 'active-text': active === 3 }">课程</span>
      </van-tabbar-item>
      <van-tabbar-item to="/profile">
        <template #icon="props">
          <div class="tabbar-icon-container">
            <svg
              class="icon"
              :class="{ 'active-icon': props.active }"
              aria-hidden="true"
            >
              <use xlink:href="#icon-wode"></use>
            </svg>
          </div>
        </template>
        <span :class="{ 'active-text': active === 4 }">我的</span>
      </van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useUserStore } from './stores/userStore';
import { useSettingsStore } from './stores/settingsStore';

const route = useRoute();
const userStore = useUserStore();
const settingsStore = useSettingsStore();
const active = ref(0);

// 计算是否显示底部导航栏
const showTabbar = computed(() => {
  // 一级页面（显示底部导航栏）
  const mainRoutes = ['/', '/chat', '/circle', '/courses', '/profile'];

  // 判断当前路由是否为一级页面
  return mainRoutes.includes(route.path);
});

// 监听路由变化，设置底部导航栏激活项和页面样式
watch(
  () => route.path,
  (newPath) => {
    // 设置底部导航栏激活项
    if (newPath === '/') {
      active.value = 0;
    } else if (newPath === '/chat') {
      active.value = 1;
    } else if (newPath === '/circle') {
      active.value = 2;
    } else if (newPath === '/courses') {
      active.value = 3;
    } else if (newPath === '/profile') {
      active.value = 4;
    }

    // 设置页面样式
    const mainRoutes = ['/', '/chat', '/circle', '/courses', '/profile'];
    const isMainRoute = mainRoutes.includes(newPath);

    // 移除所有相关类
    document.body.classList.remove('has-tabbar', 'no-tabbar');

    // 添加相应的类
    if (isMainRoute) {
      document.body.classList.add('has-tabbar');
    } else {
      document.body.classList.add('no-tabbar');
    }
  },
  { immediate: true },
);

// 在应用启动时获取当前登录用户信息
onMounted(async () => {
  if (userStore.userInfo) {
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
  font-family:
    'Noto Sans SC',
    -apple-system,
    BlinkMacSystemFont,
    'Helvetica Neue',
    Helvetica,
    Segoe UI,
    Arial,
    Roboto,
    'PingFang SC',
    'miui',
    'Hiragino Sans GB',
    'Microsoft Yahei',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* 有底部标签栏的页面 */
.has-tabbar {
  padding-bottom: 60px !important;
}

/* 没有底部标签栏的页面 */
.no-tabbar {
  padding-bottom: 0 !important;
}

.app {
  min-height: 100vh;
  background: linear-gradient(to bottom, rgba(232, 242, 252, 0.8), rgba(255, 255, 255, 0.9));
}

/* 统一的页面容器样式 */
.page-container {
  min-height: 100vh;
  background: linear-gradient(to bottom, rgba(232, 242, 252, 0.8), rgba(255, 255, 255, 0.9));
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
  transition: all 0.3s ease;
}

/* 底部导航栏动画效果 */
.tabbar-icon-container {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 24px;
  width: 24px;
}

.active-icon {
  transform: scale(1.2);
  color: var(--van-tabbar-item-active-color, #1989fa);
}

.active-text {
  transform: scale(1.05);
  color: var(--van-tabbar-item-active-color, #1989fa);
}

.van-icon {
  transition: all 0.3s ease;
  width: 24px;
  height: 24px;
}

/* iconfont图标样式 */
.iconfont {
  font-size: 24px;
  transition: all 0.3s ease;
  color: #646566;
}

.iconfont.active-icon {
  color: var(--van-tabbar-item-active-color, #1989fa);
}

/* svg图标样式 */
.icon {
  width: 24px;
  height: 24px;
  transition: all 0.3s ease;
  color: #646566;
  fill: currentColor;
}

.icon.active-icon {
  transform: scale(1.2);
  color: var(--van-tabbar-item-active-color, #1989fa);
}

/* 页面切换动画 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* 组件标题样式 */
.van-cell__title {
  font-weight: 700 !important;
  font-family: 'Noto Sans SC', sans-serif !important;
}

/* 统一van-cell样式 */
.van-cell {
  position: relative;
  padding: 12px 16px !important;
  border-radius: 8px !important;
  transition: all 0.3s ease;
  margin: 4px 0;
  line-height: 1.5;
  font-size: var(--font-size-md) !important;
  background-color: #fff;
}

.van-cell::after {
  position: absolute;
  box-sizing: border-box;
  content: ' ';
  pointer-events: none;
  right: 16px;
  bottom: 0;
  left: 16px;
  border-bottom: 1px solid rgba(200, 200, 200, 0.3);
  transform: scaleY(0.5);
}

.van-cell:hover {
  background-color: #f7f8fa;
}

.van-cell:active {
  background-color: #f2f3f5;
}

.van-cell--clickable:active {
  background-color: #f2f3f5;
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
h2,
h3,
h4 {
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
.van-cell-group__title,
.course-title,
.article-title {
  font-weight: 700 !important;
  font-family: 'Noto Sans SC', sans-serif !important;
}

/* 确保课程和文章组件的字体大小正确 */
.course-title {
  font-size: var(--font-size-md) !important;
}

.course-brief,
.article-brief {
  font-size: var(--font-size-sm) !important;
}

.course-meta,
.article-meta {
  font-size: var(--font-size-sm) !important;
}

/* 文章和课程标签样式 */
.article-tag,
.course-tag,
.detail-tag {
  font-weight: 500 !important;
  letter-spacing: 0.5px;
}

/* 统一所有图标与文字的垂直对齐 */
.van-cell__title {
  display: flex !important;
  align-items: center !important;
  height: 24px !important;
}

.svg-icon {
  display: inline-flex !important;
  align-items: center !important;
  justify-content: center !important;
  vertical-align: middle !important;
}

/* 统一所有图标样式 */
.course-icon,
.ai-icon,
.notice-icon,
.word-icon,
.article-icon {
  font-size: 24px !important;
  margin-right: 4px !important;
  vertical-align: middle !important;
  display: flex !important;
  align-items: center !important;
  height: 24px !important;
  width: 24px !important;
}
</style>
