<template>
  <div class="back-button">
    <div class="icon-wrapper" @click="handleClick">
      <van-icon name="arrow-left" :size="iconSize" />
    </div>
    <span v-if="title" class="page-title">{{ title }}</span>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';

interface Props {
  title?: string;
  iconSize?: string | number;
  customPath?: string;
  preventDefault?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  title: '',
  iconSize: '20',
  customPath: '',
  preventDefault: false,
});

// 定义点击事件
const emit = defineEmits<{
  (e: 'click'): void;
}>();

const router = useRouter();

const handleClick = (): void => {
  // 发送点击事件给父组件
  emit('click');

  // 如果设置了阻止默认事件，则不执行默认的导航行为
  if (props.preventDefault) {
    return;
  }

  // 否则执行默认导航行为
  if (props.customPath) {
    router.push(props.customPath);
  } else {
    router.back();
  }
};
</script>

<style scoped>
.back-button {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  background: linear-gradient(
    to right,
    rgba(255, 255, 255, 0.95),
    rgba(255, 255, 255, 0.85)
  );
  backdrop-filter: blur(10px);
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: 0 1px 6px rgba(0, 0, 0, 0.05);
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

.icon-wrapper {
  display: inline-flex;
  cursor: pointer;
}

.back-button .van-icon {
  color: #323233;
  padding: 6px;
  border-radius: 50%;
  background-color: rgba(0, 0, 0, 0.03);
  transition: all 0.2s ease;
}

.icon-wrapper:active .van-icon {
  background-color: rgba(0, 0, 0, 0.08);
  transform: scale(0.95);
}

.page-title {
  font-size: var(--font-size-md, 16px);
  font-weight: 700;
  margin-left: 12px;
  color: #323233;
  font-family: 'Noto Sans SC', sans-serif;
}
</style>
