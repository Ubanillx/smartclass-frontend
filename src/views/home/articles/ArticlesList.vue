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

    <!-- 文章详情弹出层 -->
    <van-popup
      v-model:show="showPopup"
      round
      position="bottom"
      :style="{ height: '90%' }"
    >
      <div class="article-detail">
        <div class="popup-header">
          <span class="title">文章详情</span>
          <van-icon name="cross" @click="closePopup" />
        </div>
        <div class="article-content" v-if="selectedArticle">
          <h2>{{ selectedArticle.title }}</h2>
          <div class="article-info">
            <span
              class="detail-tag"
              :style="getTagStyle(selectedArticle.category)"
              >{{ selectedArticle.category }}</span
            >
            <span>{{ selectedArticle.readTime }}分钟</span>
            <span>{{ convertDifficultyToText(selectedArticle.difficulty) }}</span>
            <span v-if="selectedArticle.author">作者: {{ selectedArticle.author }}</span>
          </div>
          <div class="article-actions">
            <van-button 
              icon="like-o" 
              :class="{ 'active': isLiked }"
              plain 
              hairline 
              round 
              size="small" 
              @click="toggleLike"
            >
              {{ isLiked ? '已点赞' : '点赞' }} ({{ selectedArticle.likeCount || 0 }})
            </van-button>
            <van-button 
              icon="star-o" 
              :class="{ 'active': isFavorite }"
              plain 
              hairline 
              round 
              size="small" 
              @click="toggleFavorite"
            >
              {{ isFavorite ? '已收藏' : '收藏' }}
            </van-button>
          </div>
          <van-image :src="selectedArticle.cover" fit="cover" width="100%" />
          <div class="article-text markdown-body" v-html="renderMarkdown(selectedArticle.content)"></div>
          <div class="article-footer" v-if="selectedArticle.source">
            <div class="source-info">
              <div>来源: {{ selectedArticle.source }}</div>
              <div v-if="selectedArticle.publishDate">发布时间: {{ formatDate(selectedArticle.publishDate) }}</div>
            </div>
          </div>
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { showToast, showSuccessToast, showLoadingToast } from 'vant';
import { BackButton } from '../../../components/Common';
import { ArticleContent } from '../../../components/Home';
import { marked } from 'marked';
import { DailyArticleControllerService, DailyArticleFavourControllerService, DailyArticleThumbControllerService } from '../../../services';

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
const category = computed(() => route.query.category as string);

// 状态变量
const loading = ref(false);
const refreshing = ref(false);
const finished = ref(false);
const articles = ref<Article[]>([]);
const activeTab = ref(0);
const showPopup = ref(false);
const selectedArticle = ref<Article | null>(null);
const currentPage = ref(1);
const pageSize = ref(10);
const total = ref(0);
const isLiked = ref(false);
const isFavorite = ref(false);

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
    selectedCategory.value = categories.value[index - 1];
  }
  
  // 重置分页和文章列表
  currentPage.value = 1;
  articles.value = [];
  finished.value = false;
  
  // 重新加载文章
  loadArticles();
};

// 点击文章显示详情
const showArticleDetail = async (article: Article): Promise<void> => {
  const loadingToast = showLoadingToast({
    message: '加载中...',
    forbidClick: true,
  });
  
  try {
    // 获取完整文章详情
    const response = await DailyArticleControllerService.getDailyArticleVoByIdUsingGet(article.id);
    
    if (response.code === 0 && response.data) {
      const fullArticle = mapToArticle(response.data);
      selectedArticle.value = fullArticle;
      showPopup.value = true;
      
      // 检查是否已点赞
      checkIsLiked(article.id);
      
      // 检查是否已收藏
      checkIsFavorite(article.id);
    } else {
      showToast('获取文章详情失败');
    }
  } catch (error) {
    console.error('获取文章详情失败:', error);
    showToast('获取文章详情失败，请稍后再试');
  } finally {
    loadingToast.close();
  }
};

// 检查是否已点赞
const checkIsLiked = async (articleId: number) => {
  try {
    const response = await DailyArticleThumbControllerService.isThumbArticleUsingGet(articleId);
    if (response.code === 0) {
      isLiked.value = response.data || false;
    }
  } catch (error) {
    console.error('检查点赞状态失败:', error);
  }
};

// 检查是否已收藏
const checkIsFavorite = async (articleId: number) => {
  try {
    const response = await DailyArticleFavourControllerService.isFavourArticleUsingGet(articleId);
    if (response.code === 0) {
      isFavorite.value = response.data || false;
    }
  } catch (error) {
    console.error('检查收藏状态失败:', error);
  }
};

