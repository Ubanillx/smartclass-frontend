<template>
  <div class="circle has-tabbar">
    <!-- 固定头部区域 -->
    <div class="fixed-header">
      <!-- 页面标题区域 -->
      <div class="header">
        <div class="page-title">
          <van-icon name="friends-o" class="title-icon" />
          <span>圈子</span>
        </div>
        <div class="header-actions">
          <van-icon name="search" class="action-icon" @click="handleSearch" />
        </div>
      </div>

      <!-- 导航栏 -->
      <div class="nav-tabs">
        <div
          v-for="tab in tabs"
          :key="tab.value"
          :class="['nav-tab', { active: activeTab === tab.value }]"
          @click="switchTab(tab.value)"
        >
          {{ tab.label }}
        </div>
      </div>
    </div>

    <!-- 主要内容区域 -->
    <div class="main-content">
      <!-- 简化下拉刷新组件，与主页保持一致 -->
      <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
        <!-- 可滚动内容区域 -->
        <div class="scrollable-content" @scroll="handleScroll" ref="scrollContent">
          <!-- 内容区域 -->
          <div class="tab-content">
            <!-- 推荐内容 -->
            <div v-show="activeTab === 'recommend'" class="tab-pane">
              <div v-if="posts.length === 0" class="empty-state">
                <van-empty description="暂无内容" />
              </div>
              <div v-else>
                <div class="post-list">
                  <div v-for="post in posts" :key="post.id" class="post-card" @click="viewPostDetail(post)">
                    <div class="post-header">
                      <div class="user-info" @click.stop="viewUserProfile(post.user?.id)">
                        <van-image
                          round
                          width="36"
                          height="36"
                          :src="post.user?.userAvatar || 'https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg'"
                          class="avatar"
                        />
                        <div class="user-details">
                          <div class="username">
                            {{ post.user?.userName || '匿名用户' }}
                            <span v-if="post.user?.userRole === 'admin'" class="vip-tag">VIP</span>
                          </div>
                          <div class="post-time">{{ formatDate(post.createTime) }}</div>
                        </div>
                      </div>
                    </div>
                    <div class="post-title">{{ post.title }}</div>
                    <div class="post-content" v-html="renderMarkdown(formatContent(post.content))"></div>
                    <div v-if="post.images && post.images.length > 0" class="post-images">
                      <van-image
                        v-for="(img, index) in post.images"
                        :key="index"
                        width="100"
                        height="100"
                        :src="img"
                        radius="4px"
                        class="post-image"
                      />
                    </div>
                    <div class="post-footer">
                      <div class="action-item" @click.stop="toggleLike(post)">
                        <van-icon :name="post.hasThumb ? 'good-job' : 'good-job-o'" :class="{'liked': post.hasThumb}" />
                        <span class="count">{{ post.thumbNum || 0 }}</span>
                      </div>
                      <div class="action-item" @click.stop="showCommentPopup(post)">
                        <van-icon name="chat-o" />
                        <span class="count">{{ post.commentNum || 0 }}</span>
                      </div>
                      <div class="action-item" @click.stop="toggleFavour(post)">
                        <van-icon :name="post.hasFavour ? 'star' : 'star-o'" :class="{'favoured': post.hasFavour}" />
                        <span class="count">{{ post.favourNum || 0 }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- 关注内容 -->
            <div v-show="activeTab === 'following'" class="tab-pane">
              <div class="empty-state">
                <van-empty description="关注更多用户，获取精彩内容" />
              </div>
            </div>
            
            <!-- 其他标签页 -->
            <div v-show="activeTab !== 'recommend' && activeTab !== 'following'" class="tab-pane">
              <div class="empty-state">
                <van-empty description="内容筹备中" />
              </div>
            </div>
          </div>
        </div>
      </van-pull-refresh>
    </div>

    <!-- 发布按钮 -->
    <van-button
      class="publish-btn"
      type="primary"
      round
      icon="plus"
      @click="handlePublish"
    >
      发布
    </van-button>

    <!-- 评论弹出层 -->
    <van-popup
      v-model:show="showComments"
      position="bottom"
      round
      :style="{ height: '60%' }"
    >
      <div class="comment-popup">
        <div class="comment-header">
          <span>评论</span>
          <van-icon name="cross" @click="showComments = false" />
        </div>
        <div class="comment-list">
          <div v-if="currentComments.length === 0" class="empty-comment">
            <van-empty description="暂无评论" />
          </div>
          <div v-else v-for="comment in currentComments" :key="comment.id" class="comment-item">
            <van-image
              round
              width="32"
              height="32"
              :src="comment.avatar"
              class="comment-avatar"
            />
            <div class="comment-content">
              <div class="comment-user">{{ comment.username }}</div>
              <div class="comment-text">{{ comment.content }}</div>
              <div class="comment-time">{{ comment.time }}</div>
            </div>
          </div>
        </div>
        <div class="comment-input">
          <van-field
            v-model="commentText"
            placeholder="发表评论..."
            :border="false"
          >
            <template #button>
              <van-button size="small" type="primary" @click="addComment">发送</van-button>
            </template>
          </van-field>
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed, nextTick } from 'vue';
import { useRouter } from 'vue-router';
import { showToast, PullRefresh, Icon, Image as VanImage, Empty, Loading, Popup, Field, Button } from 'vant';
import { ActionSheet } from 'vant';
import { useSettingsStore } from '../../stores/settingsStore';
import { PostControllerService } from '../../services/services/PostControllerService';
import { PostFavourControllerService } from '../../services/services/PostFavourControllerService';
import { PostCommentControllerService } from '../../services/services/PostCommentControllerService';
import { PostThumbControllerService } from '../../services/services/PostThumbControllerService';
import type { PostVO } from '../../services/models/PostVO';
import type { PostQueryRequest } from '../../services/models/PostQueryRequest';
import type { PostFavourAddRequest } from '../../services/models/PostFavourAddRequest';
import type { PostCommentAddRequest } from '../../services/models/PostCommentAddRequest';
import type { PostCommentQueryRequest } from '../../services/models/PostCommentQueryRequest';
import type { PostCommentVO } from '../../services/models/PostCommentVO';
import type { PostThumbAddRequest } from '../../services/models/PostThumbAddRequest';
import { getClientIPWithRetry } from '../../utils/ipUtils';
import dayjs from 'dayjs';
import { marked } from 'marked';
import DOMPurify from 'dompurify';

