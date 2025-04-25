<template>
  <div class="courses has-tabbar">
    <!-- 固定头部区域 -->
    <div class="fixed-header">
      <!-- 页面标题区域 -->
      <div class="header">
        <div class="page-title">
          <i class="iconfont icon-kecheng title-icon"></i>
          <span>课程</span>
        </div>
        <div class="header-actions">
          <van-icon
            name="calendar-o"
            class="action-icon"
            @click="handleShowSchedule"
          />
          <van-icon
            name="todo-list-o"
            class="action-icon"
            @click="handleShowTasks"
          />
        </div>
      </div>

      <!-- 课程分类 -->
      <course-categories
        :categories="categories"
        :active-category="activeCategory"
        @select="selectCategory"
      />
    </div>

    <!-- 可滚动内容区域 -->
    <div class="scrollable-content">
      <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
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

        <!-- 单独放置年级选择器 - 使用自定义下拉菜单替代 van-dropdown-menu -->
        <div v-if="activeCategory !== 0" class="grade-selector-container">
          <div class="custom-dropdown">
            <div class="dropdown-trigger" @click="toggleDropdown">
              <span>{{ currentGradeText }}</span>
              <span class="dropdown-arrow"></span>
            </div>
            <div v-if="showDropdown" class="dropdown-content">
              <div
                v-for="option in gradeOptions"
                :key="option.value"
                class="dropdown-option"
                :class="{
                  'dropdown-option-active': gradeValue === option.value,
                }"
                @click="selectGrade(option.value)"
              >
                {{ option.text }}
              </div>
            </div>
          </div>
        </div>

        <!-- 学科课程列表 -->
        <course-list
          v-if="activeCategory !== 0"
          :title="getActiveCategoryName()"
          :courses="filteredCourses"
          class-name="subject-courses"
          @select="showCourseDetail"
        >
          <template #right-icon>
            <!-- 移除此处的年级选择器 -->
          </template>
        </course-list>
      </van-pull-refresh>
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
import { useRouter, useRoute } from 'vue-router';
import { showToast } from 'vant';
import {
  CourseCategories,
  CourseList,
  CourseDetail,
} from '../components/Course';
import { BackButton } from '../components/Common';
import { Course as CourseType } from '../api/mock';

// 定义类型
interface CourseHighlight {
  icon: string;
  color: string;
  text: string;
}

