<template>
  <PostDetail>
    <!-- 顶部导航区域 -->
    <BackButton title="帖子详情" />
    
    <!-- 加载状态 -->
    <LoadingState v-if="loading" />
    
    <template v-else>
      <!-- 个人信息卡片 -->
      <PostUserCard 
        :avatar="post.avatar || post.user?.userAvatar"
        :username="post.username || post.user?.userName"
        :is-vip="post.isVip || post.user?.userRole === 'admin'"
        :time="post.time || formatDate(post.createTime)"
        :location="post.location || '未知位置'"
        :is-following="post.isFollowing"
        :user-id="post.user?.id"
        @follow="toggleFollow"
      />
      
      <!-- 帖子内容卡片 -->
      <PostContent 
        :title="post.title || ''"
        :content="post.content || ''"
        :images="post.images || []"
        @image-preview="previewImage"
      />

      <!-- 评论区域 -->
      <CommentSection
        :comments="comments"
        :loading="commentLoading"
        :finished="commentFinished"
        :sort-type="sortType as 'recommend' | 'newest'"
        @change-sort="changeSort"
        @load-more="loadMoreComments"
        @reply="handleReplyComment"
        @inline-reply="handleInlineReply"
        @load-more-replies="handleLoadMoreReplies"
      />
    </template>

    <!-- 底部评论输入区域 -->
    <CommentInput
      :submitting="submitting"
      @submit="handleSubmitComment"
      @focus="commentFocus"
    />
  </PostDetail>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { showToast, showImagePreview } from 'vant';
import { ActionSheet } from 'vant';
import BackButton from '../../components/Common/BackButton.vue';
import { useSettingsStore } from '../../stores/settingsStore';
import { PostControllerService } from '../../services/services/PostControllerService';
import { PostCommentControllerService } from '../../services/services/PostCommentControllerService';
import { PostCommentReplyControllerService } from '../../services/services/PostCommentReplyControllerService';
import { PostThumbControllerService } from '../../services/services/PostThumbControllerService';
import type { PostVO } from '../../services/models/PostVO';
import type { PostCommentVO } from '../../services/models/PostCommentVO';
import type { PostCommentReplyVO } from '../../services/models/PostCommentReplyVO';
import type { PostCommentAddRequest } from '../../services/models/PostCommentAddRequest';
import type { PostCommentReplyAddRequest } from '../../services/models/PostCommentReplyAddRequest';
import type { PostThumbAddRequest } from '../../services/models/PostThumbAddRequest';
import { getClientIPWithRetry } from '../../utils/ipUtils';
import { 
  PostUserCard,
  PostContent,
  CommentSection,
  CommentInput,
  LoadingState,
  PostDetail
} from '../../components/Circle';

// 声明全局类型
declare global {
  // 空接口，不需要任何全局函数
}

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
  userVO?: {
    userName?: string;
    userAvatar?: string;
    userRole?: string;
  };
  city?: string;
  country?: string;
}

interface Gift {
  id: string;
  name: string;
  icon: string;
  price: number;
}

const route = useRoute();
const router = useRouter();
const settingsStore = useSettingsStore(); // 初始化settingsStore
const commentText = ref('');
const sortType = ref('recommend');
const showEmoji = ref(false);
const showGift = ref(false);
const selectedGift = ref<Gift | null>(null);
const loading = ref(false);
const postId = ref<string | null>(null); // 改为字符串类型
const submitting = ref(false); // 添加提交状态标志，防止重复提交

// 帖子数据
const post = ref<PostVO & {
  avatar?: string;
  username?: string;
  isVip?: boolean;
  time?: string;
  location?: string;
  comments?: number;
  isFollowing?: boolean;
  images?: string[];
}>({
  title: '',
  content: '',
  thumbNum: 0,
  hasThumb: false,
  user: {
    userName: '',
    userAvatar: '',
    userRole: ''
  }
});

// 评论数据
const comments = ref<Comment[]>([]);
const commentLoading = ref(false);
const commentFinished = ref(false);
const commentCurrent = ref(1);
const commentPageSize = ref(10);

// 当前回复的评论对象，用于提交回复时获取评论ID
const replyToComment = ref<Comment | null>(null);