// 扩展PostVO类型增加images属性
interface ExtendedPostVO extends PostVO {
  images?: string[];
}

interface Comment {
  id: string;
  username: string;
  avatar: string;
  content: string;
  time: string;
}

const router = useRouter();
const settingsStore = useSettingsStore(); // 初始化settingsStore
const activeTab = ref('recommend'); // 默认显示推荐
const refreshing = ref(false);
const showComments = ref(false);
const commentText = ref('');
const currentPostId = ref<number | null>(null);
const currentComments = ref<Comment[]>([]);
const posts = ref<ExtendedPostVO[]>([]); // 使用扩展的类型
const loading = ref(false);
const currentPage = ref(1);
const pageSize = ref(10);
const hasMore = ref(true);

// 新增：解决滑动冲突相关的变量
const isScrolling = ref(false);
const scrollTimeout = ref<number | null>(null);
const scrollContent = ref<HTMLElement | null>(null);

// 新增：处理滚动事件
const handleScroll = () => {
  // 设置滚动状态为true
  isScrolling.value = true;
  
  // 清除之前的定时器
  if (scrollTimeout.value !== null) {
    window.clearTimeout(scrollTimeout.value);
  }
  
  // 设置新的定时器，滚动结束后200ms恢复状态
  scrollTimeout.value = window.setTimeout(() => {
    isScrolling.value = false;
  }, 200);
  
  // 检查是否滚动到底部
  if (!loading.value && hasMore.value && scrollContent.value) {
    const { scrollTop, clientHeight, scrollHeight } = scrollContent.value;
    // 当距离底部不足50px时触发加载更多
    if (scrollTop + clientHeight >= scrollHeight - 50) {
      loadMore();
    }
  }
};

// 新增：加载更多数据
const loadMore = () => {
  if (!loading.value && hasMore.value) {
    fetchPosts(false);
  }
};

