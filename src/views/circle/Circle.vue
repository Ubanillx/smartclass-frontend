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

    <!-- 可滚动内容区域 -->
    <div class="scrollable-content">
      <!-- 内容区域 -->
      <div class="tab-content">
        <!-- 推荐内容 -->
        <div v-show="activeTab === 'recommend'" class="tab-pane">
          <div v-if="posts.length === 0" class="empty-state">
            <van-empty description="暂无内容" />
          </div>
          <div v-else>
            <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
              <div class="post-list">
                <div v-for="post in posts" :key="post.id" class="post-card" @click="viewPostDetail(post)">
                  <div class="post-header">
                    <div class="user-info">
                      <van-image
                        round
                        width="36"
                        height="36"
                        :src="post.avatar"
                        class="avatar"
                      />
                      <div class="user-details">
                        <div class="username">
                          {{ post.username }}
                          <span v-if="post.isVip" class="vip-tag">VIP</span>
                        </div>
                        <div class="post-time">今天 {{ post.time }}</div>
                      </div>
                    </div>
                  </div>
                  <div class="post-title">{{ post.title }}</div>
                  <div class="post-content">{{ post.content }}</div>
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
                    <div class="action-item" @click="toggleLike(post)">
                      <van-icon :name="post.isLiked ? 'good-job' : 'good-job-o'" :class="{'liked': post.isLiked}" />
                      <span class="count">{{ post.likes }}</span>
                    </div>
                    <div class="action-item" @click="showCommentPopup(post)">
                      <van-icon name="chat-o" />
                      <span class="count">{{ post.comments }}</span>
                    </div>
                    <div class="action-item" @click="showActionSheet(post)">
                      <van-icon name="ellipsis" />
                    </div>
                  </div>
                </div>
              </div>
            </van-pull-refresh>
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
import { ref, reactive, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { showToast } from 'vant';
import { ActionSheet } from 'vant';
import { useSettingsStore } from '../../stores/settingsStore';

interface Comment {
  id: string;
  username: string;
  avatar: string;
  content: string;
  time: string;
}

interface Post {
  id: string;
  username: string;
  isVip: boolean;
  avatar: string;
  time: string;
  title: string;
  content: string;
  likes: number;
  comments: number;
  isLiked: boolean;
  images: string[];
  commentList: Comment[];
}

const router = useRouter();
const settingsStore = useSettingsStore(); // 初始化settingsStore
const activeTab = ref('recommend'); // 默认显示推荐
const refreshing = ref(false);
const showComments = ref(false);
const commentText = ref('');
const currentPostId = ref('');
const currentComments = ref<Comment[]>([]);

// 标签页数据
const tabs = [
  { label: '推荐', value: 'recommend' },
  { label: '关注', value: 'following' },
  { label: '热榜', value: 'hot' },
  { label: '精选', value: 'selected' },
  { label: '热门', value: 'hot_topics' },
  { label: '问答', value: 'questions' },
  { label: '求职', value: 'jobs' }
];

// 假数据
const posts = ref<Post[]>([
  {
    id: '1',
    username: '404NotFound',
    isVip: true,
    avatar: 'https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg',
    time: '00:17',
    title: 'Day 14',
    content: '今天做了：很晚才开始写空间模块前端，还有部分没有写完',
    likes: 0,
    comments: 0,
    isLiked: false,
    images: [],
    commentList: []
  },
  {
    id: '2',
    username: 'Tycho',
    isVip: true,
    avatar: 'https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg',
    time: '00:16',
    title: 'Day8 2025年04月28日',
    content: '学习内容：1.不背单词复习了40个单词，预习了20个单词\n娱乐内容：...',
    likes: 0,
    comments: 0,
    isLiked: false,
    images: [
      'https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg',
      'https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg'
    ],
    commentList: []
  },
  {
    id: '3',
    username: '旭耀',
    isVip: true,
    avatar: 'https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg',
    time: '00:12',
    title: '今日学习打卡',
    content: '明天计划：...\n今天大部分时间都在看书：...',
    likes: 0,
    comments: 0,
    isLiked: false,
    images: [],
    commentList: []
  },
  {
    id: '4',
    username: '学习达人',
    isVip: false,
    avatar: 'https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg',
    time: '23:45',
    title: '分享我的学习方法',
    content: '学习一定要讲究方法，我总结了几点自己的经验：1. 番茄工作法很有效 2. 每天坚持打卡 3. 合理安排休息时间',
    likes: 12,
    comments: 5,
    isLiked: false,
    images: [],
    commentList: [
      {
        id: '1',
        username: '学习新手',
        avatar: 'https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg',
        content: '谢谢分享，很实用！',
        time: '1小时前'
      },
      {
        id: '2',
        username: '英语爱好者',
        avatar: 'https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg',
        content: '番茄工作法确实很好用',
        time: '2小时前'
      }
    ]
  },
  {
    id: '5',
    username: '英语爱好者',
    isVip: true,
    avatar: 'https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg',
    time: '22:30',
    title: '单词记忆技巧分享',
    content: '今天学习了50个新单词，分享一下我的记忆方法：联想记忆法真的很管用！',
    likes: 24,
    comments: 8,
    isLiked: false,
    images: [
      'https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg'
    ],
    commentList: [
      {
        id: '1',
        username: '单词达人',
        avatar: 'https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg',
        content: '我一直在用这个方法，效果确实很好！',
        time: '30分钟前'
      },
      {
        id: '2',
        username: '学习小白',
        avatar: 'https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg',
        content: '请问有什么具体的例子吗？',
        time: '1小时前'
      }
    ]
  }
]);

// 切换标签页
const switchTab = (tab: string) => {
  activeTab.value = tab;
};

// 下拉刷新
const onRefresh = () => {
  setTimeout(() => {
    showToast('刷新成功');
    refreshing.value = false;
  }, 1000);
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
const toggleLike = (post: Post) => {
  post.isLiked = !post.isLiked;
  if (post.isLiked) {
    post.likes++;
    showToast({
      message: '点赞成功',
      icon: 'good-job-o',
    });
  } else {
    post.likes--;
  }
};

// 显示评论弹窗
const showCommentPopup = (post: Post) => {
  currentPostId.value = post.id;
  currentComments.value = post.commentList;
  showComments.value = true;
};

// 添加评论
const addComment = () => {
  if (!commentText.value.trim()) {
    showToast('评论不能为空');
    return;
  }

  const post = posts.value.find(p => p.id === currentPostId.value);
  if (post) {
    const newComment: Comment = {
      id: Date.now().toString(),
      username: '当前用户',
      avatar: 'https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg',
      content: commentText.value,
      time: '刚刚'
    };
    post.commentList.push(newComment);
    post.comments++;
    currentComments.value = post.commentList;
    commentText.value = '';
    showToast('评论成功');
  }
};

// 显示更多操作
const showActionSheet = (post: Post) => {
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
const viewPostDetail = (post: Post) => {
  router.push(`/circle/post/${post.id}`);
};

// 模拟加载数据
onMounted(() => {
  // 这里可以添加实际的数据加载逻辑
});
</script>

<style scoped>
.circle {
  display: flex;
  flex-direction: column;
  padding-bottom: 66px;
  background-color: #f2f7fd;
  min-height: 100vh;
  position: relative;
}

.fixed-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  background-color: #f2f7fd;
  padding: 16px 16px 0;
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

.scrollable-content {
  flex: 1;
  overflow-y: auto;
  background-color: #f2f7fd;
  margin-top: 110px; /* 添加顶部边距，为固定导航腾出空间 */
  padding: 0 16px;
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
