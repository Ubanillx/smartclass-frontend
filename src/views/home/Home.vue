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

<script setup lang="ts">
import { ref, markRaw, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { showToast } from 'vant';
import SearchBar from '../../components/Common/SearchBar.vue';
import {
  NoticeCard,
  AiAssistantList,
  PopularCourses,
  DailyWordCard,
  ArticleList,
} from '../../components/Home';
import {
  mockPopularCourses,
  vocabularyCategories,
  type Course,
  type Word,
  type Notice,
  type Article,
} from '../../api/mock.ts';
import { useCollectedWordsStore } from '../../stores/collectedWordsStore.ts';
import {
  AiAvatarControllerService,
  DailyWordControllerService,
  DailyWordFavourControllerService,
  DailyArticleControllerService,
  UserWordBookControllerService,
} from '../../services';
import { AnnouncementControllerService } from '../../services/services/AnnouncementControllerService.ts';
import { AnnouncementVO } from '../../services/models/AnnouncementVO.ts';
import { AnnouncementQueryRequest } from '../../services/models/AnnouncementQueryRequest.ts';
import { useUserStore } from '../../stores/userStore.ts';

// 定义类型
interface Assistant {
  id: number;
  name: string;
  description: string;
  avatar: string;
}

interface Action {
  name: string;
  icon: string;
  color: string;
}

// 使用markRaw包装组件，防止被转换为响应式对象
const PopularCoursesRaw = markRaw(PopularCourses);

const router = useRouter();
const searchText = ref('');
const showActionSheet = ref(false);
const refreshing = ref(false);
const collectedWordsStore = useCollectedWordsStore();
const userStore = useUserStore();

// 设置公告数据
const notices = ref<Notice[]>([]);

// 将后端公告数据转换为组件使用的格式
const convertAnnouncementToNotice = (announcement: AnnouncementVO): Notice => {
  return {
    id: announcement.id || 0,
    title: announcement.title || '未命名公告',
    content: announcement.content || '',
    date: announcement.createTime
      ? new Date(announcement.createTime).toLocaleDateString()
      : '',
  };
};

// 获取公告数据
const fetchNotices = async () => {
  try {
    // 创建请求参数，按创建时间倒序排列
    const queryRequest: AnnouncementQueryRequest = {
      current: 1,
      pageSize: 3, // 只获取3条
      sortField: 'createTime',
      sortOrder: 'desc', // 按时间倒序，最新的在前面
    };

    // 调用list/page/vo接口
    const response =
      await AnnouncementControllerService.listAnnouncementVoByPageUsingPost(
        queryRequest,
      );

    if (
      response.code === 0 &&
      response.data &&
      response.data.records &&
      response.data.records.length > 0
    ) {
      // 直接使用返回的记录转换为Notice格式
      notices.value = response.data.records.map(convertAnnouncementToNotice);
    } else {
      // 如果API请求失败，使用空数组
      notices.value = [];
    }
  } catch (error) {
    console.error('获取公告数据失败', error);
    notices.value = [];
  }
};

// 设置热门课程数据
const popularCourses = ref<Course[]>(mockPopularCourses);

// 筛选热门课程（选取每个学科中最热门的课程）
const filteredPopularCourses = computed(() => {
  // 获取不同的学科
  const subjects = [
    ...new Set(
      popularCourses.value.map((course) => course.subject).filter(Boolean),
    ),
  ];

  // 从每个学科中选择一个课程（按studentsCount排序）
  const topCourses = subjects
    .map((subject) => {
      const subjectCourses = popularCourses.value
        .filter((course) => course.subject === subject)
        .sort((a, b) => b.studentsCount - a.studentsCount);

      return subjectCourses[0]; // 返回该学科中最热门的课程
    })
    .filter(Boolean)
    .slice(0, 3); // 最多展示3个

  return topCourses;
});

// 构建一个空的单词对象作为初始值
const emptyWord = {
  id: 0,
  text: '',
  phonetic: '',
  translation: '',
  example: '',
  isCollected: false,
  isThumbUp: false,
  thumbCount: 0,
  likeCount: 0,
  meanings: [],
  viewCount: 0,
  collectCount: 0,
  lastViewTime: new Date().toISOString(),
  difficulty: '中级',
  category: '日常用语'
};

const dailyWord = ref(emptyWord);

// 从后端获取今日单词
const fetchDailyWord = async () => {
  try {
    const response = await DailyWordControllerService.getTodayWordUsingGet();

    if (response.code === 0 && response.data) {
      // 使用API返回的单词
      const todayWord = response.data;

      if (todayWord) {
        // 转换API返回的DailyWordVO格式为组件使用的Word格式
        const word = {
          id: todayWord.id || 0,
          text: todayWord.word || '',
          phonetic: todayWord.pronunciation || '',
          translation: todayWord.translation || '',
          example: todayWord.example || '',
          isCollected: false, // 默认未收藏，将在checkCollectedStatus中检查
          isThumbUp: false, // 默认未点赞，将在后续API中检查
          thumbCount: todayWord.likeCount || 0,
          likeCount: todayWord.likeCount || 0,
          meanings: [
            {
              partOfSpeech: todayWord.category || '',
              definition: todayWord.translation || '',
              example: todayWord.example || '',
            },
          ],
          viewCount: todayWord.viewCount || 0,
          collectCount: 0,
          lastViewTime: new Date().toISOString(),
          difficulty: convertDifficultyToText(todayWord.difficulty),
          category: todayWord.category || '日常用语',
          audioUrl: todayWord.audioUrl,
          exampleTranslation: todayWord.exampleTranslation || '',
          notes: todayWord.notes,
        };

        dailyWord.value = word;
        checkCollectedStatus();
      } else {
        console.error('后端返回的今日单词数据为空');
        // 显示错误信息给用户
        showToast('无法获取今日单词，请稍后再试');
      }
    } else {
      console.error('获取今日单词API调用失败', response);
      // 显示错误信息给用户
      showToast('获取单词数据失败，请稍后再试');
    }
  } catch (error) {
    console.error('获取今日单词数据失败', error);
    showToast('获取单词数据失败，请稍后再试');
  }
};

// 将数字难度转换为文本描述
const convertDifficultyToText = (difficulty?: number): string => {
  if (!difficulty) return '中级';

  switch (difficulty) {
    case 1:
      return '初级';
    case 2:
      return '中级';
    case 3:
      return '高级';
    default:
      return '中级';
  }
};

// 检查单词是否已收藏
const checkCollectedStatus = async () => {
  if (!dailyWord.value.id) {
    return; // 如果没有单词ID，无法进行检查
  }

  try {
    // 使用UserWordBookControllerService检查单词是否在生词本中
    const response = await UserWordBookControllerService.isWordInUserBookUsingGet(
      dailyWord.value.id
    );

    if (response.code === 0 && response.data !== undefined) {
      // 更新单词收藏状态
      dailyWord.value.isCollected = response.data;
    }
  } catch (error) {
    console.error('检查单词收藏状态失败', error);
  }
};

// 设置美文数据
const articles = ref<Article[]>([]);

// 获取今日美文数据
const fetchTodayArticles = async () => {
  try {
    const response = await DailyArticleControllerService.getTodayArticleUsingGet();

    if (response.code === 0 && response.data) {
      // 将后端数据转换为前端所需格式
      const article = response.data;
      
      // 处理标签字符串，将逗号分隔的标签转换为数组
      const tagsList = article.tags
        ? article.tags.split(',').map((tag) => tag.trim())
        : [];

      const formattedArticle = {
        id: article.id || 0,
        title: article.title || '未命名文章',
        brief: article.summary || '暂无简介',
        cover: article.coverImage ||
              'https://smart-class-1329220530.cos.ap-nanjing.myqcloud.com/user_avatar/a5c6d7e8f9b0a1c2d3e4f5a6b7c8d9e0.png',
        category: article.category || '文化',
        readTime: article.readTime || 5,
        difficulty: article.difficulty,
        content: article.content || '暂无内容',
        publishDate: article.publishDate || '',
        viewCount: article.viewCount || 0,
        likeCount: article.likeCount || 0,
        tags: tagsList,
        author: article.author || '', 
        source: article.source || '',
      };

      // 放入数组中以便组件渲染
      articles.value = [formattedArticle];
    } else {
      console.error('获取今日美文数据失败', response);
      articles.value = [];
      showToast('获取美文数据失败');
    }
  } catch (error) {
    console.error('获取今日美文数据失败', error);
    articles.value = [];
    showToast('获取美文数据失败');
  }
};

// 获取单词分类数据（使用mock.ts中的数据）
const wordCategories = ref(vocabularyCategories);

// 添加生词本分类（如果不存在）
const ensureCollectedCategory = () => {
  const collectedCategory = wordCategories.value.find(
    (category) => category.path === '/vocabulary/collected',
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
const aiAssistants = ref<Assistant[]>([]);

// 从后端获取智慧体数据
const fetchAiAssistants = async () => {
  try {
    const response = await AiAvatarControllerService.listAiAvatarUsingGet();

    if (response.code === 0 && response.data) {
      // 将后端数据转换为前端需要的格式
      aiAssistants.value = response.data.map((avatar) => ({
        id: avatar.id || 0,
        name: avatar.name || '未命名智慧体',
        description: avatar.description || '',
        avatar: avatar.avatarImgUrl || userStore.DEFAULT_USER_AVATAR,
      }));
    } else {
      // 使用默认数据作为备用
      setDefaultAiAssistants();
    }
  } catch (error) {
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
      avatar: userStore.DEFAULT_USER_AVATAR,
    },
    {
      id: 2,
      name: '口语伙伴 Mike',
      description: '日常英语对话，地道表达，场景练习',
      avatar: userStore.DEFAULT_USER_AVATAR,
    },
    {
      id: 3,
      name: '写作助手 Sarah',
      description: '作文指导，文章润色，写作技巧',
      avatar: userStore.DEFAULT_USER_AVATAR,
    },
  ];
};

// 快捷操作列表
const actions = ref<Action[]>([
  { name: '添加生词', icon: 'edit', color: '#1989fa' },
  { name: '上传笔记', icon: 'notes-o', color: '#07c160' },
  { name: '发起对话', icon: 'chat-o', color: '#ff976a' },
  { name: '分享内容', icon: 'share-o', color: '#ee0a24' },
]);

// 搜索处理
const onSearch = (text: string) => {
  // 这里添加实际的搜索逻辑
};

// 开始对话
const startChat = (assistant: Assistant) => {
  router.push(`/chat-detail/${assistant.id}`);
};

// 查看课程详情
const viewCourseDetail = (course: any) => {
  router.push({
    path: '/popular-courses',
    query: { showDetail: 'true', courseId: course.id },
  });
};

// 处理快捷操作选择
const onActionSelect = (action: Action) => {
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
const onRefresh = async () => {
  try {
    // 依次刷新所有数据，避免 Promise.all 的错误
    await fetchAiAssistants();
    await fetchNotices(); // 刷新公告数据
    await fetchDailyWord(); // 刷新今日单词数据
    await fetchTodayArticles(); // 刷新今日美文数据

    showToast('刷新成功');
  } catch (error) {
    showToast('刷新失败');
  } finally {
    refreshing.value = false;
  }
};

// 页面加载时获取数据
onMounted(() => {
  checkCollectedStatus();
  ensureCollectedCategory();
  fetchAiAssistants();
  fetchNotices(); // 获取公告数据
  fetchDailyWord(); // 获取今日单词数据
  fetchTodayArticles(); // 获取今日美文数据
});
</script>

<style scoped>
.home {
  padding: 16px;
  padding-bottom: 66px;
  background-color: #f2f7fd;
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
