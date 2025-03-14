<template>
  <div class="chat-container has-tabbar">
    <!-- 搜索栏 -->
    <search-bar
      v-model="searchText"
      placeholder="搜索对话记录"
      @search="onSearch"
    />

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

    <!-- 内容区域 -->
    <div class="tab-content">
      <!-- 历史对话内容 -->
      <div v-show="activeTab === 'history'" class="tab-pane">
        <chat-history-content 
          :search-text="searchText"
          @select="handleChatSelect"
        />
      </div>
      
      <!-- 智慧体中心内容 -->
      <div v-show="activeTab === 'intelligence'" class="tab-pane">
        <intelligence-center-content />
      </div>
    </div>

    <!-- 新建对话按钮 -->
    <van-button 
      class="new-chat-btn" 
      type="primary" 
      round 
      icon="plus"
      @click="router.push('/assistants')"
    >
      新建对话
    </van-button>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import SearchBar from '../../components/SearchBar.vue';
import ChatHistoryContent from './components/ChatHistoryContent.vue';
import IntelligenceCenterContent from './components/IntelligenceCenterContent.vue';

const router = useRouter();
const route = useRoute();
const searchText = ref('');
const activeTab = ref('history'); // 默认显示历史对话

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
      query: { ...route.query, tab: 'history' } 
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
    query 
  });
};

// 处理对话选择
const handleChatSelect = (chatId: number, assistantId: number) => {
  router.push(`/chat-detail?assistantId=${assistantId}`);
};

// 搜索处理
const onSearch = (text: string) => {
  console.log('搜索:', text);
  // 实际应用中这里可能需要从服务器获取搜索结果
};
</script>

<style scoped>
.chat-container {
  padding: 16px;
  padding-bottom: 66px;
}

.search-bar {
  margin-bottom: 16px;
}

.nav-tabs {
  display: flex;
  margin-bottom: 16px;
  border-bottom: 1px solid #ebedf0;
}

.nav-tab {
  flex: 1;
  text-align: center;
  padding: 12px 0;
  font-size: var(--font-size-md, 16px);
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

.tab-content {
  position: relative;
}

.tab-pane {
  width: 100%;
}

.new-chat-btn {
  position: fixed;
  bottom: 80px;
  right: 20px;
  width: auto;
  padding: 0 20px;
  height: 40px;
  z-index: 10;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

:deep(.van-button__text) {
  font-weight: 700 !important;
  font-family: 'Noto Sans SC', sans-serif !important;
  font-size: var(--font-size-md, 14px) !important;
}
</style> 