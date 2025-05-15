<template>
  <div class="post-result-item" @click="$emit('click')">
    <div class="post-info">
      <h3 class="post-title">{{ post.title }}</h3>
      <p class="post-content">{{ formatContent }}</p>
      <div class="post-meta">
        <div class="tags">
          <van-tag 
            v-for="tag in post.tags" 
            :key="tag" 
            type="primary" 
            plain 
            round 
            class="tag"
          >
            {{ tag }}
          </van-tag>
        </div>
        <div class="stats">
          <span class="author">{{ post.userVO?.userName || '匿名用户' }}</span>
          <span class="time">{{ formatTime }}</span>
          <span class="likes"><van-icon name="like-o" /> {{ post.thumbNum || 0 }}</span>
          <span class="comments"><van-icon name="comment-o" /> {{ post.favourNum || 0 }}</span>
        </div>
      </div>
    </div>
    <van-image 
      v-if="post.coverUrl" 
      :src="post.coverUrl" 
      class="post-cover" 
      fit="cover"
      radius="4px"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { formatDate } from '../../utils/dateUtils';

const props = defineProps<{
  post: any
}>();

// 截断内容显示
const formatContent = computed(() => {
  if (!props.post.content) return '';
  if (props.post.content.length > 80) {
    return props.post.content.substring(0, 80) + '...';
  }
  return props.post.content;
});

// 格式化时间
const formatTime = computed(() => {
  if (!props.post.createTime) return '';
  return formatDate(props.post.createTime);
});
</script>

<style scoped>
.post-result-item {
  display: flex;
  padding: 16px;
  border-bottom: 1px solid #ebedf0;
  background-color: #fff;
  cursor: pointer;
  transition: background-color 0.2s;
}

.post-result-item:last-child {
  border-bottom: none;
}

.post-result-item:active {
  background-color: #f2f3f5;
}

.post-info {
  flex: 1;
  overflow: hidden;
  margin-right: 12px;
}

.post-title {
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

.post-content {
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

.post-meta {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.tag {
  margin-right: 6px;
}

.stats {
  display: flex;
  align-items: center;
  font-size: var(--font-size-sm);
  color: #969799;
}

.author {
  color: #1989fa;
  margin-right: 8px;
}

.time, .likes, .comments {
  margin-right: 8px;
  display: flex;
  align-items: center;
}

.likes :deep(.van-icon), .comments :deep(.van-icon) {
  font-size: 14px;
  margin-right: 2px;
}

.post-cover {
  width: 80px;
  height: 80px;
  flex-shrink: 0;
}
</style> 