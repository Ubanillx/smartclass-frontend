<template>
  <div class="course-study">
    <div class="video-container">
      <video
        ref="videoRef"
        controls
        class="course-video"
        :poster="course?.cover"
      >
        <source :src="videoUrl" type="video/mp4" />
        您的浏览器不支持视频播放
      </video>
    </div>

    <div class="course-info">
      <h2 class="course-title">{{ course?.title }}</h2>
      <div class="course-meta">
        <span v-if="course?.grade" class="grade">{{ course.grade }}</span>
        <span class="difficulty" :class="course?.level">{{
          course?.level
        }}</span>
        <span>{{ course?.duration }}分钟</span>
      </div>

      <div class="course-tabs">
        <van-tabs v-model:active="activeTab" animated swipeable>
          <van-tab title="课程介绍">
            <div class="tab-content">
              <p class="course-description">{{ course?.description }}</p>

              <div
                class="course-highlights"
                v-if="course?.highlights && course.highlights.length > 0"
              >
                <h3>课程特点</h3>
                <div class="highlights-grid">
                  <div
                    class="highlight-item"
                    v-for="(point, index) in course.highlights"
                    :key="index"
                  >
                    <van-icon :name="point.icon" :color="point.color" />
                    <span>{{ point.text }}</span>
                  </div>
                </div>
              </div>
            </div>
          </van-tab>

          <van-tab title="课程目录">
            <div class="tab-content">
              <div class="chapter-list">
                <div
                  v-for="(chapter, index) in chapters"
                  :key="index"
                  class="chapter-item"
                  :class="{ active: currentChapter === index }"
                  @click="switchChapter(index)"
                >
                  <div class="chapter-info">
                    <span class="chapter-index">{{ index + 1 }}</span>
                    <div class="chapter-detail">
                      <h4>{{ chapter.title }}</h4>
                      <p>{{ chapter.duration }}分钟</p>
                    </div>
                  </div>
                  <van-icon
                    :name="
                      currentChapter === index ? 'play-circle-o' : 'play-circle'
                    "
                  />
                </div>
              </div>
            </div>
          </van-tab>

          <van-tab title="课后练习">
            <div class="tab-content">
              <div class="exercise-list">
                <div
                  v-for="(exercise, index) in exercises"
                  :key="index"
                  class="exercise-item"
                >
                  <h4>{{ exercise.title }}</h4>
                  <p>{{ exercise.description }}</p>
                  <van-button
                    type="primary"
                    size="small"
                    round
                    @click="startExercise(exercise)"
                  >
                    开始练习
                  </van-button>
                </div>
              </div>
            </div>
          </van-tab>
        </van-tabs>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { showToast } from 'vant';
import { Course as CourseType } from '../../api/mock';

interface CourseHighlight {
  icon: string;
  color: string;
  text: string;
}

// 扩展Course类型
interface EnhancedCourse extends CourseType {
  grade?: string;
  description?: string;
  highlights?: CourseHighlight[];
}

interface Chapter {
  title: string;
  duration: number;
  videoUrl: string;
}

interface Exercise {
  id: number;
  title: string;
  description: string;
  type: string;
}

const props = defineProps<{
  course: EnhancedCourse | null;
  courseId?: number;
}>();

const router = useRouter();
const videoRef = ref<HTMLVideoElement | null>(null);
const activeTab = ref(0);
const currentChapter = ref(0);

// 模拟章节数据
const chapters = ref<Chapter[]>([
  {
    title: '课程介绍与学习方法',
    duration: 5,
    videoUrl: 'https://example.com/video1.mp4',
  },
  {
    title: '基础知识讲解',
    duration: 10,
    videoUrl: 'https://example.com/video2.mp4',
  },
  {
    title: '实例演示与分析',
    duration: 15,
    videoUrl: 'https://example.com/video3.mp4',
  },
  {
    title: '综合练习与应用',
    duration: 10,
    videoUrl: 'https://example.com/video4.mp4',
  },
]);

// 模拟练习数据
const exercises = ref<Exercise[]>([
  {
    id: 1,
    title: '基础概念测试',
    description: '检验对课程基础概念的理解',
    type: 'quiz',
  },
  {
    id: 2,
    title: '实践应用练习',
    description: '通过实际案例应用所学知识',
    type: 'practice',
  },
]);

// 当前视频URL
const videoUrl = computed(() => {
  return chapters.value[currentChapter.value]?.videoUrl || '';
});

// 切换章节
const switchChapter = (index: number) => {
  currentChapter.value = index;
  if (videoRef.value) {
    videoRef.value.load();
    videoRef.value.play().catch((err) => {
      // 视频播放失败的静默处理
    });
  }
};

// 开始练习
const startExercise = (exercise: Exercise) => {
  router.push(`/exercise/${exercise.id}`);
};
</script>

<style scoped>
.course-study {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.video-container {
  width: 100%;
  background: #000;
}

.course-video {
  width: 100%;
  max-height: 30vh;
  object-fit: contain;
}

.course-info {
  padding: 16px;
  flex: 1;
  overflow: auto;
}

.course-title {
  margin: 0 0 8px;
  font-size: 18px;
  font-weight: 500;
  color: #323233;
}

.course-meta {
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
  font-size: 14px;
  color: #969799;
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

.course-tabs {
  margin-top: 16px;
}

.tab-content {
  padding: 16px 0;
}

.course-description {
  font-size: 14px;
  line-height: 1.6;
  color: #646566;
  margin-bottom: 16px;
}

.course-highlights h3 {
  font-size: 16px;
  margin: 16px 0 8px;
  color: #323233;
}

.highlights-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.highlight-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #646566;
  padding: 8px;
  background: #f7f8fa;
  border-radius: 4px;
}

.chapter-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.chapter-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  background: #f7f8fa;
  border-radius: 8px;
  cursor: pointer;
}

.chapter-item.active {
  background: #e8f3ff;
}

.chapter-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.chapter-index {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 24px;
  height: 24px;
  background: #1989fa;
  color: #fff;
  border-radius: 50%;
  font-size: 14px;
}

.chapter-detail h4 {
  margin: 0 0 4px;
  font-size: 14px;
  color: #323233;
}

.chapter-detail p {
  margin: 0;
  font-size: 12px;
  color: #969799;
}

.exercise-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.exercise-item {
  padding: 16px;
  background: #f7f8fa;
  border-radius: 8px;
}

.exercise-item h4 {
  margin: 0 0 8px;
  font-size: 16px;
  color: #323233;
}

.exercise-item p {
  margin: 0 0 12px;
  font-size: 14px;
  color: #646566;
}
</style>
