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
          maxAspectRatio: 1,
        }"
        :stencil-component="CircleStencil"
        :resize-image="{
          touch: true,
          wheel: {
            ratio: 0.1,
          },
        }"
        :transitions="true"
        @change="onChange"
        ref="cropperRef"
      />
    </div>

    <div class="action-buttons">
      <van-button type="primary" block @click="onSave" :loading="uploading">{{
        uploading ? '上传中...' : '完成'
      }}</van-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { showToast, showSuccessToast, showLoadingToast } from 'vant';
import { BackButton } from '../../../components/Common';
import { Cropper, CircleStencil } from 'vue-advanced-cropper';
import 'vue-advanced-cropper/dist/style.css';
import { FileControllerService } from '../../../services/services/FileControllerService.ts';

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
      // 将canvas转换为Blob
      const blob = await new Promise<Blob>((resolve) => {
        canvas.toBlob(
          (blob: Blob | null) => {
            resolve(blob as Blob);
          },
          'image/jpeg',
          0.9,
        );
      });

      // 创建一个File对象，确保设置正确的类型
      const avatarFile = new File([blob], `avatar_${Date.now()}.jpg`, {
        type: 'image/jpeg',
      });

      // 上传图片到服务器
      const response =
        await FileControllerService.uploadAvatarUsingPost(avatarFile);

      // 检查是否未登录
      if (response.code === 40100) {
        showToast('登录已过期，请重新登录');
        setTimeout(() => {
          router.replace('/login');
        }, 1500);
        return;
      }

      if (response.code === 0 && response.data) {
        // 上传成功，获取图片URL
        const imageUrl = response.data;

        // 将图片URL传回个人资料页面
        router.replace({
          path: '/profile/settings/info',
          query: {
            avatarUrl: imageUrl,
          },
        });

        showSuccessToast('头像上传成功');
      } else {
        throw new Error(response.message || '上传失败');
      }
    } catch (error) {
      showToast('上传头像失败，请重试');
    } finally {
      uploading.value = false;
    }
  } catch (error) {
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
