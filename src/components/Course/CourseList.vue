<template>
  <van-cell-group inset :class="className">
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
  </van-cell-group>
</template>

<script setup lang="ts">
import CourseItem from './CourseItem.vue';

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

defineProps<{
  title: string;
  courses: Course[];
  showMore?: boolean;
  className?: string;
}>();

const emit = defineEmits<{
  (e: 'select', course: Course): void;
  (e: 'more'): void;
}>();
</script>

<style scoped>
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
</style> 