// 新增：计算属性，判断是否禁用下拉刷新
const isLoadingOrScrolling = computed(() => {
  return loading.value || isScrolling.value;
});

// 日期格式化
const formatDate = (dateString?: string) => {
  if (!dateString) return '未知时间';
  const date = dayjs(dateString);
  const now = dayjs();
  
  if (date.isSame(now, 'day')) {
    return date.format('HH:mm');
  } else if (date.isSame(now.subtract(1, 'day'), 'day')) {
    return '昨天 ' + date.format('HH:mm');
  } else if (date.isAfter(now.subtract(7, 'day'))) {
    return date.format('dddd HH:mm');
  } else {
    return date.format('YYYY-MM-DD HH:mm');
  }
};

// 标签页数据
const tabs = [
  { label: '推荐', value: 'recommend' },
  { label: '关注', value: 'following' },
  { label: '热榜', value: 'hot' },
  { label: '问答', value: 'questions' }
];

// 获取帖子数据
const fetchPosts = async (reset = false) => {
  if (reset) {
    currentPage.value = 1;
    posts.value = [];
  }
  
  if (!hasMore.value && !reset) return;
  
  loading.value = true;
  try {
    const queryParams: PostQueryRequest = {
      current: currentPage.value,
      pageSize: pageSize.value,
      sortField: 'createTime',
      sortOrder: 'descend'
    };
    
    const response = await PostControllerService.listPostVoByPageUsingPost(queryParams);
    
    if (response.code === 0 && response.data) {
      if (reset) {
        posts.value = response.data.records || [];
      } else {
        posts.value = [...posts.value, ...(response.data.records || [])];
      }
      
      currentPage.value++;
      hasMore.value = Boolean(response.data.records?.length === pageSize.value);
    } else {
      console.error('获取帖子失败:', response.message);
    }
  } catch (error) {
    console.error('获取帖子失败:', error);
  } finally {
    loading.value = false;
    refreshing.value = false;
  }
};

// 切换标签页
const switchTab = (tab: string) => {
  activeTab.value = tab;
  if (tab === 'recommend') {
    fetchPosts(true);
  }
};

// 下拉刷新
const onRefresh = async () => {
  try {
    // 刷新数据
    await fetchPosts(true);
  } catch (error) {
    console.error('刷新失败:', error);
  } finally {
    // 确保刷新状态结束
    refreshing.value = false;
  }
};

// 搜索功能
const handleSearch = () => {
  showToast('搜索功能开发中');
};

// 发布功能
const handlePublish = () => {
  router.push('/circle/post/create');
};

// 点赞功能
const toggleLike = async (post: ExtendedPostVO) => {
  if (!post.id) return;
  
  try {
    // 准备请求参数
    const thumbRequest: PostThumbAddRequest = {
      postId: post.id
    };
    
    // 发送点赞/取消点赞请求
    const response = await PostThumbControllerService.doThumbUsingPost(thumbRequest);
    
    if (response.code === 0) {
      // 更新本地状态
      post.hasThumb = !post.hasThumb;
      
      // 如果是点赞操作，点赞数+1，否则-1
      if (post.hasThumb) {
        if (post.thumbNum !== undefined) post.thumbNum += 1;
        showToast({
          message: '点赞成功',
          icon: 'good-job-o',
        });
      } else {
        if (post.thumbNum !== undefined) post.thumbNum -= 1;
      }
    } else {
      showToast('操作失败: ' + response.message);
    }
  } catch (error) {
    console.error('点赞操作失败:', error);
    showToast('操作失败，请稍后重试');
  }
};

// 收藏功能
const toggleFavour = async (post: ExtendedPostVO) => {
  if (!post.id) return;
  
  try {
    // 准备请求参数
    const favourRequest: PostFavourAddRequest = {
      postId: post.id
    };
    
    // 发送收藏/取消收藏请求
    const response = await PostFavourControllerService.doFavourUsingPost(favourRequest);
    
    if (response.code === 0) {
      // 更新本地状态
      post.hasFavour = !post.hasFavour;
      
      // 如果是收藏操作，收藏数+1，否则-1
      if (post.hasFavour) {
        if (post.favourNum !== undefined) post.favourNum += 1;
        showToast({
          message: '收藏成功',
          icon: 'star-o',
        });
      } else {
        if (post.favourNum !== undefined) post.favourNum -= 1;
      }
    } else {
      showToast('操作失败: ' + response.message);
    }
  } catch (error) {
    console.error('收藏操作失败:', error);
    showToast('操作失败，请稍后重试');
  }
};

