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
      <van-empty description="智慧体中心功能即将上线">
        <template #image>
          <van-icon name="smile-o" size="80" color="#1989fa" />
        </template>
        <p class="coming-soon-text">敬请期待！</p>
      </van-empty>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import SearchBar from '../../components/SearchBar.vue';

const router = useRouter();
const searchText = ref('');

// 搜索处理
const onSearch = (text: string) => {
  console.log('搜索:', text);
  // 实际应用中这里可能需要从服务器获取搜索结果
};
</script>

<style scoped>
.intelligence-center {
  padding: 16px;
  padding-bottom: 66px;
}

.search-bar {
  margin-bottom: 16px;
}

.center-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-top: 80px;
}

.coming-soon-text {
  font-size: var(--font-size-md, 16px);
  color: #969799;
  margin-top: 8px;
}
</style> 