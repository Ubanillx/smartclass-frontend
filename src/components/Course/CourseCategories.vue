<template>
  <div class="course-categories-container">
    <div class="course-categories">
      <div
        v-for="category in categories"
        :key="category.id"
        :class="['category-item', { active: activeCategory === category.id }]"
        @click="emit('select', category)"
      >
        <svg class="icon svg-icon category-icon" aria-hidden="true">
          <use :xlink:href="'#icon-' + getIconName(category.icon)"></use>
        </svg>
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

const getIconName = (iconName: string) => {
  const iconMap: Record<string, string> = {
    star: 'tuijian',
  };

  return iconMap[iconName] || iconName;
};
</script>

<style scoped>
.course-categories-container {
  position: relative;
  margin-bottom: 0;
  margin-top: 0;
  padding: 8px 0;
  border-radius: 0;
  background-color: transparent;
  box-shadow: none;
  overflow: hidden;
}

.course-categories {
  display: flex;
  padding: 0 16px;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  padding-right: 40px;
}

.course-categories::-webkit-scrollbar {
  display: none;
}

.category-item {
  display: flex;
  align-items: center;
  flex-shrink: 0;
  padding: 8px 12px;
  margin-right: 12px;
  font-size: var(--font-size-base, 14px);
  font-weight: 700;
  font-family: 'Noto Sans SC', sans-serif;
  color: #646566;
  background-color: transparent;
  border-radius: 16px;
  cursor: pointer;
  transition: all 0.3s;
}

.category-item.active {
  color: #fff;
  background-color: #308fff;
  transform: scale(1.05);
  box-shadow: 0 2px 6px rgba(100, 177, 255, 0.2);
}

.category-item.active .category-icon {
  color: #fff;
  fill: #fff;
}

.svg-icon {
  width: 1em;
  height: 1em;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
}

.category-icon {
  margin-right: 4px;
  font-size: 16px;
}

.swipe-hint {
  position: absolute;
  top: 0;
  right: 0;
  height: 100%;
  width: 40px;
  background: transparent;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding-right: 10px;
}

.swipe-icon {
  color: #969799;
  animation: swipeHint 1.5s infinite ease-in-out;
}

@keyframes swipeHint {
  0%, 100% {
    transform: translateX(-2px);
    opacity: 0.5;
  }
  50% {
    transform: translateX(2px);
    opacity: 1;
  }
}
</style>
