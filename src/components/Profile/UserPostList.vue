<template>
  <div class="user-post-list">
    <van-loading v-if="loading" color="#1989fa" vertical>加载中...</van-loading>
    <van-empty v-else-if="!postList.length" description="暂无帖子内容" />
    <div v-else class="post-list">
      <van-pull-refresh v-model="refreshing" @refresh="onRefresh" success-text="刷新成功">
        <van-list
          v-model:loading="listLoading"
          :finished="finished"
          finished-text="没有更多了"
          @load="loadMore"
        >
          <div v-for="post in postList" :key="post.id" class="post-item">
            <div class="post-card">
              <div class="post-header">
                <div class="user-avatar">
                  <img 
                    :src="post.user?.userAvatar || getDefaultAvatar()" 
                    alt="用户头像"
                    class="avatar-img"
                    @error="handleAvatarError"
                  />
                </div>
                <div class="post-info">
                  <div class="post-author">{{ post.user?.userName || '未知用户' }}</div>
                  <div class="post-time">{{ formatPostTime(post.createTime) }}</div>
                </div>
                <div class="post-actions">
                  <van-icon name="ellipsis" size="16" color="#999" />
                </div>
              </div>

              <div class="post-content" @click="viewPostDetails(post.id)">
                <div v-if="post.title" class="post-title">{{ post.title }}</div>
                <div class="post-text">{{ post.content }}</div>
              </div>

              <div v-if="post.tagList && post.tagList.length > 0" class="post-tags">
                <van-tag
                  v-for="tag in post.tagList"
                  :key="tag"
                  plain
                  type="primary"
                  class="tag-item"
                >
                  {{ tag }}
                </van-tag>
              </div>

              <div class="post-footer">
                <div class="post-stat" @click="handleThumb(post)">
                  <van-icon :name="post.hasThumb ? 'like' : 'like-o'" size="16" :color="post.hasThumb ? '#1989fa' : ''" />
                  <span :style="{color: post.hasThumb ? '#1989fa' : ''}">{{ post.thumbNum || 0 }}</span>
                </div>
                <div class="post-stat" @click="handleFavour(post)">
                  <van-icon :name="post.hasFavour ? 'star' : 'star-o'" size="16" :color="post.hasFavour ? '#ff976a' : ''" />
                  <span :style="{color: post.hasFavour ? '#ff976a' : ''}">{{ post.favourNum || 0 }}</span>
                </div>
                <div class="post-stat" @click="viewPostDetails(post.id)">
                  <van-icon name="chat-o" size="16" />
                  <span>{{ post.commentNum || 0 }}</span>
                </div>
                <div class="post-location" v-if="post.city || post.country">
                  <van-icon name="location-o" size="14" />
                  <span>{{ [post.city, post.country].filter(Boolean).join(', ') }}</span>
                </div>
              </div>
            </div>
          </div>
        </van-list>
      </van-pull-refresh>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { showToast, showSuccessToast } from 'vant';
import { PostControllerService, PostThumbControllerService, PostFavourControllerService } from '../../services';
import type { PostVO } from '../../services/models/PostVO';
import type { PostQueryRequest } from '../../services/models/PostQueryRequest';
import { useUserStore } from '../../stores/userStore';
import { useRouter } from 'vue-router';

const userStore = useUserStore();
const router = useRouter();

// 状态变量
const postList = ref<PostVO[]>([]);
const loading = ref(true);
const refreshing = ref(false);
const listLoading = ref(false);
const finished = ref(false);
const current = ref(1);
const pageSize = ref(10);

// 获取用户帖子列表
const fetchUserPosts = async (reset = false) => {
  if (reset) {
    current.value = 1;
    postList.value = [];
    finished.value = false;
  }

  try {
    if (!userStore.userInfo?.id) {
      showToast('用户未登录');
      loading.value = false;
      refreshing.value = false;
      listLoading.value = false;
      finished.value = true;
      return;
    }

    const queryParams: PostQueryRequest = {
      userId: userStore.userInfo.id,
      current: current.value,
      pageSize: pageSize.value,
      sortField: 'createTime',
      sortOrder: 'descend',
    };

    const result = await PostControllerService.listMyPostVoByPageUsingPost(queryParams);
    
    if (result.code === 0 && result.data) {
      if (reset) {
        postList.value = result.data.records || [];
      } else {
        postList.value = [...postList.value, ...(result.data.records || [])];
      }
      
      current.value++;
      finished.value = !result.data.records?.length || 
                        postList.value.length >= (result.data.total || 0);
    } else {
      showToast(result.message || '获取帖子失败');
      finished.value = true;
    }
  } catch (error) {
    console.error('获取用户帖子失败:', error);
    showToast('获取用户帖子失败，请重试');
    finished.value = true;
  } finally {
    loading.value = false;
    refreshing.value = false;
    listLoading.value = false;
  }
};

// 下拉刷新
const onRefresh = () => {
  fetchUserPosts(true);
};

// 加载更多
const loadMore = () => {
  fetchUserPosts();
};

