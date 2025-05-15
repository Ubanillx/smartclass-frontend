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
          <van-icon name="search" size="18" class="search-icon" />
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
        <div
          v-if="filteredRecommendations.length && searchValue"
          class="search-suggestions"
        >
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
        <div
          v-if="searchStore.searchHistory.length && !searchValue"
          class="history-records"
        >
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

      <!-- 分类选择器 -->
      <div v-if="searchExecuted && !loading" class="category-selector">
        <van-tabs v-model:active="activeTab" swipeable animated>
          <van-tab title="全部"></van-tab>
          <van-tab title="帖子"></van-tab>
          <van-tab title="文章"></van-tab>
          <van-tab title="单词"></van-tab>
        </van-tabs>
      </div>

      <!-- 搜索结果列表 -->
      <div ref="container" class="search-results">
        <!-- 搜索中显示加载提示 -->
        <div v-if="loading" class="loading-container">
          <van-loading type="spinner" color="#1989fa" />
          <p class="loading-text">搜索中...</p>
        </div>

        <!-- 无搜索结果时显示提示 -->
        <div 
          v-if="!loading && searchExecuted && getTotalResults === 0" 
          class="empty-result"
        >
          <van-empty description="暂无搜索结果" />
        </div>

        <!-- 全部搜索结果 -->
        <div v-if="!loading && searchExecuted && activeTab === 0 && getTotalResults > 0">
          <!-- 帖子结果预览 -->
          <div v-if="postResults.list?.length" class="result-section">
            <div class="section-header">
              <h3>帖子</h3>
              <span class="view-more" @click="activeTab = 1">查看更多</span>
            </div>
            <post-result-item 
              v-for="item in postResults.list.slice(0, 2)" 
              :key="'post-' + item.id" 
              :post="item"
              @click="navigateToPost(item.id)" 
            />
          </div>
          
          <!-- 文章结果预览 -->
          <div v-if="articleResults.list?.length" class="result-section">
            <div class="section-header">
              <h3>文章</h3>
              <span class="view-more" @click="activeTab = 2">查看更多</span>
            </div>
            <article-result-item 
              v-for="item in articleResults.list.slice(0, 2)" 
              :key="'article-' + item.id" 
              :article="item"
            />
          </div>
          
          <!-- 单词结果预览 -->
          <div v-if="wordResults.list?.length" class="result-section">
            <div class="section-header">
              <h3>单词</h3>
              <span class="view-more" @click="activeTab = 3">查看更多</span>
            </div>
            <word-result-item 
              v-for="item in wordResults.list.slice(0, 2)" 
              :key="'word-' + item.id" 
              :word="item"
              @click="showWordDetail(item)" 
              ref="wordResultRefs"
            />
          </div>
        </div>

        <!-- 帖子搜索结果 -->
        <div v-if="!loading && searchExecuted && activeTab === 1">
          <div v-if="postResults.list?.length">
            <post-result-item 
              v-for="item in postResults.list" 
              :key="'post-' + item.id" 
              :post="item"
              @click="navigateToPost(item.id)" 
            />
          </div>
          <van-empty v-else description="暂无帖子搜索结果" />
        </div>

        <!-- 文章搜索结果 -->
        <div v-if="!loading && searchExecuted && activeTab === 2">
          <div v-if="articleResults.list?.length">
            <article-result-item 
              v-for="item in articleResults.list" 
              :key="'article-' + item.id" 
              :article="item"
            />
          </div>
          <van-empty v-else description="暂无文章搜索结果" />
        </div>

        <!-- 单词搜索结果 -->
        <div v-if="!loading && searchExecuted && activeTab === 3">
          <div v-if="wordResults.list?.length">
            <word-result-item 
              v-for="item in wordResults.list" 
              :key="'word-' + item.id" 
              :word="item"
              @click="showWordDetail(item)" 
              ref="wordResultRefs"
            />
          </div>
          <van-empty v-else description="暂无单词搜索结果" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed, onMounted, defineAsyncComponent } from 'vue';
import { useRouter } from 'vue-router';
import { mockRecommendations } from '../../api/mock.ts'; // 仅保留推荐词
import { useSearchStore } from '../../stores/searchStore.ts'; // 导入搜索历史存储
import { showToast } from 'vant';
import { PostControllerService } from '../../services/services/PostControllerService';
import { DailyArticleControllerService } from '../../services/services/DailyArticleControllerService';
import { DailyWordControllerService } from '../../services/services/DailyWordControllerService';

// 懒加载结果项组件
const PostResultItem = defineAsyncComponent(() => import('../../components/Search').then(m => ({ default: m.PostResultItem })));
const ArticleResultItem = defineAsyncComponent(() => import('../../components/Search').then(m => ({ default: m.ArticleResultItem })));
const WordResultItem = defineAsyncComponent(() => import('../../components/Search').then(m => ({ default: m.WordResultItem })));

const router = useRouter();
const searchStore = useSearchStore(); // 使用搜索历史存储
const emit = defineEmits<{
  (event: 'update:modelValue', value: string): void;
}>();

// 接口数据及状态管理
const searchValue = ref<string>(''); // 绑定搜索框的值
const loading = ref(false); // 是否正在加载数据
const searchExecuted = ref(false); // 是否已执行搜索
const placeholder = '请输入搜索内容';
const showRecommendations = true;
const activeTab = ref(0); // 当前选中的分类标签

// 搜索结果
const postResults = ref<{
  list: any[];
  total: number;
  pageSize: number;
  current: number;
}>({
  list: [],
  total: 0,
  pageSize: 10,
  current: 1,
});

