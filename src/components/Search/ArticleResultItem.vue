<template>
  <div class="article-result-item" @click="navigateToDetail">
    <div class="article-info">
      <h3 class="article-title">{{ article.title }}</h3>
      <p class="article-summary">{{ article.summary || formatContent }}</p>
      <div class="article-meta">
        <span class="category" :style="getCategoryStyle">{{ article.category }}</span>
        <span class="difficulty" :class="getDifficultyClass">
          {{ getDifficultyText }}
        </span>
        <span class="read-time">{{ article.readTime || 0 }}分钟</span>
        <span class="publish-date">{{ formatDate(article.publishDate) }}</span>
      </div>
    </div>
    <van-image 
      v-if="article.coverUrl" 
      :src="article.coverUrl" 
      class="article-cover" 
      fit="cover"
      radius="4px"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { formatDate } from '../../utils/dateUtils';
import { useRouter } from 'vue-router';

const props = defineProps<{
  article: any
}>();

const router = useRouter();

// 截断内容显示
const formatContent = computed(() => {
  if (!props.article.content) return '';
  if (props.article.content.length > 80) {
    return props.article.content.substring(0, 80) + '...';
  }
  return props.article.content;
});

// 获取难度等级文本
const getDifficultyText = computed(() => {
  return getDifficultyTextById(props.article.difficulty);
});

// 获取难度等级样式
const getDifficultyClass = computed(() => {
  return getDifficultyClassById(props.article.difficulty);
});

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

// 获取分类样式
const getCategoryStyle = computed(() => {
  const color = getCategoryColorById(props.article.category);
  return { backgroundColor: color };
});

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

// 跳转到文章详情页面
const navigateToDetail = () => {
  if (props.article && props.article.id) {
    router.push(`/daily/article/${props.article.id}`);
  }
};
</script>

<style scoped>
.article-result-item {
  display: flex;
  padding: 16px;
  border-bottom: 1px solid #ebedf0;
  background-color: #fff;
  cursor: pointer;
  transition: background-color 0.2s;
}

.article-result-item:last-child {
  border-bottom: none;
}

.article-result-item:active {
  background-color: #f2f3f5;
}

.article-info {
  flex: 1;
  overflow: hidden;
  margin-right: 12px;
}

.article-title {
  font-size: var(--font-size-lg);
  font-weight: 500;
  color: #323233;
  margin: 0 0 8px 0;
  line-height: 1.4;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  line-clamp: 1;
  -webkit-box-orient: vertical;
}

.article-summary {
  font-size: var(--font-size-md);
  color: #646566;
  margin: 0 0 12px 0;
  line-height: 1.6;
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
  align-items: center;
}

.category {
  display: inline-block;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: var(--font-size-sm);
  color: #fff;
}

.difficulty {
  display: inline-block;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: var(--font-size-sm);
}

.difficulty.easy {
  background-color: #07c160;
  color: #fff;
}

.difficulty.medium {
  background-color: #ff976a;
  color: #fff;
}

.difficulty.hard {
  background-color: #ee0a24;
  color: #fff;
}

.read-time, .publish-date {
  font-size: var(--font-size-sm);
  color: #969799;
}

.article-cover {
  width: 80px;
  height: 80px;
  flex-shrink: 0;
}
</style> 