// 显示评论弹窗
const showCommentPopup = async (post: ExtendedPostVO) => {
  currentPostId.value = post.id || null;
  
  // 清空当前评论列表并显示加载中
  currentComments.value = [];
  showComments.value = true;
  
  if (!currentPostId.value) return;
  
  try {
    // 查询评论参数
    const queryRequest: PostCommentQueryRequest = {
      postId: currentPostId.value,
      current: 1,
      pageSize: 10,
      sortField: 'createTime',
      sortOrder: 'desc'
    };
    
    // 获取评论列表
    const response = await PostCommentControllerService.listPostCommentByPageUsingPost(queryRequest);
    
    if (response.code === 0 && response.data) {
      // 转换评论格式
      currentComments.value = response.data.records?.map((comment: PostCommentVO) => ({
        id: String(comment.id || ''),
        username: comment.userVO?.userName || '匿名用户',
        avatar: comment.userVO?.userAvatar || 'https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg',
        content: comment.content || '',
        time: formatDate(comment.createTime)
      })) || [];
    } else {
      showToast('获取评论失败: ' + response.message);
    }
  } catch (error) {
    console.error('获取评论失败:', error);
    showToast('获取评论失败，请稍后重试');
  }
};

// 添加评论
const addComment = async () => {
  if (!commentText.value.trim() || !currentPostId.value) {
    showToast('评论不能为空');
    return;
  }
  
  try {
    // 获取用户IP地址
    const clientIp = await getClientIPWithRetry();
    
    // 准备评论请求数据
    const commentRequest: PostCommentAddRequest = {
      content: commentText.value.trim(),
      postId: currentPostId.value,
      clientIp: clientIp || '127.0.0.1' // 使用本地地址作为默认值
    };
    
    // 发送评论请求
    const response = await PostCommentControllerService.addPostCommentUsingPost(commentRequest);
    
    if (response.code === 0) {
      showToast('评论成功');
      commentText.value = '';
      
      // 刷新评论列表
      await showCommentPopup({ id: currentPostId.value } as ExtendedPostVO);
      
      // 更新帖子的评论数
      const post = posts.value.find(p => p.id === currentPostId.value);
      if (post && post.commentNum !== undefined) {
        post.commentNum += 1;
      }
    } else {
      showToast('评论失败: ' + response.message);
    }
  } catch (error) {
    console.error('提交评论失败:', error);
    showToast('评论失败，请稍后重试');
  }
};

// 显示更多操作
const showActionSheet = (post: ExtendedPostVO) => {
  ActionSheet.show({
    actions: [
      { name: '分享', color: '#1989fa' },
      { name: '收藏' },
      { name: '不感兴趣' },
      { name: '举报', color: '#ee0a24' }
    ],
    cancel: '取消'
  }).then((action: { name: string }) => {
    showToast(action.name);
  });
};

// 查看帖子详情
const viewPostDetail = (post: ExtendedPostVO) => {
  if (post && post.id) {
    router.push(`/circle/post/${post.id}`);
  }
};

// 查看用户个人主页
const viewUserProfile = (userId: number | undefined) => {
  if (userId) {
    router.push(`/users/${userId}`);
  }
};

// 处理Markdown内容，只显示前三行
const formatContent = (content?: string): string => {
  if (!content) return '';
  
  // 先将内容按行分割
  const contentLines = content.split('\n');
  
  // 只取前三行
  const limitedContent = contentLines.slice(0, 3).join('\n');
  
  // 如果原内容超过三行，添加省略号
  const hasMore = contentLines.length > 3;
  const displayContent = hasMore ? `${limitedContent}...` : limitedContent;
  
  return displayContent;
};

