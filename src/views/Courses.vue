<template>
  <div class="courses">
    <!-- 搜索栏 -->
    <search-bar
      v-model="searchText"
      placeholder="搜索课程"
      @search="onSearch"
    />

    <!-- 课程分类 -->
    <van-cell-group inset class="course-categories">
      <van-grid :column-num="5" :border="false">
        <van-grid-item 
          v-for="category in categories" 
          :key="category.id"
          :icon="category.icon"
          :text="category.name"
          :class="{ active: activeCategory === category.id }"
          @click="selectCategory(category)"
        />
      </van-grid>
    </van-cell-group>

    <!-- 推荐课程 -->
    <van-cell-group inset class="recommended" v-if="activeCategory === 0">
      <van-cell title="热门推荐">
        <template #right-icon>
          <span class="more-link" @click="router.push('/courses/all')">更多</span>
        </template>
      </van-cell>
      
      <div class="course-list">
        <div 
          v-for="course in recommendedCourses" 
          :key="course.id" 
          class="course-item"
          @click="showCourseDetail(course)"
        >
          <div class="course-cover">
            <van-image :src="course.cover" fit="cover" radius="8"/>
            <span class="course-tag" :style="{ background: course.tagColor }">{{ course.tag }}</span>
          </div>
          <div class="course-info">
            <h3 class="course-title">{{ course.title }}</h3>
            <p class="course-brief">{{ course.brief }}</p>
            <div class="course-meta">
              <span class="difficulty" :class="course.level">{{ course.level }}</span>
              <span>{{ course.duration }}分钟</span>
              <span>{{ course.studentsCount }}人在学</span>
            </div>
          </div>
        </div>
      </div>
    </van-cell-group>

    <!-- 学科课程列表 -->
    <van-cell-group inset class="subject-courses" v-else>
      <van-cell :title="getActiveCategoryName()">
        <template #right-icon>
          <van-dropdown-menu>
            <van-dropdown-item v-model="gradeValue" :options="gradeOptions" />
          </van-dropdown-menu>
        </template>
      </van-cell>
      
      <div class="course-list">
        <div 
          v-for="course in filteredCourses" 
          :key="course.id" 
          class="course-item"
          @click="showCourseDetail(course)"
        >
          <div class="course-cover">
            <van-image :src="course.cover" fit="cover" radius="8"/>
            <span class="course-tag" :style="{ background: course.tagColor }">{{ course.tag }}</span>
          </div>
          <div class="course-info">
            <h3 class="course-title">{{ course.title }}</h3>
            <p class="course-brief">{{ course.brief }}</p>
            <div class="course-meta">
              <span class="grade">{{ course.grade }}</span>
              <span class="difficulty" :class="course.level">{{ course.level }}</span>
              <span>{{ course.duration }}分钟</span>
            </div>
          </div>
        </div>
      </div>
    </van-cell-group>

    <!-- 课程详情弹出层 -->
    <van-popup
      v-model:show="showDetailPopup"
      round
      position="bottom"
      :style="{ height: '75%' }"
    >
      <div class="course-detail">
        <div class="popup-header">
          <span class="title">课程详情</span>
          <van-icon name="cross" @click="showDetailPopup = false" />
        </div>
        <div class="detail-content" v-if="selectedCourse">
          <van-image 
            :src="selectedCourse.cover" 
            fit="cover" 
            width="100%"
            radius="8"
          />
          <h2>{{ selectedCourse.title }}</h2>
          <div class="detail-meta">
            <span class="grade">{{ selectedCourse.grade }}</span>
            <span class="difficulty" :class="selectedCourse.level">
              {{ selectedCourse.level }}
            </span>
            <span>{{ selectedCourse.duration }}分钟</span>
          </div>
          <div class="course-highlights">
            <div class="highlight-item" v-for="(point, index) in selectedCourse.highlights" :key="index">
              <van-icon :name="point.icon" :color="point.color" />
              <span>{{ point.text }}</span>
            </div>
          </div>
          <p class="course-description">{{ selectedCourse.description }}</p>
          <van-button 
            type="primary" 
            block 
            round
            @click="startLearning"
          >
            开始学习
          </van-button>
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { showToast } from 'vant';
import SearchBar from '../components/SearchBar.vue';

const router = useRouter();
const searchText = ref('');
const showDetailPopup = ref(false);
const selectedCourse = ref(null);
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
const categories = ref([
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
const recommendedCourses = ref([
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
    courses = courses.filter(course => course.grade.includes(gradeValue.value));
  }
  return courses;
});

const selectCategory = (category) => {
  activeCategory.value = category.id;
};

const getActiveCategoryName = () => {
  const category = categories.value.find(c => c.id === activeCategory.value);
  return category ? category.name + '课程' : '推荐课程';
};

// 显示课程详情
const showCourseDetail = (course) => {
  selectedCourse.value = course;
  showDetailPopup.value = true;
};

// 开始学习
const startLearning = () => {
  showDetailPopup.value = false;
  router.push(`/course-study/${selectedCourse.value.id}`);
};

// 搜索处理
const onSearch = (text) => {
  console.log('搜索:', text);
};
</script>

<style scoped>
.courses {
  padding: 16px;
  padding-bottom: 66px;
}

.course-categories {
  margin-bottom: 16px;
}

.course-categories :deep(.van-grid-item__content) {
  padding: 12px 8px;
}

.course-categories :deep(.van-grid-item__content.active) {
  background: #e8f3ff;
}

.course-categories :deep(.van-grid-item__icon) {
  font-size: 24px;
  color: #323233;
}

.course-categories :deep(.van-grid-item__text) {
  font-size: 12px;
  color: #323233;
}

.course-list {
  padding: 0 0 16px;
}

.course-item {
  margin-bottom: 16px;
  background: #fff;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.course-cover {
  position: relative;
  width: 100%;
  height: 160px;
  overflow: hidden;
}

.course-cover :deep(.van-image) {
  width: 100%;
  height: 100%;
}

.course-cover :deep(.van-image__img) {
  object-fit: cover;
  width: 100%;
  height: 100%;
}

.course-tag {
  position: absolute;
  top: 8px;
  left: 8px;
  padding: 2px 8px;
  font-size: 12px;
  color: #fff;
  border-radius: 4px;
}

.course-info {
  padding: 16px;
}

.course-title {
  margin: 0 0 8px;
  font-size: 16px;
  color: #323233;
  font-weight: 500;
  line-height: 1.4;
}

.course-brief {
  margin: 0 0 8px;
  font-size: 14px;
  color: #646566;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  height: 40px;
}

.course-meta {
  display: flex;
  gap: 12px;
  font-size: 12px;
  color: #969799;
  align-items: center;
}

.difficulty {
  padding: 2px 6px;
  border-radius: 4px;
  color: #fff;
}

.difficulty.初级 {
  background: #07c160;
}

.difficulty.中级 {
  background: #1989fa;
}

.difficulty.高级 {
  background: #ff976a;
}

.grade {
  color: #323233;
}

.course-detail {
  padding: 16px;
}

.popup-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.detail-content h2 {
  margin: 16px 0 8px;
  font-size: 20px;
  color: #323233;
}

.detail-meta {
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
  font-size: 14px;
}

.course-highlights {
  margin: 16px 0;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}

.highlight-item {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 14px;
  color: #646566;
}

.course-description {
  margin: 16px 0;
  font-size: 14px;
  line-height: 1.6;
  color: #646566;
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

.recommended,
.subject-courses {
  margin-bottom: 16px;
}
</style> 