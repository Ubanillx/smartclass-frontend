<!-- UserCommentList.vue -->
<template>
  <div class="user-comment-list">
    <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
      <van-list
        v-model:loading="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="loadMore"
      >
        <div v-if="commentList.length === 0 && !loading && !refreshing" class="empty-state">
          <van-empty image="search" description="暂无评论记录" />
        </div>
        
        <div v-for="comment in commentList" :key="comment.id" class="comment-item">
          <div class="comment-header">
            <van-icon name="chat-o" class="comment-icon" />
            <div class="comment-title">评论了: {{ comment.postTitle || '帖子详情' }}</div>
            <div class="comment-time">{{ formatDate(comment.createTime) }}</div>
          </div>
          
          <div class="comment-text">
            {{ comment.content }}
          </div>
          
          <div class="comment-location" v-if="comment.location">
            <van-icon name="location-o" class="location-icon" />
            <span>{{ comment.location }}</span>
          </div>
          
          <div class="comment-actions">
            <div class="action-delete" @click="confirmDeleteComment(comment)">
              <van-icon name="delete-o" class="delete-icon" />
              <span>删除</span>
            </div>
            <div class="action-view" @click="viewPostDetail(comment.postId)">
              <van-icon name="eye-o" class="view-icon" />
              <span>查看</span>
            </div>
          </div>
        </div>
      </van-list>
    </van-pull-refresh>
    
    <!-- 删除确认弹窗 -->
    <van-dialog
      v-model:show="showDeleteDialog"
      title="删除评论"
      show-cancel-button
      :before-close="handleBeforeClose"
    >
      <p class="delete-confirm">确定要删除这条评论吗？</p>
    </van-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { showToast, showLoadingToast } from 'vant';
import { PostCommentControllerService } from '../../services/services/PostCommentControllerService';
import { PostControllerService } from '../../services/services/PostControllerService';
import type { PostCommentQueryRequest } from '../../services/models/PostCommentQueryRequest';
import type { DeleteRequest } from '../../services/models/DeleteRequest';
import type { PostCommentVO } from '../../services/models/PostCommentVO';
import { useUserStore } from '../../stores/userStore';

const router = useRouter();
const userStore = useUserStore();

// 评论列表状态
const commentList = ref<Array<{
  id: number | undefined;
  content: string;
  createTime: string;
  postId: number | undefined;
  postTitle?: string;
  location?: string;
}>>([]);
const loading = ref(false);
const refreshing = ref(false);
const finished = ref(false);
const current = ref(1);
const pageSize = ref(10);

// 删除评论相关状态
const showDeleteDialog = ref(false);
const currentComment = ref<{ id: number | undefined } | null>(null);

// 初始化
onMounted(() => {
  fetchUserComments(true);
});

// 获取我的评论列表
const fetchUserComments = async (reset = false) => {
  if (reset) {
    current.value = 1;
    commentList.value = [];
    finished.value = false;
  }

  if (!userStore.userInfo?.id) {
    showToast('用户未登录');
    loading.value = false;
    refreshing.value = false;
    finished.value = true;
    return;
  }

  loading.value = true;

  try {
    const queryParams: PostCommentQueryRequest = {
      userId: userStore.userInfo.id,
      current: current.value,
      pageSize: pageSize.value,
      sortField: 'createTime',
      sortOrder: 'desc'
    };

    const result = await PostCommentControllerService.listPostCommentByPageUsingPost(queryParams);
    
    if (result.code === 0 && result.data) {
      const newComments = result.data.records || [];
      
      // 获取每条评论对应的帖子标题
      const commentsWithPostInfo = await Promise.all(newComments.map(async (comment: PostCommentVO) => {
        let postTitle = '帖子详情';
        
        if (comment.postId) {
          try {
            const postResult = await PostControllerService.getPostVoByIdUsingGet(comment.postId);
            if (postResult.code === 0 && postResult.data) {
              postTitle = postResult.data.title || '帖子详情';
            }
          } catch (error) {
            console.error('获取帖子信息失败:', error);
          }
        }
        
        // 组合位置信息
        let location = '';
        if (comment.city && comment.city.trim() !== '') {
          location = comment.city;
        } else if (comment.country && comment.country.trim() !== '') {
          location = comment.country;
        }
        
        return {
          id: comment.id,
          content: comment.content || '',
          createTime: comment.createTime || '',
          postId: comment.postId,
          postTitle,
          location
        };
      }));
      
      if (reset) {
        commentList.value = commentsWithPostInfo;
      } else {
        commentList.value = [...commentList.value, ...commentsWithPostInfo];
      }
      
      current.value++;
      finished.value = !newComments.length || commentList.value.length >= (result.data.total || 0);
    } else {
      showToast(result.message || '获取评论失败');
      finished.value = true;
    }
  } catch (error) {
    console.error('获取用户评论失败:', error);
    showToast('获取评论失败，请重试');
    finished.value = true;
  } finally {
    loading.value = false;
    refreshing.value = false;
  }
};

