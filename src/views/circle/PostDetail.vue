<template>
  <div class="post-detail">
    <!-- 顶部导航区域 -->
    <BackButton title="帖子详情" />
    
    <!-- 个人信息卡片 -->
    <div class="user-card-detail">
      <div class="user-profile">
        <div class="user-info">
          <van-image
            round
            width="50"
            height="50"
            :src="post.avatar"
            class="avatar"
          />
          <div class="user-details">
            <div class="username">
              {{ post.username }}
              <span v-if="post.isVip" class="vip-tag">VIP</span>
            </div>
            <div class="post-time">{{ post.time }} · {{ post.location || '未知位置' }}</div>
          </div>
        </div>
        <van-button
          class="follow-btn"
          size="small"
          :type="post.isFollowing ? 'default' : 'primary'"
          :text="post.isFollowing ? '已关注' : '关注'"
          @click="toggleFollow"
        />
      </div>
    </div>
    <!-- 帖子内容卡片 -->
    <div class="post-card-detail">
      <div class="post-content">
        <h3 class="post-title">{{ post.title }}</h3>
        <!-- 使用v-html渲染Markdown和KaTeX解析后的内容 -->
        <div class="post-text markdown-body" v-html="renderedContent"></div>
        <!-- 图片列表 -->
        <div v-if="post.images && post.images.length > 0" class="post-images">
          <van-image
            v-for="(img, index) in post.images"
            :key="index"
            width="100%"
            :src="img"
            radius="4px"
            class="post-image"
            @click="previewImage(index)"
          />
        </div>
      </div>
    </div>

    <!-- 评论提示语 -->
    <div class="comment-tip">
      <van-icon name="info-o" />
      <span>长按评论可以进行举报哦~</span>
      <van-icon name="cross" @click="dismissTip" />
    </div>

    <!-- 评论区域 -->
    <div class="comment-section">
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
        <div v-for="comment in sortedComments" :key="comment.id" class="comment-item" @touchstart="startLongPress(comment)" @touchend="cancelLongPress" @touchmove="cancelLongPress">
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
              <span class="comment-reply" @click="replyComment(comment)">回复</span>
            </div>
            
            <!-- 评论点赞区域 -->
            <div class="comment-actions">
              <div class="like-action" @click="toggleCommentLike(comment)">
                <van-icon :name="comment.isLiked ? 'good-job' : 'good-job-o'" :class="{'active': comment.isLiked}" />
                <span>{{ comment.likes || '' }}</span>
              </div>
              <div class="dislike-action" @click="toggleCommentDislike(comment)">
                <van-icon name="down" :class="{'active': comment.isDisliked}" />
              </div>
            </div>
            
            <!-- 回复区域 -->
            <div v-if="comment.replies && comment.replies.length > 0" class="reply-list">
              <div v-for="reply in comment.replies" :key="reply.id" class="reply-item">
                <div class="reply-user">{{ reply.username }}</div>
                <div class="reply-text">{{ reply.content }}</div>
                <div class="reply-meta">
                  <span class="reply-time">{{ reply.time }}</span>
                </div>
              </div>
              <div v-if="comment.replyCount > comment.replies.length" class="more-replies" @click="loadMoreReplies(comment)">
                查看更多回复 ({{ comment.replyCount }})
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 底部评论输入区域 -->
    <div class="comment-input-bar">
      <van-field
        v-model="commentText"
        placeholder="说点什么..."
        class="comment-input"
        @click="commentFocus"
      >
        <template #button>
          <div class="input-actions">
            <van-icon name="smile-o" class="emoji-icon" @click="showEmojiPicker" />
            <van-button 
              size="small" 
              :disabled="!commentText.trim()" 
              :class="['send-btn', {'send-btn-active': commentText.trim()}]"
              @click="submitComment"
            >
              发送
            </van-button>
          </div>
        </template>
      </van-field>
    </div>

    <!-- 底部表情选择弹出层 -->
    <van-popup v-model:show="showEmoji" position="bottom" :style="{ height: '30%' }">
      <div class="emoji-picker">
        <div class="emoji-list">
          <span 
            v-for="emoji in emojiList" 
            :key="emoji" 
            class="emoji-item"
            @click="selectEmoji(emoji)"
          >
            {{ emoji }}
          </span>
        </div>
      </div>
    </van-popup>

    <!-- 举报弹出层 -->
    <van-action-sheet
      v-model:show="showReportOptions"
      title="举报评论"
      cancel-text="取消"
    >
      <div class="report-options">
        <div class="report-option" v-for="option in reportOptions" :key="option" @click="reportComment(option)">
          {{ option }}
        </div>
      </div>
    </van-action-sheet>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { showToast, showImagePreview } from 'vant';
