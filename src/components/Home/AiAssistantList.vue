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
        <template v-if="displayAssistants && displayAssistants.length > 0">
          <div
            v-for="assistant in displayAssistants"
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
          <div v-if="showLoadMore && assistants.length > displayLimit" class="load-more">
            <van-button size="small" type="default" @click="loadMore">查看更多</van-button>
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
import { ref, reactive, computed, onMounted } from 'vue';
import { showToast } from 'vant';
import { AiAvatarControllerService } from '../../services';
import type { AiAvatarVO } from '../../services/models/AiAvatarVO';

interface Assistant {
  id: number;
  name: string;
  description: string;
  avatar: string;
}

// 定义props
defineProps<{
  assistants: Assistant[];
  showLoadMore?: boolean;
}>();

// 定义事件
const emit = defineEmits<{
  (e: 'chat', assistant: Assistant): void;
  (e: 'more'): void;
  (e: 'loadMore'): void;
}>();

// 助手数据
const assistants = ref<Assistant[]>([]);
const loading = ref(false);
const error = ref<string | null>(null);

// 默认显示条数
const displayLimit = ref(3);
// 是否显示全部
const showAll = ref(false);

// 计算需要显示的助手列表
const displayAssistants = computed(() => {
  if (showAll.value) {
    return assistants.value;
  } else {
    return assistants.value.slice(0, displayLimit.value);
  }
});

// 从API获取智慧体数据
const fetchAiAssistants = async () => {
  loading.value = true;
  error.value = null;
  
  try {
    // 使用普通用户接口获取AI分身列表，替换管理员接口
    const response = await AiAvatarControllerService.listAiAvatarByPageUsingGet(
      undefined, // abilities
      undefined, // adminId
      undefined, // avatarUrl
      undefined, // category
      undefined, // createTime
      undefined, // creatorId
      1, // current - 默认第一页
      undefined, // description
      undefined, // id
      1, // isPublic - 只获取公开的智慧体
      undefined, // modelType
      undefined, // name
      20, // pageSize - 默认每页20条
      undefined, // personality
      undefined, // rating
      undefined, // sortField
      undefined, // sortOrder
      1, // status - 只获取正常状态的智慧体
      undefined, // tags
      undefined  // usageCount
    );

    if (response.code === 0 && response.data && response.data.records) {
      // 将AI分身信息转换为智能助手格式
      assistants.value = response.data.records.map((avatar: AiAvatarVO) => {
        return {
          id: avatar.id || 0,
          name: avatar.name || '未命名智慧体',
          description: avatar.description || '',
          avatar: avatar.avatarImgUrl || '/default.jpg',
        };
      });
    } else {
      error.value = '获取智慧体列表失败';
      showToast('获取智慧体列表失败');
    }
  } catch (err) {
    error.value = '网络连接失败，请检查网络设置后重试';
    showToast('加载智慧体信息失败');
    console.error(err);
  } finally {
    loading.value = false;
  }
};

// 加载更多
const loadMore = () => {
  showAll.value = true;
  // 通知父组件可能需要加载更多数据
  emit('loadMore');
};

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

// 组件挂载时加载AI分身信息
onMounted(() => {
  fetchAiAssistants();
});
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
  line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  max-height: 4.5em;
}

.toggle-truncate {
  color: #1989fa;
  font-size: var(--font-size-sm);
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

.load-more {
  display: flex;
  justify-content: center;
  margin-top: 12px;
  margin-bottom: 8px;
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