// 下拉刷新
const onRefresh = () => {
  fetchUserComments(true);
};

// 加载更多
const loadMore = () => {
  fetchUserComments();
};

// 查看帖子详情
const viewPostDetail = (postId?: number) => {
  if (postId) {
    router.push(`/circle/post/${postId}`);
  } else {
    showToast('无法查看帖子详情');
  }
};

// 确认删除评论
const confirmDeleteComment = (comment: { id: number | undefined }) => {
  currentComment.value = comment;
  showDeleteDialog.value = true;
};

// 处理删除弹窗关闭
const handleBeforeClose = (action: string, done: () => void) => {
  if (action === 'confirm') {
    deleteComment().then(() => {
      done();
    });
  } else {
    done();
  }
};

// 删除评论
const deleteComment = async () => {
  if (!currentComment.value?.id) {
    showToast('无法删除评论');
    return;
  }

  const loading = showLoadingToast({
    message: '删除中...',
    forbidClick: true,
  });

  try {
    const deleteRequest: DeleteRequest = {
      id: currentComment.value.id
    };

    const result = await PostCommentControllerService.deletePostCommentUsingPost(deleteRequest);
    
    if (result.code === 0 && result.data) {
      showToast('删除成功');
      // 从列表中移除已删除的评论
      commentList.value = commentList.value.filter(item => item.id !== currentComment.value?.id);
    } else {
      showToast(result.message || '删除失败');
    }
  } catch (error) {
    console.error('删除评论失败:', error);
    showToast('删除失败，请重试');
  } finally {
    loading.close();
    currentComment.value = null;
  }
};

// 日期格式化
const formatDate = (dateString?: string): string => {
  if (!dateString) return '未知时间';
  
  const date = new Date(dateString);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  
  // 一分钟内
  if (diff < 60 * 1000) {
    return '刚刚';
  }
  
  // 一小时内
  if (diff < 60 * 60 * 1000) {
    return `${Math.floor(diff / (60 * 1000))}分钟前`;
  }
  
  // 一天内
  if (diff < 24 * 60 * 60 * 1000) {
    return `${Math.floor(diff / (60 * 60 * 1000))}小时前`;
  }
  
  // 一周内
  if (diff < 7 * 24 * 60 * 60 * 1000) {
    return `${Math.floor(diff / (24 * 60 * 60 * 1000))}天前`;
  }
  
  // 超过一周，显示具体日期
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
};
</script>

<style scoped>
.user-comment-list {
  padding: 8px 0 60px;
}

.empty-state {
  padding: 40px 0;
}

.comment-item {
  position: relative;
  background-color: rgba(255, 255, 255, 0.8);
  margin-bottom: 16px;
  padding: 16px;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
  transition: all 0.3s ease;
}

.comment-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.1);
}

.comment-header {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.comment-icon {
  color: #1989fa;
  font-size: 20px;
  margin-right: 6px;
}

.comment-title {
  flex: 1;
  font-size: 14px;
  font-weight: 500;
  color: #323233;
}

.comment-time {
  font-size: 12px;
  color: #969799;
}

.comment-text {
  font-size: 15px;
  color: #323233;
  line-height: 1.5;
  margin-bottom: 12px;
  word-break: break-word;
}

.comment-location {
  display: flex;
  align-items: center;
  margin: 12px 0;
}

.location-icon {
  color: #1989fa;
  font-size: 16px;
  margin-right: 4px;
}

.comment-location span {
  font-size: 13px;
  color: #646566;
}

.comment-actions {
  display: flex;
  justify-content: flex-end;
  gap: 20px;
  margin-top: 12px;
}

.action-delete, .action-view {
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 4px 8px;
}

.action-delete {
  color: #ee0a24;
}

.action-view {
  color: #1989fa;
}

.delete-icon, .view-icon {
  font-size: 16px;
  margin-right: 4px;
}

.delete-confirm {
  padding: 16px;
  text-align: center;
  color: #646566;
}

/* 响应式调整 */
@media (max-width: 360px) {
  .comment-item {
    padding: 12px;
    margin: 10px 8px;
  }
}
</style> 