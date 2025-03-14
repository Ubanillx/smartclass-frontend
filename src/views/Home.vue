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
        :courses="popularCourses"
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
      <article-list 
        :articles="articles" 
        @more="router.push('/articles')" 
      />
    </van-pull-refresh>

    <!-- 浮动加号按钮 -->
    <div class="float-button">
      <van-icon 
        name="plus" 
        size="24" 
        @click="showActionSheet = true" 
      />
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
import { ref, markRaw, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { showToast } from 'vant';
import SearchBar from '../components/SearchBar.vue';
import { 
  NoticeCard, 
  AiAssistantList, 
  PopularCourses,
  DailyWordCard, 
  ArticleList 
} from '../components/Home';

// 使用markRaw包装组件，防止被转换为响应式对象
const PopularCoursesRaw = markRaw(PopularCourses);

const router = useRouter();
const searchText = ref('');
const showActionSheet = ref(false);
const refreshing = ref(false);

// Mock 公告数据
const notices = ref([
  {
    id: 1,
    title: '新功能上线：AI 口语助手',
    date: '2024-03-15',
    content: '我们很高兴地宣布，全新的 AI 口语助手功能现已上线！这个功能将帮助您提升口语水平，提供实时发音纠正和对话练习。欢迎体验并提供反馈。'
  },
  {
    id: 2,
    title: '系统维护通知',
    date: '2024-03-14',
    content: '为了给您提供更好的服务，系统将于本周日凌晨 2:00-4:00 进行例行维护，期间可能影响部分功能的使用。给您带来的不便敬请谅解。'
  },
  {
    id: 3,
    title: '课程更新预告',
    date: '2024-03-13',
    content: '下周将更新商务英语系列课程，包含电子邮件写作、商务谈判等实用主题。敬请期待！'
  }
]);

// Mock 每日单词数据
const dailyWord = ref({
  text: 'serendipity',
  phonetic: 'ˌserənˈdɪpəti',
  translation: '意外发现美好事物的能力',
  example: 'Finding this cafe was pure serendipity.',
  isCollected: false,
  meanings: [
    {
      partOfSpeech: 'n.',
      definition: '意外发现美好事物的能力',
      example: 'The discovery of penicillin was a perfect example of serendipity.'
    }
  ]
});

// Mock 单词分类数据
const wordCategories = ref([
  {
    id: 1,
    name: '商务',
    icon: 'shop-o',
    path: '/vocabulary/business'
  },
  {
    id: 2,
    name: '日常',
    icon: 'clock-o',
    path: '/vocabulary/daily'
  },
  {
    id: 3,
    name: '考试',
    icon: 'records',
    path: '/vocabulary/exam'
  },
  {
    id: 4,
    name: '生词本',
    icon: 'bookmark-o',
    path: '/vocabulary/collected'
  }
]);

// Mock 文章数据
const articles = ref([
  {
    id: 1,
    title: 'The Power of Positive Thinking',
    brief: 'How optimism can change your life and lead to success...',
    cover: 'https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg',
    category: '励志',
    readTime: 5,
    difficulty: '初级',
    content: `<p>Positive thinking is more than just a catchphrase. It changes the way we behave. And I firmly believe that when I am positive, it not only makes me better, but it also makes those around me better.</p>
              <p>I think that's something that we all have within us...</p>`
  },
  {
    id: 2,
    title: 'A Journey Through Time',
    brief: 'Exploring the history of human civilization...',
    cover: 'https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg',
    category: '历史',
    readTime: 8,
    difficulty: '中级',
    content: '文章内容...'
  },
  {
    id: 3,
    title: 'The Future of Technology',
    brief: 'What innovations will shape our tomorrow...',
    cover: 'https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg',
    category: '科技',
    readTime: 6,
    difficulty: '高级',
    content: '文章内容...'
  }
]);

// Mock AI助手数据
const aiAssistants = ref([
  {
    id: 1,
    name: '英语教师 Emma',
    description: '专业英语教学，语法讲解，口语指导',
    avatar: 'https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg'
  },
  {
    id: 2,
    name: '口语伙伴 Mike',
    description: '日常英语对话，地道表达，场景练习',
    avatar: 'https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg'
  },
  {
    id: 3,
    name: '写作助手 Sarah',
    description: '作文指导，文章润色，写作技巧',
    avatar: 'https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg'
  }
]);

// Mock 热门课程数据
const popularCourses = ref([
  markRaw({
    id: 1,
    title: '商务英语口语进阶',
    brief: '掌握商务场景下的专业英语表达，提升职场竞争力',
    cover: 'https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg',
    tag: '热门',
    tagColor: '#ee0a24',
    level: '中级',
    duration: 45,
    studentsCount: 1280
  }),
  markRaw({
    id: 2,
    title: '雅思写作高分技巧',
    brief: '针对雅思写作常见题型的分析与解答，助你轻松突破6.5分',
    cover: 'https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg',
    tag: '推荐',
    tagColor: '#1989fa',
    level: '高级',
    duration: 60,
    studentsCount: 968
  }),
  markRaw({
    id: 3,
    title: '日常英语口语100句',
    brief: '覆盖生活中最常用的英语表达，让你轻松应对各种场景',
    cover: 'https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg',
    tag: '入门',
    tagColor: '#07c160',
    level: '初级',
    duration: 30,
    studentsCount: 2156
  })
]);

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
    query: { assistantId: assistant.id }
  });
};

// 查看课程详情
const viewCourseDetail = (course) => {
  router.push({
    path: `/course-study/${course.id}`
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
  
  // 模拟网络请求延迟
  setTimeout(() => {
    refreshing.value = false;
    showToast('刷新成功');
  }, 1000);
};

// 页面加载时获取数据
onMounted(() => {
  console.log('Home页面加载，开始获取数据');
});
</script>

<style scoped>
.home {
  padding: 16px;
  padding-bottom: 66px;
}

.search-bar {
  margin-bottom: 16px;
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
</style> 