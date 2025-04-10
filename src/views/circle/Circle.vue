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
      <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
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
      </van-pull-refresh>
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
const refreshing = ref(false);

// 切换标签页
const switchTab = (tab: string) => {
  activeTab.value = tab;
};

// 搜索功能
const handleSearch = () => {
  showToast('搜索功能开发中');
};

// 刷新功能
const onRefresh = () => {
  setTimeout(() => {
    showToast('刷新成功');
    refreshing.value = false;
  }, 1000);
};

// 发布功能
const handlePublish = () => {
  showToast('发布功能开发中');
};
</script>

<style scoped>
.circle {
  min-height: 100vh;
  background-color: #f7f8fa;
}

.fixed-header {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 1;
  background-color: #ffffff;
  box-shadow: 0 1px 6px rgba(0, 0, 0, 0.05);
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
}

.page-title {
  display: flex;
  align-items: center;
  font-size: 18px;
  font-weight: bold;
}

.title-icon {
  margin-right: 8px;
  font-size: 22px;
}

.header-actions {
  display: flex;
  gap: 16px;
}

.action-icon {
  font-size: 22px;
  cursor: pointer;
}

.nav-tabs {
  display: flex;
  border-bottom: 1px solid #f2f2f2;
}

.nav-tab {
  flex: 1;
  text-align: center;
  padding: 12px 0;
  font-size: 16px;
  font-weight: 700;
  color: #646566;
  position: relative;
  cursor: pointer;
}

.nav-tab.active {
  color: #1989fa;
}

.nav-tab.active::after {
  content: '';
  position: absolute;
  bottom: -1px;
  left: 50%;
  transform: translateX(-50%);
  width: 40px;
  height: 3px;
  background-color: #1989fa;
  border-radius: 3px;
}

.scrollable-content {
  padding-top: 104px;
  padding-bottom: 16px;
  min-height: calc(100vh - 104px);
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
  bottom: 80px;
  right: 20px;
  width: auto;
  padding: 0 20px;
  height: 40px;
  z-index: 10;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}
</style> 