// 模拟表情列表
const emojiList = ['😀', '😃', '😄', '😁', '😆', '😅', '😂', '🤣', '😊', '😇', '🙂', '🙃', '😉', '😌', '😍', '🥰', '😘', '😗', '😙', '😚', '😋', '😛', '😝', '😜', '🤪', '🤨', '🧐', '🤓', '😎', '🤩', '🥳', '😏'];

// 礼物列表
const giftList = [
  { id: '1', name: '点赞', icon: '👍', price: 1 },
  { id: '2', name: '鲜花', icon: '🌹', price: 5 },
  { id: '3', name: '蛋糕', icon: '🍰', price: 10 },
  { id: '4', name: '爱心', icon: '❤️', price: 20 },
  { id: '5', name: '钻石', icon: '💎', price: 50 },
  { id: '6', name: '皇冠', icon: '👑', price: 100 }
];

// 根据排序方式获取评论列表
const sortedComments = computed(() => {
  return comments.value;
});

// 返回上一页
const goBack = () => {
  router.back();
};

// 切换关注状态
const toggleFollow = () => {
  post.value.isFollowing = !post.value.isFollowing;
  showToast(post.value.isFollowing ? '已关注' : '已取消关注');
};

// 分享帖子
const sharePost = () => {
  showToast('分享功能开发中');
};

// 显示操作菜单
const showActionSheet = () => {
  ActionSheet.show({
    actions: [
      { name: '收藏', color: '#1989fa' },
      { name: '复制链接' }
    ],
    cancel: '取消'
  }).then((action: { name: string }) => {
    showToast(action.name);
  });
};

// 切换点赞状态
const toggleLike = async () => {
  if (!post.value.id) return;
  
  try {
    // 准备请求参数
    const thumbRequest: PostThumbAddRequest = {
      postId: post.value.id
    };
    
    // 发送点赞/取消点赞请求
    const response = await PostThumbControllerService.addThumbUsingPost(thumbRequest);
    
    if (response.code === 0) {
      // 更新本地状态
      post.value.hasThumb = !post.value.hasThumb;
      
      // 如果是点赞操作，点赞数+1，否则-1
      if (post.value.hasThumb) {
        if (post.value.thumbNum !== undefined) post.value.thumbNum++;
        showToast('点赞成功');
      } else {
        if (post.value.thumbNum !== undefined) post.value.thumbNum--;
      }
    } else {
      showToast('操作失败: ' + response.message);
    }
  } catch (error) {
    console.error('点赞操作失败:', error);
    showToast('操作失败，请稍后重试');
  }
};

// 切换评论排序方式
const changeSort = (type: string) => {
  sortType.value = type;
  fetchComments(true);
};

// 处理回复评论 - 用于CommentSection组件
const handleReplyComment = (comment: Comment) => {
  replyComment(comment);
};

// 处理加载更多回复 - 用于CommentSection组件
const handleLoadMoreReplies = (commentId: string) => {
  const comment = comments.value.find(c => c.id === commentId);
  if (comment) {
    loadMoreReplies(comment);
  }
};

// 处理提交评论 - 用于CommentInput组件
const handleSubmitComment = (text: string) => {
  commentText.value = text;
  submitComment();
};

// 处理内联回复评论 - 用于CommentSection组件
const handleInlineReply = async (commentId: string, text: string) => {
  if (!post.value.id) return;
  
  try {
    // 显示发送中状态提示
    const loadingToast = showToast({
      message: '发送中...',
      duration: 0,
      forbidClick: true,
      loadingType: 'spinner'
    });
    
    // 获取用户IP地址
    let clientIp = await getClientIPWithRetry();
    
    // IP地址获取失败时的处理
    if (!clientIp) {
      console.warn('无法获取用户IP地址，使用默认地址');
      clientIp = '127.0.0.1'; // 使用本地地址作为默认值
    }
    
    // 准备回复请求数据
    const replyRequest: PostCommentReplyAddRequest = {
      content: text.trim(),
      postId: post.value.id,
      commentId: Number(commentId),
      clientIp: clientIp
    };
    
    // 发送回复评论请求
    const response = await PostCommentReplyControllerService.addPostCommentReplyUsingPost(replyRequest);
    
    // 关闭加载提示
    loadingToast.close();
    
    if (response.code === 0) {
      showToast({
        message: '回复成功',
        type: 'success',
        duration: 1500
      });
      
      // 找到被回复的评论
      const comment = comments.value.find(c => c.id === commentId);
      if (comment) {
        // 刷新回复列表
        await fetchCommentReplies(comment);
      } else {
        // 未找到评论，无法刷新回复
      }
    } else {
      showToast({
        message: '回复失败: ' + response.message,
        type: 'fail'
      });
    }
  } catch (error) {
    console.error('回复评论失败:', error);
    showToast({
      message: '回复失败，请稍后重试',
      type: 'fail'
    });
  }
};