const articleResults = ref<{
  list: any[];
  total: number;
  pageSize: number;
  current: number;
}>({
  list: [],
  total: 0,
  pageSize: 10,
  current: 1,
});

const wordResults = ref<{
  list: any[];
  total: number;
  pageSize: number;
  current: number;
}>({
  list: [],
  total: 0,
  pageSize: 10,
  current: 1,
});

// 计算总结果数
const getTotalResults = computed(() => {
  return (
    (postResults.value.list?.length || 0) +
    (articleResults.value.list?.length || 0) +
    (wordResults.value.list?.length || 0)
  );
});

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
  return mockRecommendations.filter((item) =>
    item.toLowerCase().includes(searchValue.value.toLowerCase()),
  );
});

// 处理历史记录的展示，反转数组以便最新的记录显示在前面
const processedHistory = computed(() => {
  return searchStore.searchHistory.slice(0, 7);
});

// 搜索功能处理
const handleSearch = async (): Promise<void> => {
  const query = searchValue.value.trim();
  if (!query) return;

  // 清空先前的搜索结果
  postResults.value.list = [];
  articleResults.value.list = [];
  wordResults.value.list = [];
  searchExecuted.value = true;

  // 添加到搜索历史
  searchStore.addSearchHistory(query);

  // 显示加载提示
  loading.value = true;
  
  try {
    // 同时发起三个搜索请求
    const [postsResponse, articlesResponse, wordsResponse] = await Promise.all([
      PostControllerService.searchPostVoByPageUsingGet(query),
      DailyArticleControllerService.searchDailyArticleUsingGet(query),
      DailyWordControllerService.searchDailyWordUsingGet(query)
    ]);

    // 处理帖子搜索结果
    if (postsResponse.data) {
      postResults.value = {
        list: postsResponse.data.records || [],
        total: postsResponse.data.total || 0,
        pageSize: postsResponse.data.size || 10,
        current: postsResponse.data.current || 1
      };
    }

    // 处理文章搜索结果
    if (articlesResponse.data) {
      articleResults.value = {
        list: articlesResponse.data.records || [],
        total: articlesResponse.data.total || 0,
        pageSize: articlesResponse.data.size || 10,
        current: articlesResponse.data.current || 1
      };
    }

    // 处理单词搜索结果
    if (wordsResponse.data) {
      wordResults.value = {
        list: wordsResponse.data.records || [],
        total: wordsResponse.data.total || 0,
        pageSize: wordsResponse.data.size || 10,
        current: wordsResponse.data.current || 1
      };
    }
  } catch (error) {
    console.error('搜索失败:', error);
    showToast('搜索出错，请稍后重试');
  } finally {
    loading.value = false;
  }
};

// 清空搜索框内容
const handleClear = () => {
  searchValue.value = '';
  searchExecuted.value = false;
  postResults.value.list = [];
  articleResults.value.list = [];
  wordResults.value.list = [];
  activeTab.value = 0;
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
});

// 导航到帖子详情
const navigateToPost = (id: number) => {
  router.push(`/circle/post/${id}`);
};

// 显示单词详情
const showWordDetail = (_word: any) => {
  // 不再跳转到单词详情页，而是直接触发WordResultItem组件中的弹出层
  // 通过refs访问子组件的方法较复杂，所以这里让WordResultItem组件自己处理展示详情
};
</script>

<style scoped>
.search-page {
  background-color: #f2f7fd;
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
  background-color: #f2f7fd;
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
  font-size: var(--font-size-md);
  font-family: 'Noto Sans SC', sans-serif;
}

:deep(.van-field__control::placeholder) {
  color: #969799;
  font-size: var(--font-size-md);
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
  font-size: var(--font-size-md);
  color: #323233;
  padding: 12px 0;
  border-bottom: 1px solid #ebedf0;
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
  font-size: var(--font-size-md);
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
  display: inline-block;
  margin: 0 8px 8px 0;
  padding: 6px 12px;
  font-size: var(--font-size-sm);
  color: #646566;
  background: #f7f8fa;
  border-radius: 14px;
  position: relative;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;
}

.recommend-tag:active {
  background: #1989fa;
  color: white;
  transform: scale(0.96);
}

.recommend-tag::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  background-color: rgba(25, 137, 250, 0.1);
  border-radius: 50%;
  transform: translate(-50%, -50%);
  transition: width 0.5s, height 0.5s;
  z-index: 0;
}

.recommend-tag:hover::before {
  width: 200%;
  height: 200%;
}

.section-title {
  font-size: var(--font-size-md);
  font-weight: 600;
  margin-bottom: 10px;
  color: #323233;
}

.section-title:before {
  content: '';
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

/* 分类选择器 */
.category-selector {
  margin-top: 16px;
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
}

/* 搜索结果区域 */
.search-results {
  margin-top: 16px;
}

/* 加载中样式 */
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 32px 0;
}

.loading-text {
  margin-top: 12px;
  font-size: var(--font-size-md);
  color: #969799;
}

/* 结果区块样式 */
.result-section {
  margin-bottom: 20px;
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  border-bottom: 1px solid #ebedf0;
}

.section-header h3 {
  font-size: var(--font-size-md);
  font-weight: 600;
  margin: 0;
  color: #323233;
}

.view-more {
  font-size: var(--font-size-sm);
  color: #1989fa;
}

/* 空结果样式 */
.empty-result {
  margin-top: 40px;
}
</style>
