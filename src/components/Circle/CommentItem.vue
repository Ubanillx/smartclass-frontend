<template>
  <div class="comment-item">
    <van-image
      round
      width="40"
      height="40"
      :src="comment.avatar"
      class="comment-avatar"
    />
    <div class="comment-content">
      <div class="comment-user">{{ comment.username }}</div>
      <div class="comment-text">{{ comment.content }}</div>
      <div class="comment-meta">
        <span class="comment-time">{{ comment.time }}</span>
        <span class="comment-location">{{ comment.location }}</span>
        <span class="comment-reply" @click="toggleReplyInput">回复</span>
      </div>
      
      <!-- 内联回复输入框 -->
      <InlineReplyInput
        v-if="isReplying"
        :username="comment.username"
        :submitting="submitting"
        @submit="handleReplySubmit"
        @cancel="handleCancelReply"
      />
      
      <!-- 回复区域 - 使用缩进展示 -->
      <div v-if="comment.replies && comment.replies.length > 0" class="reply-list">
        <div v-for="reply in comment.replies" :key="reply.id" class="reply-item">
          <div class="reply-content">
            <div class="reply-user">{{ reply.username }}</div>
            <div class="reply-text">{{ reply.content }}</div>
            <div class="reply-meta">
              <span class="reply-time">{{ reply.time }}</span>
            </div>
          </div>
        </div>
        <div v-if="comment.replyCount > comment.replies.length" class="more-replies" @click="handleLoadMoreReplies">
          查看更多回复 ({{ comment.replyCount }})
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';
import InlineReplyInput from './InlineReplyInput.vue';

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

interface CommentItemProps {
  comment: Comment;
  submitting?: boolean;
  isReplying?: boolean;
}

const props = withDefaults(defineProps<CommentItemProps>(), {
  submitting: false,
  isReplying: false
});

const emit = defineEmits<{
  (e: 'like', commentId: string): void;
  (e: 'dislike', commentId: string): void;
  (e: 'reply', comment: Comment): void;
  (e: 'inline-reply', commentId: string, text: string): void;
  (e: 'load-more-replies', commentId: string): void;
  (e: 'cancel-reply'): void;
}>();

// 切换回复输入框显示状态
const toggleReplyInput = () => {
  // 通知父组件处理回复状态
  emit('reply', props.comment);
};

// 处理回复提交
const handleReplySubmit = (text: string) => {
  // 发送内联回复事件
  emit('inline-reply', props.comment.id, text);
};

// 处理取消回复
const handleCancelReply = () => {
  emit('cancel-reply');
};

// 加载更多回复
const handleLoadMoreReplies = () => {
  emit('load-more-replies', props.comment.id);
};
</script>

<style scoped>
.comment-item {
  display: flex;
  margin: 18px 0 8px;
  padding: 10px 0 14px;
  border-bottom: 1px solid #f2f3f5;
  position: relative;
}

.comment-avatar {
  flex-shrink: 0;
  margin-right: 12px;
}

.comment-content {
  flex: 1;
}

.comment-user {
  font-size: var(--font-size-md);
  font-weight: 600;
  color: #323233;
  margin-bottom: 4px;
}

.comment-text {
  font-size: var(--font-size-md);
  color: #323233;
  line-height: 1.5;
  margin-bottom: 10px;
  word-break: break-word;
}

.comment-meta {
  display: flex;
  align-items: center;
  font-size: var(--font-size-sm);
  color: #b0b0b0;
  margin-bottom: 8px;
}

.comment-time, .comment-location {
  margin-right: 8px;
}

.comment-reply {
  color: #1989fa;
  cursor: pointer;
  padding: 2px 6px;
  border-radius: 10px;
  transition: background-color 0.2s;
}

.comment-reply:hover {
  background-color: rgba(25, 137, 250, 0.1);
}

/* 修改回复区域样式，实现缩进效果 */
.reply-list {
  background-color: #f7f8fa;
  padding: 12px 12px 12px 16px; /* 增加左侧内边距 */
  border-radius: 8px;
  margin-top: 10px;
  margin-left: 12px; /* 添加整体左侧缩进 */
  position: relative; /* 相对定位，用于添加左侧竖线 */
  box-shadow: inset 0 0 0 1px rgba(232, 232, 232, 0.7);
}

.reply-list::before {
  content: '';
  position: absolute;
  left: 0;
  top: 8px;
  bottom: 8px;
  width: 3px;
  background-color: #e8e8e8; /* 左侧竖线颜色 */
  border-radius: 2px;
}

.reply-item {
  margin-bottom: 12px;
  position: relative;
  padding-left: 8px; /* 增加每个回复项的左侧内边距 */
}

.reply-item::before {
  content: '';
  position: absolute;
  left: -8px;
  top: 8px;
  width: 8px;
  height: 1px;
  background-color: #e8e8e8; /* 连接线颜色 */
}

.reply-content {
  padding-left: 4px; /* 回复内容左侧内边距 */
}

.reply-user {
  font-size: var(--font-size-sm);
  font-weight: 500;
  color: #323233;
  margin-bottom: 2px;
}

.reply-text {
  font-size: var(--font-size-sm);
  color: #323233;
  line-height: 1.4;
  word-break: break-word;
}

.reply-meta {
  font-size: 12px;
  color: #969799;
  margin-top: 2px;
}

.more-replies {
  font-size: var(--font-size-sm);
  color: #1989fa;
  cursor: pointer;
  padding: 4px 8px;
  margin-left: 8px; /* 添加左侧缩进 */
  border-radius: 12px;
  display: inline-block;
  transition: background-color 0.2s;
}

.more-replies:hover {
  background-color: rgba(25, 137, 250, 0.1);
}
</style> 