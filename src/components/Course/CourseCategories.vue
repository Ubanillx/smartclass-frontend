<template>
  <div class="course-categories-container">
    <div class="course-categories">
      <div 
        v-for="category in categories" 
        :key="category.id"
        :class="['category-item', { active: activeCategory === category.id }]"
        @click="emit('select', category)"
      >
        <van-icon :name="category.icon" class="category-icon" />
        <span>{{ category.name }}</span>
      </div>
    </div>
    <div class="swipe-hint">
      <van-icon name="arrow" class="swipe-icon" />
    </div>
  </div>
</template>

<script setup lang="ts">
interface Category {
  id: number;
  name: string;
  icon: string;
  path: string;
}

defineProps<{
  categories: Category[];
  activeCategory: number;
}>();

const emit = defineEmits<{
  (e: 'select', category: Category): void;
}>();
</script>

<style scoped>
.course-categories-container {
  position: relative;
  margin-bottom: 16px;
}

.course-categories {
  display: flex;
  padding: 0 16px;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  padding-right: 40px; /* 为右侧提示图标留出空间 */
}

.course-categories::-webkit-scrollbar {
  display: none;
}

.category-item {
  display: flex;
  align-items: center;
  flex-shrink: 0;
  padding: 8px 16px;
  margin-right: 8px;
  font-size: var(--font-size-base, 14px);
  font-weight: 700;
  font-family: 'Noto Sans SC', sans-serif;
  color: #646566;
  background-color: #f7f8fa;
  border-radius: 16px;
  cursor: pointer;
  transition: all 0.3s;
}

.category-item.active {
  color: #fff;
  background-color: #1989fa;
}

.category-item.active .category-icon {
  color: #fff;
}

.category-icon {
  margin-right: 4px;
  font-size: var(--font-size-md, 16px);
}

.swipe-hint {
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.1);
  border-radius: 50%;
  z-index: 1;
}

.swipe-icon {
  color: #969799;
  animation: swipe-hint 1.5s infinite;
}

@keyframes swipe-hint {
  0% {
    transform: translateX(-2px);
  }
  50% {
    transform: translateX(2px);
  }
  100% {
    transform: translateX(-2px);
  }
}
</style> 