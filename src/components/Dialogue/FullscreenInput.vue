<template>
  <van-popup
    :show="show"
    @update:show="updateShow"
    position="bottom"
    :style="{ height: '80%' }"
    round
  >
    <div class="fullscreen-input">
      <div class="fullscreen-header">
        <span class="title">编辑消息</span>
        <van-icon name="cross" size="20" @click="closeFullscreen" />
      </div>
      <div class="fullscreen-content">
        <div class="textarea-container">
          <textarea
            v-model="inputValue"
            placeholder="输入消息..."
            class="custom-textarea"
            rows="12"
          ></textarea>
        </div>
      </div>
      <div class="fullscreen-footer">
        <div class="footer-left">
          <div class="action-icons">
            <van-icon name="smile-o" size="20" @click="$emit('emoji')" />
            <van-icon name="photograph" size="20" @click="$emit('image')" />
            <van-icon name="records" size="20" @click="$emit('voice')" />
          </div>
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
  </van-popup>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';

// 定义props
const props = defineProps<{
  show: boolean;
  modelValue: string;
  isLoading?: boolean;
}>();

// 定义emit
const emit = defineEmits<{
  (e: 'update:show', value: boolean): void;
  (e: 'update:modelValue', value: string): void;
  (e: 'send'): void;
  (e: 'emoji'): void;
  (e: 'image'): void;
  (e: 'voice'): void;
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

// 更新show状态
const updateShow = (value: boolean) => {
  emit('update:show', value);
};

// 关闭全屏输入框
const closeFullscreen = () => {
  emit('update:show', false);
};

// 发送消息
const sendMessage = () => {
  if (inputValue.value.trim() && !props.isLoading) {
    emit('send');
    closeFullscreen();
  }
};
</script>

<style scoped>
.fullscreen-input {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.fullscreen-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid #ebedf0;
}

.fullscreen-header .title {
  font-size: var(--font-size-md, 16px);
  font-weight: 700;
  font-family: 'Noto Sans SC', sans-serif;
}

.fullscreen-content {
  flex: 1;
  padding: 16px;
  overflow: hidden;
}

.fullscreen-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  border-top: 1px solid #ebedf0;
}

.fullscreen-footer .action-icons {
  display: flex;
  gap: 24px;
  color: #969799;
}

.fullscreen-footer .send-button {
  border-radius: 4px;
  padding: 0 14px;
  height: 32px;
  font-size: 14px;
}

.textarea-container {
  height: 100%;
  width: 100%;
}

.custom-textarea {
  width: 100%;
  height: 100%;
  min-height: 400px;
  background-color: #f9f9f9;
  border-radius: 6px;
  border: 1px solid #eaeaea;
  padding: 16px;
  font-size: 16px;
  line-height: 1.5;
  resize: none;
  font-family: inherit;
  outline: none;
  box-sizing: border-box;
  overflow-y: auto;
  box-shadow: inset 0 1px 4px rgba(0, 0, 0, 0.05);
}

.custom-textarea:focus {
  border-color: #5e72e4;
  background-color: #fff;
}
</style> 