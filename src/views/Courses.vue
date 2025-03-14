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
            :class="{ 'dropdown-option-active': gradeValue === option.value }"
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
const route = useRoute();
const searchText = ref('');
const showDetailPopup = ref(false);
const selectedCourse = ref<Course | null>(null);
const activeCategory = ref(0);
const gradeValue = ref(0);
const showDropdown = ref(false);

// 年级选项
const gradeOptions = [
  { text: '全部年级', value: 0, icon: '' },
  { text: '一年级', value: 1, icon: '' },
  { text: '二年级', value: 2, icon: '' },
  { text: '三年级', value: 3, icon: '' },
  { text: '四年级', value: 4, icon: '' },
  { text: '五年级', value: 5, icon: '' },
  { text: '六年级', value: 6, icon: '' }
];

// 获取当前选中的年级文本
const currentGradeText = computed(() => {
  const option = gradeOptions.find(opt => opt.value === gradeValue.value);
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
  const query: Record<string, string> = { ...route.query as Record<string, string> };
  if (value === 0) {
    delete query.grade;
  } else {
    query.grade = value.toString();
  }
  
  router.replace({
    path: route.path,
    query
  });
};

// 点击外部关闭下拉菜单
const closeDropdownOnClickOutside = (event: MouseEvent) => {
  const dropdown = document.querySelector('.custom-dropdown');
  if (dropdown && !dropdown.contains(event.target as Node) && showDropdown.value) {
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
    path: '/courses/recommended'
  },
  {
    id: 1,
    name: '语文',
    icon: 'yuwen',
    path: '/courses/chinese'
  },
  {
    id: 2,
    name: '数学',
    icon: 'shuxue',
    path: '/courses/math'
  },
  {
    id: 3,
    name: '英语',
    icon: 'yingyu1',
    path: '/courses/english'
  },
  {
    id: 4,
    name: '物理',
    icon: 'wuli',
    path: '/courses/physics'
  },
  {
    id: 5,
    name: '化学',
    icon: 'huaxue',
    path: '/courses/chemistry'
  },
  {
    id: 6,
    name: '政治',
    icon: 'zhengzhi',
    path: '/courses/politics'
  },
  {
    id: 7,
    name: '历史',
    icon: 'lishi',
    path: '/courses/history'
  },
  {
    id: 8,
    name: '生物',
    icon: 'shengwu',
    path: '/courses/biology'
  },
  {
    id: 9,
    name: '地理',
    icon: 'dili-',
    path: '/courses/geography'
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

// 在组件挂载时检查 URL 参数
onMounted(() => {
  const categoryParam = route.query.category as string;
  let needUpdateUrl = false;
  
  if (categoryParam) {
    const categoryId = parseInt(categoryParam);
    if (!isNaN(categoryId) && categories.value.some(c => c.id === categoryId)) {
      activeCategory.value = categoryId;
    } else {
      // 如果参数无效，设置为默认值
      activeCategory.value = 0;
      needUpdateUrl = true;
    }
  } else {
    // 如果没有 category 参数，设置为默认值并标记需要更新 URL
    activeCategory.value = 0;
    needUpdateUrl = true;
  }
  
  const gradeParam = route.query.grade as string;
  if (gradeParam) {
    const gradeId = parseInt(gradeParam);
    if (!isNaN(gradeId) && gradeOptions.some(g => g.value === gradeId)) {
      gradeValue.value = gradeId;
    } else {
      // 如果参数无效，设置为默认值
      gradeValue.value = 0;
      needUpdateUrl = true;
    }
  }
  
  // 如果需要更新 URL，添加默认参数
  if (needUpdateUrl) {
    const query: Record<string, string> = { ...route.query as Record<string, string> };
    query.category = activeCategory.value.toString();
    
    // 如果年级是默认值，删除年级参数
    if (gradeValue.value === 0) {
      delete query.grade;
    } else {
      query.grade = gradeValue.value.toString();
    }
    
    router.replace({
      path: route.path,
      query
    });
  }
});

const selectCategory = (category: Category) => {
  activeCategory.value = category.id;
  
  // 更新 URL 参数
  const query: Record<string, string> = { ...route.query as Record<string, string>, category: category.id.toString() };
  // 如果是推荐分类，删除年级参数
  if (category.id === 0) {
    delete query.grade;
  }
  
  router.replace({
    path: route.path,
    query
  });
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
  margin-bottom: 6px;
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

/* 删除自定义勾选图标 */
/* .dropdown-option-active::after {
  content: "";
  position: absolute;
  right: 16px;
  top: 50%;
  transform: translateY(-50%);
  width: 16px;
  height: 16px;
  background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%231989fa'%3E%3Cpath d='M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z'/%3E%3C/svg%3E") no-repeat;
  background-size: contain;
} */

.recommended,
.subject-courses {
  margin-bottom: 16px;
}

/* 确保没有任何元素有阴影 */
:deep(.van-popup) {
  box-shadow: none !important;
  background-color: #fff;
  border: 1px solid #ebedf0;
}
</style> 