<template>
  <div class="comment-section" @click="handleSectionClick">
    <div class="comment-header">
      <div class="comment-title">全部评论</div>
      <div class="comment-sort">
        <span 
          :class="['sort-option', { active: sortType === 'recommend' }]" 
          @click="changeSort('recommend')"
        >
          推荐
        </span>
        <span 
          :class="['sort-option', { active: sortType === 'newest' }]" 
          @click="changeSort('newest')"
        >
          最新
        </span>
      </div>
    </div>

    <!-- 评论列表 -->
    <div class="comment-list">
      <div v-if="comments.length === 0 && !loading" class="empty-comment">
        <van-empty description="暂无评论" />
      </div>
      <div v-else-if="loading && comments.length === 0" class="loading-comment">
        <van-loading type="spinner" color="#1989fa" size="24px" />
        <div class="loading-text">加载评论中...</div>
      </div>
      <template v-else>
        <CommentItem 
          v-for="comment in comments" 
          :key="comment.id" 
          :comment="comment"
          :submitting="submittingMap[comment.id]"
          :is-replying="comment.id === activeReplyCommentId"
          @reply="handleReply"
          @inline-reply="handleInlineReply"
          @load-more-replies="handleLoadMoreReplies"
          @cancel-reply="closeReplyInput"
        />
      </template>
      
      <!-- 加载更多 -->
      <div v-if="comments.length > 0" class="load-more">
        <van-button 
          v-if="!finished" 
          size="small" 
          plain 
          type="primary" 
          :loading="loading" 
          @click="loadMore"
        >
          {{ loading ? '加载中...' : '加载更多' }}
        </van-button>
        <div v-else class="load-finished">已加载全部评论</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, defineProps, defineEmits, computed, reactive, onMounted, onUnmounted } from 'vue';
import { showToast } from 'vant';
import CommentItem from './CommentItem.vue';

interface Reply {
  id: string;
  username: string;
  content: string;
  time: string;
}

interface Comment {
  id: string;
  username: string;
  avatar: string;
  content: string;
  time: string;
  location: string;
  likes: number;
  isLiked: boolean;
  isDisliked: boolean;
  replies: Reply[];
  replyCount: number;
  postId?: number;
  userId?: number;
  createTime?: string;
}

interface CommentSectionProps {
  comments: Comment[];
  loading: boolean;
  finished: boolean;
  sortType: 'recommend' | 'newest';
}

const props = withDefaults(defineProps<CommentSectionProps>(), {
  comments: () => [],
  loading: false,
  finished: false,
  sortType: 'recommend'
});

const emit = defineEmits<{
  (e: 'load-more'): void;
  (e: 'change-sort', type: 'recommend' | 'newest'): void;
  (e: 'reply', comment: Comment): void;
  (e: 'inline-reply', commentId: string, text: string): void;
  (e: 'load-more-replies', commentId: string): void;
}>();

// 跟踪哪些评论正在提交回复
const submittingMap = reactive<Record<string, boolean>>({});

// 当前正在回复的评论ID
const activeReplyCommentId = ref<string | null>(null);

// 添加全局点击事件来关闭回复框
const setupGlobalClickHandler = () => {
  document.addEventListener('click', handleGlobalClick);
};

// 移除全局点击事件
const removeGlobalClickHandler = () => {
  document.removeEventListener('click', handleGlobalClick);
};

// 全局点击事件处理程序
const handleGlobalClick = (event: MouseEvent) => {
  const target = event.target as HTMLElement;
  // 如果点击的不是评论区，且不是回复按钮或回复输入框，则关闭回复框
  if (!target.closest('.comment-section') && activeReplyCommentId.value !== null) {
    closeReplyInput();
  }
};

// 在组件挂载和卸载时设置和移除全局点击事件
onMounted(setupGlobalClickHandler);
onUnmounted(removeGlobalClickHandler);

// 关闭回复输入框
const closeReplyInput = () => {
  activeReplyCommentId.value = null;
};

// 切换评论排序方式
const changeSort = (type: 'recommend' | 'newest') => {
  // 关闭任何打开的回复框
  closeReplyInput();
  emit('change-sort', type);
};

// 加载更多评论
const loadMore = () => {
  if (props.loading || props.finished) return;
  emit('load-more');
};

// 回复评论
const handleReply = (comment: Comment) => {
  // 切换回复状态：如果当前已经在回复这条评论，则关闭回复框；否则激活
  if (activeReplyCommentId.value === comment.id) {
    closeReplyInput();
  } else {
    activeReplyCommentId.value = comment.id;
  }
};

// 处理整个评论区的点击事件，用于关闭回复框
const handleSectionClick = (event: MouseEvent) => {
  // 检查点击事件是否来自回复按钮或回复输入框
  const target = event.target as HTMLElement;
  if (target.closest('.comment-reply') || target.closest('.inline-reply-input')) {
    // 如果是回复按钮或输入框内的点击，不处理
    return;
  }
  
  // 关闭回复框
  closeReplyInput();
};

// 处理内联回复
const handleInlineReply = (commentId: string, text: string) => {
  // 设置对应评论的提交状态
  submittingMap[commentId] = true;
  
  // 发送内联回复事件到父组件
  emit('inline-reply', commentId, text);
  
  // 关闭回复框
  closeReplyInput();
  
  // 模拟提交完成后取消提交状态（实际应该由父组件调用时设置）
  setTimeout(() => {
    submittingMap[commentId] = false;
  }, 2000);
};

// 加载更多回复
const handleLoadMoreReplies = (commentId: string) => {
  emit('load-more-replies', commentId);
};
</script>

<style scoped>
.comment-section {
  flex: 1;
  background-color: white;
  margin: 16px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  /* 确保整个区域可接收点击事件 */
  min-height: 200px;
  overflow: hidden;
}

.comment-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 18px 20px 10px 20px;
  border-bottom: 1px solid #f2f3f5;
}

.comment-title {
  font-size: var(--font-size-lg);
  font-weight: 600;
  color: #323233;
}

.comment-sort {
  display: flex;
  gap: 16px;
}

.sort-option {
  font-size: var(--font-size-md);
  color: #969799;
  cursor: pointer;
}

.sort-option.active {
  color: #323233;
  font-weight: 500;
}

.comment-list {
  padding: 0 20px 12px;
}

.loading-comment {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 30px 0;
  color: #969799;
}

.loading-text {
  margin-top: 16px;
  font-size: var(--font-size-md);
}

.empty-comment {
  padding: 30px 0;
}

.load-more {
  display: flex;
  justify-content: center;
  padding: 20px 0 10px;
}

.load-more .van-button {
  border-radius: 20px;
  font-size: 14px;
  height: 36px;
  padding: 0 24px;
}

.load-finished {
  font-size: var(--font-size-sm);
  color: #969799;
  padding: 8px 0;
  text-align: center;
}
</style> 