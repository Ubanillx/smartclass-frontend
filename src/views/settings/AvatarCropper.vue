<!-- src/views/settings/AvatarCropper.vue -->
<template>
  <div class="avatar-cropper">
    <back-button title="裁剪头像" />
    
    <div class="cropper-wrapper">
      <Cropper
        v-if="cropperVisible"
        :imagePath="imagePath"
        fileType="blob"
        :cropSize="200"
        :fixedBox="true"
        @save="onCropperSave"
        @cancel="onCancel"
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
import Cropper from 'vue3-cropper';
import 'vue3-cropper/lib/vue3-cropper.css';
import { FileControllerService } from '../../services';

const router = useRouter();
const route = useRoute();

const imagePath = ref('');
const cropperVisible = ref(false);
const cropperRef = ref<any>(null);
const uploading = ref(false);

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

// 保存裁剪结果 - 直接触发裁剪组件内部的保存事件
const onSave = (): void => {
  if (uploading.value) return;
  
  try {
    // 查找裁剪组件内部的保存按钮并点击它
    const saveButton = document.querySelector('.cropper-save-btn');
    if (saveButton) {
      (saveButton as HTMLElement).click();
    } else {
      // 如果找不到保存按钮，尝试直接获取裁剪数据
      if (cropperRef.value && typeof cropperRef.value.getCropData === 'function') {
        cropperRef.value.getCropData((data: string | Blob) => {
          onCropperSave(data);
        });
      } else {
        showToast('裁剪失败，请重试');
      }
    }
  } catch (error) {
    console.error('裁剪失败:', error);
    showToast('裁剪失败，请重试');
  }
};

// 裁剪完成后的回调
const onCropperSave = async (res: string | Blob): Promise<void> => {
  uploading.value = true;
  
  try {
    let imageFile: Blob;
    
    if (res instanceof Blob) {
      imageFile = res;
    } else {
      // 如果是base64字符串，转换为Blob
      const base64Data = res.split(',')[1] || '';
      const byteCharacters = atob(base64Data);
      const byteArrays = [];
      
      for (let i = 0; i < byteCharacters.length; i++) {
        byteArrays.push(byteCharacters.charCodeAt(i));
      }
      
      const byteArray = new Uint8Array(byteArrays);
      imageFile = new Blob([byteArray], { type: 'image/jpeg' });
    }
    
    // 上传图片到服务器
    const response = await FileControllerService.uploadImageUsingPost(imageFile);
    
    if (response.code === 0 && response.data) {
      // 上传成功，获取图片URL
      const imageUrl = response.data;
      
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
    uploading.value = false;
  }
};

// 取消裁剪
const onCancel = (): void => {
  router.back();
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

:deep(.vue3-cropper) {
  height: 100% !important;
  width: 100% !important;
  position: absolute !important;
  top: 0;
  left: 0;
}

:deep(.cropper-box) {
  border-radius: 50%;
}

/* 隐藏裁剪组件内部的工具栏 */
:deep(.cropper-toolbar) {
  display: none !important;
}
</style> 