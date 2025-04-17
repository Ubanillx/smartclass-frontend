<template>
  <div class="intelligence-center-content">
    <!-- 智能助手列表 -->
    <chat-list 
      v-if="!loading && !error && assistants.length > 0" 
      :chats="assistants" 
      :show-status="true" 
      @select="handleAssistantSelect" 
    />
    
    <!-- 加载状态 -->
    <div v-if="loading" class="loading-container">
      <van-loading type="spinner" size="32" color="#1989fa" />
      <p>正在加载智慧体列表...</p>
    </div>
    
    <!-- 错误状态 -->
    <network-error 
      v-if="error" 
      :message="error" 
      :loading="retryLoading"
      @retry="retryLoadData"
    />
    
    <!-- 空状态 -->
    <div v-if="!loading && assistants.length === 0 && !error" class="empty-container">
      <van-empty description="暂无智慧体数据" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, defineEmits } from 'vue';
import { ChatList } from '../../../components/Dialogue';
import { NetworkError } from '../../../components/Common';
import { showToast } from 'vant';
import { AiAvatarControllerService } from '../../../services';
import type { AiAvatarBriefVO } from '../../../services/models/AiAvatarBriefVO';

interface Assistant {
  id: number;
  assistantId: number;
  assistantName: string;
  avatar: string;
  lastMessage: string;
  summary?: string;
  lastTime: string;
  online?: boolean;
  tags?: string[];
  type: number;
}

const emit = defineEmits<{
  (e: 'select', assistantId: number): void;
}>();

// 智能助手数据
const assistants = ref<Assistant[]>([]);
const loading = ref<boolean>(false);
const retryLoading = ref<boolean>(false);
const error = ref<string>('');

// 重试加载数据
const retryLoadData = () => {
  retryLoading.value = true;
  loadAiAvatars().finally(() => {
    retryLoading.value = false;
  });
};

// 从API加载AI分身信息
const loadAiAvatars = async () => {
  loading.value = true;
  error.value = '';
  
  try {
    // 获取所有AI分身信息
    const response = await AiAvatarControllerService.listAllAiAvatarUsingGet();
    
    if (response.code === 0 && response.data) {
      // 将AI分身信息转换为智能助手格式
      assistants.value = response.data.map((avatar: AiAvatarBriefVO) => {
        // 将tags字符串转换为数组
        const tagsList = avatar.tags ? avatar.tags.split(',').map(tag => tag.trim()) : [];
        
        return {
          id: avatar.id || 0,
          assistantId: avatar.id || 0,
          assistantName: avatar.name || '未命名智慧体',
          avatar: avatar.avatarImgUrl || '/default.jpg',
          lastMessage: '',
          summary: avatar.description || '',
          lastTime: '在线',
          online: true,
          tags: tagsList,
          type: avatar.status || 1,
        };
      });
    } else {
      error.value = '获取智慧体列表失败，请检查网络连接';
      showToast('获取AI分身列表失败');
    }
  } catch (err) {
    error.value = '网络连接失败，请检查网络设置后重试';
    showToast('加载AI分身信息失败');
  } finally {
    loading.value = false;
  }
};

// 处理助手选择
const handleAssistantSelect = (assistant: Assistant) => {
  emit('select', assistant.assistantId);
};

// 组件挂载时加载AI分身信息
onMounted(() => {
  loadAiAvatars();
});
</script>

<style scoped>
.intelligence-center-content {
  width: 100%;
  position: relative;
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 0;
}

.loading-container p {
  margin-top: 12px;
  color: #666;
  font-size: 14px;
  font-family: 'Noto Sans SC', sans-serif;
}

.empty-container {
  padding: 40px 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
</style>