// 获取默认头像
const getDefaultAvatar = () => {
  return userStore.DEFAULT_USER_AVATAR || 'https://img01.yzcdn.cn/vant/cat.jpeg';
};

// 处理头像加载错误
const handleAvatarError = (e: Event) => {
  if (e.target) {
    (e.target as HTMLImageElement).src = getDefaultAvatar();
  }
};

// 处理点赞
const handleThumb = async (post: PostVO) => {
  try {
    if (!userStore.userInfo?.id) {
      showToast('请先登录');
      return;
    }

    if (post.id) {
      const result = await PostThumbControllerService.doThumbUsingPost({
        postId: post.id
      });

      if (result.code === 0) {
        // 更新点赞状态
        post.hasThumb = !post.hasThumb;
        if (post.hasThumb) {
          post.thumbNum = (post.thumbNum || 0) + 1;
          showSuccessToast('点赞成功');
        } else {
          post.thumbNum = Math.max((post.thumbNum || 0) - 1, 0);
          showSuccessToast('已取消点赞');
        }
      } else {
        showToast(result.message || '操作失败');
      }
    }
  } catch (error) {
    console.error('点赞操作失败:', error);
    showToast('操作失败，请重试');
  }
};

// 处理收藏
const handleFavour = async (post: PostVO) => {
  try {
    if (!userStore.userInfo?.id) {
      showToast('请先登录');
      return;
    }

    if (post.id) {
      const result = await PostFavourControllerService.doFavourUsingPost({
        postId: post.id
      });

      if (result.code === 0) {
        // 更新收藏状态
        post.hasFavour = !post.hasFavour;
        if (post.hasFavour) {
          post.favourNum = (post.favourNum || 0) + 1;
          showSuccessToast('收藏成功');
        } else {
          post.favourNum = Math.max((post.favourNum || 0) - 1, 0);
          showSuccessToast('已取消收藏');
        }
      } else {
        showToast(result.message || '操作失败');
      }
    }
  } catch (error) {
    console.error('收藏操作失败:', error);
    showToast('操作失败，请重试');
  }
};

// 查看帖子详情
const viewPostDetails = (postId?: number) => {
  if (postId) {
    router.push(`/circle/post/${postId}`);
  }
};

// 格式化帖子时间
const formatPostTime = (timeStr?: string) => {
  if (!timeStr) return '';
  
  const postTime = new Date(timeStr);
  const now = new Date();
  const diffMs = now.getTime() - postTime.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);
  
  if (diffSec < 60) {
    return '刚刚';
  } else if (diffMin < 60) {
    return `${diffMin}分钟前`;
  } else if (diffHour < 24) {
    return `${diffHour}小时前`;
  } else if (diffDay < 30) {
    return `${diffDay}天前`;
  } else {
    return postTime.toLocaleDateString();
  }
};

// 组件挂载时获取数据
onMounted(() => {
  fetchUserPosts();
});
</script>

<style scoped>
.user-post-list {
  min-height: 300px;
}

.post-list {
  padding: 4px 0;
}

.post-item {
  margin-bottom: 12px;
}

.post-card {
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  padding: 12px;
  transition: all 0.3s ease;
}

.post-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  transform: translateY(-2px);
}

.post-header {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.user-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  overflow: hidden;
  margin-right: 8px;
  background-color: #f5f7fa;
  flex-shrink: 0;
  border: 1px solid rgba(0,0,0,0.05);
}

.avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.post-info {
  flex: 1;
  overflow: hidden;
}

.post-author {
  font-size: var(--font-size-md);
  font-weight: 500;
  color: var(--text-color-primary);
  line-height: 1.2;
}

.post-time {
  font-size: 12px;
  color: var(--text-color-secondary);
  margin-top: 2px;
}

.post-actions {
  padding: 4px;
}

.post-content {
  margin-bottom: 10px;
  cursor: pointer;
}

.post-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--text-color-primary);
  margin-bottom: 6px;
  line-height: 1.4;
}

.post-text {
  font-size: var(--font-size-md);
  color: var(--text-color-regular);
  line-height: 1.5;
  word-break: break-word;
  margin-bottom: 8px;
  /* 多行省略 */
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

.post-tags {
  display: flex;
  flex-wrap: wrap;
  margin-bottom: 10px;
}

.tag-item {
  margin-right: 6px;
  margin-bottom: 6px;
}

.post-footer {
  display: flex;
  align-items: center;
  padding-top: 8px;
  border-top: 1px solid #f5f5f5;
}

.post-stat {
  display: flex;
  align-items: center;
  margin-right: 16px;
  color: var(--text-color-secondary);
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 16px;
  transition: background-color 0.2s;
}

.post-stat:hover {
  background-color: rgba(0, 0, 0, 0.03);
}

.post-stat span {
  margin-left: 4px;
  font-size: 12px;
}

.post-location {
  display: flex;
  align-items: center;
  margin-left: auto;
  color: var(--text-color-secondary);
  font-size: 12px;
}

.post-location span {
  margin-left: 2px;
}
</style> 