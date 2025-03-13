<!-- src/views/settings/AvatarCropper.vue -->
<template>
  <div class="avatar-cropper">
    <back-button title="裁剪头像" />
    
    <div class="cropper-wrapper">
      <Cropper
        v-if="cropperVisible"
        :src="imagePath"
        :stencil-props="{
          aspectRatio: 1,
          minAspectRatio: 1,
          maxAspectRatio: 1
        }"
        :stencil-component="CircleStencil"
        :resize-image="{
          touch: true,
          wheel: {
            ratio: 0.1
          }
        }"
        :transitions="true"
        @change="onChange"
        ref="cropperRef"
      />
    </div>
    
    <div class="action-buttons">
      <van-button type="primary" block @click="onSave" :loading="uploading">{{ uploading ? '上传中...' : '完成' }}</van-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { showToast, showSuccessToast, showLoadingToast } from 'vant';
import { BackButton } from '../../components/common';
import { Cropper, CircleStencil } from 'vue-advanced-cropper';
import 'vue-advanced-cropper/dist/style.css';
import { FileControllerService } from '../../services';

const router = useRouter();
const route = useRoute();

const imagePath = ref('');
const cropperVisible = ref(false);
const cropperRef = ref<any>(null);
const uploading = ref(false);
const cropperResult = ref<any>(null);

// 取消裁剪的回调
const onCancel = (): void => {
  router.back();
};

// 初始化裁剪组件
onMounted(() => {
  // 从路由参数中获取图片路径
  const imageUrl = route.query.imageUrl as string;
  if (imageUrl) {
    imagePath.value = decodeURIComponent(imageUrl);
    setTimeout(() => {
      cropperVisible.value = true;
    }, 100);
  } else {
    showToast('未找到图片');
    router.back();
  }
});

// 裁剪变化时的回调
const onChange = (result: any): void => {
  cropperResult.value = result;
  console.log('裁剪变化:', result);
};

// 保存裁剪结果
const onSave = async (): Promise<void> => {
  if (uploading.value) return;
  
  try {
    if (!cropperRef.value || !cropperResult.value) {
      showToast('裁剪组件未初始化，请重试');
      return;
    }
    
    uploading.value = true;
    showLoadingToast({
      message: '上传中...',
      forbidClick: true,
    });
    
    // 获取裁剪后的canvas
    const { canvas } = cropperResult.value;
    
    try {
      // 将canvas转换为base64
      const base64Data = canvas.toDataURL('image/jpeg', 0.9);
      console.log('裁剪结果base64前缀:', base64Data.substring(0, 30) + '...');
      
      // 确保base64数据格式正确 - 只保留base64编码部分，去掉前缀
      let base64Content = '';
      if (base64Data.indexOf('base64,') >= 0) {
        base64Content = base64Data.split('base64,')[1];
      } else {
        base64Content = base64Data;
      }
      
      console.log('处理后的base64长度:', base64Content.length);
      
      // 测试base64数据是否有效
      try {
        const testBlob = await fetch(`data:image/jpeg;base64,${base64Content}`).then(res => res.blob());
        console.log('测试base64转换为Blob成功，大小:', testBlob.size, 'bytes');
      } catch (e) {
        console.error('测试base64转换失败:', e);
      }
      
      // 构建上传请求
      const uploadRequest = {
        base64Data: base64Content,
        biz: 'avatar',
        filename: `avatar_${Date.now()}.jpg`,
        description: '用户头像'
      };
      
      // 上传图片到服务器
      console.log('开始上传base64图片...');
      const response = await FileControllerService.uploadBase64ImageUsingPost(uploadRequest);
      console.log('上传响应:', response);
      
      // 检查是否未登录
      if (response.code === 40100) {
        showToast('登录已过期，请重新登录');
        // 可以在这里添加重定向到登录页面的逻辑
        setTimeout(() => {
          router.replace('/login');
        }, 1500);
        return;
      }
      
      if (response.code === 0 && response.data) {
        // 上传成功，获取图片URL
        const imageUrl = response.data;
        console.log('上传成功，URL:', imageUrl);
        
        // 将图片URL传回个人资料页面
        router.replace({
          path: '/settings/profile',
          query: {
            avatarUrl: imageUrl
          }
        });
        
        showSuccessToast('头像上传成功');
      } else {
        throw new Error(response.message || '上传失败');
      }
    } catch (error) {
      console.error('上传头像失败:', error);
      showToast('上传头像失败，请重试');
    } finally {
      uploading.value = false;
    }
  } catch (error) {
    console.error('裁剪失败:', error);
    showToast('裁剪失败，请重试');
    uploading.value = false;
  }
};
</script>

<style scoped>
.avatar-cropper {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: #fff;
}

.cropper-wrapper {
  flex: 1;
  overflow: hidden;
  position: relative;
  margin-bottom: 10px;
}

.action-buttons {
  padding: 16px;
  background-color: #fff;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 10;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.05);
}

:deep(.vue-advanced-cropper) {
  height: 100% !important;
  width: 100% !important;
}

:deep(.vue-circle-stencil) {
  box-shadow: 0 0 0 9999px rgba(0, 0, 0, 0.5);
}
</style> 