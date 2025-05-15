<template>
  <div class="course-item" @click="emit('click', course)">
    <div class="course-cover">
      <van-image :src="course.cover" fit="cover" radius="8" />
    </div>
    <div class="course-info">
      <h3 class="course-title">{{ course.title }}</h3>
      <p class="course-brief">{{ course.brief }}</p>
      <div class="course-meta">
        <span v-if="course.grade" class="grade">{{ course.grade }}</span>
        <span class="difficulty" :class="course.level">{{ course.level }}</span>
        <span>{{ course.duration }}分钟</span>
        <span v-if="course.studentsCount"
          >{{ course.studentsCount }}人在学</span
        >
        <span class="course-tag" :style="{ background: course.tagColor }">{{
          course.tag
        }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Course as CourseType } from '../../api/mock';

// 扩展Course类型
interface EnhancedCourse extends CourseType {
  grade?: string;
  description?: string;
  highlights?: Array<{
    icon: string;
    color: string;
    text: string;
  }>;
}

defineProps<{
  course: EnhancedCourse;
}>();

const emit = defineEmits<{
  (e: 'click', course: EnhancedCourse): void;
}>();
</script>

<style scoped>
.course-item {
  margin-bottom: 16px;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
  transition: all 0.3s ease;
}

.course-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.1);
}

.course-cover {
  position: relative;
  width: 100%;
  height: 160px;
  overflow: hidden;
  padding: 0;
  box-sizing: border-box;
}

.course-cover :deep(.van-image) {
  width: 100%;
  height: 100%;
  border-radius: 8px;
  overflow: hidden;
  margin-top: 0;
}

.course-cover :deep(.van-image__img) {
  object-fit: cover;
  width: 100%;
  height: 100%;
}

.course-info {
  padding: 16px;
}

.course-title {
  margin: 0 0 8px;
  font-size: var(--font-size-md, 16px);
  color: #323233;
  font-weight: 700;
  line-height: 1.4;
  font-family: 'Noto Sans SC', sans-serif;
}

.course-brief {
  margin: 0 0 12px;
  font-size: var(--font-size-base, 14px);
  color: #646566;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  height: 40px;
  font-family: 'Noto Sans SC', sans-serif;
}

.course-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 8px 12px;
  font-size: var(--font-size-sm, 12px);
  color: #969799;
  align-items: center;
  font-family: 'Noto Sans SC', sans-serif;
}

.difficulty {
  padding: 2px 8px;
  border-radius: 4px;
  color: #fff;
  font-weight: 500;
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
  background-color: rgba(0, 0, 0, 0.05);
  padding: 2px 8px;
  border-radius: 4px;
}

.course-tag {
  padding: 2px 10px;
  font-size: var(--font-size-sm, 12px);
  color: #fff;
  border-radius: 4px;
  font-family: 'Noto Sans SC', sans-serif;
  margin-left: auto;
  font-weight: 500;
}
</style>