// 回复评论 - 从底部输入框回复
const replyComment = (comment: Comment) => {
  replyToComment.value = comment;
  commentText.value = `回复 @${comment.username}：`;
  // 聚焦输入框
  setTimeout(() => {
    const inputEl = document.querySelector('.comment-input input') as HTMLInputElement;
    if (inputEl) {
      inputEl.focus();
    }
  }, 100);
};

// 提交评论
const submitComment = async () => {
  // 检查评论内容是否为空或正在提交中
  if (!commentText.value.trim() || !post.value.id || submitting.value) return;
  
  // 设置提交中状态
  submitting.value = true;
  
  try {
    // 显示发送中状态提示
    const loadingToast = showToast({
      message: '发送中...',
      duration: 0,
      forbidClick: true,
      loadingType: 'spinner'
    });
    
    // 获取当前用户的地理位置信息
    const userLocation = settingsStore.location || '未知';
    
    // 获取用户IP地址
    let clientIp = await getClientIPWithRetry();
    
    // IP地址获取失败时的处理
    if (!clientIp) {
      console.warn('无法获取用户IP地址，使用默认地址');
      clientIp = '127.0.0.1'; // 使用本地地址作为默认值
    }
    
    // 判断是回复评论还是新增评论
    if (replyToComment.value) {
      // 回复评论
      const replyRequest: PostCommentReplyAddRequest = {
        content: commentText.value.trim(),
        postId: post.value.id,
        commentId: Number(replyToComment.value.id),
        clientIp: clientIp
      };
      
      // 发送回复评论请求
      const response = await PostCommentReplyControllerService.addPostCommentReplyUsingPost(replyRequest);
      
      // 关闭加载提示
      loadingToast.close();
      
      if (response.code === 0) {
        showToast({
          message: '回复成功',
          type: 'success',
          duration: 1500
        });
        commentText.value = '';
        
        // 保存当前评论引用用于刷新回复
        const currentComment = replyToComment.value;
        
        // 重置回复对象
        replyToComment.value = null;
        
        // 刷新评论回复列表（如果当前评论存在）
        if (currentComment) {
          await fetchCommentReplies(currentComment);
        }
        
        // 刷新评论列表
        await fetchComments(true);
      } else {
        showToast({
          message: '回复失败: ' + response.message,
          type: 'fail'
        });
      }
    } else {
      // 新增评论
      // 准备评论请求数据
      const commentRequest: PostCommentAddRequest = {
        content: commentText.value.trim(),
        postId: post.value.id,
        clientIp: clientIp // 添加IP地址
      };
      
      // 发送评论请求
      const response = await PostCommentControllerService.addPostCommentUsingPost(commentRequest);
      
      // 关闭加载提示
      loadingToast.close();
      
      if (response.code === 0) {
        showToast({
          message: '评论成功',
          type: 'success',
          duration: 1500
        });
        commentText.value = '';
        // 刷新评论列表
        await fetchComments(true);
      } else {
        showToast({
          message: '评论失败: ' + response.message,
          type: 'fail'
        });
      }
    }
  } catch (error) {
    console.error('提交评论失败:', error);
    showToast({
      message: '评论失败，请稍后重试',
      type: 'fail'
    });
  } finally {
    // 关闭表情选择器
    showEmoji.value = false;
    
    submitting.value = false;
  }
};

// 加载更多回复
const loadMoreReplies = async (comment: Comment) => {
  await fetchCommentReplies(comment);
};

