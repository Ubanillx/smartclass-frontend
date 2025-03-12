<template>
  <div class="course-study-page">
    <!-- 返回按钮 -->
    <div class="back-button">
      <van-icon name="arrow-left" size="20" @click="router.back()" />
      <span class="page-title">课程学习</span>
    </div>
    
    <course-study
      :course="course"
      :course-id="courseId"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { showToast } from 'vant';
import { CourseStudy } from '../components/Course';

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

const route = useRoute();
const router = useRouter();
const courseId = ref<number>(Number(route.params.id) || 0);
const course = ref<Course | null>(null);

// 模拟获取课程数据
onMounted(() => {
  // 这里应该是从API获取课程数据
  // 这里使用模拟数据
  setTimeout(() => {
    course.value = {
      id: courseId.value,
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
    };
  }, 500);
});
</script>

<style scoped>
.course-study-page {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

.back-button {
  display: flex;
  align-items: center;
  padding: 12px;
  background-color: #fff;
}

.back-button .page-title {
  font-size: 16px;
  font-weight: 500;
  margin-left: 8px;
}

:deep(.course-study) {
  flex: 1;
  overflow: hidden;
}
</style> 