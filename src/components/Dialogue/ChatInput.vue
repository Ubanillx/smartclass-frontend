<template>
  <div class="input-area">
    <!-- 输入框 -->
    <van-field
      v-model="inputValue"
      placeholder="输入消息..."
      :border="false"
      type="textarea"
      :autosize="{ minHeight: 60, maxHeight: 100 }"
      :rows="3"
      :disabled="disabled"
      @keypress.enter.prevent="handleEnterPress"
      class="grey-input"
    />
    
    <!-- 功能按钮工具栏 -->
    <div class="toolbar">
      <div class="action-icons">
        <van-icon name="expand-o" size="20" @click="$emit('fullscreen')" />
        <van-icon name="smile-o" size="20" @click="$emit('emoji')" />
        <van-icon name="photograph" size="20" @click="$emit('image')" />
        <van-icon name="records" size="20" @click="$emit('voice')" />
      </div>
      <van-button 
        size="mini" 
        type="primary" 
        :loading="disabled"
        :disabled="!inputValue.trim()"
        @click="sendMessage"
        class="send-button"
      >
        发送
      </van-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';

// 定义props
const props = defineProps<{
  modelValue: string;
  disabled?: boolean;
}>();

// 定义事件
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
watch(() => props.modelValue, (newVal) => {
  inputValue.value = newVal;
});

// 监听inputValue变化
watch(inputValue, (newVal) => {
  emit('update:modelValue', newVal);
});

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
  if (inputValue.value.trim() && !props.disabled) {
    emit('send', inputValue.value);
    inputValue.value = '';
  }
};
</script>

<style scoped>
.input-area {
  padding: 12px 16px;
  background-color: #fff;
  border-top: 1px solid #ebedf0;
}

.toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 10px;
  padding-left: 4px;
}

.action-icons {
  display: flex;
  gap: 24px;
  color: #969799;
}

.send-button {
  border-radius: 4px;
  padding: 0 14px;
  height: 32px;
  font-size: 14px;
}

:deep(.van-field__control) {
  min-height: 60px !important;
  max-height: 100px !important;
  overflow-y: auto;
  padding: 8px 0;
  line-height: 1.5;
}

/* 添加灰色输入框样式 */
.grey-input {
  background-color: #f5f5f5;
  border-radius: 8px;
  padding: 0 12px;
}

:deep(.grey-input .van-field__control) {
  background-color: #f5f5f5;
}

:deep(.van-icon) {
  cursor: pointer;
}
</style> 