// 获取评论回复列表
const fetchCommentReplies = async (comment: Comment) => {
  if (!comment.id) return;
  
  try {
    // 使用GET方法获取评论回复
    const response = await PostCommentReplyControllerService.listPostCommentReplyByPageUsingGet(
      Number(comment.id),  // commentId
      undefined,           // content
      1,                   // current
      10,                  // pageSize
      post.value.id,       // postId
      'createTime',        // sortField
      'desc',              // sortOrder
      undefined            // userId
    );
    
    if (response.code === 0 && response.data) {
      // 转换回复格式
      const replies = response.data.records?.map((reply: {
        id?: number;
        userVO?: { userName?: string; userAvatar?: string };
        content?: string;
        createTime?: string;
      }) => ({
        id: String(reply.id || ''),
        username: reply.userVO?.userName || '匿名用户',
        content: reply.content || '',
        time: formatDate(reply.createTime)
      })) || [];
      
      // 更新评论的回复列表
      comment.replies = replies;
      comment.replyCount = response.data.total || 0;
    } else {
      showToast('获取回复失败: ' + response.message);
    }
  } catch (error) {
    console.error('获取回复失败:', error);
    showToast('获取回复失败，请稍后重试');
  }
};

// 预览图片
const previewImage = (index: number) => {
  if (post.value.images && post.value.images.length > 0) {
    showImagePreview({
      images: post.value.images,
      startPosition: index
    });
  }
};

// 聚焦评论输入框
const commentFocus = () => {
  // 聚焦输入框
  setTimeout(() => {
    const inputEl = document.querySelector('.comment-input input') as HTMLInputElement;
    if (inputEl) {
      inputEl.focus();
    }
  }, 100);
};

// 选择表情
const selectEmoji = (emoji: string) => {
  commentText.value += emoji;
};

// 显示表情选择器
const showEmojiPicker = () => {
  showEmoji.value = true;
};

// 显示礼物选择器
const showGiftPopup = () => {
  showGift.value = true;
};

// 选择礼物
const selectGift = (gift: Gift) => {
  selectedGift.value = gift;
};

// 发送礼物
const sendGift = () => {
  if (!selectedGift.value) {
    showToast('请选择礼物');
    return;
  }
  
  showToast(`成功赠送${selectedGift.value.name}`);
  showGift.value = false;
  selectedGift.value = null;
};

// 获取帖子详情
const fetchPostDetail = async () => {
  if (!postId.value) return;
  
  loading.value = true;
  try {
    // 转换为数字类型调用API
    const response = await PostControllerService.getPostVoByIdUsingGet(Number(postId.value));
    
    if (response.code === 0 && response.data) {
      // 处理位置信息
      const locationInfo = formatLocation(response.data.country, response.data.city);
      
      post.value = { 
        ...response.data,
        avatar: response.data.user?.userAvatar || 'https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg',
        username: response.data.user?.userName || '匿名用户',
        isVip: response.data.user?.userRole === 'admin',
        time: formatDate(response.data.createTime),
        location: locationInfo,
        comments: 0,
        isFollowing: false,
        images: [] // 目前后端API中没有图片字段，使用空数组
      };
      
      // 获取评论列表
      await fetchComments();
    } else {
      showToast('获取帖子详情失败: ' + response.message);
    }
  } catch (error) {
    showToast('获取帖子详情失败，请稍后重试');
  } finally {
    loading.value = false;
  }
};

// 获取评论列表
const fetchComments = async (isRefresh = false) => {
  if (!post.value.id) return;
  
  if (isRefresh) {
    commentCurrent.value = 1;
    comments.value = [];
    commentFinished.value = false;
  }
  
  if (commentFinished.value) return;
  
  commentLoading.value = true;
  try {
    // 使用GET方法获取评论列表
    const response = await PostCommentControllerService.listPostCommentByPageUsingGet(
      undefined,                                                // content
      commentCurrent.value,                                     // current
      commentPageSize.value,                                    // pageSize
      post.value.id,                                            // postId
      sortType.value === 'newest' ? 'createTime' : undefined,   // sortField
      sortType.value === 'newest' ? 'desc' : undefined,         // sortOrder
      undefined                                                 // userId
    );
    
    if (response.code === 0 && response.data) {
      // 修复类型错误，明确指定类型
      const newComments = response.data.records?.map((comment: PostCommentVO) => transformComment(comment)) || [];
      comments.value = [...comments.value, ...newComments];
      
      commentCurrent.value++;
      commentFinished.value = comments.value.length >= (response.data.total || 0);
      
      // 更新帖子的评论总数
      post.value.comments = response.data.total || 0;
      
      // 为每条评论加载回复数据
      for (const comment of newComments) {
        if (comment.id) {
          await fetchCommentReplies(comment);
        }
      }
    } else {
      showToast('获取评论失败: ' + response.message);
    }
  } catch (error) {
    console.error('获取评论失败:', error);
    showToast('获取评论失败，请稍后重试');
  } finally {
    commentLoading.value = false;
  }
};

