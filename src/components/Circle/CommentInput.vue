<template>
  <div>
    <!-- 底部评论输入区域 -->
    <div class="comment-input-bar">
      <van-field
        v-model="commentText"
        placeholder="说点什么..."
        class="comment-input"
        @click="commentFocus"
      >
        <template #button>
          <div class="input-actions">
            <van-icon name="smile-o" class="emoji-icon" @click="showEmojiPicker" />
            <van-button 
              size="small" 
              :loading="submitting"
              :disabled="!commentText.trim() || submitting" 
              :class="['send-btn', {'send-btn-active': commentText.trim() && !submitting}]"
              @click="submitComment"
            >
              {{ submitting ? '' : '发送' }}
            </van-button>
          </div>
        </template>
      </van-field>
    </div>

    <!-- 底部表情选择弹出层 -->
    <van-popup v-model:show="showEmoji" position="bottom" :style="{ height: '30%' }">
      <div class="emoji-picker">
        <div class="emoji-list">
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
  </div>
</template>

<script setup lang="ts">
import { ref, defineEmits } from 'vue';

const props = defineProps<{
  submitting?: boolean;
}>();

const emit = defineEmits<{
  (e: 'submit', text: string): void;
  (e: 'focus'): void;
}>();

const commentText = ref('');
const showEmoji = ref(false);

// 模拟表情列表
const emojiList = ['😀', '😃', '😄', '😁', '😆', '😅', '😂', '🤣', '😊', '😇', '🙂', '🙃', '😉', '😌', '😍', '🥰', '😘', '😗', '😙', '😚', '😋', '😛', '😝', '😜', '🤪', '🤨', '🧐', '🤓', '😎', '🤩', '🥳', '😏'];

// 聚焦评论输入框
const commentFocus = () => {
  // 聚焦输入框
  setTimeout(() => {
    const inputEl = document.querySelector('.comment-input input') as HTMLInputElement;
    if (inputEl) {
      inputEl.focus();
    }
  }, 100);
  emit('focus');
};

// 选择表情
const selectEmoji = (emoji: string) => {
  commentText.value += emoji;
};

// 显示表情选择器
const showEmojiPicker = () => {
  showEmoji.value = true;
};

// 提交评论
const submitComment = () => {
  // 检查评论内容是否为空
  if (!commentText.value.trim()) return;
  
  // 发送评论内容
  emit('submit', commentText.value);
  
  // 提交后清空输入框
  commentText.value = '';
  
  // 关闭表情选择器
  showEmoji.value = false;
};
</script>

<style scoped>
.comment-input-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: white;
  border-top: 1px solid #f2f3f5;
  padding: 10px 16px;
  display: flex;
  align-items: center;
  z-index: 100;
}

.comment-input {
  flex: 1;
  background-color: #f7f8fa;
  border-radius: 20px;
}

.comment-input :deep(.van-field__control) {
  height: 36px;
  min-height: 36px;
}

.input-actions {
  display: flex;
  align-items: center;
  margin-left: 8px;
}

.emoji-icon {
  font-size: 24px;
  color: #969799;
  margin-right: 8px;
  cursor: pointer;
}

.send-btn {
  border-radius: 16px;
  background-color: #f2f3f5;
  color: #c8c9cc;
  border: none;
}

.send-btn-active {
  background-color: #1989fa;
  color: white;
}

.emoji-picker {
  padding: 16px;
}

.emoji-list {
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  gap: 8px;
}

.emoji-item {
  font-size: 24px;
  text-align: center;
  cursor: pointer;
  user-select: none;
  padding: 8px;
}

.emoji-item:active {
  background-color: #f2f3f5;
  border-radius: 4px;
}
</style> 