// 扩展Course类型为EnhancedCourse
interface EnhancedCourse extends Omit<CourseType, 'studentsCount'> {
  studentsCount: number;
  grade?: string;
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
const route = useRoute();
const showDetailPopup = ref(false);
const selectedCourse = ref<EnhancedCourse | null>(null);
const activeCategory = ref(0);
const gradeValue = ref(0);
const showDropdown = ref(false);
const refreshing = ref(false);

// 课程表功能
const handleShowSchedule = () => {
  router.push('/course-schedule');
};

// 任务功能
const handleShowTasks = () => {
  router.push('/task-plans');
};

// 年级选项
const gradeOptions = [
  { text: '全部年级', value: 0, icon: '' },
  { text: '一年级', value: 1, icon: '' },
  { text: '二年级', value: 2, icon: '' },
  { text: '三年级', value: 3, icon: '' },
  { text: '四年级', value: 4, icon: '' },
  { text: '五年级', value: 5, icon: '' },
  { text: '六年级', value: 6, icon: '' },
];

// 获取当前选中的年级文本
const currentGradeText = computed(() => {
  const option = gradeOptions.find((opt) => opt.value === gradeValue.value);
  return option ? option.text : '全部年级';
});

// 切换下拉菜单显示状态
const toggleDropdown = () => {
  showDropdown.value = !showDropdown.value;
};

// 选择年级
const selectGrade = (value: number) => {
  gradeValue.value = value;
  showDropdown.value = false;

  // 更新 URL 参数
  const query: Record<string, string> = {
    ...(route.query as Record<string, string>),
  };
  if (value === 0) {
    delete query.grade;
  } else {
    query.grade = value.toString();
  }

  router.replace({
    path: route.path,
    query,
  });
};

// 点击外部关闭下拉菜单
const closeDropdownOnClickOutside = (event: MouseEvent) => {
  const dropdown = document.querySelector('.custom-dropdown');
  if (
    dropdown &&
    !dropdown.contains(event.target as Node) &&
    showDropdown.value
  ) {
    showDropdown.value = false;
  }
};

// 添加全局点击事件监听器
if (typeof window !== 'undefined') {
  window.addEventListener('click', closeDropdownOnClickOutside);
}

// 课程分类
const categories = ref<Category[]>([
  {
    id: 0,
    name: '推荐',
    icon: 'star',
    path: '/courses/recommended',
  },
  {
    id: 1,
    name: '语文',
    icon: 'yuwen',
    path: '/courses/chinese',
  },
  {
    id: 2,
    name: '数学',
    icon: 'shuxue',
    path: '/courses/math',
  },
  {
    id: 3,
    name: '英语',
    icon: 'yingyu1',
    path: '/courses/english',
  },
  {
    id: 4,
    name: '物理',
    icon: 'wuli',
    path: '/courses/physics',
  },
  {
    id: 5,
    name: '化学',
    icon: 'huaxue',
    path: '/courses/chemistry',
  },
  {
    id: 6,
    name: '政治',
    icon: 'zhengzhi',
    path: '/courses/politics',
  },
  {
    id: 7,
    name: '历史',
    icon: 'lishi',
    path: '/courses/history',
  },
  {
    id: 8,
    name: '生物',
    icon: 'shengwu',
    path: '/courses/biology',
  },
  {
    id: 9,
    name: '地理',
    icon: 'dili-',
    path: '/courses/geography',
  },
]);

// Mock 推荐课程数据
const recommendedCourses = ref<EnhancedCourse[]>([
  {
    id: 1,
    title: '填空选择秒选大招合集',
    brief: '本课程通过有趣的动画和游戏互动，帮助同学们掌握...',
    cover:
      'https://smart-class-1329220530.cos.ap-nanjing.myqcloud.com/user_avatar/f8b3549a57984426bd563291f081f9bf.png',
    tag: '数学',
    tagColor: '#1989fa',
    grade: '高一',
    level: '中级',
    duration: 30,
    studentsCount: 1234,
    description: '本课程通过有趣的动画和游戏互动，帮助同学们掌握...',
    highlights: [
      { icon: 'smile-o', color: '#ff976a', text: '趣味教学' },
      { icon: 'music-o', color: '#07c160', text: '互动练习' },
      { icon: 'star-o', color: '#ffcd32', text: '奖励机制' },
    ],
  },
  {
    id: 2,
    title: '典型实验大题解答合集',
    brief: '本课程通过有趣的动画和游戏互动，帮助同学们掌握...',
    cover:
      'https://smart-class-1329220530.cos.ap-nanjing.myqcloud.com/user_avatar/65e2cbeb958c47c4be3dcf06aa00057a.png',
    tag: '物理',
    tagColor: '#07c160',
    grade: '初三',
    level: '中级',
    duration: 45,
    studentsCount: 856,
    description: '本课程通过有趣的动画和游戏互动，帮助同学们掌握...',
  },
  {
    id: 3,
    title: '科学实验室探索',
    brief: '动手做实验，探索科学奥秘',
    cover:
      'https://smart-class-1329220530.cos.ap-nanjing.myqcloud.com/user_avatar/88e4f754e8d2413ea55a0c1c7d7f7b46.png',
    tag: '科学',
    tagColor: '#7232dd',
    grade: '初三',
    level: '初级',
    duration: 40,
    studentsCount: 567,
    description: '通过有趣的科学实验，了解身边的科学现象...',
  },
]);

// 根据分类和年级筛选课程
const filteredCourses = computed(() => {
  let courses = recommendedCourses.value;
  if (gradeValue.value !== 0) {
    courses = courses.filter((course) =>
      course.grade?.includes(gradeValue.value.toString()),
    );
  }
  return courses;
});

// 下拉刷新
const onRefresh = () => {
  // 模拟网络请求延迟
  setTimeout(() => {
    refreshing.value = false;
    showToast('刷新成功');
  }, 1000);
};

// 在组件挂载时检查 URL 参数
onMounted(() => {
  // 从URL参数中获取分类和年级
  const categoryId = parseInt(route.query.category as string) || 0;
  const grade = parseInt(route.query.grade as string) || 0;

  if (categoryId !== 0 && categories.value.some((c) => c.id === categoryId)) {
    activeCategory.value = categoryId;
  }

  if (grade !== 0 && gradeOptions.some((g) => g.value === grade)) {
    gradeValue.value = grade;
  }
});

const selectCategory = (category: Category) => {
  activeCategory.value = category.id;

  // 更新 URL 参数
  const query: Record<string, string> = {
    ...(route.query as Record<string, string>),
    category: category.id.toString(),
  };
  // 如果是推荐分类，删除年级参数
  if (category.id === 0) {
    delete query.grade;
  }

  router.replace({
    path: route.path,
    query,
  });
};

const getActiveCategoryName = () => {
  const category = categories.value.find((c) => c.id === activeCategory.value);
  return category ? category.name + '课程' : '推荐课程';
};

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
</script>

<style scoped>
.courses {
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

.scrollable-content {
  flex: 1;
  overflow-y: auto;
  padding: 0 16px;
  margin-top: 140px; /* 添加顶部边距，为固定导航腾出空间 */
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
  font-size: 20px;
  font-weight: 700;
  color: #323233;
  font-family: 'Noto Sans SC', sans-serif;
}

.title-icon {
  margin-right: 6px;
  color: #1989fa;
  font-size: 22px;
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

.grade-selector-container {
  margin: 0 0 16px;
  background-color: transparent;
  border-radius: 8px;
  padding: 0;
  box-shadow: none;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  position: relative;
}

/* 自定义下拉菜单样式 */
.custom-dropdown {
  width: 100px;
  position: relative;
}

.dropdown-trigger {
  height: 28px;
  border: 1px solid #ebedf0;
  border-radius: 6px;
  padding: 0 8px;
  background-color: #f7f8fa;
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  font-size: 13px;
  font-weight: 500;
  font-family: 'Noto Sans SC', sans-serif;
  color: #323233;
}

.dropdown-arrow {
  width: 0;
  height: 0;
  border-style: solid;
  border-width: 4px 4px 0 4px;
  border-color: #969799 transparent transparent transparent;
  margin-left: 4px;
}

.dropdown-content {
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  background-color: #fff;
  border: 1px solid #ebedf0;
  border-radius: 6px;
  margin-top: 6px;
  z-index: 100;
  max-height: 300px;
  overflow-y: auto;
}

.dropdown-option {
  padding: 12px 0;
  text-align: center;
  border-bottom: 1px solid #f5f5f5;
  font-size: 13px;
  font-family: 'Noto Sans SC', sans-serif;
  color: #323233;
  cursor: pointer;
}

.dropdown-option:last-child {
  border-bottom: none;
}

.dropdown-option:hover {
  background-color: #f7f8fa;
}

.dropdown-option-active {
  color: #1989fa;
  background-color: #fff;
  position: relative;
}

.recommended,
.subject-courses {
  margin-top: 16px;
  margin-bottom: 16px;
}

/* 确保没有任何元素有阴影 */
:deep(.van-popup) {
  box-shadow: none !important;
  background-color: #fff;
  border: 1px solid #ebedf0;
}

:deep(.van-pull-refresh) {
  min-height: calc(100vh - 32px);
}

:deep(.van-pull-refresh__track) {
  padding-bottom: 16px;
}
</style>
