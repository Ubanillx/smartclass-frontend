<template>
  <div class="home has-tabbar">
    <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
      <!-- 搜索栏 -->
      <search-bar
        v-model="searchText"
        placeholder="搜索你想要的"
        @search="onSearch"
      />

      <!-- 公告卡片 -->
      <notice-card :notices="notices" />

      <!-- AI助手列表 -->
      <ai-assistant-list
        :assistants="aiAssistants"
        @chat="startChat"
        @more="router.push('/chat?tab=intelligence')"
      />

      <!-- 热门课程模块 -->
      <component
        :is="PopularCoursesRaw"
        :courses="filteredPopularCourses"
        @select="viewCourseDetail"
        @more="router.push('/popular-courses')"
      />

      <!-- 每日单词模块 -->
      <daily-word-card
        :word="dailyWord"
        :categories="wordCategories"
        @update:word="dailyWord = $event"
        @more="router.push('/vocabulary')"
        @category-click="router.push($event.path)"
      />

      <!-- 精美文章模块 -->
      <article-list :articles="articles" @more="router.push('/articles')" />
    </van-pull-refresh>

    <!-- 浮动加号按钮 -->
    <div class="float-button">
      <van-icon name="plus" size="24" @click="showActionSheet = true" />
    </div>

    <!-- 快捷操作面板 -->
    <van-action-sheet
      v-model:show="showActionSheet"
      :actions="actions"
      cancel-text="取消"
      close-on-click-action
      @select="onActionSelect"
    />
  </div>
</template>

