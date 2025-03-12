<template>
  <div class="input-area">
    <van-field
      v-model="inputValue"
      placeholder="输入消息..."
      :border="false"
      type="textarea"
      autosize
      :disabled="disabled"
      @keypress.enter.prevent="handleEnterPress"
    >
      <template #button>
        <van-button 
          size="small" 
          type="primary" 
          :loading="disabled"
          :disabled="!inputValue.trim()"
          @click="sendMessage"
        >
          发送
        </van-button>
      </template>
      <template #right-icon>
        <div class="action-icons">
          <van-icon name="smile-o" size="20" @click="$emit('emoji')" />
          <van-icon name="photograph" size="20" @click="$emit('image')" />
          <van-icon name="records" size="20" @click="$emit('voice')" />
        </div>
      </template>
    </van-field>
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
  padding: 8px 16px;
  background-color: #fff;
  border-top: 1px solid #ebedf0;
}

.action-icons {
  display: flex;
  gap: 16px;
  color: #969799;
}

:deep(.van-field__button) {
  margin-left: 8px;
}

:deep(.van-field__right-icon) {
  margin-right: 8px;
}
</style> 