// 关闭弹窗
const closePopup = (): void => {
  showPopup.value = false;
  setTimeout(() => {
    selectedArticle.value = null;
    isLiked.value = false;
    isFavorite.value = false;
  }, 300);
};

// 切换点赞状态
const toggleLike = async (): Promise<void> => {
  if (!selectedArticle.value) return;
  
  const loadingToast = showLoadingToast({
    message: isLiked.value ? '取消点赞中...' : '点赞中...',
    forbidClick: true,
  });
  
  try {
    const articleId = selectedArticle.value.id;
    const response = await DailyArticleThumbControllerService.doArticleThumbUsingPost(articleId);
    
    if (response.code === 0) {
      isLiked.value = !isLiked.value;
      
      // 更新点赞数量
      if (selectedArticle.value) {
        const newLikeCount = response.data || selectedArticle.value.likeCount || 0;
        selectedArticle.value = {
          ...selectedArticle.value,
          likeCount: newLikeCount
        };
      }
      
      showToast({
        message: isLiked.value ? '点赞成功' : '已取消点赞',
        icon: isLiked.value ? 'like' : 'cross',
      });
    } else {
      showToast(`操作失败: ${response.message || '未知错误'}`);
    }
  } catch (error) {
    console.error('点赞操作失败:', error);
    showToast('操作失败，请稍后再试');
  } finally {
    loadingToast.close();
  }
};

// 切换收藏状态
const toggleFavorite = async (): Promise<void> => {
  if (!selectedArticle.value) return;
  
  const loadingToast = showLoadingToast({
    message: isFavorite.value ? '取消收藏中...' : '收藏中...',
    forbidClick: true,
  });
  
  try {
    const articleId = selectedArticle.value.id;
    const response = await DailyArticleFavourControllerService.doArticleFavourUsingPost(articleId);
    
    if (response.code === 0) {
      isFavorite.value = !isFavorite.value;
      
      showToast({
        message: isFavorite.value ? '收藏成功' : '已取消收藏',
        icon: isFavorite.value ? 'star' : 'cross',
      });
    } else {
      showToast(`操作失败: ${response.message || '未知错误'}`);
    }
  } catch (error) {
    console.error('收藏操作失败:', error);
    showToast('操作失败，请稍后再试');
  } finally {
    loadingToast.close();
  }
};

// 渲染Markdown内容
const renderMarkdown = (content: string): string => {
  if (!content) return '';
  try {
    return marked.parse(content) as string;
  } catch (error) {
    console.error('Markdown渲染失败:', error);
    return content;
  }
};

// 根据文章类别返回不同的样式
const getTagStyle = (category: string): Record<string, string> => {
  const styles: Record<string, string> = {};

  switch (category) {
    case '励志':
      styles.background = 'linear-gradient(135deg, #ff9a9e 0%, #fad0c4 99%)';
      break;
    case '历史':
      styles.background = 'linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%)';
      break;
    case '科技':
      styles.background = 'linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%)';
      break;
    case '文化':
      styles.background = 'linear-gradient(135deg, #fbc2eb 0%, #a6c1ee 100%)';
      break;
    case '旅行':
      styles.background = 'linear-gradient(135deg, #f6d365 0%, #fda085 100%)';
      break;
    default:
      styles.background = 'linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%)';
  }

  return styles;
};

// 将数字难度转换为文本
const convertDifficultyToText = (difficulty: number | undefined | string): string => {
  if (typeof difficulty === 'string') return difficulty;
  
  switch (difficulty) {
    case 1: return '初级';
    case 2: return '中级';
    case 3: return '高级';
    default: return '未知';
  }
};

// 将后端数据映射为前端文章格式
const mapToArticle = (item: any): Article => {
  // 处理标签字符串，将逗号分隔的标签转换为数组
  const tagsList = item.tags
    ? item.tags.split(',').map((tag: string) => tag.trim())
    : [];
    
  return {
    id: item.id || 0,
    title: item.title || '未命名文章',
    brief: item.summary || '暂无简介',
    cover: item.coverImage ||
          'https://smart-class-1329220530.cos.ap-nanjing.myqcloud.com/user_avatar/a5c6d7e8f9b0a1c2d3e4f5a6b7c8d9e0.png',
    category: item.category || '文化',
    readTime: item.readTime || 5,
    difficulty: item.difficulty,
    content: item.content || '暂无内容',
    publishDate: item.publishDate || '',
    viewCount: item.viewCount || 0,
    likeCount: item.likeCount || 0,
    tags: tagsList,
    author: item.author || '', 
    source: item.source || '',
  };
};