// 将Markdown转为HTML
const renderMarkdown = (content?: string): string => {
  if (!content) return '';
  
  try {
    // 使用marked.parse渲染Markdown（返回字符串）
    const rawHtml = marked.parse(content) as string;
    
    // 使用DOMPurify清理HTML
    return DOMPurify.sanitize(rawHtml);
  } catch (error) {
    console.error('Markdown渲染错误:', error);
    return content;
  }
};

// 初始化加载数据
onMounted(async () => {
  // 先加载数据
  await fetchPosts();
  
  // 使用nextTick确保DOM已完全渲染
  nextTick(() => {
    // 添加滚动事件监听
    if (scrollContent.value) {
      scrollContent.value.addEventListener('scroll', handleScroll);
    } else {
      console.warn('scrollContent元素未找到，无法添加滚动监听');
    }
  });
});
</script>

<style scoped>
.circle {
  display: flex;
  flex-direction: column;
  background-color: #f2f7fd;
  min-height: 100vh;
  position: relative;
  padding-bottom: 50px; /* 底部导航栏的高度 */
}

.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  position: relative;
  padding-top: 110px; /* 与fixed-header高度一致 */
  height: calc(100vh - 50px); /* 减去底部导航栏高度 */
}

/* 复制主页下拉刷新样式 */
:deep(.van-pull-refresh) {
  min-height: calc(100vh - 110px); /* 考虑固定头部的高度 */
}

:deep(.van-pull-refresh__track) {
  padding-bottom: 16px;
}

/* 滚动内容区域 */
.scrollable-content {
  flex: 1;
  height: 100%;
  overflow-y: auto;
  background-color: #f2f7fd;
  padding: 0 16px;
  -webkit-overflow-scrolling: touch; /* 增强iOS滚动体验 */
  overscroll-behavior-y: contain; /* 防止滚动链接到父元素 */
  position: relative;
  touch-action: pan-y; /* 优化触摸滑动 */
}

.fixed-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  background-color: #f2f7fd;
  padding: 16px 16px 0;
  height: 110px; /* 确保高度固定 */
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 12px;
  padding: 12px 12px;
}

.page-title {
  display: flex;
  align-items: center;
  font-size: var(--font-size-xl);
  font-weight: 700;
  color: #323233;
  font-family: 'Noto Sans SC', sans-serif;
}

.title-icon {
  margin-right: 6px;
  color: #1989fa;
  font-size: var(--font-size-xl);
}

.header-actions {
  display: flex;
  align-items: center;
}

.action-icon {
  font-size: 24px;
  color: #323233;
  margin-left: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s;
  opacity: 0.85;
}

.action-icon:active {
  opacity: 0.6;
  transform: scale(0.95);
}

.nav-tabs {
  display: flex;
  margin-top: 0;
  margin-bottom: 0;
  border-bottom: 1px solid #ebedf0;
  background-color: #f2f7fd;
  border-radius: 0;
  box-shadow: none;
  overflow-x: auto;
  white-space: nowrap;
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.nav-tabs::-webkit-scrollbar {
  display: none;
}

.nav-tab {
  flex-shrink: 0;
  padding: 12px 16px;
  font-size: var(--font-size-md);
  font-weight: 500;
  color: #646566;
  position: relative;
  cursor: pointer;
  transition: all 0.3s ease;
}

.nav-tab.active {
  color: #1989fa;
  font-weight: 600;
  background-color: transparent;
}

.nav-tab.active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 30%;
  height: 2px;
  background-color: #1989fa;
  border-radius: 2px 2px 0 0;
}

.tab-content {
  padding: 0;
}

.tab-pane {
  min-height: 400px;
}

.empty-state {
  margin-top: 80px;
}

.publish-btn {
  position: fixed;
  right: 16px;
  bottom: 80px;
  z-index: 999;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

/* 帖子列表样式 */
.post-list {
  padding: 16px 0;
}

.post-card {
  background-color: rgba(255, 255, 255, 0.8);
  margin-bottom: 16px;
  padding: 16px;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
  transition: all 0.3s ease;
}

.post-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.1);
}

/* 为帖子添加与主页相同的过渡动画效果 */
.post-card {
  transition: all 0.3s ease;
}

