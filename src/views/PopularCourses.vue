<template>
  <div class="popular-courses-page">
    <!-- 返回按钮 -->
    <back-button title="热门课程" />

    <!-- 主要内容区域 -->
    <div class="content-container">
      <!-- 搜索栏 -->
      <search-bar
        v-model="searchText"
        placeholder="搜索热门课程"
        @search="onSearch"
      />

      <!-- 课程分类标签 -->
      <van-tabs v-model:active="activeCategory" sticky swipeable>
        <van-tab title="全部">
          <course-list
            title="推荐课程"
            :courses="filteredCourses"
            class-name="recommended"
            @select="showCourseDetail"
          />
        </van-tab>
        <van-tab v-for="category in categories" :key="category.id" :title="category.name">
          <course-list
            :title="category.name + '课程'"
            :courses="filteredCourses"
            class-name="category-courses"
            @select="showCourseDetail"
          />
        </van-tab>
      </van-tabs>
    </div>

    <!-- 课程详情弹出层 -->
    <course-detail
      v-model="showDetailPopup"
      :course="selectedCourse"
      @close="showDetailPopup = false"
      @start="startLearning"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { showToast } from 'vant';
import SearchBar from '../components/SearchBar.vue';
import { CourseList, CourseDetail } from '../components/Course';
import { BackButton } from '../components/Common';

// 定义类型
interface CourseHighlight {
  icon: string;
  color: string;
  text: string;
}

interface Course {
  id: number;
  title: string;
  brief: string;
  cover: string;
  tag: string;
  tagColor: string;
  grade?: string;
  level: string;
  duration: number;
  studentsCount?: number;
  description?: string;
  highlights?: CourseHighlight[];
}

interface Category {
  id: number;
  name: string;
  icon: string;
}

const router = useRouter();
const searchText = ref('');
const showDetailPopup = ref(false);
const selectedCourse = ref<Course | null>(null);
const activeCategory = ref(0);
const courses = ref<Course[]>([]);
const loading = ref(true);

// 课程分类
const categories = ref<Category[]>([
  { id: 1, name: '英语', icon: 'chat-o' },
  { id: 2, name: '数学', icon: 'chart-trending-o' },
  { id: 3, name: '科学', icon: 'cluster-o' },
  { id: 4, name: '历史', icon: 'clock-o' },
  { id: 5, name: '艺术', icon: 'music-o' }
]);

// 根据分类筛选课程
const filteredCourses = computed(() => {
  if (searchText.value) {
    return courses.value.filter(course => 
      course.title.toLowerCase().includes(searchText.value.toLowerCase()) ||
      course.brief.toLowerCase().includes(searchText.value.toLowerCase())
    );
  }
  
  if (activeCategory.value === 0) {
    return courses.value;
  } else {
    const category = categories.value[activeCategory.value - 1];
    if (category) {
      return courses.value.filter(course => course.tag === category.name);
    }
    return courses.value;
  }
});

// 显示课程详情
const showCourseDetail = (course: Course) => {
  selectedCourse.value = course;
  showDetailPopup.value = true;
};

// 开始学习
const startLearning = () => {
  showDetailPopup.value = false;
  if (selectedCourse.value) {
    router.push(`/course-study/${selectedCourse.value.id}`);
  }
};

// 搜索处理
const onSearch = (text: string) => {
  searchText.value = text;
};

