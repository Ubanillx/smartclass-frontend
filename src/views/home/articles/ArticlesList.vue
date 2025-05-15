<template>
  <div class="articles-list">
    <!-- 返回按钮 -->
    <back-button title="精美文章" />

    <!-- 主要内容区域 -->
    <div class="content-container">
      <!-- 分类标签页 -->
      <van-tabs v-model:active="activeTab" sticky swipeable @change="handleTabChange">
        <van-tab title="全部">
          <article-content
            :articles="filteredArticles"
            :loading="loading"
            :finished="finished"
            :refreshing="refreshing"
            @article-click="showArticleDetail"
            @load="loadArticles"
            @refresh="onRefresh"
          />
        </van-tab>
        <van-tab
          v-for="category in categories"
          :key="category"
          :title="category"
        >
          <article-content
            :articles="filteredArticles"
            :loading="loading"
            :finished="finished"
            :refreshing="refreshing"
            @article-click="showArticleDetail"
            @load="loadArticles"
            @refresh="onRefresh"
          />
        </van-tab>
      </van-tabs>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { showToast, showSuccessToast } from 'vant';
import { BackButton } from '../../../components/Common';
import { ArticleContent } from '../../../components/Home';
import { DailyArticleControllerService } from '../../../services';

interface Article {
  id: number;
  title: string;
  brief: string;
  cover: string;
  category: string;
  readTime: number;
  difficulty: number | string;
  content: string;
  tags?: string[];
  author?: string;
  source?: string;
  publishDate?: string;
  viewCount?: number;
  likeCount?: number;
}

const router = useRouter();
const route = useRoute();

// 获取路由
const category = computed(() => route.query.category as string || '');

// 状态变量
const loading = ref(false);
const refreshing = ref(false);
const finished = ref(false);
const articles = ref<Article[]>([]);
const activeTab = ref(0);
const currentPage = ref(1);
const pageSize = ref(10);
const total = ref(0);

// 文章分类
const categories = ref<string[]>(['励志', '历史', '科技', '文化', '旅行']);

// 当前选中的分类
const selectedCategory = ref('');

// 根据分类筛选文章
const filteredArticles = computed(() => {
  return articles.value;
});

// 处理标签页切换
const handleTabChange = (index: number) => {
  if (index === 0) {
    selectedCategory.value = '';
  } else {
    const category = categories.value[index - 1];
    if (category) {
      selectedCategory.value = category;
    }
  }
  
  // 重置分页和文章列表
  currentPage.value = 1;
  articles.value = [];
  finished.value = false;
  
  // 重新加载文章
  loadArticles();
};

// 点击文章显示详情
const showArticleDetail = (article: Article): void => {
  // 直接导航到文章详情页面
  router.push(`/daily/article/${article.id}`);
};

// 加载文章列表
const loadArticles = async () => {
  if (loading.value) return;
  
  loading.value = true;
  
  try {
    const queryParams: any = {
      current: currentPage.value,
      pageSize: pageSize.value
    };
    
    // 添加分类过滤条件
    if (selectedCategory.value) {
      queryParams.category = selectedCategory.value;
    }
    
    // 调用API获取文章列表
    const response = await DailyArticleControllerService.listDailyArticleVoByPageUsingGet(
      undefined, // adminId
      undefined, // author
      queryParams.category, // category
      undefined, // content
      undefined, // createTime
      queryParams.current, // current
      undefined, // difficulty
      undefined, // id
      undefined, // maxReadTime
      undefined, // minReadTime
      undefined, // minViewCount
      queryParams.pageSize, // pageSize
      undefined, // publishDateEnd
      undefined, // publishDateStart
      undefined, // sortField
      undefined, // sortOrder
      undefined, // source
      undefined, // summary
      undefined, // tags
      undefined  // title
    );
    
    if (response.code === 0 && response.data) {
      const data = response.data;
      
      // 将API返回数据转换为前端需要的格式
      const newArticles = (data.records || []).map(mapToArticle);
      
      // 更新列表和分页信息
      articles.value = [...articles.value, ...newArticles];
      total.value = data.total || 0;
      
      // 更新分页状态
      currentPage.value += 1;
      finished.value = articles.value.length >= total.value;
    } else {
      showToast('获取文章列表失败');
      finished.value = true;
    }
  } catch (error) {
    console.error('获取文章列表失败:', error);
    showToast('获取文章列表失败，请稍后再试');
    finished.value = true;
  } finally {
    loading.value = false;
  }
};

// 下拉刷新
const onRefresh = () => {
  // 重置状态
  finished.value = false;
  currentPage.value = 1;
  
  // 清空文章列表
  articles.value = [];
  
  // 重新加载
  loadArticles().then(() => {
    refreshing.value = false;
    showSuccessToast('刷新成功');
  }).catch(() => {
    refreshing.value = false;
  });
};

// 将API返回的文章数据映射为前端使用的格式
const mapToArticle = (item: any): Article => {
  return {
    id: item.id,
    title: item.title || '',
    brief: item.summary || '',
    cover: item.coverUrl || '',
    category: item.category || '未分类',
    readTime: item.readTime || 5,
    difficulty: item.difficulty || 1,
    content: item.content || '',
    tags: item.tags ? item.tags.split(',') : [],
    author: item.author,
    source: item.source,
    publishDate: item.publishDate,
    viewCount: item.viewCount,
    likeCount: item.thumbCount
  };
};

// 初始加载
onMounted(() => {
  // 如果URL中有分类参数，设置对应的标签页
  if (category.value) {
    const index = categories.value.findIndex(item => item === category.value);
    if (index !== -1) {
      activeTab.value = index + 1; // +1 是因为第一个标签是"全部"
      selectedCategory.value = category.value;
    }
  }
  
  // 加载文章列表
  loadArticles();
});
</script>

<style scoped>
.articles-list {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #f7f8fa;
}

.content-container {
  flex: 1;
  padding-bottom: 10px;
}

/* 标签页样式 */
:deep(.van-tabs) {
  background-color: #fff;
}

:deep(.van-tabs__wrap) {
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
}

:deep(.van-tab) {
  font-size: var(--font-size-md);
  color: #646566;
}

:deep(.van-tab--active) {
  font-weight: 700;
  color: #1989fa;
}

:deep(.van-tabs__line) {
  background-color: #1989fa;
  width: 20px !important;
  left: 50%;
  transform: translateX(-50%) !important;
  border-radius: 3px;
}
</style>
