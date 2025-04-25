<template>
  <div class="popular-courses-page">
    <!-- 返回按钮 -->
    <back-button title="热门课程" />

    <!-- 主要内容区域 -->
    <div class="content-container">
      <!-- 课程分类标签 -->
      <van-tabs v-model:active="activeCategory" sticky swipeable>
        <van-tab title="全部">
          <course-list
            title="推荐课程"
            :courses="displayedCourses"
            class-name="recommended"
            @select="showCourseDetail"
          />
        </van-tab>
        <van-tab
          v-for="category in categories"
          :key="category.id"
          :title="category.name"
        >
          <course-list
            :title="category.name + '课程'"
            :courses="displayedCourses"
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
import { CourseList, CourseDetail } from '../components/Course';
import { BackButton } from '../components/Common';
import {
  mockPopularCourses,
  courseCategories,
  getCoursesByCategory,
  fetchMockPopularCourses,
  fetchCourseCategories,
} from '../api/mock';

// 定义类型
interface CourseHighlight {
  icon: string;
  color: string;
  text: string;
}

// 基本课程类型
interface BaseCourse {
  id: number;
  title: string;
  brief: string;
  cover: string;
  tag: string;
  tagColor: string;
  level: string;
  duration: number;
  studentsCount: number;
  subject?: string;
  description?: string;
  highlights?: CourseHighlight[];
}

// 扩展课程类型
interface EnhancedCourse extends BaseCourse {
  description?: string;
  highlights?: CourseHighlight[];
}

interface Category {
  id: number;
  name: string;
  icon: string;
}

const router = useRouter();
const showDetailPopup = ref(false);
const selectedCourse = ref<EnhancedCourse | null>(null);
const activeCategory = ref(0);
const allCourses = ref<EnhancedCourse[]>([]);
const categories = ref<Category[]>([]);
const loading = ref(true);

// 根据分类筛选课程
const displayedCourses = computed(() => {
  if (activeCategory.value === 0) {
    return allCourses.value;
  } else {
    const category = categories.value[activeCategory.value - 1];
    if (category) {
      return allCourses.value.filter(
        (course) => course.subject === category.name,
      );
    }
    return allCourses.value;
  }
});

// 显示课程详情
const showCourseDetail = (course: EnhancedCourse) => {
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

// 为课程添加描述和亮点
const enhanceCourse = (course: BaseCourse): EnhancedCourse => {
  return {
    ...course,
    // 如果没有描述，则创建一个标准描述
    description:
      course.description ||
      `本课程是${course.subject || ''}学科的${course.level}课程，${course.brief}`,
    // 如果没有亮点，则根据课程信息创建标准亮点
    highlights: course.highlights || [
      {
        icon:
          course.level === '初级'
            ? 'smile-o'
            : course.level === '中级'
              ? 'bulb-o'
              : 'certificate',
        color: course.tagColor,
        text: `${course.level}级别`,
      },
      { icon: 'clock-o', color: '#1989fa', text: `${course.duration}分钟` },
      {
        icon: 'friends-o',
        color: '#07c160',
        text: `${course.studentsCount}人学习`,
      },
    ],
  };
};

// 加载课程数据
const loadCourses = async () => {
  loading.value = true;

  try {
    // 获取课程数据和分类数据
    const [coursesData, categoriesData] = await Promise.all([
      fetchMockPopularCourses(),
      fetchCourseCategories(),
    ]);

    // 增强课程数据
    allCourses.value = coursesData.map(enhanceCourse);

    // 转换分类数据为组件需要的格式
    categories.value = categoriesData.map((category) => ({
      id: category.id,
      name: category.name,
      icon: category.icon,
    }));
  } catch (error) {
    console.error('加载课程数据失败:', error);
    showToast('数据加载失败，请重试');
  } finally {
    loading.value = false;
  }

  // 返回一个Promise以便后续链式操作
  return Promise.resolve();
};

// 组件挂载时加载数据
onMounted(() => {
  loadCourses().then(() => {
    // 检查URL参数，如果有showDetail和courseId，则自动打开课程详情
    const searchParams = new URLSearchParams(location.search);
    const showDetail = searchParams.get('showDetail');
    const courseId = searchParams.get('courseId');

    if (showDetail === 'true' && courseId) {
      const courseIdNum = parseInt(courseId, 10);
      const course = allCourses.value.find((c) => c.id === courseIdNum);
      if (course) {
        showCourseDetail(course);
      }
    }
  });
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
  margin-top: 46px; /* 为返回按钮留出空间 */
  padding-bottom: 20px;
}

:deep(.van-tabs) {
  background: #fff;
}

:deep(.van-sticky--fixed) {
  z-index: 999;
}

:deep(.van-tabs__line) {
  background-color: #1989fa;
}

:deep(.van-tab) {
  font-size: 14px;
  color: #323233;
}

:deep(.van-tab--active) {
  font-weight: 700;
  color: #1989fa;
}

:deep(.van-tab__pane) {
  padding: 12px 0;
}
</style>
