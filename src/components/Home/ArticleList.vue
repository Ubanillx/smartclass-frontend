<template>
  <div>
    <!-- 精美文章模块 -->
    <van-cell-group class="article-module">
      <van-cell title="每日美文">
        <template #icon>
          <svg class="icon svg-icon article-icon" aria-hidden="true">
            <use xlink:href="#icon-wenzhang"></use>
          </svg>
        </template>
        <template #right-icon>
          <span class="more-link" @click="$emit('more')">更多</span>
        </template>
      </van-cell>

      <div class="article-list">
        <div
          v-for="article in articles"
          :key="article.id"
          class="article-item"
          @click="showArticleDetail(article)"
        >
          <div class="article-cover">
            <van-image :src="article.cover" fit="cover" radius="4" />
            <span class="article-tag" :style="getTagStyle(article.category)">{{
              article.category
            }}</span>
          </div>
          <div class="article-info">
            <h3 class="article-title">{{ article.title }}</h3>
            <p class="article-brief">{{ article.brief }}</p>
            <div class="article-meta">
              <span>{{ article.readTime }}分钟</span>
              <span>{{ article.difficulty }}</span>
            </div>
          </div>
        </div>
      </div>
    </van-cell-group>

    <!-- 文章详情弹出层 -->
    <van-popup
      v-model:show="showArticlePopup"
      round
      position="bottom"
      :style="{ height: '90%' }"
    >
      <div class="article-detail">
        <div class="popup-header">
          <span class="title">文章详情</span>
          <van-icon name="cross" @click="showArticlePopup = false" />
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
import { ref } from 'vue';

interface Article {
  id: number;
  title: string;
  brief: string;
  cover: string;
  category: string;
  readTime: number;
  difficulty: string;
  content: string;
}

// 定义props
const props = defineProps<{
  articles: Article[];
}>();

// 定义事件
defineEmits<{
  (e: 'more'): void;
}>();

const showArticlePopup = ref(false);
const selectedArticle = ref<Article | null>(null);

// 显示文章详情
const showArticleDetail = (article: Article): void => {
  selectedArticle.value = article;
  showArticlePopup.value = true;
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
    default:
      styles.background = 'linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%)';
  }

  return styles;
};
</script>

<style scoped>
.article-module {
  margin-bottom: 16px;
  border-radius: 12px;
  overflow: hidden;
  background: #fff;
  box-shadow: 0 2px 12px rgba(100, 101, 102, 0.08);
}

.more-link {
  color: #1989fa;
  font-size: var(--font-size-md);
  font-weight: 700;
}

.article-list {
  padding: 0 16px 16px;
}

.article-item {
  display: flex;
  padding: 16px 0;
  border-bottom: 1px solid #ebedf0;
  cursor: pointer;
}

.article-item:last-child {
  border-bottom: none;
}

.article-cover {
  position: relative;
  width: 120px;
  height: 80px;
  margin-right: 12px;
  flex-shrink: 0;
}

.article-tag {
  position: absolute;
  top: 4px;
  left: 4px;
  padding: 3px 8px;
  font-size: var(--font-size-sm);
  color: #fff;
  background: linear-gradient(135deg, #ff9a9e 0%, #fad0c4 99%, #fad0c4 100%);
  border-radius: 4px;
  font-weight: 500;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.15);
  letter-spacing: 0.5px;
}

.article-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  overflow: hidden;
}

.article-title {
  margin: 0;
  font-size: var(--font-size-md) !important;
  line-height: 1.4;
  color: #323233;
  font-weight: 700 !important;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.article-brief {
  margin: 4px 0;
  font-size: var(--font-size-sm) !important;
  color: #646566;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
}

.article-meta {
  display: flex;
  gap: 12px;
  font-size: var(--font-size-sm);
  color: #969799;
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
  font-size: var(--font-size-md);
  font-weight: 500;
}

.article-content {
  flex: 1;
  padding: 16px;
  overflow-y: auto;
}

.article-content h2 {
  margin: 0 0 12px;
  font-size: var(--font-size-xl);
  color: #323233;
}

.article-content .article-info {
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
  font-size: var(--font-size-sm);
  color: #969799;
  align-items: center;
}

.detail-tag {
  padding: 3px 8px;
  font-size: var(--font-size-sm);
  color: #fff;
  border-radius: 4px;
  font-weight: 500;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.15);
  letter-spacing: 0.5px;
}

.article-text {
  margin-top: 16px;
  font-size: var(--font-size-md);
  line-height: 1.6;
  color: #323233;
}

.article-text p {
  margin: 12px 0;
}

.svg-icon {
  width: 1em;
  height: 1em;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
}

.article-icon {
  font-size: var(--font-size-lg);
  margin-right: 4px;
  color: #1989fa;
  vertical-align: middle;
  display: flex;
  align-items: center;
  height: 24px;
}

.article-module .article-item .article-title {
  margin: 0;
  font-size: var(--font-size-md) !important;
  line-height: 1.4;
  color: #323233;
  font-weight: 700 !important;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.article-module .article-item .article-brief {
  margin: 4px 0;
  font-size: var(--font-size-sm) !important;
  color: #646566;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
}

.article-module .article-item .article-meta {
  display: flex;
  gap: 12px;
  font-size: var(--font-size-sm) !important;
  color: #969799;
}
</style>
