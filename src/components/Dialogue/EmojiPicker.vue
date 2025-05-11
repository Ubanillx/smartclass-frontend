<template>
  <van-popup
    :show="show"
    @update:show="updateShow"
    position="bottom"
    :style="{ height: '30%' }"
    round
  >
    <div class="emoji-picker">
      <div class="emoji-header">
        <span class="title">选择表情</span>
        <van-icon name="cross" @click="closePicker" />
      </div>
      <div class="emoji-grid">
        <span
          v-for="emoji in emojiList"
          :key="emoji"
          class="emoji-item"
          @click="selectEmoji(emoji)"
        >
          {{ emoji }}
        </span>
      </div>
    </div>
  </van-popup>
</template>

<script setup lang="ts">
import { ref } from 'vue';

// 定义props
const props = defineProps<{
  show: boolean;
}>();

// 定义emit
const emit = defineEmits<{
  (e: 'update:show', value: boolean): void;
  (e: 'select', emoji: string): void;
}>();

// 更新show状态
const updateShow = (value: boolean) => {
  emit('update:show', value);
};

// 表情列表
const emojiList = ref([
  '😀', '😄', '😁', '😆', '😅', '😂', '🤣', '😊', '😇', '🙂', '🙃',
  '😉', '😌', '😍', '🥰', '😘', '😋', '😝', '🤔', '🤫', '🤐', '🤨',
  '😐', '😑', '😶', '😏', '😒', '🙄', '😬', '🤥', '😔'
]);

// 关闭选择器
const closePicker = () => {
  emit('update:show', false);
};

// 选择表情
const selectEmoji = (emoji: string) => {
  emit('select', emoji);
  closePicker();
};
</script>

<style scoped>
.emoji-picker {
  padding: 16px;
}

.emoji-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.emoji-header .title {
  font-size: var(--font-size-md, 16px);
  font-weight: 700;
  font-family: 'Noto Sans SC', sans-serif;
}

.emoji-grid {
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  gap: 12px;
}

.emoji-item {
  font-size: 24px;
  text-align: center;
  cursor: pointer;
  user-select: none;
}
</style> 