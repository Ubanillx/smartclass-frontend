<template>
  <div class="circle has-tabbar">
    <!-- 固定头部区域 -->
    <div class="fixed-header">
      <!-- 页面标题区域 -->
      <div class="header">
        <div class="page-title">
          <van-icon name="friends-o" class="title-icon" />
          <span>圈子</span>
        </div>
        <div class="header-actions">
          <van-icon name="search" class="action-icon" @click="handleSearch" />
        </div>
      </div>

      <!-- 导航栏 -->
      <div class="nav-tabs">
        <div
          :class="['nav-tab', { active: activeTab === 'recommend' }]"
          @click="switchTab('recommend')"
        >
          推荐
        </div>
        <div
          :class="['nav-tab', { active: activeTab === 'following' }]"
          @click="switchTab('following')"
        >
          关注
        </div>
      </div>
    </div>

    <!-- 可滚动内容区域 -->
    <div class="scrollable-content">
      <!-- 内容区域 -->
      <div class="tab-content">
        <!-- 推荐内容 -->
        <div v-show="activeTab === 'recommend'" class="tab-pane">
          <div class="empty-state">
            <van-empty description="暂无内容" />
          </div>
        </div>

        <!-- 关注内容 -->
        <div v-show="activeTab === 'following'" class="tab-pane">
          <div class="empty-state">
            <van-empty description="暂无内容" />
          </div>
        </div>
      </div>
    </div>

    <!-- 发布按钮 -->
    <van-button
      class="publish-btn"
      type="primary"
      round
      icon="plus"
      @click="handlePublish"
    >
      发布
    </van-button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { showToast } from 'vant';

const router = useRouter();
const activeTab = ref('recommend'); // 默认显示推荐

// 切换标签页
const switchTab = (tab: string) => {
  activeTab.value = tab;
};

// 搜索功能
const handleSearch = () => {
  showToast('搜索功能开发中');
};

// 发布功能
const handlePublish = () => {
  showToast('发布功能开发中');
};
</script>

<style scoped>
.circle {
  display: flex;
  flex-direction: column;
  padding-bottom: 66px;
  background-color: #f2f7fd;
  min-height: 100vh;
  position: relative;
}

.fixed-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  background-color: #f2f7fd;
  padding: 16px 16px 0;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 12px;
  padding: 12px 12px;
}

.page-title {
  display: flex;
  align-items: center;
  font-size: 20px;
  font-weight: 700;
  color: #323233;
  font-family: 'Noto Sans SC', sans-serif;
}

.title-icon {
  margin-right: 6px;
  color: #1989fa;
  font-size: 22px;
}

.header-actions {
  display: flex;
  align-items: center;
}

.action-icon {
  font-size: 24px;
  color: #323233;
  margin-left: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s;
  opacity: 0.85;
}

.action-icon:active {
  opacity: 0.6;
  transform: scale(0.95);
}

.nav-tabs {
  display: flex;
  margin-top: 0;
  margin-bottom: 16px;
  border-bottom: 1px solid #ebedf0;
  background-color: transparent;
  border-radius: 0;
  box-shadow: none;
  overflow: hidden;
}

.nav-tab {
  flex: 1;
  text-align: center;
  padding: 14px 0;
  font-size: var(--font-size-md, 16px);
  font-weight: 700;
  color: #646566;
  position: relative;
  cursor: pointer;
  transition: all 0.3s ease;
}

.nav-tab.active {
  color: #1989fa;
  background-color: transparent;
}

.nav-tab.active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 40%;
  height: 3px;
  background-color: #1989fa;
  border-radius: 3px 3px 0 0;
}

.scrollable-content {
  flex: 1;
  overflow-y: auto;
  padding: 0 16px;
  margin-top: 120px; /* 添加顶部边距，为固定导航腾出空间 */
}

.tab-content {
  padding: 16px;
}

.tab-pane {
  min-height: 400px;
}

.empty-state {
  margin-top: 80px;
}

.publish-btn {
  position: fixed;
  right: 16px;
  bottom: 70px;
  z-index: 999;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}
</style>
