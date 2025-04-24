<template>
  <div>
    <!-- 热门课程模块 -->
    <van-cell-group class="popular-courses-module">
      <van-cell title="热门课程">
        <template #icon>
          <svg class="icon svg-icon course-icon" aria-hidden="true">
            <use xlink:href="#icon-a-044_shipinkecheng"></use>
          </svg>
        </template>
        <template #right-icon>
          <span class="more-link" @click="$emit('more')">更多</span>
        </template>
      </van-cell>

      <div class="course-list">
        <div
          v-for="course in courses"
          :key="course.id"
          class="course-item"
          @click="$emit('select', course)"
        >
          <div class="course-cover">
            <van-image :src="course.cover" fit="cover" radius="4" />
          </div>
          <div class="course-info">
            <h3 class="course-title">{{ course.title }}</h3>
            <p class="course-brief">{{ course.brief }}</p>
            <div class="course-meta">
              <span class="tag" :class="course.level">{{
                course.level
              }}</span>
              <span class="tag" :style="{ background: course.tagColor }">{{ course.tag }}</span>
              <span>{{ course.duration }}分钟</span>
              <span v-if="course.studentsCount"
                >{{ course.studentsCount }}人在学</span
              >
            </div>
          </div>
        </div>
      </div>
    </van-cell-group>
  </div>
</template>

<script setup lang="ts">
// 引入Course接口
import { Course } from '../../api/mock';

// 定义props
const props = defineProps<{
  courses: Course[];
}>();

// 定义事件
defineEmits<{
  (e: 'select', course: Course): void;
  (e: 'more'): void;
}>();
</script>

<style scoped>
.popular-courses-module {
  margin-bottom: 16px;
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(100, 101, 102, 0.08);
}

.more-link {
  color: #1989fa;
  font-size: var(--font-size-md);
  font-weight: 700;
}

.course-list {
  padding: 8px 16px 16px;
}

.course-item {
  display: flex;
  padding: 12px 0;
  border-bottom: 1px solid #ebedf0;
  cursor: pointer;
}

.course-item:last-child {
  border-bottom: none;
}

.course-cover {
  position: relative;
  width: 120px;
  height: 80px;
  margin-right: 12px;
  flex-shrink: 0;
  border-radius: 4px;
  overflow: hidden;
}

.course-cover :deep(.van-image) {
  width: 100%;
  height: 100%;
}

.course-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  overflow: hidden;
}

.tag {
  display: inline-block;
  padding: 2px 6px;
  border-radius: 4px;
  color: #fff;
  font-size: var(--font-size-sm) !important;
  font-weight: 500 !important;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.tag.初级 {
  background: #07c160;
}

.tag.中级 {
  background: #1989fa;
}

.tag.高级 {
  background: #ff976a;
}

:deep(.van-cell__title) {
  font-size: var(--font-size-md) !important;
}

.svg-icon {
  width: 1em;
  height: 1em;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
}

.course-icon {
  font-size: var(--font-size-lg);
  margin-right: 4px;
  color: #1989fa;
  vertical-align: middle;
  display: flex;
  align-items: center;
  height: 24px;
}

/* 为视频课程图标添加特殊样式 */
:deep(.icon-a-044_shipinkecheng) {
  color: #ff9a9e;
  background: linear-gradient(135deg, #1989fa, #39b9fa);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-size: 22px;
}

.popular-courses-module .course-item .course-title {
  margin: 0 0 4px;
  font-size: var(--font-size-md) !important;
  color: #323233;
  font-weight: 700 !important;
  line-height: 1.4;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
}

.popular-courses-module .course-item .course-brief {
  margin: 0 0 8px;
  font-size: var(--font-size-sm) !important;
  color: #646566;
  line-height: 1.4;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.popular-courses-module .course-item .course-meta {
  display: flex;
  gap: 12px;
  font-size: var(--font-size-sm) !important;
  color: #969799;
  align-items: center;
  line-height: 1.2;
  white-space: nowrap;
  overflow-x: auto;
  padding-bottom: 4px;
  scrollbar-width: none;
}

/* 隐藏WebKit浏览器的滚动条 */
.popular-courses-module .course-item .course-meta::-webkit-scrollbar {
  display: none;
}

:deep(.van-cell) {
  position: relative;
  padding: 12px 16px !important;
  transition: all 0.3s ease;
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
