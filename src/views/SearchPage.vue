<template>
  <div class="search-page">
    <div class="header-container">
      <van-icon 
        name="arrow-left"
        class="back-btn"
        @click.stop="handleBack"  
        aria-label="返回按钮"
      />
      
      <van-search 
        v-model="searchValue"
        :placeholder="placeholder"
        shape="round"
        background="transparent"
        :clearable="true"
        input-align="center"
        @search="handleSearch"
        @clear="handleClear"
        class="search-input"
      >
        <template #left-icon>
          <van-icon 
            name="search" 
            size="18" 
            class="search-icon"
          />
        </template>
      </van-search>
    </div>

    <!-- 推荐搜索标签 -->
    <div class="content-container">
      <div v-if="showRecommendations">
        <!-- 热门搜索标签，无论有无输入都显示 -->
        <div class="hot-search">
          <h3 class="section-title">热门搜索</h3>
          <div class="recommendations">
            <span 
              v-for="(tag, index) in randomHotWords" 
              :key="index"
              class="recommend-tag"
              @click="handleTagClick(tag)"
              role="button"
              :aria-label="`搜索${tag}`"
            >
              {{ tag }}
            </span>
          </div>
        </div>
        
        <!-- 搜索建议，输入文字时显示 -->
        <div v-if="filteredRecommendations.length && searchValue" class="search-suggestions">
          <h3 class="section-title">搜索建议</h3>
          <div class="recommendations">
            <span 
              v-for="(tag, index) in filteredRecommendations" 
              :key="index"
              class="recommend-tag"
              @click="handleTagClick(tag)"
              role="button"
              :aria-label="`搜索${tag}`"
            >
              {{ tag }}
            </span>
          </div>
        </div>
        
        <!-- 历史记录显示 -->
        <div v-if="searchStore.searchHistory.length && !searchValue" class="history-records">
          <h3 class="section-title">搜索历史</h3>
          <div 
            v-for="(record, index) in processedHistory"
            :key="index"
            class="record-item"
            @click="reSearch(record)"
            role="button"
            :aria-label="`重新搜索${record}`"
          >
            <van-icon name="clock" class="history-icon" />
            <span class="text">{{ record }}</span>
            <van-icon 
              name="cross" 
              class="delete-icon"
              @click.stop="deleteRecord(index)" 
            />
          </div>
        </div>
      </div>

      <!-- 搜索结果列表 -->
      <div ref="container" class="search-results">
        <ul ref="list">
          <li 
            v-for="(item, index) in searchList" 
            :key="index" 
            @click.stop="handleSearchList(item)"
            class="result-item"
          >
            {{ item }}
          </li>
          <li v-if="loading" class="loading-item">加载中...</li>
          <!-- 没有搜索到结果时显示 -->
          <li v-show="searchResult" class="no-results">
            暂无搜索结果
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { mockRecommendations, mockSearchResults } from '../api/mock'; // 导入 mock 数据
import { useSearchStore } from '../stores/searchStore'; // 导入搜索历史存储

const router = useRouter();
const searchStore = useSearchStore(); // 使用搜索历史存储
const emit = defineEmits<{
  (event: 'update:modelValue', value: string): void;
}>();

// 接口数据及状态管理
const searchValue = ref<string>(''); // 绑定搜索框的值
const searchList = ref<string[]>([]); // 存储搜索结果
const loading = ref(false); // 是否正在加载数据
const searchResult = ref(false); // 是否显示"暂无搜索结果"
const placeholder = '请输入搜索内容';
const iconColor = '#1989fa';
const showRecommendations = true;

// 随机选择8个热门搜索词
const randomHotWords = ref<string[]>([]);

// 在组件挂载时生成随机热词
onMounted(() => {
  generateRandomHotWords();
});

// 生成随机热词方法
const generateRandomHotWords = () => {
  // 复制原数组，避免修改原数据
  const shuffled = [...mockRecommendations];
  
  // 使用Fisher-Yates洗牌算法
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = shuffled[i] as string;
    shuffled[i] = shuffled[j] as string;
    shuffled[j] = temp;
  }
  
  // 取前8个
  randomHotWords.value = shuffled.slice(0, 8);
};

// 使用从 mock.ts 文件中导入的 mock 数据
const filteredRecommendations = computed(() => {
  return mockRecommendations.filter(item => 
    item.toLowerCase().includes(searchValue.value.toLowerCase())
  );
});

// 处理历史记录的展示，反转数组以便最新的记录显示在前面
const processedHistory = computed(() => {
  return searchStore.searchHistory.slice(0, 7);
});

// 搜索功能处理
const handleSearch = (): void => {
  const query = searchValue.value.trim();
  if (!query) return;

  // 清空先前的搜索结果
  searchList.value = [];
  searchResult.value = false;

  // 添加到搜索历史
  searchStore.addSearchHistory(query);

  // 发起搜索请求
  loading.value = true;
  setTimeout(() => {
    searchList.value = mockSearchResults(query); // 使用 mockSearchResults 函数来模拟搜索结果
    searchResult.value = searchList.value.length === 0;
    loading.value = false;
  }, 1000);
};

// 清空搜索框内容
const handleClear = () => {
  searchValue.value = '';
  searchList.value = [];  // 清空搜索结果
  searchResult.value = false; // 清除"暂无搜索结果"
};

// 重新搜索历史记录
const reSearch = (text: string) => {
  searchValue.value = text;
  handleSearch();
};

