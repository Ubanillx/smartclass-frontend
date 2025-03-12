<template>
  <div class="courses has-tabbar">
    <!-- 搜索栏 -->
    <search-bar
      v-model="searchText"
      placeholder="搜索课程"
      @search="onSearch"
    />

    <!-- 课程分类 -->
    <course-categories
      :categories="categories"
      :active-category="activeCategory"
      @select="selectCategory"
    />

    <!-- 推荐课程 -->
    <course-list
      v-if="activeCategory === 0"
      title="热门推荐"
      :courses="recommendedCourses"
      show-more
      class-name="recommended"
      @select="showCourseDetail"
      @more="router.push('/courses/all')"
    />

    <!-- 学科课程列表 -->
    <course-list
      v-else
      :title="getActiveCategoryName()"
      :courses="filteredCourses"
      class-name="subject-courses"
      @select="showCourseDetail"
    >
      <template #right-icon>
        <van-dropdown-menu>
          <van-dropdown-item v-model="gradeValue" :options="gradeOptions" />
        </van-dropdown-menu>
      </template>
    </course-list>

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
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { showToast } from 'vant';
import SearchBar from '../components/SearchBar.vue';
import { CourseCategories, CourseList, CourseDetail } from '../components/Course';

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
  path: string;
}

const router = useRouter();
const searchText = ref('');
const showDetailPopup = ref(false);
const selectedCourse = ref<Course | null>(null);
const activeCategory = ref(0);
const gradeValue = ref(0);

// 年级选项
const gradeOptions = [
  { text: '全部年级', value: 0 },
  { text: '一年级', value: 1 },
  { text: '二年级', value: 2 },
  { text: '三年级', value: 3 },
  { text: '四年级', value: 4 },
  { text: '五年级', value: 5 },
  { text: '六年级', value: 6 }
];

// 课程分类
const categories = ref<Category[]>([
  {
    id: 0,
    name: '推荐',
    icon: 'star',
    path: '/courses/recommended'
  },
  {
    id: 1,
    name: '语文',
    icon: 'edit',
    path: '/courses/chinese'
  },
  {
    id: 2,
    name: '数学',
    icon: 'points',
    path: '/courses/math'
  },
  {
    id: 3,
    name: '英语',
    icon: 'smile',
    path: '/courses/english'
  },
  {
    id: 4,
    name: '科学',
    icon: 'bulb-o',
    path: '/courses/science'
  }
]);

// Mock 推荐课程数据
const recommendedCourses = ref<Course[]>([
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
    description: '本课程通过有趣的动画和游戏互动，帮助同学们掌握日常英语口语...',
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
    description: '通过趣味数学题和实际生活案例，培养同学们的数学思维能力...'
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
    description: '通过有趣的科学实验，了解身边的科学现象...'
  }
]);

// 根据分类和年级筛选课程
const filteredCourses = computed(() => {
  let courses = recommendedCourses.value;
  if (gradeValue.value !== 0) {
    courses = courses.filter(course => course.grade?.includes(gradeValue.value.toString()));
  }
  return courses;
});

const selectCategory = (category: Category) => {
  activeCategory.value = category.id;
};

const getActiveCategoryName = () => {
  const category = categories.value.find(c => c.id === activeCategory.value);
  return category ? category.name + '课程' : '推荐课程';
};

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
  console.log('搜索:', text);
};
</script>

<style scoped>
.courses {
  padding: 16px;
  padding-bottom: 66px;
}

.search-bar {
  margin-bottom: 16px;
}

:deep(.van-dropdown-menu) {
  height: 28px;
}

:deep(.van-dropdown-menu__bar) {
  background: transparent;
}

:deep(.van-dropdown-menu__item) {
  justify-content: flex-end;
}

:deep(.van-dropdown-item__option-text) {
  font-size: var(--font-size-base, 14px);
  font-family: 'Noto Sans SC', sans-serif;
}

:deep(.van-dropdown-menu__title) {
  font-size: var(--font-size-base, 14px);
  font-weight: 700;
  font-family: 'Noto Sans SC', sans-serif;
}

:deep(.van-cell__title) {
  font-weight: 700 !important;
  font-family: 'Noto Sans SC', sans-serif !important;
  font-size: var(--font-size-md, 16px) !important;
}

.recommended,
.subject-courses {
  margin-bottom: 16px;
}
</style> 