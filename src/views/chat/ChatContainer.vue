<template>
  <div class="chat-container has-tabbar">
    <!-- 固定头部区域 -->
    <div class="fixed-header">
      <!-- 页面标题区域 -->
      <div class="header">
        <div class="page-title">
          <van-icon name="chat-o" class="title-icon" />
          <span>对话</span>
        </div>
        <div class="header-actions">
          <van-icon name="search" class="action-icon" @click="handleSearch" />
        </div>
      </div>

      <!-- 导航栏 -->
      <div class="nav-tabs">
        <div
          :class="['nav-tab', { active: activeTab === 'history' }]"
          @click="switchTab('history')"
        >
          历史对话
        </div>
        <div
          :class="['nav-tab', { active: activeTab === 'intelligence' }]"
          @click="switchTab('intelligence')"
        >
          智慧体中心
        </div>
      </div>
    </div>

    <!-- 可滚动内容区域 -->
    <div class="scrollable-content">
      <!-- 内容区域 -->
      <div class="tab-content">
        <!-- 历史对话内容 -->
        <div v-show="activeTab === 'history'" class="tab-pane">
          <chat-history-content @select="handleChatSelect" />
        </div>

        <!-- 智慧体中心内容 -->
        <div v-show="activeTab === 'intelligence'" class="tab-pane">
          <intelligence-center-content @select="handleAssistantSelect" />
        </div>
      </div>
    </div>

    <!-- 新建对话按钮 -->
    <van-button
      v-show="activeTab === 'history'"
      class="new-chat-btn"
      type="primary"
      round
      icon="plus"
      @click="switchTab('intelligence')"
    >
      新建对话
    </van-button>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { showToast } from 'vant';
import ChatHistoryContent from './components/ChatHistoryContent.vue';
import IntelligenceCenterContent from './components/IntelligenceCenterContent.vue';

const router = useRouter();
const route = useRoute();
const activeTab = ref('history'); // 默认显示历史对话

// 搜索功能
const handleSearch = () => {
  router.push('/search');
};

// 更多功能
const handleMore = () => {
  showToast('更多功能开发中');
};

// 检查URL参数，决定默认显示哪个标签页
onMounted(() => {
  const tab = route.query.tab as string;
  if (tab === 'intelligence' || tab === 'history') {
    activeTab.value = tab;
  } else {
    // 如果URL没有有效的tab参数，设置为默认标签并更新URL
    activeTab.value = 'history';
    router.replace({
      path: route.path,
      query: { ...route.query, tab: 'history' },
    });
  }
});

// 切换标签页
const switchTab = (tab: string) => {
  activeTab.value = tab;

  // 更新URL参数，但不触发页面刷新
  const query = { ...route.query };
  query.tab = tab; // 设置tab参数为当前标签页

  router.replace({
    path: route.path,
    query,
  });
};

// 处理对话选择
const handleChatSelect = (messageId: string, assistantId: number) => {
  router.push(`/chat-detail/${assistantId}?sessionId=${messageId}`);
};

// 处理智能助手选择
const handleAssistantSelect = (assistantId: number) => {
  router.push(`/chat-detail/${assistantId}`);
};
</script>

<style scoped>
.chat-container {
  display: flex;
  flex-direction: column;
  padding-bottom: 130px; /* 减小底部间距，避免过多空白 */
  background-color: #f2f7fd;
  min-height: 100vh;
  position: relative;
  overflow-x: hidden; /* 防止水平滚动条出现 */
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

.scrollable-content {
  flex: 1;
  overflow-y: auto;
  padding: 0 16px;
  margin-top: 150px; /* 顶部边距，确保内容不会与导航栏重叠 */
  padding-bottom: 100px; /* 增加底部内边距，确保分页组件有足够空间 */
  position: relative;
  will-change: transform; /* 优化滚动性能 */
  overflow-x: hidden; /* 防止水平滚动条 */
  height: calc(100vh - 150px); /* 设置固定高度 */
  box-sizing: border-box;
}

.tab-content {
  min-height: 300px; /* 调整为更合理的高度 */
  position: relative;
  display: flex; 
  flex-direction: column;
}

.tab-pane {
  width: 100%;
  position: relative;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
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
  font-size: var(--font-size-xl);
  font-weight: 700;
  color: #323233;
  font-family: 'Noto Sans SC', sans-serif;
}

.title-icon {
  margin-right: 6px;
  color: #1989fa;
  font-size: var(--font-size-xl);
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
  padding: 12px 0;
  font-size: var(--font-size-md);
  font-weight: 500;
  color: #969799;
  position: relative;
  cursor: pointer;
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

.new-chat-btn {
  position: fixed;
  right: 16px;
  bottom: 130px; /* 将按钮显示在分页组件上方 */
  z-index: 99;
}
</style>
