<template>
  <div class="articles-list">
    <!-- 返回按钮 -->
    <back-button title="精美文章" />

    <!-- 主要内容区域 -->
    <div class="content-container">
      <!-- 分类标签页 -->
      <van-tabs v-model:active="activeTab" sticky swipeable>
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
            <span>{{ selectedArticle.difficulty }}</span>
          </div>
          <van-image :src="selectedArticle.cover" fit="cover" width="100%" />
          <div class="article-text" v-html="selectedArticle.content"></div>
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { showToast } from 'vant';
import { BackButton } from '../../../components/Common';
import ArticleContent from './components/ArticleContent.vue';
import {
  mockArticles,
  generateMockArticles,
  type Article,
} from '../../../api/mock.ts';

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

// 文章分类
const categories = ref<string[]>(['励志', '历史', '科技', '文化', '旅行']);

// 根据分类筛选文章
const filteredArticles = computed(() => {
  if (!category.value) {
    return articles.value;
  }
  return articles.value.filter(
    (article) => article.category === category.value,
  );
});

// 点击文章显示详情
const showArticleDetail = (article: Article): void => {
  // 更新文章数据，模拟阅读量+1
  const updatedArticle = {
    ...article,
    viewCount: (article.viewCount || 0) + 1,
  };
  selectedArticle.value = updatedArticle;
  showPopup.value = true;
};

// 关闭弹窗
const closePopup = (): void => {
  showPopup.value = false;
  setTimeout(() => {
    selectedArticle.value = null;
  }, 300);
};

// 点赞文章
const likeArticle = (): void => {
  if (!selectedArticle.value) return;

  // 更新文章数据，模拟点赞+1
  selectedArticle.value = {
    ...selectedArticle.value,
    likeCount: (selectedArticle.value.likeCount || 0) + 1,
  };

  showToast({
    message: '点赞成功',
    icon: 'like-o',
  });
};

// 收藏文章
const collectArticle = (): void => {
  showToast({
    message: '收藏成功',
    icon: 'star-o',
  });
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

// 加载文章数据
const loadArticles = () => {
  loading.value = true;

  // 模拟异步加载
  setTimeout(() => {
    const newArticles = generateMockArticles(10);
    articles.value = [...articles.value, ...newArticles];

    loading.value = false;

    // 判断是否已加载完所有数据
    if (articles.value.length >= 30) {
      finished.value = true;
    }
  }, 1000);
};

// 下拉刷新
const onRefresh = () => {
  finished.value = false;
  articles.value = [];
  loadArticles();
  refreshing.value = false;
};

// 组件挂载时加载初始数据
onMounted(() => {
  // 初始化时添加一些基础文章
  articles.value = [...mockArticles];
  // 加载更多文章
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
</style>
