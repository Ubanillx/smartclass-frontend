<template>
  <div :class="['course-list-container', className]">
    <van-cell :title="title">
      <template #right-icon v-if="showMore">
        <span class="more-link" @click="emit('more')">更多</span>
      </template>
      <template #right-icon v-if="$slots['right-icon']">
        <slot name="right-icon"></slot>
      </template>
    </van-cell>

    <div class="course-list">
      <course-item
        v-for="course in courses"
        :key="course.id"
        :course="course"
        @click="emit('select', course)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import CourseItem from './CourseItem.vue';
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

defineProps<{
  title: string;
  courses: EnhancedCourse[];
  showMore?: boolean;
  className?: string;
}>();

const emit = defineEmits<{
  (e: 'select', course: EnhancedCourse): void;
  (e: 'more'): void;
}>();
</script>

<style scoped>
.course-list-container {
  margin-bottom: 16px;
  background-color: transparent;
}

.course-list {
  padding: 0 0 16px;
}

:deep(.more-link) {
  font-size: var(--font-size-base, 14px);
  color: #1989fa;
  font-weight: 700;
  font-family: 'Noto Sans SC', sans-serif;
}

:deep(.van-cell__title) {
  font-weight: 700 !important;
  font-family: 'Noto Sans SC', sans-serif !important;
  font-size: var(--font-size-md, 16px) !important;
}

:deep(.van-cell) {
  padding-left: 0 !important;
  padding-right: 0 !important;
  border-radius: 0 !important;
  background-color: transparent !important;
  margin: 0 !important;
}

:deep(.van-cell:hover) {
  background-color: transparent !important;
}

:deep(.van-cell::after) {
  display: none !important;
}
</style>
