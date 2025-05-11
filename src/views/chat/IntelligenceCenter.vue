<template>
  <div class="intelligence-center has-tabbar">
    <!-- 搜索栏 -->
    <search-bar
      v-model="searchText"
      placeholder="搜索智慧体"
      @search="onSearch"
    />

    <!-- 智慧体中心内容 -->
    <div class="center-content">
      <intelligence-center-content @select="handleAssistantSelect" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import SearchBar from '../../components/Common/SearchBar.vue';
import { IntelligenceCenterContent } from '../../components/Chat';

const router = useRouter();
const searchText = ref('');

// 搜索处理
const onSearch = (text: string) => {
  console.log('搜索:', text);
  // 实际应用中这里可能需要从服务器获取搜索结果
};

// 处理助手选择
const handleAssistantSelect = (assistantId: number) => {
  console.log('选择的智慧体ID:', assistantId);
  // 跳转到聊天详情页面
  router.push(`/chat/detail/${assistantId}`);
};
</script>

<style scoped>
.intelligence-center {
  padding: 16px;
  padding-bottom: 66px;
  background-color: #f2f7fd;
  min-height: 100vh;
}

.search-bar {
  margin-bottom: 16px;
}

.center-content {
  display: flex;
  flex-direction: column;
  width: 100%;
  position: relative;
  max-width: 800px;
  margin: 0 auto;
  padding: 0 4px;
  box-sizing: border-box;
}
</style>