.post-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(100, 101, 102, 0.12);
}

.post-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 12px;
}

.user-info {
  display: flex;
  align-items: center;
}

.avatar {
  margin-right: 10px;
}

.user-details {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.username {
  font-size: var(--font-size-md);
  font-weight: 600;
  color: #323233;
  display: flex;
  align-items: center;
}

.vip-tag {
  display: inline-block;
  margin-left: 4px;
  padding: 0 4px;
  font-size: 12px;
  line-height: 16px;
  color: #ee0a24;
  background-color: #ffe1e1;
  border-radius: 2px;
  transform: scale(0.8);
  transform-origin: left center;
}

.post-time {
  font-size: var(--font-size-sm);
  color: #969799;
  margin-top: 2px;
}

.post-title {
  font-size: var(--font-size-lg);
  font-weight: bold;
  color: #323233;
  margin-bottom: 8px;
}

.post-content {
  font-size: var(--font-size-md);
  color: #323233;
  line-height: 1.5;
  margin-bottom: 12px;
  word-break: break-word;
  overflow: hidden;
  text-overflow: ellipsis;
  max-height: 4.5em; /* 限制最多显示3行，每行1.5倍行高 */
}

/* Markdown渲染的内容样式 */
.post-content :deep(p) {
  margin: 0 0 0.5em;
}

.post-content :deep(h1),
.post-content :deep(h2),
.post-content :deep(h3),
.post-content :deep(h4),
.post-content :deep(h5),
.post-content :deep(h6) {
  margin: 0 0 0.5em;
  font-weight: 600;
}

.post-content :deep(a) {
  color: #1989fa;
  text-decoration: none;
}

.post-content :deep(img) {
  max-width: 100%;
  border-radius: 4px;
  margin: 4px 0;
}

.post-content :deep(code) {
  background-color: rgba(0, 0, 0, 0.05);
  border-radius: 3px;
  padding: 2px 4px;
  font-family: monospace;
  font-size: 90%;
}

.post-content :deep(ul), 
.post-content :deep(ol) {
  padding-left: 20px;
  margin: 0 0 0.5em;
}

.post-content :deep(blockquote) {
  border-left: 3px solid #dfe2e5;
  padding-left: 10px;
  color: #646566;
  margin: 0 0 0.5em;
}

.post-content :deep(pre) {
  background-color: #f7f8fa;
  border-radius: 4px;
  padding: 8px;
  overflow-x: auto;
  margin: 0 0 0.5em;
}

.post-content :deep(pre code) {
  background-color: transparent;
  padding: 0;
}

.post-images {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 12px;
}

.post-image {
  object-fit: cover;
  border-radius: 8px;
  overflow: hidden;
}

.post-footer {
  display: flex;
  border-top: 1px solid #f2f3f5;
  padding-top: 12px;
  color: #969799;
}

.action-item {
  display: flex;
  align-items: center;
  margin-right: 20px;
  font-size: var(--font-size-sm);
  cursor: pointer;
}

.action-item i {
  font-size: 18px;
  margin-right: 4px;
}

.action-item .liked {
  color: #ee0a24;
}

.action-item .favoured {
  color: #ffba00;
}

.action-item .count {
  margin-left: 4px;
}

/* 评论弹窗样式 */
.comment-popup {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.comment-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  font-size: 16px;
  font-weight: 500;
  border-bottom: 1px solid #f2f3f5;
}

.comment-list {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
}

.empty-comment {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}

.comment-item {
  display: flex;
  margin-bottom: 16px;
}

.comment-avatar {
  margin-right: 12px;
  flex-shrink: 0;
}

.comment-content {
  flex: 1;
}

.comment-user {
  font-size: var(--font-size-md);
  font-weight: 500;
  color: #323233;
  margin-bottom: 4px;
}

.comment-text {
  font-size: var(--font-size-md);
  color: #323233;
  margin-bottom: 4px;
  line-height: 1.4;
}

.comment-time {
  font-size: var(--font-size-sm);
  color: #969799;
}

.comment-input {
  padding: 8px 16px;
  border-top: 1px solid #f2f3f5;
}
</style>
