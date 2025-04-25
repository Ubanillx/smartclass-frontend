<template>
  <div>
    <!-- AI助手列表 -->
    <van-cell-group class="ai-assistant-module">
      <van-cell title="智慧体">
        <template #icon>
          <svg class="icon svg-icon ai-icon" aria-hidden="true">
            <use xlink:href="#icon-rengongzhinengjiqiren"></use>
          </svg>
        </template>
        <template #right-icon>
          <span class="more-link" @click="$emit('more')">更多</span>
        </template>
      </van-cell>

      <div class="assistant-list">
        <template v-if="assistants && assistants.length > 0">
          <div
            v-for="assistant in assistants"
            :key="assistant.id"
            class="assistant-item"
            @click="$emit('chat', assistant)"
          >
            <van-image :src="assistant.avatar" round width="50" height="50" />
            <div class="assistant-info">
              <div class="assistant-name">{{ assistant.name }}</div>
              <div class="assistant-desc-container">
                <div
                  class="assistant-desc"
                  :class="{ truncated: !expanded[assistant.id] }"
                >
                  {{ assistant.description }}
                </div>
                <span
                  v-if="shouldShowToggle(assistant.description)"
                  class="toggle-truncate"
                  @click.stop="toggleExpand(assistant.id)"
                >
                  {{ expanded[assistant.id] ? '收起' : '更多' }}
                </span>
              </div>
            </div>
            <van-icon name="chat-o" class="chat-icon" />
          </div>
        </template>
        <template v-else>
          <div class="empty-assistant">
            <van-empty description="暂无智慧体" />
          </div>
        </template>
      </div>
    </van-cell-group>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';

interface Assistant {
  id: number;
  name: string;
  description: string;
  avatar: string;
}

// 定义props
const props = defineProps<{
  assistants: Assistant[];
}>();

// 定义事件
defineEmits<{
  (e: 'chat', assistant: Assistant): void;
  (e: 'more'): void;
}>();

// 定义展开状态，默认所有描述都是收起的
const expanded = reactive<Record<number, boolean>>({});

// 切换展开状态
const toggleExpand = (id: number) => {
  expanded[id] = !expanded[id];
};

// 判断是否应该显示展开/收起按钮
const shouldShowToggle = (description: string) => {
  return description && description.length > 60;
};
</script>

<style scoped>
.ai-assistant-module {
  margin-bottom: 16px;
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(100, 101, 102, 0.08);
}

.more-link {
  color: #1989fa;
  font-size: var(--font-size-md);
}

.assistant-list {
  padding: 8px 16px;
}

.assistant-item {
  display: flex;
  align-items: flex-start;
  padding: 12px 0;
  border-bottom: 1px solid #ebedf0;
  cursor: pointer;
}

.assistant-item:last-child {
  border-bottom: none;
}

.assistant-info {
  flex: 1;
  margin-left: 12px;
  overflow: hidden;
}

.assistant-name {
  font-size: var(--font-size-md);
  color: #323233;
  margin-bottom: 4px;
  font-weight: 700;
}

.assistant-desc-container {
  position: relative;
}

.assistant-desc {
  font-size: var(--font-size-sm);
  color: #969799;
  line-height: 1.5;
  word-break: break-word;
  transition: max-height 0.3s;
}

.assistant-desc.truncated {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  max-height: 4.5em;
}

.toggle-truncate {
  color: #1989fa;
  font-size: 12px;
  cursor: pointer;
  padding-left: 4px;
  user-select: none;
}

.chat-icon {
  font-size: var(--font-size-lg);
  color: #1989fa;
  margin-top: 12px;
  margin-left: 6px;
}

:deep(.van-cell) {
  position: relative;
  padding: 12px 16px !important;
  transition: all 0.3s ease;
  border-radius: 0 !important;
  background-color: transparent !important;
  margin: 0 !important;
}

:deep(.van-cell:hover) {
  background-color: transparent !important;
}

:deep(.van-cell::after) {
  display: none !important;
}

.svg-icon {
  width: 1em;
  height: 1em;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
}

.ai-icon {
  font-size: var(--font-size-lg);
  margin-right: 4px;
  color: #1989fa;
  vertical-align: middle;
  display: flex;
  align-items: center;
  height: 24px;
}

:deep(.van-cell__title) {
  font-size: var(--font-size-md) !important;
}

.empty-assistant {
  padding: 30px 0;
  text-align: center;
}
</style>