import { ActionSheet } from 'vant';
import BackButton from '../../components/Common/BackButton.vue';
import { useSettingsStore } from '../../stores/settingsStore';
import { marked } from 'marked';
import DOMPurify from 'dompurify';
import katex from 'katex';
import 'katex/dist/katex.min.css';
// 引入highlight.js和样式
import hljs from 'highlight.js/lib/core';
// 按需导入常用语言
import javascript from 'highlight.js/lib/languages/javascript';
import typescript from 'highlight.js/lib/languages/typescript';
import xml from 'highlight.js/lib/languages/xml';
import css from 'highlight.js/lib/languages/css';
import json from 'highlight.js/lib/languages/json';
import plaintext from 'highlight.js/lib/languages/plaintext';
// 不导入CSS样式，使用自定义样式
// import 'highlight.js/styles/dracula.css'; // 路径错误，改为使用自定义样式

// 注册语言
hljs.registerLanguage('javascript', javascript);
hljs.registerLanguage('js', javascript);
hljs.registerLanguage('typescript', typescript);
hljs.registerLanguage('ts', typescript);
hljs.registerLanguage('html', xml);
hljs.registerLanguage('xml', xml);
hljs.registerLanguage('css', css);
hljs.registerLanguage('json', json);
hljs.registerLanguage('plaintext', plaintext);

// 声明全局类型
declare global {
  interface Window {
    copyToClipboard: (button: HTMLButtonElement) => void;
    toggleFullscreen: (button: HTMLButtonElement) => void;
  }
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
}

interface Post {
  id: string;
  username: string;
  isVip: boolean;
  avatar: string;
  time: string;
  location: string;
  title: string;
  content: string;
  likes: number;
  comments: number;
  isLiked: boolean;
  isFollowing: boolean;
  images: string[];
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
const showReportOptions = ref(false);
const showGift = ref(false);
const selectedComment = ref<Comment | null>(null);
const longPressTimer = ref<number | null>(null);
const selectedGift = ref<Gift | null>(null);
const showTip = ref(true);

// 模拟帖子数据
const post = ref<Post>({
  id: '1',
  username: '黄豆芽配油豆腐',
  isVip: true,
  avatar: 'https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg',
  time: '4月27日 13:51',
  location: '上海',
  title: '学习数学和编程笔记分享',
  content: `这是一段 **Markdown** 格式的文本。

## 数学公式示例

行内公式: $E=mc^2$ 表示能量与质量的关系。

块级公式:

$$
\\int_{a}^{b} f(x) \\, dx = F(b) - F(a)
$$

矩阵公式:

$$
\\begin{pmatrix} 
a & b \\\\ 
c & d 
\\end{pmatrix}
$$

## 列表示例

* 项目1
* 项目2
  * 子项目A
  * 子项目B

1. 第一步
2. 第二步

## 代码示例

\`\`\`javascript
function hello() {
    console.log("Hello World!");
    return 42;
}
\`\`\`

> 这是一个引用块。
> 引用块可以有多行。
`,
  likes: 18,
  comments: 3,
  isLiked: false,
  isFollowing: false,
  images: [
    'https://fastly.jsdelivr.net/npm/@vant/assets/apple-1.jpeg'
  ]
});

// 模拟评论数据
const comments = ref<Comment[]>([
  {
    id: '1',
    username: 'Black天天',
    avatar: 'https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg',
    content: '人和蛇不合适，你去找找刘梓晨吧',
    time: '1天前',
    location: '江苏',
    likes: 35,
    isLiked: false,
    isDisliked: false,
    replies: [],
    replyCount: 0
  },
  {
    id: '2',
    username: '会做香菜（卡巴斯基）',
    avatar: 'https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg',
    content: '6',
    time: '1天前',
    location: '湖北',
    likes: 0,
    isLiked: false,
    isDisliked: false,
    replies: [],
    replyCount: 0
  },
  {
    id: '3',
    username: '哈哈哈哈哈哈哈哈哈',
    avatar: 'https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg',
    content: '去了她的主页才明白这评论有点东西🤣🤣',
    time: '1天前',
    location: '广东',
    likes: 4,
    isLiked: false,
    isDisliked: false,
    replies: [],
    replyCount: 0
  }
]);

// 模拟表情列表
const emojiList = ['😀', '😃', '😄', '😁', '😆', '😅', '😂', '🤣', '😊', '😇', '🙂', '🙃', '😉', '😌', '😍', '🥰', '😘', '😗', '😙', '😚', '😋', '😛', '😝', '😜', '🤪', '🤨', '🧐', '🤓', '😎', '🤩', '🥳', '😏'];

// 举报选项
const reportOptions = [
  '垃圾广告信息',
  '色情低俗内容',
  '政治敏感内容',
  '造谣传谣信息',
  '侵犯权益内容',
  '其他有害信息'
];

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
  if (sortType.value === 'newest') {
    return [...comments.value].sort((a, b) => {
      return new Date(b.time).getTime() - new Date(a.time).getTime();
    });
  } else {
    // 推荐模式按点赞数排序
    return [...comments.value].sort((a, b) => b.likes - a.likes);
  }
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
      { name: '复制链接' },
      { name: '举报', color: '#ee0a24' }
    ],
    cancel: '取消'
  }).then((action: { name: string }) => {
    showToast(action.name);
  });
};

