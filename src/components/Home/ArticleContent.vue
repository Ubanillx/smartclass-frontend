<template>
  <div class="article-content-container">
    <van-pull-refresh v-model="refreshing" @refresh="$emit('refresh')">
      <van-list
        v-model:loading="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="$emit('load')"
      >
        <div v-if="articles.length === 0 && !loading" class="empty-state">
          <van-empty description="暂无文章" />
        </div>

        <div
          v-for="article in articles"
          :key="article.id"
          class="article-item"
          @click="$emit('article-click', article)"
        >
          <div class="article-cover">
            <van-image
              :src="article.cover"
              fit="cover"
              radius="8"
              width="120"
              height="80"
            />
            <span class="article-tag" :style="getTagStyle(article.category)">{{
              article.category
            }}</span>
          </div>
          <div class="article-info">
            <h3 class="article-title">{{ article.title }}</h3>
            <p class="article-brief">{{ article.brief }}</p>
            <div class="article-meta">
              <div class="meta-item">
                <van-icon name="clock-o" />
                <span>{{ article.readTime }}分钟</span>
              </div>
              <div class="meta-item">
                <van-icon name="eye-o" />
                <span>{{ article.viewCount }}</span>
              </div>
              <div class="meta-item">
                <van-icon name="good-job-o" />
                <span>{{ article.likeCount }}</span>
              </div>
              <div
                class="meta-item difficulty-tag"
                :class="getDifficultyClass(convertDifficultyToText(article.difficulty))"
              >
                {{ convertDifficultyToText(article.difficulty) }}
              </div>
            </div>
          </div>
        </div>
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script setup lang="ts">
import { ref, defineProps, defineEmits } from 'vue';

interface Article {
  id: number;
  title: string;
  brief: string;
  cover: string;
  category: string;
  readTime: number;
  difficulty: number | string;
  content: string;
  publishDate?: string;
  viewCount?: number;
  likeCount?: number;
  tags?: string[];
  author?: string;
  source?: string;
}

// 定义props
defineProps<{
  articles: Article[];
  loading?: boolean;
  finished?: boolean;
  refreshing?: boolean;
}>();

// 定义事件
defineEmits<{
  (e: 'article-click', article: Article): void;
  (e: 'load'): void;
  (e: 'refresh'): void;
}>();

// 状态变量
const loading = ref(false);
const finished = ref(false);
const refreshing = ref(false);

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
const convertDifficultyToText = (difficulty: number | string | undefined): string => {
  if (typeof difficulty === 'string') return difficulty;
  
  switch (difficulty) {
    case 1: return '初级';
    case 2: return '中级';
    case 3: return '高级';
    default: return '未知';
  }
};

// 根据难度返回不同的样式类
const getDifficultyClass = (difficulty: string): string => {
  switch (difficulty) {
    case '初级':
      return 'easy';
    case '中级':
      return 'medium';
    case '高级':
      return 'hard';
    default:
      return '';
  }
};
</script>

<style scoped>
.article-content-container {
  padding: 12px;
}

.article-item {
  display: flex;
  padding: 16px;
  margin-bottom: 12px;
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.article-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.article-cover {
  position: relative;
  margin-right: 12px;
  flex-shrink: 0;
}

.article-tag {
  position: absolute;
  top: 4px;
  left: 4px;
  padding: 2px 6px;
  font-size: 10px;
  color: #fff;
  border-radius: 4px;
  font-weight: 500;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.15);
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
  font-size: var(--font-size-md, 14px);
  line-height: 1.4;
  color: #323233;
  font-weight: 700;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
}

.article-brief {
  margin: 4px 0 8px;
  font-size: var(--font-size-sm, 12px);
  color: #646566;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
}

.article-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  font-size: var(--font-size-sm, 12px);
  color: #969799;
}

.meta-item {
  display: flex;
  align-items: center;
}

.meta-item .van-icon {
  font-size: 14px;
  margin-right: 4px;
}

.difficulty-tag {
  padding: 2px 6px;
  border-radius: 4px;
  color: #fff;
  font-weight: 500;
}

.difficulty-tag.easy {
  background-color: #07c160;
}

.difficulty-tag.medium {
  background-color: #1989fa;
}

.difficulty-tag.hard {
  background-color: #ee0a24;
}

.empty-state {
  padding: 32px 0;
}
</style> 