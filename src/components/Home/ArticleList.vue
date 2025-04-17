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
            <!-- 显示前两个标签（如果有） -->
            <div class="list-tags-container" v-if="article.tags && article.tags.length > 0">
              <van-tag
                v-for="(tag, index) in article.tags.slice(0, 2)"
                :key="index"
                type="primary"
                plain
                class="list-tag-item"
              >
                {{ tag }}
              </van-tag>
              <span v-if="article.tags.length > 2" class="more-tags">+{{ article.tags.length - 2 }}</span>
            </div>
            <div class="article-meta">
              <span>{{ article.readTime }}分钟</span>
              <span>{{ article.difficulty }}</span>
              <span v-if="article.author">作者: {{ article.author }}</span>
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
          
          <div class="article-header-info">
            <div class="header-left">
              <div class="author-info" v-if="selectedArticle.author">
                <span>作者: {{ selectedArticle.author }}</span>
              </div>
            </div>
            <div class="header-right">
              <div class="source-info" v-if="selectedArticle.source">
                <span>来源: {{ selectedArticle.source }}</span>
              </div>
            </div>
          </div>
          
          <div class="article-tag-row">
            <span
              class="category-tag"
              :style="getTagStyle(selectedArticle.category)"
            >{{ selectedArticle.category }}</span>
            <span class="time-tag">{{ selectedArticle.readTime }}分钟</span>
            <span class="difficulty-tag">{{ selectedArticle.difficulty }}</span>
          </div>
          
          <!-- 标签显示 -->
          <div class="tags-container" v-if="selectedArticle.tags && selectedArticle.tags.length > 0">
            <van-tag
              v-for="(tag, index) in selectedArticle.tags"
              :key="index"
              type="primary"
              plain
              class="article-tag-item"
            >
              {{ tag }}
            </van-tag>
          </div>
          
          <div class="article-cover-image">
            <van-image :src="selectedArticle.cover" fit="cover" width="100%" radius="4" />
          </div>
          
          <div class="article-text markdown-body" v-html="renderMarkdown(selectedArticle.content)"></div>
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { marked } from 'marked';

interface Article {
  id: number;
  title: string;
  brief: string;
  cover: string;
  category: string;
  readTime: number;
  difficulty: string;
  content: string;
  tags?: string[];
  author?: string;
  source?: string;
  publishDate?: string;
  viewCount?: number;
  likeCount?: number;
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
    case '艺术':
      styles.background = 'linear-gradient(135deg, #d299c2 0%, #fef9d7 100%)';
      break;
    case '旅行':
      styles.background = 'linear-gradient(135deg, #f6d365 0%, #fda085 100%)';
      break;
    case '数学':
      styles.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
      break;
    case '应用':
      styles.background = 'linear-gradient(135deg, #2af598 0%, #009efd 100%)';
      break;
    case '生活':
      styles.background = 'linear-gradient(135deg, #ff9a9e 0%, #F6EAC2 100%)';
      break;
    default:
      styles.background = 'linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%)';
  }

  return styles;
};

// 将 Markdown 转换为 HTML
const renderMarkdown = (content: string): string => {
  try {
    return marked.parse(content) as string;
  } catch (error) {
    console.error('解析Markdown失败', error);
    return content; // 如果解析失败，返回原始内容
  }
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

.article-item:hover {
  background-color: #f7f8fa;
  border-radius: 8px;
}

.article-cover {
  position: relative;
  width: 120px;
  height: 80px;
  margin-right: 12px;
  flex-shrink: 0;
  border-radius: 4px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
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
  flex-wrap: wrap;
  gap: 12px;
  font-size: var(--font-size-sm);
  color: #969799;
  align-items: center;
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
  text-align: center;
}

.article-header-info {
  display: flex;
  justify-content: space-between;
  padding: 8px 12px;
  margin-bottom: 16px;
  color: #646566;
  font-size: var(--font-size-sm);
  border-bottom: 1px dashed #ebedf0;
  border-top: 1px dashed #ebedf0;
}

.header-left, .header-right {
  display: flex;
  align-items: center;
}

.author-info, .source-info {
  display: flex;
  align-items: center;
}

.author-info {
  margin-right: 15px;
}

.article-tag-row {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 16px;
  align-items: center;
}

.category-tag, .time-tag, .difficulty-tag {
  padding: 2px 10px;
  border-radius: 16px;
  font-size: var(--font-size-sm);
  display: inline-block;
}

.category-tag {
  color: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.time-tag, .difficulty-tag {
  color: #646566;
  background-color: #f5f5f5;
  border: 1px solid #ebedf0;
}

.article-cover-image {
  margin: 16px 0;
  overflow: hidden;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  text-align: center;
  background-color: #f5f7fa;
  position: relative;
  min-height: 200px;
}

.article-cover-image::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="%23ddd" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>');
  background-repeat: no-repeat;
  background-position: center;
  background-size: 48px;
  opacity: 0.5;
}

.article-text {
  margin-top: 16px;
  line-height: 1.6;
  color: #333;
  font-size: var(--font-size-md);
}

/* Markdown 样式 */
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
}

.markdown-body h1 {
  font-size: 2em;
  margin-top: 0;
}

.markdown-body h2 {
  font-size: 1.5em;
}

.markdown-body p {
  margin-top: 0;
  margin-bottom: 16px;
}

.markdown-body ul, 
.markdown-body ol {
  padding-left: 2em;
  margin-top: 0;
  margin-bottom: 16px;
}

.markdown-body code {
  font-family: monospace;
  padding: 0.2em 0.4em;
  margin: 0;
  font-size: 85%;
  background-color: rgba(27, 31, 35, 0.05);
  border-radius: 3px;
}

.markdown-body blockquote {
  margin: 0;
  padding: 0 1em;
  color: #6a737d;
  border-left: 0.25em solid #dfe2e5;
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

.tags-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 8px;
  margin: 12px 0;
  padding: 0 8px;
}

.article-tag-item {
  margin-right: 6px;
  margin-bottom: 6px;
  border-radius: 16px;
  font-size: 12px;
  padding: 2px 10px;
  background-color: #f7f8fa;
  border: 1px solid #e8e8e8;
  color: #666;
  transition: all 0.3s;
}

.article-tag-item:hover {
  background-color: #e8f3ff;
  border-color: #b3d8ff;
  color: #1989fa;
}

.list-tags-container {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  margin: 4px 0;
}

.list-tag-item {
  margin-right: 6px;
  margin-bottom: 4px;
  font-size: 10px;
  border-radius: 10px;
  padding: 1px 6px;
  background-color: #f7f8fa;
  border: 1px solid #e8e8e8;
  color: #666;
}

/* 优化类别标签 */
.category-tag {
  padding: 3px 12px;
  border-radius: 16px;
  font-size: 12px;
  font-weight: 500;
  color: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.15);
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

/* 优化时间和难度标签 */
.time-tag, .difficulty-tag {
  padding: 3px 12px;
  border-radius: 16px;
  font-size: 12px;
  color: #666;
  background-color: #f7f8fa;
  border: 1px solid #e8e8e8;
}

.more-tags {
  font-size: 10px;
  color: #969799;
}
</style>
