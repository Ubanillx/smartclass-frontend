<template>
  <div class="course-study-page">
    <!-- 返回按钮 -->
    <back-button title="课程学习" />

    <course-study :course="course" :course-id="courseId" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { showToast } from 'vant';
import { CourseStudy } from '../components/Course';
import { BackButton } from '../components/Common';
import { fetchCourseDetail, Course as CourseType } from '../api/mock';

interface CourseHighlight {
  icon: string;
  color: string;
  text: string;
}

// 扩展Course类型，添加我们需要的描述和亮点
interface EnhancedCourse extends CourseType {
  grade?: string;
  description?: string;
  highlights?: CourseHighlight[];
}

const route = useRoute();
const router = useRouter();
const courseId = ref<number>(Number(route.params.id) || 0);
const course = ref<EnhancedCourse | null>(null);

// 获取课程数据
onMounted(async () => {
  try {
    // 从mock API获取课程数据
    const courseData = await fetchCourseDetail(courseId.value);
    
    // 准备课程描述和亮点
    course.value = {
      ...courseData,
      description: `本课程是${courseData.subject || ''}学科的${courseData.level}课程，${courseData.brief}`,
      highlights: [
        { 
          icon: courseData.level === '初级' ? 'smile-o' : 
                courseData.level === '中级' ? 'bulb-o' : 'certificate',
          color: courseData.tagColor,
          text: `${courseData.level}级别` 
        },
        { icon: 'clock-o', color: '#1989fa', text: `${courseData.duration}分钟` },
        { icon: 'friends-o', color: '#07c160', text: `${courseData.studentsCount || 0}人学习` }
      ]
    };
  } catch (error) {
    showToast('获取课程数据失败，请重试');
  }
});
</script>

<style scoped>
.course-study-page {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

:deep(.course-study) {
  flex: 1;
  overflow: hidden;
}
</style>