// 切换点赞状态
const toggleLike = () => {
  post.value.isLiked = !post.value.isLiked;
  if (post.value.isLiked) {
    post.value.likes++;
    showToast('点赞成功');
  } else {
    post.value.likes--;
  }
};

// 切换评论排序方式
const changeSort = (type: string) => {
  sortType.value = type;
};

// 点赞评论
const toggleCommentLike = (comment: Comment) => {
  comment.isLiked = !comment.isLiked;
  if (comment.isLiked) {
    comment.likes++;
    // 如果点赞了，则取消踩
    if (comment.isDisliked) {
      comment.isDisliked = false;
    }
  } else {
    comment.likes--;
  }
};

// 踩评论
const toggleCommentDislike = (comment: Comment) => {
  comment.isDisliked = !comment.isDisliked;
  // 如果踩了，则取消点赞
  if (comment.isDisliked && comment.isLiked) {
    comment.isLiked = false;
    comment.likes--;
  }
};

// 回复评论
const replyComment = (comment: Comment) => {
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
const submitComment = () => {
  if (!commentText.value.trim()) return;
  
  // 模拟添加新评论
  const newComment: Comment = {
    id: Date.now().toString(),
    username: '当前用户',
    avatar: 'https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg',
    content: commentText.value,
    time: '刚刚',
    location: '未知',
    likes: 0,
    isLiked: false,
    isDisliked: false,
    replies: [],
    replyCount: 0
  };
  
  comments.value.unshift(newComment);
  post.value.comments++;
  commentText.value = '';
  showToast('评论成功');
  // 关闭表情选择器
  showEmoji.value = false;
};

// 查看更多回复
const loadMoreReplies = (comment: Comment) => {
  showToast('加载更多回复');
};

// 长按评论开始
const startLongPress = (comment: Comment) => {
  selectedComment.value = comment;
  longPressTimer.value = window.setTimeout(() => {
    showReportOptions.value = true;
  }, 500);
};

// 取消长按
const cancelLongPress = () => {
  if (longPressTimer.value) {
    clearTimeout(longPressTimer.value);
    longPressTimer.value = null;
  }
};

// 举报评论
const reportComment = (reason: string) => {
  showToast(`已举报：${reason}`);
  showReportOptions.value = false;
};

// 预览图片
const previewImage = (index: number) => {
  showImagePreview({
    images: post.value.images,
    startPosition: index
  });
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

// 关闭提示
const dismissTip = () => {
  showTip.value = false;
};

// 初始化 marked 渲染器，添加代码高亮和数学公式解析功能
const renderer = new marked.Renderer();

// 修改code渲染函数，使用highlight.js，添加行号
// @ts-ignore 忽略类型检查问题
renderer.code = function(code, language) {
  // 确保code是字符串
  if (typeof code !== 'string') {
    console.error('Code is not a string:', code);
    code = String(code || '');
  }
  
  // 确保language是字符串
  language = String(language || 'plaintext');
  
  // 尝试使用highlight.js进行高亮处理
  const validLanguage = hljs.getLanguage(language) ? language : 'plaintext';
  let highlightedCode;
  
  try {
    highlightedCode = hljs.highlight(code, { language: validLanguage }).value;
  } catch (error) {
    console.error('Highlight.js渲染错误:', error);
    highlightedCode = code;
  }
  
  // 为代码添加行号
  const codeLines = code.split('\n');
  const lineNumbers = codeLines.map((_: string, index: number) => `<span class="line-number">${index + 1}</span>`).join('');
  
  // 构建代码块，包含行号和复制按钮
  return `<div class="code-container hljs">
    <div class="code-header">
      <span class="code-language">${language || 'text'}</span>
      <div class="code-actions">
        <button class="copy-button" onclick="copyToClipboard(this)">复制</button>
        <button class="fullscreen-button" onclick="toggleFullscreen(this)">
          <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" stroke-width="2" fill="none">
            <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"></path>
          </svg>
        </button>
      </div>
    </div>
    <div class="code-content">
      <div class="line-numbers">${lineNumbers}</div>
      <pre class="code-block"><code class="hljs language-${validLanguage}">${highlightedCode}</code></pre>
    </div>
  </div>`;
};

// 设置marked选项
const markedOptions: any = {
  renderer,
  gfm: true,
  breaks: true,
  highlight: function(code: string, lang: string) {
    // 确保code是字符串
    if (typeof code !== 'string') {
      console.error('Highlight error: code is not a string:', code);
      code = String(code || '');
    }
    
    // 确保lang是字符串
    lang = String(lang || 'plaintext');
    
    if (lang && hljs.getLanguage(lang)) {
      try {
        return hljs.highlight(code, { language: lang }).value;
      } catch (error) {
        console.error('Highlight error:', error);
      }
    }
    return hljs.highlight(code, { language: 'plaintext' }).value;
  }
};

// 使用marked选项
marked.setOptions(markedOptions);

// 设置数学公式解析
const renderMath = (latex: string, displayMode: boolean) => {
  try {
    // 确保latex是字符串
    if (typeof latex !== 'string') {
      console.error('LaTeX is not a string:', latex);
      latex = String(latex || '');
    }
    
    return katex.renderToString(latex, {
      displayMode,
      throwOnError: false,
      output: 'html'
    });
  } catch (error) {
    console.error('KaTeX渲染错误:', error);
    return latex;
  }
};

// 特别处理数学公式
const processContent = (content: string) => {
  try {
    // 确保content是字符串
    if (typeof content !== 'string') {
      console.error('Content is not a string:', content);
      content = String(content || '');
    }
    
    let processed = content;
    
    // 处理行内公式: $E=mc^2$
    processed = processed.replace(/\$([^$\n]+?)\$/g, (match, formula) => {
      return renderMath(formula, false);
    });
    
    // 处理块级公式: $$\int_{a}^{b}$$
    processed = processed.replace(/\$\$([\s\S]+?)\$\$/g, (match, formula) => {
      return `<div class="katex-block">${renderMath(formula, true)}</div>`;
    });
    
    return processed;
  } catch (error) {
    console.error('处理内容错误:', error);
    return content || '';
  }
};

// 安全地渲染Markdown内容
const renderedContent = computed(() => {
  try {
    // 确保post.content存在且是字符串
    const content = post.value.content || '';
    if (typeof content !== 'string') {
      console.error('Post content is not a string:', content);
      return String(content);
    }
    
    // 预处理数学公式
    const processedContent = processContent(content);
    
    // 使用marked解析Markdown
    const rawHtml = marked(processedContent, markedOptions);
    
    // 确保rawHtml是字符串
    const htmlContent = typeof rawHtml === 'string' ? rawHtml : String(rawHtml);
    
    // 使用DOMPurify清理HTML，但允许数学公式需要的标签通过
    return DOMPurify.sanitize(htmlContent, {
      ADD_ATTR: ['target', 'class', 'style'],
      ADD_TAGS: ['svg', 'path', 'use'],
      USE_PROFILES: { html: true, svg: true, mathMl: true }
    });
  } catch (error) {
    console.error('Markdown渲染错误:', error);
    return post.value.content || '';
  }
});

// 页面加载完成后设置复制功能和高亮初始化
onMounted(() => {
  // 定义全局复制函数
  window.copyToClipboard = function(button: HTMLButtonElement) {
    try {
      if (!button || !(button instanceof HTMLButtonElement)) {
        console.error('Invalid button element:', button);
        return;
      }
      
      const codeContainer = button.closest('.code-container');
      if (!codeContainer) return;
      
      const codeElement = codeContainer.querySelector('code');
      if (!codeElement) return;
      
      const text = codeElement.textContent || '';
      
      // 创建临时textarea来复制文本
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      
      try {
        // 执行复制命令
        const successful = document.execCommand('copy');
        if (successful) {
          // 更改按钮文字提示已复制
          const originalText = button.textContent;
          button.textContent = '已复制';
          button.classList.add('copied');
          
          // 2秒后恢复按钮文字
          setTimeout(() => {
            button.textContent = originalText;
            button.classList.remove('copied');
          }, 2000);
        }
      } catch (err) {
        console.error('复制失败:', err);
      }
      
      // 移除临时元素
      document.body.removeChild(textarea);
    } catch (error) {
      console.error('复制功能错误:', error);
    }
  };
  
  // 定义全屏显示函数
  window.toggleFullscreen = function(button: HTMLButtonElement) {
    try {
      if (!button || !(button instanceof HTMLButtonElement)) {
        console.error('Invalid button element:', button);
        return;
      }
      
      const codeContainer = button.closest('.code-container');
      if (!codeContainer) return;
      
      codeContainer.classList.toggle('fullscreen');
      
      // 如果是全屏状态，添加点击外部区域关闭全屏的事件
      if (codeContainer.classList.contains('fullscreen')) {
        const closeHandler = (e: MouseEvent) => {
          if (e.target === codeContainer) {
            codeContainer.classList.remove('fullscreen');
            document.removeEventListener('click', closeHandler);
          }
        };
        
        setTimeout(() => {
          document.addEventListener('click', closeHandler);
        }, 100);
      }
    } catch (error) {
      console.error('全屏功能错误:', error);
    }
  };
});

// 组件卸载时清除全局函数
onUnmounted(() => {
  // 清除全局复制函数
  if (window.copyToClipboard) {
    // @ts-ignore
    window.copyToClipboard = undefined;
  }
});
</script>

<style scoped>
.post-detail {
  background: #f2f7fd;
  min-height: 100vh;
  padding-bottom: 60px;
}

.user-card-detail,
.post-card-detail {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
  margin: 16px 16px 0 16px;
  padding: 0;
  overflow: hidden;
}

.user-profile {
  padding: 20px 20px 20px 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.user-info {
  display: flex;
  align-items: center;
}

.avatar {
  margin-right: 14px;
}

.user-details {
  display: flex;
  flex-direction: column;
}

.username {
  font-size: var(--font-size-md);
  font-weight: 700;
  color: #323233;
  display: flex;
  align-items: center;
}

.vip-tag {
  display: inline-block;
  margin-left: 6px;
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
  color: #b0b0b0;
  margin-top: 4px;
}

.follow-btn {
  border-radius: 16px;
  padding: 0 18px;
  height: 32px;
  line-height: 30px;
  font-size: 14px;
}

.post-content {
  padding: 16px 20px 20px 20px;
}

.post-title {
  font-size: var(--font-size-xl);
  font-weight: bold;
  color: #323233;
  margin: 0 0 8px;
  line-height: 1.4;
}

.post-text {
  font-size: var(--font-size-md);
  color: #323233;
  line-height: 1.6;
  margin: 0 0 12px;
  white-space: pre-wrap;
}

.post-images {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: 10px;
  margin-bottom: 0;
}

.post-image {
  width: 100%;
  border-radius: 10px;
  object-fit: cover;
  cursor: pointer;
}

.comment-tip {
  display: flex;
  align-items: center;
  padding: 8px 16px;
  background-color: #f7f8fa;
  color: #969799;
  font-size: 12px;
  margin: 20px 16px 0;
  border-radius: 8px 8px 0 0;
}

.comment-tip i {
  margin-right: 4px;
}

.comment-tip i:last-child {
  margin-left: auto;
  cursor: pointer;
}

.comment-section {
  flex: 1;
  background-color: white;
  margin: 0 16px;
  border-radius: 0 0 8px 8px;
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
  padding: 0 20px;
}

.comment-item {
  display: flex;
  margin: 18px 0 8px;
  padding-bottom: 10px;
  border-bottom: 1px solid #f2f3f5;
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
  margin-bottom: 8px;
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
}

.comment-actions {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 8px;
}

.like-action, .dislike-action {
  display: flex;
  align-items: center;
  cursor: pointer;
  font-size: 13px;
  color: #969799;
}

.like-action i, .dislike-action i {
  font-size: 16px;
  margin-right: 4px;
}

.active {
  color: #ee0a24;
}

.reply-list {
  background-color: #f7f8fa;
  padding: 8px;
  border-radius: 4px;
  margin-top: 8px;
}

.reply-item {
  margin-bottom: 8px;
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
  padding: 4px 0;
}

.comment-input-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: white;
  border-top: 1px solid #f2f3f5;
  padding: 10px 16px;
  display: flex;
  align-items: center;
  z-index: 100;
}

.comment-input {
  flex: 1;
  background-color: #f7f8fa;
  border-radius: 20px;
}

.comment-input :deep(.van-field__control) {
  height: 36px;
  min-height: 36px;
}

.input-actions {
  display: flex;
  align-items: center;
  margin-left: 8px;
}

.emoji-icon {
  font-size: 24px;
  color: #969799;
  margin-right: 8px;
  cursor: pointer;
}

.send-btn {
  border-radius: 16px;
  background-color: #f2f3f5;
  color: #c8c9cc;
  border: none;
}

.send-btn-active {
  background-color: #1989fa;
  color: white;
}

.emoji-picker {
  padding: 16px;
}

.emoji-list {
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  gap: 8px;
}

.emoji-item {
  font-size: 24px;
  text-align: center;
  cursor: pointer;
  user-select: none;
  padding: 8px;
}

.emoji-item:active {
  background-color: #f2f3f5;
  border-radius: 4px;
}

.report-options {
  padding: 16px;
}

.report-option {
  padding: 12px 16px;
  font-size: 14px;
  color: #323233;
  cursor: pointer;
}

.report-option:active {
  background-color: #f2f3f5;
}

/* 添加Markdown样式 */
.markdown-body {
  line-height: 1.6;
  word-wrap: break-word;
}

.markdown-body h1, 
.markdown-body h2, 
.markdown-body h3, 
.markdown-body h4, 
.markdown-body h5, 
.markdown-body h6 {
  margin-top: 24px;
  margin-bottom: 16px;
  font-weight: 600;
  line-height: 1.25;
  color: #323233;
}

.markdown-body h1 {
  font-size: 1.8em;
  padding-bottom: 0.3em;
  border-bottom: 1px solid #eaecef;
}

.markdown-body h2 {
  font-size: 1.5em;
  padding-bottom: 0.3em;
  border-bottom: 1px solid #eaecef;
}

.markdown-body h3 {
  font-size: 1.25em;
}

.markdown-body h4 {
  font-size: 1em;
}

.markdown-body h5, .markdown-body h6 {
  font-size: 0.875em;
}

.markdown-body p {
  margin-top: 0;
  margin-bottom: 16px;
}

.markdown-body ul, .markdown-body ol {
  padding-left: 2em;
  margin-top: 0;
  margin-bottom: 16px;
}

.markdown-body li {
  margin-bottom: 0.25em;
}

.markdown-body blockquote {
  margin: 0 0 16px 0;
  padding: 0 1em;
  color: #6a737d;
  border-left: 0.25em solid #dfe2e5;
}

.markdown-body code {
  padding: 0.2em 0.4em;
  margin: 0;
  font-size: 85%;
  background-color: rgba(27,31,35,0.05);
  border-radius: 3px;
  font-family: SFMono-Regular, Consolas, "Liberation Mono", Menlo, monospace;
}

.markdown-body pre {
  word-wrap: normal;
  padding: 16px;
  overflow: auto;
  font-size: 85%;
  line-height: 1.45;
  background-color: #f6f8fa;
  border-radius: 3px;
  margin-bottom: 16px;
}

.markdown-body pre code {
  padding: 0;
  margin: 0;
  background-color: transparent;
  border: 0;
  overflow-wrap: normal;
  word-break: normal;
}

.markdown-body img {
  max-width: 100%;
  box-sizing: content-box;
  background-color: #fff;
  border-radius: 4px;
}

.markdown-body hr {
  height: 0.25em;
  padding: 0;
  margin: 24px 0;
  background-color: #e1e4e8;
  border: 0;
}

/* KaTeX公式样式 */
.katex-display {
  overflow-x: auto;
  overflow-y: hidden;
  margin: 1em 0;
}

/* 增强KaTeX公式样式 */
:deep(.katex-display) {
  overflow-x: auto;
  overflow-y: hidden;
  padding: 0.5em 0;
  background: #f9f9f9;
  border-radius: 4px;
  margin: 1em 0;
}

:deep(.katex-block) {
  overflow-x: auto;
  overflow-y: hidden;
  padding: 1em;
  background: #f9f9f9;
  border-radius: 4px;
  margin: 1em 0;
  text-align: center;
}

:deep(.katex) {
  font-size: 1.1em;
}

:deep(code) {
  background: #f6f8fa;
  padding: 3px 5px;
  border-radius: 3px;
  font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace;
}

:deep(pre) {
  margin: 1em 0;
  padding: 16px;
  overflow: auto;
  background: #f6f8fa;
  border-radius: 6px;
  line-height: 1.45;
}

:deep(pre code) {
  padding: 0;
  background: transparent;
  border-radius: 0;
  white-space: pre;
}

:deep(blockquote) {
  padding: 0 1em;
  color: #6a737d;
  border-left: 0.25em solid #dfe2e5;
  margin: 1em 0;
}

/* 代码块容器样式 - 优化效果 */
:deep(.code-container) {
  margin: 24px 0;
  border-radius: 8px;
  overflow: hidden;
  background: #1e1e2e;
  border: 1px solid #383850;
  box-shadow: 0 4px 8px rgba(0,0,0,0.2);
  position: relative;
  max-height: 500px;
  font-family: 'Consolas', 'Monaco', 'SFMono-Regular', monospace;
}

:deep(.code-container.fullscreen) {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1000;
  margin: 0;
  max-height: none;
  height: 100%;
  width: 100%;
  border-radius: 0;
  display: flex;
  flex-direction: column;
}

:deep(.fullscreen .code-content) {
  flex: 1;
  height: calc(100% - 40px);
}

:deep(.fullscreen-button) {
  padding: 4px 6px;
}

:deep(.code-header) {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 16px;
  background: #252538;
  border-bottom: 1px solid #333355;
  height: 40px;
}

:deep(.code-language) {
  text-transform: uppercase;
  font-weight: 500;
  color: #a277ff; /* 紫色 */
  font-size: 13px;
  letter-spacing: 0.5px;
}

:deep(.code-actions) {
  display: flex;
  gap: 8px;
}

:deep(.copy-button), :deep(.fullscreen-button) {
  background: #3a3a5e;
  border: none;
  border-radius: 4px;
  padding: 6px 12px;
  font-size: 12px;
  color: #eaeaea;
  cursor: pointer;
  transition: all 0.2s;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
}

:deep(.copy-button:hover), :deep(.fullscreen-button:hover) {
  background: #4a4a7c;
}

:deep(.copy-button.copied) {
  background: #50fa7b;
  color: #202030;
}

:deep(.code-content) {
  display: flex;
  overflow: auto;
  position: relative;
}

:deep(.line-numbers) {
  display: flex;
  flex-direction: column;
  padding: 16px 0;
  min-width: 40px;
  text-align: right;
  background: #252538;
  color: #5d5d8a; /* 淡紫色调 */
  user-select: none;
  font-size: 14px;
  line-height: 1.5;
}

:deep(.line-number) {
  padding: 0 12px 0 8px;
  border-right: 1px solid #333355;
  height: 21px; /* 固定行高 */
}

:deep(.code-block) {
  margin: 0;
  padding: 16px 20px;
  overflow: visible;
  flex: 1;
  font-size: 14px;
  line-height: 1.5;
}

:deep(pre.code-block) {
  background: transparent;
  color: #eaeaea;
}

:deep(pre code.hljs) {
  background: transparent;
  padding: 0;
  white-space: pre;
  display: block;
  color: #eaeaea;
}

/* 代码高亮颜色 - 现代化配色 */
:deep(.hljs-keyword) { color: #ff79c6; }
:deep(.hljs-built_in) { color: #8be9fd; }
:deep(.hljs-type) { color: #8be9fd; }
:deep(.hljs-literal) { color: #bd93f9; }
:deep(.hljs-number) { color: #bd93f9; }
:deep(.hljs-string) { color: #ffb86c; }
:deep(.hljs-comment) { color: #6272a4; }
:deep(.hljs-function) { color: #50fa7b; }
:deep(.hljs-tag) { color: #ff79c6; }
:deep(.hljs-name) { color: #50fa7b; }
:deep(.hljs-attr) { color: #8be9fd; }
:deep(.hljs-attribute) { color: #8be9fd; }
</style> 