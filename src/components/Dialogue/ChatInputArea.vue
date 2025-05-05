<template>
  <div class="input-container">
    <div class="input-wrapper">
      <textarea
        v-model="inputValue"
        :disabled="isLoading"
        @keypress.enter.prevent="handleEnterPress"
        placeholder="输入消息..."
        class="textarea"
        rows="2"
      ></textarea>
    </div>

    <div class="toolbar">
      <div class="action-icons">
        <van-icon name="smile-o" size="24" @click="$emit('emoji')" />
        <van-icon name="photograph" size="24" @click="$emit('image')" />
        <van-icon name="records" size="24" @click="$emit('voice')" />
        <van-icon
          name="expand-o"
          size="24"
          @click="$emit('fullscreen')"
        />
      </div>
      <van-button
        size="normal"
        type="primary"
        :disabled="isLoading || !inputValue.trim()"
        :loading="isLoading"
        @click="sendMessage"
        class="send-button"
      >
        {{ isLoading ? '等待中...' : '发送' }}
      </van-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';

// 定义props
const props = defineProps<{
  modelValue: string;
  isLoading?: boolean;
}>();

// 定义emit
const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void;
  (e: 'send', message: string): void;
  (e: 'emoji'): void;
  (e: 'image'): void;
  (e: 'voice'): void;
  (e: 'fullscreen'): void;
}>();

const inputValue = ref(props.modelValue);

// 监听modelValue变化
watch(
  () => props.modelValue,
  (newVal) => {
    inputValue.value = newVal;
  },
);

// 监听inputValue变化
watch(
  inputValue, 
  (newVal) => {
    emit('update:modelValue', newVal);
  }
);

// 处理回车键
const handleEnterPress = (e: KeyboardEvent): void => {
  // 如果按下Shift+Enter，则插入换行符
  if (e.shiftKey) {
    return;
  }

  // 否则发送消息
  sendMessage();
};

// 发送消息
const sendMessage = (): void => {
  if (inputValue.value.trim() && !props.isLoading) {
    emit('send', inputValue.value);
    inputValue.value = '';
  }
};
</script>

<style scoped>
.input-container {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: #fff;
  padding: 12px 16px;
  border-top: 1px solid #eaeaea;
  display: flex;
  flex-direction: column;
  z-index: 10;
  box-sizing: border-box;
}

.input-wrapper {
  width: 100%;
  position: relative;
  margin-bottom: 10px;
}

.textarea {
  resize: none;
  border: 1px solid #eaeaea;
  border-radius: 8px;
  background-color: #f9f9f9;
  padding: 12px 14px;
  font-size: 15px;
  line-height: 1.5;
  min-height: 60px;
  max-height: 120px;
  width: 100%;
  box-sizing: border-box;
  outline: none;
  overflow-y: auto;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
}

.textarea:focus {
  border-color: #5e72e4;
  background-color: #fff;
}

.toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.action-icons {
  display: flex;
  gap: 24px;
  color: #969799;
}

.send-button {
  height: 36px;
  padding: 0 18px;
  font-size: 15px;
  font-weight: 500;
  background-color: #1989fa;
  border-radius: 4px;
}
</style> 