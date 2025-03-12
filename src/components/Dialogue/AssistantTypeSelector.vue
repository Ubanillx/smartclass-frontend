<template>
  <div class="assistant-types-container">
    <div class="assistant-types">
      <div 
        v-for="type in types" 
        :key="type.id"
        :class="['type-item', { active: modelValue === type.id }]"
        @click="$emit('update:modelValue', type.id)"
      >
        {{ type.name }}
      </div>
    </div>
    <div class="swipe-hint">
      <van-icon name="arrow" class="swipe-icon" />
    </div>
  </div>
</template>

<script setup lang="ts">
interface AssistantType {
  id: number;
  name: string;
}

// 定义props
const props = defineProps<{
  types: AssistantType[];
  modelValue: number;
}>();

// 定义事件
defineEmits<{
  (e: 'update:modelValue', value: number): void;
}>();
</script>

<style scoped>
.assistant-types-container {
  position: relative;
  margin-bottom: 16px;
}

.assistant-types {
  display: flex;
  padding: 0 16px;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  padding-right: 40px; /* 为右侧提示图标留出空间 */
}

.assistant-types::-webkit-scrollbar {
  display: none;
}

.type-item {
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

.type-item.active {
  color: #fff;
  background-color: #1989fa;
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