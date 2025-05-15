<template>
  <div class="article-detail-page">
    <!-- 页面标题栏 -->
    <back-button title="文章详情" />

    <!-- 文章内容区域 -->
    <div class="content-container" v-if="articleDetail">
      <div class="article-header">
        <h1 class="article-title">{{ articleDetail.title }}</h1>
        <div class="article-info-detail">
          <span class="tag category-tag" :style="{ backgroundColor: getCategoryColorById(articleDetail.category) }">
            {{ articleDetail.category }}
          </span>
          <span 
            class="tag difficulty-tag" 
            :class="getDifficultyClassById(articleDetail.difficulty)"
          >
            {{ getDifficultyTextById(articleDetail.difficulty) }}
          </span>
          <span class="read-time-tag">{{ articleDetail.readTime || 0 }}分钟阅读</span>
        </div>
      </div>

      <!-- 文章封面图 -->
      <van-image 
        v-if="articleDetail.coverUrl" 
        :src="articleDetail.coverUrl" 
        class="article-cover" 
        fit="cover"
        radius="4px"
        width="100%"
      />
        
      <!-- 文章摘要 -->
      <div class="article-summary-detail" v-if="articleDetail.summary">
        {{ articleDetail.summary }}
      </div>
      
      <!-- 文章内容 -->
      <div class="article-content markdown-body" v-if="articleDetail.content" v-html="renderedContent"></div>
      
      <!-- 文章操作栏 -->
      <div class="article-actions">
        <van-button
          icon="like-o"
          :class="{ 'active': articleDetail.isThumb }"
          round
          plain
          @click="toggleThumb"
        >
          {{ articleDetail.isThumb ? '已点赞' : '点赞' }} ({{ articleDetail.thumbCount || 0 }})
        </van-button>
        <van-button
          :icon="articleDetail.isFavourite ? 'star' : 'star-o'"
          :class="{ 'active': articleDetail.isFavourite }"
          round
          plain
          @click="toggleFavourite"
        >
          {{ articleDetail.isFavourite ? '已收藏' : '收藏' }}
        </van-button>
      </div>
        
      <!-- 发布信息与统计 -->
      <div class="article-statistics">
        <div class="stat-item">
          <span class="stat-label">作者:</span>
          <span class="stat-value">{{ articleDetail.author || '未知' }}</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">发布日期:</span>
          <span class="stat-value">{{ formatDate(articleDetail.publishDate) }}</span>
        </div>
        <div class="article-metrics">
          <div class="metric-item">
            <van-icon name="eye-o" />
            <span class="metric-value">{{ articleDetail.viewCount || 0 }}</span>
          </div>
          <div class="metric-item">
            <van-icon name="like-o" />
            <span class="metric-value">{{ articleDetail.thumbCount || 0 }}</span>
          </div>
          <div class="metric-item">
            <van-icon name="star" />
            <span class="metric-value">{{ articleDetail.favourCount || 0 }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 加载中状态 -->
    <div v-else-if="loading" class="loading-container">
      <van-loading type="spinner" color="#1989fa" />
      <p class="loading-text">加载中...</p>
    </div>

    <!-- 加载失败状态 -->
    <div v-else-if="error" class="error-container">
      <van-empty description="加载失败，请稍后再试" />
      <van-button round type="primary" @click="loadArticleDetail">重新加载</van-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { formatDate } from '../../../utils/dateUtils';
import { showToast } from 'vant';
import { DailyArticleControllerService, DailyArticleFavourControllerService, DailyArticleThumbControllerService } from '../../../services';
import { BackButton } from '../../../components/Common';
import MarkdownIt from 'markdown-it';
import markdownItKatex from 'markdown-it-katex';
import DOMPurify from 'dompurify';
import 'katex/dist/katex.min.css';

const route = useRoute();
const router = useRouter();

// 初始化Markdown解析器
const md = new MarkdownIt({
  html: true,
  breaks: true,
  linkify: true,
  typographer: true
}).use(markdownItKatex);

// 文章ID
const articleId = computed(() => Number(route.params.id));

// 状态管理
const loading = ref(true);
const error = ref(false);
const articleDetail = ref<any>(null);

// 渲染后的Markdown内容
const renderedContent = computed(() => {
  if (!articleDetail.value?.content) return '';
  
  try {
    // 使用markdown-it渲染
    const rawHtml = md.render(articleDetail.value.content);
    
    // 安全处理
    return DOMPurify.sanitize(rawHtml, {
      ADD_TAGS: ['math', 'annotation', 'semantics', 'mrow', 'mi', 'mo', 'mn', 'msup', 'msub', 'mfrac'],
      ADD_ATTR: ['display', 'data-formula']
    });
  } catch (error) {
    console.error('Markdown渲染失败', error);
    return articleDetail.value.content.replace(/\n/g, '<br>');
  }
});

// 初始化页面
onMounted(() => {
  if (!articleId.value) {
    showToast('文章ID无效');
    router.back();
    return;
  }
  
  loadArticleDetail();
});

// 加载文章详情
const loadArticleDetail = async () => {
  if (!articleId.value) return;
  
  loading.value = true;
  error.value = false;
  
  try {
    // 调用API获取完整文章详情
    const response = await DailyArticleControllerService.getDailyArticleVoByIdUsingGet(articleId.value);
    
    if (response.code === 0 && response.data) {
      const data = response.data;
      
      // 更新文章详情
      articleDetail.value = {
        ...data,
        isFavourite: false,
        isThumb: false
      };
      
      // 检查文章是否已收藏和点赞
      await Promise.all([
        checkArticleFavouriteStatus(),
        checkArticleThumbStatus()
      ]);
    } else {
      showToast('获取文章详情失败');
      error.value = true;
    }
  } catch (err) {
    console.error('获取文章详情失败', err);
    showToast('获取文章详情失败，请稍后再试');
    error.value = true;
  } finally {
    loading.value = false;
  }
};

// 根据难度ID获取文本
const getDifficultyTextById = (difficultyId: number) => {
  const difficultyMap: Record<number, string> = {
    1: '初级',
    2: '中级',
    3: '高级'
  };
  return difficultyMap[difficultyId] || '未知';
};

// 根据难度ID获取样式类
const getDifficultyClassById = (difficultyId: number) => {
  const difficultyClassMap: Record<number, string> = {
    1: 'easy',
    2: 'medium',
    3: 'hard'
  };
  return difficultyClassMap[difficultyId] || '';
};

// 根据分类获取颜色
const getCategoryColorById = (category: string) => {
  const categoryColors: Record<string, string> = {
    '科技': '#1989fa',
    '文化': '#07c160',
    '教育': '#ff976a',
    '历史': '#7232dd',
    '生活': '#ee0a24',
    '艺术': '#2196f3',
    '自然': '#4caf50',
    '社会': '#ff5722'
  };
  return categoryColors[category] || '#1989fa';
};

// 检查文章是否已被收藏
const checkArticleFavouriteStatus = async () => {
  if (!articleDetail.value || !articleId.value) return;
  
  try {
    const response = await DailyArticleFavourControllerService.isFavourArticleUsingGet(articleId.value);
    
    if (response.code === 0) {
      // 更新收藏状态
      articleDetail.value.isFavourite = response.data === true;
    }
  } catch (error) {
    console.error('检查文章收藏状态失败', error);
  }
};

// 检查文章是否已被点赞
const checkArticleThumbStatus = async () => {
  if (!articleDetail.value || !articleId.value) return;
  
  try {
    const response = await DailyArticleThumbControllerService.isThumbArticleUsingGet(articleId.value);
    
    if (response.code === 0) {
      // 更新点赞状态
      articleDetail.value.isThumb = response.data === true;
    }
  } catch (error) {
    console.error('检查文章点赞状态失败', error);
  }
};

// 收藏/取消收藏文章
const toggleFavourite = async () => {
  if (!articleDetail.value || !articleId.value) return;
  
  try {
    // 根据当前收藏状态决定操作
    let response;
    if (!articleDetail.value.isFavourite) {
      // 添加收藏
      response = await DailyArticleFavourControllerService.doArticleFavourUsingPost(articleId.value);
    } else {
      // 取消收藏
      response = await DailyArticleFavourControllerService.cancelArticleFavourUsingDelete(articleId.value);
    }

    if (response.code === 0) {
      // 更新收藏状态
      articleDetail.value.isFavourite = !articleDetail.value.isFavourite;
      
      // 更新收藏数量
      if (articleDetail.value.isFavourite) {
        articleDetail.value.favourCount = (articleDetail.value.favourCount || 0) + 1;
      } else if (articleDetail.value.favourCount > 0) {
        articleDetail.value.favourCount--;
      }
      
      showToast({
        message: articleDetail.value.isFavourite ? '已收藏文章' : '已取消收藏',
        position: 'bottom'
      });
    } else {
      showToast({
        message: `操作失败: ${response.message || '未知错误'}`,
        position: 'bottom'
      });
    }
  } catch (error) {
    console.error('收藏操作失败', error);
    showToast('操作失败，请稍后再试');
  }
};

// 点赞/取消点赞文章
const toggleThumb = async () => {
  if (!articleDetail.value || !articleId.value) return;
  
  try {
    // 根据当前点赞状态决定操作
    let response;
    if (!articleDetail.value.isThumb) {
      // 添加点赞
      response = await DailyArticleThumbControllerService.thumbArticleUsingPost(articleId.value);
    } else {
      // 取消点赞
      response = await DailyArticleThumbControllerService.cancelArticleThumbUsingDelete(articleId.value);
    }

    if (response.code === 0) {
      // 更新点赞状态
      articleDetail.value.isThumb = !articleDetail.value.isThumb;
      
      // 更新点赞数量
      if (articleDetail.value.isThumb) {
        articleDetail.value.thumbCount = (articleDetail.value.thumbCount || 0) + 1;
      } else if (articleDetail.value.thumbCount > 0) {
        articleDetail.value.thumbCount--;
      }
      
      showToast({
        message: articleDetail.value.isThumb ? '已点赞文章' : '已取消点赞',
        position: 'bottom'
      });
    } else {
      showToast({
        message: `操作失败: ${response.message || '未知错误'}`,
        position: 'bottom'
      });
    }
  } catch (error) {
    console.error('点赞操作失败', error);
    showToast('操作失败，请稍后再试');
  }
};
</script>

<style scoped>
.article-detail-page {
  background-color: #f7f8fa;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.content-container {
  flex: 1;
  padding: 16px;
  background-color: #fff;
  border-radius: 8px;
  margin: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
}

.article-header {
  margin-bottom: 20px;
}

.article-title {
  font-size: 22px;
  font-weight: 600;
  color: #323233;
  margin: 0 0 16px 0;
  line-height: 1.4;
}

.article-info-detail {
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
  flex-wrap: wrap;
}

.tag {
  display: inline-block;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: var(--font-size-sm);
}

.category-tag {
  color: #fff;
}

.difficulty-tag.easy {
  background-color: #07c160;
  color: #fff;
}

.difficulty-tag.medium {
  background-color: #ff976a;
  color: #fff;
}

.difficulty-tag.hard {
  background-color: #ee0a24;
  color: #fff;
}

.read-time-tag {
  font-size: var(--font-size-sm);
  color: #646566;
  background-color: #f7f8fa;
  padding: 2px 8px;
  border-radius: 12px;
}

.article-cover {
  margin-bottom: 20px;
  border-radius: 8px;
  overflow: hidden;
}

.article-summary-detail {
  padding: 12px;
  background-color: #f7f8fa;
  border-radius: 8px;
  font-size: var(--font-size-md);
  color: #646566;
  margin-bottom: 20px;
  line-height: 1.6;
}

.article-content {
  font-size: var(--font-size-md);
  line-height: 1.8;
  color: #323233;
  margin-bottom: 24px;
}

/* Markdown 样式 */
.markdown-body {
  font-family: 'Noto Sans SC', sans-serif;
}

.markdown-body h1,
.markdown-body h2,
.markdown-body h3,
.markdown-body h4,
.markdown-body h5,
.markdown-body h6 {
  margin-top: 24px;
  margin-bottom: 16px;
  font-weight: 600;
  line-height: 1.25;
  color: #323233;
}

.markdown-body h1 {
  font-size: 2em;
  border-bottom: 1px solid #ebedf0;
  padding-bottom: 0.3em;
}

.markdown-body h2 {
  font-size: 1.5em;
  border-bottom: 1px solid #ebedf0;
  padding-bottom: 0.3em;
}

.markdown-body h3 {
  font-size: 1.25em;
}

.markdown-body p {
  margin-top: 0;
  margin-bottom: 16px;
}

.markdown-body a {
  color: #1989fa;
  text-decoration: none;
}

.markdown-body a:hover {
  text-decoration: underline;
}

.markdown-body code {
  padding: 0.2em 0.4em;
  margin: 0;
  font-size: 85%;
  background-color: rgba(27, 31, 35, 0.05);
  border-radius: 3px;
  font-family: monospace;
}

.markdown-body pre {
  padding: 16px;
  overflow: auto;
  font-size: 85%;
  line-height: 1.45;
  background-color: #f6f8fa;
  border-radius: 6px;
  margin-bottom: 16px;
}

.markdown-body pre code {
  padding: 0;
  margin: 0;
  font-size: 100%;
  word-break: normal;
  white-space: pre;
  background: transparent;
  border: 0;
}

.markdown-body blockquote {
  padding: 0 1em;
  color: #646566;
  border-left: 4px solid #dfe2e5;
  margin: 0 0 16px 0;
}

.markdown-body ul,
.markdown-body ol {
  padding-left: 2em;
  margin-bottom: 16px;
}

.markdown-body img {
  max-width: 100%;
  box-sizing: border-box;
  border-radius: 4px;
}

.markdown-body table {
  display: block;
  width: 100%;
  overflow: auto;
  margin-bottom: 16px;
  border-collapse: collapse;
}

.markdown-body table th,
.markdown-body table td {
  padding: 6px 13px;
  border: 1px solid #dfe2e5;
}

.markdown-body table tr {
  background-color: #fff;
  border-top: 1px solid #dfe2e5;
}

.markdown-body table tr:nth-child(2n) {
  background-color: #f7f8fa;
}

/* KaTeX 样式调整 */
.katex-display {
  margin: 1.5em 0;
  overflow-x: auto;
  overflow-y: hidden;
  padding: 1em;
  background-color: #f7f8fa;
  border-radius: 4px;
}

.katex {
  font-size: 1.1em;
}

.article-actions {
  display: flex;
  justify-content: center;
  gap: 24px;
  margin: 20px 0;
  padding: 16px 0;
  border-top: 1px solid #ebedf0;
  border-bottom: 1px solid #ebedf0;
}

.article-actions .van-button {
  padding: 0 16px;
  height: 36px;
}

.article-actions .van-button.active {
  color: #1989fa;
  border-color: #1989fa;
}

.article-statistics {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding-top: 16px;
}

.stat-item {
  display: flex;
  align-items: center;
  font-size: var(--font-size-sm);
  color: #646566;
}

.stat-label {
  margin-right: 8px;
  color: #969799;
}

.article-metrics {
  display: flex;
  gap: 16px;
  margin-top: 8px;
}

.metric-item {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: var(--font-size-sm);
  color: #969799;
}

.loading-container, .error-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 16px;
  gap: 16px;
}

.loading-text {
  margin-top: 8px;
  color: #969799;
  font-size: var(--font-size-md);
}
</style> 