<script setup>
import { ref, markRaw, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { showToast } from 'vant';
import SearchBar from '../components/SearchBar.vue';
import {
  NoticeCard,
  AiAssistantList,
  PopularCourses,
  DailyWordCard,
  ArticleList,
} from '../components/Home';
import { 
  mockNotices, 
  mockPopularCourses, 
  vocabularyCategories,
  dailyWords,
  getRandomArticles,
  getRandomWord,
} from '../api/mock';
import { useCollectedWordsStore } from '../stores/collectedWordsStore';
import { AiAvatarControllerService } from '../services/services/AiAvatarControllerService.ts';

// 使用markRaw包装组件，防止被转换为响应式对象
const PopularCoursesRaw = markRaw(PopularCourses);

const router = useRouter();
const searchText = ref('');
const showActionSheet = ref(false);
const refreshing = ref(false);
const collectedWordsStore = useCollectedWordsStore();

// 设置公告数据
const notices = ref(mockNotices);

// 设置热门课程数据
const popularCourses = ref(mockPopularCourses.map(course => markRaw(course)));

// 筛选热门课程（选取每个学科中最热门的课程）
const filteredPopularCourses = computed(() => {
  // 获取不同的学科
  const subjects = [...new Set(popularCourses.value.map(course => course.subject))];
  
  // 从每个学科中选择一个课程（按studentsCount排序）
  const topCourses = subjects
    .map(subject => {
      const subjectCourses = popularCourses.value
        .filter(course => course.subject === subject)
        .sort((a, b) => b.studentsCount - a.studentsCount);
      
      return subjectCourses[0]; // 返回该学科中最热门的课程
    })
    .filter(Boolean)
    .slice(0, 3); // 最多展示3个
  
  return topCourses;
});

// 设置每日单词数据（随机获取）
const dailyWord = ref(getRandomWord());

// 检查单词是否已收藏
const checkCollectedStatus = () => {
  // 使用store的方法检查单词是否已收藏
  const isCollected = collectedWordsStore.isWordCollected(dailyWord.value.text);
  dailyWord.value.isCollected = isCollected;
};

// 设置美文数据（随机获取4篇）
const articles = ref(getRandomArticles(4));

// 获取单词分类数据（使用mock.ts中的数据）
const wordCategories = ref(vocabularyCategories);

// 添加生词本分类（如果不存在）
const ensureCollectedCategory = () => {
  const collectedCategory = wordCategories.value.find(
    (category) => category.path === '/vocabulary/collected'
  );
  
  if (!collectedCategory) {
    wordCategories.value.push({
      id: wordCategories.value.length,
      name: '生词本',
      icon: 'bookmark-o',
      path: '/vocabulary/collected',
    });
  }
};

// AI助手数据
const aiAssistants = ref([]);

// 从后端获取智慧体数据
const fetchAiAssistants = async () => {
  try {
    const response = await AiAvatarControllerService.listAllAiAvatarUsingGet();
    
    if (response.code === 0 && response.data) {
      console.log('获取到的智慧体列表:', response.data);
      
      // 将后端数据转换为前端需要的格式
      aiAssistants.value = response.data.map(avatar => ({
        id: avatar.id || 0,
        name: avatar.name || '未命名智慧体',
        description: avatar.description || '',
        avatar: avatar.avatarImgUrl || 'https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg',
      }));
    } else {
      console.error('获取智慧体列表失败:', response);
      // 使用默认数据作为备用
      setDefaultAiAssistants();
    }
  } catch (error) {
    console.error('加载智慧体信息失败:', error);
    // 使用默认数据作为备用
    setDefaultAiAssistants();
  }
};

// 设置默认的智慧体数据（当API请求失败时使用）
const setDefaultAiAssistants = () => {
  aiAssistants.value = [
    {
      id: 1,
      name: '英语教师 Emma',
      description: '专业英语教学，语法讲解，口语指导',
      avatar: 'https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg',
    },
    {
      id: 2,
      name: '口语伙伴 Mike',
      description: '日常英语对话，地道表达，场景练习',
      avatar: 'https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg',
    },
    {
      id: 3,
      name: '写作助手 Sarah',
      description: '作文指导，文章润色，写作技巧',
      avatar: 'https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg',
    },
  ];
};

// 快捷操作列表
const actions = [
  { name: '添加生词', icon: 'edit', color: '#1989fa' },
  { name: '上传笔记', icon: 'notes-o', color: '#07c160' },
  { name: '发起对话', icon: 'chat-o', color: '#ff976a' },
  { name: '分享内容', icon: 'share-o', color: '#ee0a24' },
];

// 搜索处理
const onSearch = (text) => {
  console.log('搜索:', text);
  // 这里添加实际的搜索逻辑
};

// 开始对话
const startChat = (assistant) => {
  router.push({
    path: '/chat-detail',
    query: { assistantId: assistant.id },
  });
};

// 查看课程详情
const viewCourseDetail = (course) => {
  router.push({
    path: '/popular-courses',
    query: { showDetail: 'true', courseId: course.id }
  });
};

// 处理快捷操作选择
const onActionSelect = (action) => {
  switch (action.name) {
    case '添加生词':
      router.push('/vocabulary/add');
      break;
    case '上传笔记':
      router.push('/notes/add');
      break;
    case '发起对话':
      router.push('/chat?tab=intelligence');
      break;
    case '分享内容':
      showToast('分享功能开发中');
      break;
  }
};

// 下拉刷新
const onRefresh = () => {
  console.log('下拉刷新，重新获取首页数据');

  // 重新获取随机美文
  articles.value = getRandomArticles(4);
  
  // 重新获取随机单词
  dailyWord.value = getRandomWord();
  
  // 检查单词收藏状态
  checkCollectedStatus();
  
  // 重新获取智慧体数据
  fetchAiAssistants();
  
  // 模拟网络请求延迟
  setTimeout(() => {
    refreshing.value = false;
    showToast('刷新成功');
  }, 1000);
};

// 页面加载时获取数据
onMounted(() => {
  console.log('Home页面加载，开始获取数据');
  
  // 确保有生词本分类
  ensureCollectedCategory();
  
  // 获取随机单词
  dailyWord.value = getRandomWord();
  
  // 检查单词收藏状态
  checkCollectedStatus();
  
  // 获取随机美文
  articles.value = getRandomArticles(4);
  
  // 获取智慧体数据
  fetchAiAssistants();
});
</script>

<style scoped>
.home {
  padding: 16px;
  padding-bottom: 66px;
  background-color: #F2F7FD;
}

.search-bar {
  margin-bottom: 16px;
  position: relative;
  z-index: 10;
}

.article-list {
  margin-top: 16px;
}

.float-button {
  position: fixed;
  right: 16px;
  bottom: 70px; /* 位于底部导航栏之上 */
  z-index: 999;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 50px;
  height: 50px;
  color: #fff;
  background: #1989fa;
  border-radius: 50%;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.error-container {
  padding: 40px 0;
}

:deep(.van-pull-refresh) {
  min-height: calc(100vh - 32px);
}

:deep(.van-pull-refresh__track) {
  padding-bottom: 16px;
}

/* 为圆角组件添加过渡动画效果 */
:deep(.van-cell-group) {
  transition: all 0.3s ease;
}

:deep(.van-cell-group:hover) {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(100, 101, 102, 0.12);
}
</style>