// 格式化日期
const formatDate = (dateString: string): string => {
  if (!dateString) return '未知';
  
  const date = new Date(dateString);
  return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
};

// 加载文章数据
const loadArticles = async () => {
  if (loading.value) return;
  
  loading.value = true;
  
  try {
    const queryParams = {
      current: currentPage.value,
      pageSize: pageSize.value,
      category: selectedCategory.value || undefined,
      sortField: 'publishDate',
      sortOrder: 'desc',
    };
    
    const response = await DailyArticleControllerService.listDailyArticleVoByPageUsingPost(queryParams);
    
    if (response.code === 0 && response.data) {
      const { records, total: totalCount } = response.data;
      total.value = totalCount || 0;
      
      const newArticles = (records || []).map(mapToArticle);
      
      if (currentPage.value === 1) {
        // 第一页，替换数据
        articles.value = newArticles;
      } else {
        // 后续页，追加数据
        articles.value = [...articles.value, ...newArticles];
      }
      
      // 判断是否加载完所有数据
      finished.value = !records || records.length < pageSize.value || articles.value.length >= total.value;
      
      // 增加页码，为下次加载做准备
      currentPage.value++;
    } else {
      showToast('获取文章数据失败');
      finished.value = true;
    }
  } catch (error) {
    console.error('获取文章列表失败:', error);
    showToast('获取数据失败，请稍后再试');
    finished.value = true;
  } finally {
    loading.value = false;
  }
};

// 下拉刷新
const onRefresh = async () => {
  try {
    currentPage.value = 1;
    finished.value = false;
    await loadArticles();
    showToast('刷新成功');
  } catch (error) {
    console.error('刷新失败:', error);
    showToast('刷新失败，请稍后再试');
  } finally {
    refreshing.value = false;
  }
};

// 组件挂载时加载初始数据
onMounted(() => {
  loadArticles();
});

// 监听分类变化
watch(() => route.query.category, (newCategory) => {
  if (newCategory) {
    const categoryIndex = categories.value.findIndex(c => c === newCategory);
    if (categoryIndex !== -1) {
      activeTab.value = categoryIndex + 1;
      selectedCategory.value = newCategory as string;
    } else {
      activeTab.value = 0;
      selectedCategory.value = '';
    }
  } else {
    activeTab.value = 0;
    selectedCategory.value = '';
  }
  
  // 重置分页和文章列表
  currentPage.value = 1;
  articles.value = [];
  finished.value = false;
  
  // 重新加载文章
  loadArticles();
});
</script>

<style scoped>
.articles-list {
  min-height: 100vh;
  background-color: #f7f8fa;
  display: flex;
  flex-direction: column;
}

.content-container {
  flex: 1;
  margin-top: 8px; /* 为返回按钮留出空间 */
}

.article-detail {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.popup-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid #ebedf0;
}

.popup-header .title {
  font-size: var(--font-size-md, 14px);
  font-weight: 700;
}

.article-content {
  flex: 1;
  padding: 16px;
  overflow-y: auto;
}

.article-content h2 {
  margin: 0 0 12px;
  font-size: var(--font-size-xl, 18px);
  color: #323233;
  font-weight: 700;
}

.article-info {
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
  font-size: var(--font-size-sm, 12px);
  color: #969799;
  align-items: center;
  flex-wrap: wrap;
}

.article-actions {
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
}

.article-actions .van-button {
  border-color: #dcdee0;
  color: #646566;
}

.article-actions .van-button.active {
  color: #1989fa;
  border-color: #1989fa;
}

.detail-tag {
  padding: 3px 8px;
  font-size: var(--font-size-sm, 12px);
  color: #fff;
  border-radius: 4px;
  font-weight: 500;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.15);
  letter-spacing: 0.5px;
}

.article-text {
  margin-top: 16px;
  font-size: var(--font-size-md, 14px);
  line-height: 1.6;
  color: #323233;
}

.article-text p {
  margin: 12px 0;
}

.article-footer {
  margin-top: 24px;
  padding-top: 16px;
  border-top: 1px solid #ebedf0;
  font-size: var(--font-size-sm, 12px);
  color: #969799;
}

.source-info {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
</style>
