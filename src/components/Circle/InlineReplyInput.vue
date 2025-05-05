<template>
  <div class="inline-reply-input">
    <van-field
      v-model="replyText"
      :placeholder="placeholder"
      class="reply-field"
      :autofocus="true"
    >
      <template #button>
        <div class="reply-actions">
          <van-icon name="smile-o" class="emoji-icon" @click="showEmojiPicker" />
          <van-button 
            size="small" 
            :loading="submitting"
            :disabled="!replyText.trim() || submitting" 
            :class="['send-btn', {'send-btn-active': replyText.trim() && !submitting}]"
            @click="submitReply"
          >
            {{ submitting ? '' : '回复' }}
          </van-button>
        </div>
      </template>
    </van-field>

    <!-- 取消按钮 -->
    <div class="cancel-reply" @click="cancelReply">取消</div>

    <!-- 表情选择弹出层 -->
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
import { ref, defineProps, defineEmits, onMounted } from 'vue';

interface ReplyInputProps {
  username: string;
  submitting?: boolean;
}

const props = withDefaults(defineProps<ReplyInputProps>(), {
  submitting: false
});

const emit = defineEmits<{
  (e: 'submit', text: string): void;
  (e: 'cancel'): void;
}>();

const replyText = ref(`@${props.username} `);
const showEmoji = ref(false);
const placeholder = `回复 ${props.username}...`;

// 模拟表情列表
const emojiList = ['😀', '😃', '😄', '😁', '😆', '😅', '😂', '🤣', '😊', '😇', '🙂', '🙃', '😉', '😌', '😍', '🥰', '😘', '😗', '😙', '😚', '😋', '😛', '😝', '😜', '🤪', '🤨', '🧐', '🤓', '😎', '🤩', '🥳', '😏'];

// 聚焦输入框
onMounted(() => {
  // 自动聚焦
  setTimeout(() => {
    const inputEl = document.querySelector('.reply-field input') as HTMLInputElement;
    if (inputEl) {
      inputEl.focus();
    }
  }, 100);
});

// 选择表情
const selectEmoji = (emoji: string) => {
  replyText.value += emoji;
};

// 显示表情选择器
const showEmojiPicker = () => {
  showEmoji.value = true;
};

// 提交回复
const submitReply = () => {
  // 检查回复内容是否为空
  if (!replyText.value.trim()) return;
  
  // 发送回复内容
  emit('submit', replyText.value);
  
  // 提交后清空输入框
  replyText.value = '';
  
  // 关闭表情选择器
  showEmoji.value = false;
};

// 取消回复
const cancelReply = () => {
  // 触发取消事件
  emit('cancel');
  
  // 关闭表情选择器
  showEmoji.value = false;
};
</script>

<style scoped>
.inline-reply-input {
  background-color: #f7f8fa;
  border-radius: 12px;
  margin: 12px 0;
  padding: 6px 10px;
  position: relative;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
}

.reply-field {
  width: 100%;
  background-color: transparent;
}

.reply-field :deep(.van-field__control) {
  height: 36px;
  min-height: 36px;
}

.reply-field :deep(.van-field__value) {
  border-radius: 18px;
  background-color: rgba(255, 255, 255, 0.5);
  padding: 0 6px;
}

.reply-actions {
  display: flex;
  align-items: center;
  margin-left: 8px;
}

.emoji-icon {
  font-size: 24px;
  color: #969799;
  margin-right: 8px;
  cursor: pointer;
  transition: color 0.2s;
}

.emoji-icon:hover {
  color: #646566;
}

.send-btn {
  border-radius: 18px;
  background-color: #f2f3f5;
  color: #c8c9cc;
  border: none;
  padding: 0 12px;
  height: 32px;
  line-height: 32px;
  transition: all 0.2s;
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
  border-radius: 8px;
  transition: background-color 0.2s;
}

.emoji-item:hover {
  background-color: #f2f3f5;
}

/* 取消回复按钮样式 */
.cancel-reply {
  position: absolute;
  right: 8px;
  top: -28px;
  color: #969799;
  font-size: 12px;
  background-color: rgba(255, 255, 255, 0.9);
  padding: 3px 8px;
  border-radius: 12px;
  cursor: pointer;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: all 0.2s;
}

.cancel-reply:hover {
  color: #1989fa;
  background-color: white;
}
</style> 