// 删除某条历史记录
const deleteRecord = (index: number) => {
  searchStore.deleteSearchRecord(index);
};

// 推荐标签点击事件
const handleTagClick = (tag: string) => {
  searchValue.value = tag;
  handleSearch();
};

// 处理返回按钮
const handleBack = () => {
  try {
    window.history.state?.back ? router.go(-1) : router.replace('/');
  } catch (e) {
    console.error(' 路由异常:', e);
    router.push('/error');
  }
};

// 搜索框输入绑定
watch(searchValue, (newVal) => {
  emit('update:modelValue', newVal);
  
  searchResult.value = false;
});

// 处理搜索结果点击
const handleSearchList = (item: string) => {
  searchValue.value = item;
  handleSearch();
};
</script>

<style scoped>
.search-page {
  background-color: #F2F7FD;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.header-container {
  display: flex;
  align-items: center;
  padding: 16px 16px 12px;
  position: sticky;
  top: 0;
  z-index: 100;
  background-color: #F2F7FD;
}

.back-btn {
  font-size: 20px;
  padding: 6px;
  border-radius: 50%;
  background-color: rgba(0, 0, 0, 0.03);
  margin-right: 8px;
  color: #323233;
  transition: all 0.2s ease;
}

.back-btn:active {
  background-color: rgba(0, 0, 0, 0.08);
  transform: scale(0.95);
}

.search-input {
  flex: 1;
}

:deep(.van-search) {
  padding: 0;
  background: transparent;
}

:deep(.van-search__content) {
  background: rgba(255, 255, 255, 0.8);
  border-radius: 20px;
  padding: 0 6px;
  height: 40px;
  box-shadow: none;
  transition: all 0.3s ease;
  border: none;
  display: flex;
  align-items: center;
}

:deep(.van-search__content:hover) {
  box-shadow: none;
  transform: translateY(-1px);
  background: rgba(255, 255, 255, 0.9);
}

:deep(.van-cell) {
  background-color: transparent !important;
  padding: 8px 8px !important;
  line-height: 24px;
}

:deep(.van-field) {
  padding: 0;
  height: 100%;
  display: flex;
  align-items: center;
}

:deep(.van-field__body) {
  display: flex;
  align-items: center;
  height: 100%;
}

:deep(.van-field__left-icon) {
  margin-right: 6px;
  display: flex;
  align-items: center;
  height: 100%;
}

:deep(.van-field__right-icon) {
  margin-right: 6px;
  display: flex;
  align-items: center;
  height: 100%;
}

:deep(.van-field__control) {
  color: #323233;
  font-size: 14px;
  font-family: 'Noto Sans SC', sans-serif;
}

:deep(.van-field__control::placeholder) {
  color: #969799;
  font-size: 14px;
  text-align: center;
}

:deep(.van-search--focus .van-search__content) {
  background: rgba(255, 255, 255, 0.95);
  box-shadow: none;
  border: none;
}

:deep(.search-icon) {
  color: #1989fa;
  font-weight: bold;
  transition: all 0.3s ease;
}

:deep(.van-search__content:hover .search-icon) {
  transform: scale(1.1);
}

.content-container {
  flex: 1;
  padding: 0 16px 16px;
}

/* 历史记录样式 */
.history-records {
  margin-top: 16px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
  overflow: hidden;
}

.record-item {
  display: flex;
  align-items: center;
  padding: 14px 16px;
  border-bottom: 1px solid #f5f5f5;
  transition: all 0.2s;
}

.record-item:last-child {
  border-bottom: none;
}

.record-item:active {
  background: #f8f9fa;
}

.history-icon {
  color: #969799;
  margin-right: 10px;
}

.text {
  flex: 1;
  color: #323233;
  font-size: 14px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.delete-icon {
  color: #c8c9cc;
  padding: 4px;
}

.delete-icon:active {
  color: #1989fa;
}

/* 推荐标签样式 */
.recommendations {
  margin-top: 8px;
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.recommend-tag {
  padding: 8px 16px;
  background: #fff;
  border-radius: 18px;
  font-size: 14px;
  color: #323233;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  margin-bottom: 8px;
  font-weight: 500;
  position: relative;
  overflow: hidden;
  border: 1px solid rgba(25, 137, 250, 0.1);
}

.recommend-tag:active {
  background: #1989fa;
  color: white;
  transform: scale(0.96);
}

.recommend-tag:before {
  content: "";
  position: absolute;
  top: -2px;
  left: -2px;
  width: 0;
  height: 0;
  background-color: rgba(25, 137, 250, 0.1);
  border-radius: 50%;
  transform: translate(-50%, -50%);
  transition: width 0.5s, height 0.5s;
}

.recommend-tag:hover:before {
  width: 200%;
  height: 200%;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  color: #323233;
  margin: 16px 0 10px;
  position: relative;
  padding-left: 12px;
}

.section-title:before {
  content: "";
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 4px;
  height: 16px;
  background-color: #1989fa;
  border-radius: 2px;
}

.hot-search {
  margin-top: 16px;
}

.search-suggestions {
  margin-top: 8px;
}

/* 搜索结果列表 */
.search-results {
  margin-top: 16px;
}

.search-results ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.result-item {
  background: #fff;
  padding: 14px 16px;
  border-radius: 12px;
  margin-bottom: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.loading-item {
  text-align: center;
  padding: 16px;
  color: #969799;
}

.no-results {
  text-align: center;
  padding: 24px 0;
  color: #969799;
  font-size: 15px;
}
</style>
  
  
  
  
  