// 加载课程数据
const loadCourses = () => {
  loading.value = true;
  
  // 模拟异步加载
  setTimeout(() => {
    courses.value = [
      {
        id: 1,
        title: '趣味英语口语课堂',
        brief: '通过游戏和动画学习日常英语对话',
        cover: 'https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg',
        tag: '英语',
        tagColor: '#1989fa',
        grade: '三年级',
        level: '初级',
        duration: 30,
        studentsCount: 1234,
        description: '本课程通过有趣的动画和游戏互动，帮助同学们掌握日常英语口语。课程内容包括基础发音、常用对话、情景会话等，通过生动有趣的教学方式，让学习变得轻松愉快。',
        highlights: [
          { icon: 'smile-o', color: '#ff976a', text: '趣味教学' },
          { icon: 'music-o', color: '#07c160', text: '互动练习' },
          { icon: 'star-o', color: '#ffcd32', text: '奖励机制' }
        ]
      },
      {
        id: 2,
        title: '数学思维训练营',
        brief: '培养数学逻辑思维能力',
        cover: 'https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg',
        tag: '数学',
        tagColor: '#07c160',
        grade: '四年级',
        level: '中级',
        duration: 45,
        studentsCount: 856,
        description: '通过趣味数学题和实际生活案例，培养同学们的数学思维能力。课程内容包括数学思维方法、解题技巧、数学游戏等，帮助学生建立良好的数学思维习惯。',
        highlights: [
          { icon: 'bulb-o', color: '#ffcd32', text: '思维训练' },
          { icon: 'question-o', color: '#1989fa', text: '解题技巧' },
          { icon: 'gem-o', color: '#ff976a', text: '能力提升' }
        ]
      },
      {
        id: 3,
        title: '科学实验室探索',
        brief: '动手做实验，探索科学奥秘',
        cover: 'https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg',
        tag: '科学',
        tagColor: '#7232dd',
        grade: '五年级',
        level: '初级',
        duration: 40,
        studentsCount: 567,
        description: '通过有趣的科学实验，了解身边的科学现象。课程内容包括物理、化学、生物等多个领域的基础知识和实验操作，激发学生对科学的兴趣和探索精神。',
        highlights: [
          { icon: 'fire-o', color: '#ee0a24', text: '趣味实验' },
          { icon: 'eye-o', color: '#1989fa', text: '科学观察' },
          { icon: 'guide-o', color: '#07c160', text: '探索精神' }
        ]
      },
      {
        id: 4,
        title: '中国历史文化探秘',
        brief: '了解中华文明的灿烂历史',
        cover: 'https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg',
        tag: '历史',
        tagColor: '#ff976a',
        grade: '六年级',
        level: '中级',
        duration: 50,
        studentsCount: 423,
        description: '带领学生探索中国悠久的历史文化，了解中华文明的发展历程。课程内容包括重要历史事件、历史人物、文化遗产等，培养学生的历史意识和文化自信。',
        highlights: [
          { icon: 'bookmark-o', color: '#ff976a', text: '历史故事' },
          { icon: 'friends-o', color: '#1989fa', text: '人物解析' },
          { icon: 'flag-o', color: '#ee0a24', text: '文化传承' }
        ]
      },
      {
        id: 5,
        title: '创意美术工作坊',
        brief: '释放想象力，培养艺术感知',
        cover: 'https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg',
        tag: '艺术',
        tagColor: '#ee0a24',
        grade: '三年级',
        level: '初级',
        duration: 35,
        studentsCount: 689,
        description: '通过多种艺术形式，培养学生的创造力和审美能力。课程内容包括绘画、手工、设计等多种艺术表现形式，让学生在艺术创作中体验乐趣，提升艺术素养。',
        highlights: [
          { icon: 'brush-o', color: '#7232dd', text: '创意表达' },
          { icon: 'photo-o', color: '#1989fa', text: '艺术欣赏' },
          { icon: 'gift-o', color: '#ff976a', text: '手工制作' }
        ]
      },
      {
        id: 6,
        title: '商务英语口语进阶',
        brief: '掌握商务场景下的专业英语表达',
        cover: 'https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg',
        tag: '英语',
        tagColor: '#1989fa',
        grade: '高中',
        level: '高级',
        duration: 60,
        studentsCount: 345,
        description: '针对商务场景，提供专业的英语口语训练。课程内容包括商务会议、谈判、演讲等场景的英语表达，帮助学生掌握商务英语技能，提升职场竞争力。',
        highlights: [
          { icon: 'manager-o', color: '#1989fa', text: '商务场景' },
          { icon: 'chat-o', color: '#07c160', text: '口语练习' },
          { icon: 'certificate', color: '#ffcd32', text: '专业提升' }
        ]
      }
    ];
    
    loading.value = false;
  }, 1000);
};

// 组件挂载时加载数据
onMounted(() => {
  loadCourses();
});
</script>

<style scoped>
.popular-courses-page {
  min-height: 100vh;
  background-color: #f7f8fa;
  display: flex;
  flex-direction: column;
}

.content-container {
  flex: 1;
  margin-top: 8px; /* 为返回按钮留出空间 */
}

:deep(.van-tabs__wrap) {
  position: sticky;
  top: 46px;
  z-index: 2;
  background-color: #fff;
}

:deep(.van-tabs__content) {
  padding: 0 16px;
}

:deep(.van-tab) {
  font-size: var(--font-size-md);
  font-weight: 500;
  color: #323233;
}

:deep(.van-tab--active) {
  font-weight: 700;
  color: #1989fa;
}

:deep(.van-tabs__line) {
  background-color: #1989fa;
}

:deep(.recommended), :deep(.category-courses) {
  margin-top: 16px;
  margin-bottom: 16px;
}
</style> 