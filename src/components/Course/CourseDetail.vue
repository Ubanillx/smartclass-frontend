<template>
  <van-popup
    :show="modelValue"
    @update:show="emit('update:modelValue', $event)"
    round
    position="bottom"
    :style="{ height: '75%' }"
  >
    <div class="course-detail">
      <div class="popup-header">
        <span class="title">课程详情</span>
        <van-icon name="cross" @click="emit('close')" />
      </div>
      <div class="detail-content" v-if="course">
        <div class="image-container">
          <van-image 
            :src="course.cover" 
            fit="cover" 
            width="100%"
            radius="8"
          />
        </div>
        <h2>{{ course.title }}</h2>
        <div class="detail-meta">
          <span v-if="course.grade" class="grade">{{ course.grade }}</span>
          <span class="difficulty" :class="course.level">
            {{ course.level }}
          </span>
          <span>{{ course.duration }}分钟</span>
        </div>
        <div class="course-highlights" v-if="course.highlights && course.highlights.length > 0">
          <div class="highlight-item" v-for="(point, index) in course.highlights" :key="index">
            <van-icon :name="point.icon" :color="point.color" />
            <span>{{ point.text }}</span>
          </div>
        </div>
        <p class="course-description">{{ course.description }}</p>
        <van-button 
          type="primary" 
          block 
          round
          @click="emit('start')"
        >
          开始学习
        </van-button>
      </div>
    </div>
  </van-popup>
</template>

<script setup lang="ts">
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
  modelValue: boolean;
  course: Course | null;
}>();

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'start'): void;
  (e: 'update:modelValue', value: boolean): void;
}>();
</script>

<style scoped>
.course-detail {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.popup-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid #f5f5f5;
}

.title {
  font-size: var(--font-size-lg, 16px);
  font-weight: 700;
  color: #323233;
  font-family: 'Noto Sans SC', sans-serif;
}

.detail-content {
  flex: 1;
  padding: 16px;
  overflow-y: auto;
}

.image-container {
  padding: 0 12px;
  box-sizing: border-box;
  margin-bottom: 16px;
}

.image-container :deep(.van-image) {
  border-radius: 8px;
  overflow: hidden;
}

.detail-content h2 {
  margin: 0 0 8px;
  font-size: 18px;
  font-weight: 700;
  color: #323233;
  font-family: 'Noto Sans SC', sans-serif;
}

.detail-meta {
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
  font-size: var(--font-size-base, 14px);
  font-family: 'Noto Sans SC', sans-serif;
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
  font-size: var(--font-size-base, 14px);
  color: #646566;
  font-family: 'Noto Sans SC', sans-serif;
}

.course-description {
  margin: 16px 0;
  font-size: var(--font-size-base, 14px);
  line-height: 1.6;
  color: #646566;
  font-family: 'Noto Sans SC', sans-serif;
}

:deep(.van-button__text) {
  font-weight: 700 !important;
  font-family: 'Noto Sans SC', sans-serif !important;
  font-size: var(--font-size-md, 16px) !important;
}
</style> 