// 转换评论数据格式
const transformComment = (commentVO: PostCommentVO): Comment => {
  return {
    id: String(commentVO.id || ''),
    username: commentVO.userVO?.userName || '匿名用户',
    avatar: commentVO.userVO?.userAvatar || 'https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg',
    content: commentVO.content || '',
    time: formatDate(commentVO.createTime),
    location: formatLocation(commentVO.country, commentVO.city),
    likes: 0, // 后端暂未提供点赞数
    isLiked: false,
    isDisliked: false,
    replies: [], // 初始化为空数组，后续会通过fetchCommentReplies加载
    replyCount: (commentVO as any).replyNum || 0, // 尝试获取回复数量，如果不存在则默认为0
    postId: commentVO.postId,
    userId: commentVO.userId,
    createTime: commentVO.createTime,
    userVO: commentVO.userVO,
    city: commentVO.city,
    country: commentVO.country
  };
};

// 格式化位置信息
const formatLocation = (country?: string, city?: string): string => {
  // 如果有国家和城市，优先显示城市，然后显示国家
  if (city && city.trim() !== '') {
    return city;
  } else if (country && country.trim() !== '') {
    return country;
  }
  return '未知位置';
};

// 格式化日期
const formatDate = (dateString?: string) => {
  if (!dateString) return '未知时间';
  
  try {
    // 解析ISO格式的日期字符串
    const date = new Date(dateString);
    
    // 检查日期是否有效
    if (isNaN(date.getTime())) {
      return '无效时间';
    }
    
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const dateDay = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    
    // 格式化小时和分钟
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const timeStr = `${hours}:${minutes}`;
    
    // 今天
    if (dateDay.getTime() === today.getTime()) {
      return `今天 ${timeStr}`;
    }
    
    // 昨天
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    if (dateDay.getTime() === yesterday.getTime()) {
      return `昨天 ${timeStr}`;
    }
    
    // 一周内
    const oneWeekAgo = new Date(today);
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    if (dateDay >= oneWeekAgo) {
      const weekday = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'][date.getDay()];
      return `${weekday} ${timeStr}`;
    }
    
    // 其他时间
    return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日 ${timeStr}`;
  } catch (error) {
    console.error('时间格式化错误:', error, dateString);
    return '时间格式错误';
  }
};

// 页面加载完成后设置复制功能和高亮初始化
onMounted(() => {
  // 获取路由参数中的帖子ID
  const routeId = route.params.id;
  
  if (routeId) {
    try {
      // 直接使用字符串ID，不转换为数字
      postId.value = routeId as string;
      // 检查是否为有效ID格式
      if (!/^\d+$/.test(postId.value)) {
        showToast('无效的帖子ID');
        router.back();
        return;
      }
      fetchPostDetail();
    } catch (error) {
      showToast('帖子ID格式错误');
      router.back();
    }
  } else {
    showToast('缺少帖子ID参数');
    router.back();
  }
  
  // 获取用户位置信息
  getUserLocation();
});

// 获取用户位置信息 - 已移除不安全的地理位置API调用
const getUserLocation = () => {
  // 使用默认位置或IP定位替代浏览器地理位置API
  settingsStore.setLocation('未知位置');
};

// 移除了模拟获取位置信息的API调用

// 加载更多评论
const loadMoreComments = () => {
  if (commentLoading.value || commentFinished.value) return;
  fetchComments();
};
</script>

<style scoped>
/* 所有样式已移动到各组件中 */
</style> 