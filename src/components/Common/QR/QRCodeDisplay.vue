<template>
  <div class="qr-display">
    <div class="qr-header">
      <back-button title="我的二维码" @click="handleBack" />
      <div class="header-actions">
        <van-icon name="share" @click="handleShare" class="share-icon" />
      </div>
    </div>
    
    <div class="qr-container">
      <div class="qr-card">
        <!-- 用户信息头部 -->
        <div class="user-header">
          <div class="user-avatar">
            <van-image 
              round 
              width="60" 
              height="60" 
              :src="userInfo?.userAvatar || 'https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg'" 
            />
          </div>
          <div class="user-info">
            <div class="user-name">{{ userInfo?.userName || '未知用户' }}</div>
            <div class="user-desc">{{ userInfo?.userProfile || '智云星课用户' }}</div>
          </div>
        </div>
        
        <!-- 二维码区域 -->
        <div class="qr-code-area">
          <div class="qr-code-container" ref="qrCodeContainer">
            <canvas 
              ref="qrCanvas" 
              :width="qrSize" 
              :height="qrSize"
              class="qr-canvas"
            ></canvas>
          </div>
          <div class="qr-tips">
            <p>扫一扫上方二维码，加我为好友</p>
          </div>
        </div>
        
        <!-- 用户ID信息 -->
        <div class="user-id-info">
          <div class="id-item">
            <span class="id-label">用户ID:</span>
            <span class="id-value">{{ userInfo?.id }}</span>
            <van-button 
              size="mini" 
              type="primary" 
              plain 
              @click="copyUserId"
              class="copy-btn"
            >
              复制
            </van-button>
          </div>
        </div>
      </div>
      
      <!-- 操作按钮 -->
      <div class="actions">
        <van-button 
          type="primary" 
          size="large" 
          @click="handleSaveToAlbum"
          :loading="isSaving"
          class="save-button"
        >
          保存到相册
        </van-button>
        <van-button 
          plain 
          type="primary" 
          size="large" 
          @click="handleRefresh"
          :loading="isGenerating"
          class="refresh-button"
        >
          刷新二维码
        </van-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick, computed } from 'vue';
import { useRouter } from 'vue-router';
import { showToast, showSuccessToast } from 'vant';
import { useUserStore } from '../../../stores/userStore.ts';
import QRCode from 'qrcode';
import { generateUserQRData } from '../../../utils/qrUtils.ts';
import BackButton from '../BackButton.vue';

const router = useRouter();
const userStore = useUserStore();

const qrCanvas = ref<HTMLCanvasElement>();
const qrCodeContainer = ref<HTMLDivElement>();
const isGenerating = ref(false);
const isSaving = ref(false);
const qrSize = ref(200);

// 获取用户信息
const userInfo = computed(() => userStore.userInfo);

// 生成二维码数据
const generateQRData = () => {
  if (!userInfo.value?.id) {
    return 'smartclass://user/unknown';
  }
  
  return generateUserQRData(
    userInfo.value.id,
    userInfo.value.userName
  );
};

// 生成二维码
const generateQRCode = async () => {
  if (!qrCanvas.value) return;
  
  try {
    isGenerating.value = true;
    
    const qrData = generateQRData();
    
    // 二维码生成选项
    const options = {
      width: qrSize.value,
      height: qrSize.value,
      margin: 1,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      },
      errorCorrectionLevel: 'M' as const
    };
    
    // 生成二维码到canvas
    await QRCode.toCanvas(qrCanvas.value, qrData, options);
    
  } catch (error) {
    console.error('生成二维码失败:', error);
    showToast('生成二维码失败');
  } finally {
    isGenerating.value = false;
  }
};

// 返回上一页
const handleBack = () => {
  router.back();
};

// 分享二维码
const handleShare = async () => {
  try {
    if (navigator.share && qrCanvas.value) {
      // 将canvas转为blob
      qrCanvas.value.toBlob(async (blob) => {
        if (blob) {
          const file = new File([blob], 'my-qrcode.png', { type: 'image/png' });
          await navigator.share({
            title: '我的二维码',
            text: '扫一扫，添加我为好友',
            files: [file]
          });
        }
      });
    } else {
      // 降级处理：复制二维码数据
      const qrData = generateQRData();
      await navigator.clipboard.writeText(qrData);
      showSuccessToast('二维码信息已复制到剪贴板');
    }
  } catch (error) {
    console.error('分享失败:', error);
    showToast('分享失败');
  }
};

// 复制用户ID
const copyUserId = async () => {
  if (!userInfo.value?.id) {
    showToast('用户ID无效');
    return;
  }
  
  try {
    await navigator.clipboard.writeText(userInfo.value.id.toString());
    showSuccessToast('用户ID已复制');
  } catch (error) {
    console.error('复制失败:', error);
    showToast('复制失败');
  }
};

// 保存到相册
const handleSaveToAlbum = async () => {
  if (!qrCanvas.value) {
    showToast('二维码未生成');
    return;
  }
  
  try {
    isSaving.value = true;
    
    // 将canvas转换为dataURL
    const dataURL = qrCanvas.value.toDataURL('image/png', 1.0);
    
    // 创建下载链接
    const link = document.createElement('a');
    link.download = `smartclass-qrcode-${userInfo.value?.id || 'user'}.png`;
    link.href = dataURL;
    
    // 触发下载
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    showSuccessToast('二维码已保存');
  } catch (error) {
    console.error('保存失败:', error);
    showToast('保存失败');
  } finally {
    isSaving.value = false;
  }
};

// 刷新二维码
const handleRefresh = () => {
  generateQRCode();
};

// 响应式调整二维码大小
const updateQRSize = () => {
  if (qrCodeContainer.value) {
    const containerWidth = qrCodeContainer.value.clientWidth;
    qrSize.value = Math.min(200, containerWidth - 40);
    nextTick(() => {
      generateQRCode();
    });
  }
};

// 组件挂载时生成二维码
onMounted(async () => {
  await nextTick();
  updateQRSize();
  
  // 监听窗口大小变化
  window.addEventListener('resize', updateQRSize);
});
</script>

<style scoped>
.qr-display {
  min-height: 100vh;
  background-color: #f2f7fd;
  padding-bottom: 20px;
  padding-top: env(safe-area-inset-top);
}

.header-actions {
  position: absolute;
  top: 50%;
  right: 16px;
  transform: translateY(-50%);
}

.share-icon {
  font-size: 20px;
  color: #fff;
  cursor: pointer;
  padding: 8px;
  transition: opacity 0.2s;
}

.share-icon:hover {
  opacity: 0.8;
}

.qr-container {
  padding: 20px 16px;
}

.qr-card {
  background: #fff;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
  max-width: 400px;
  margin-left: auto;
  margin-right: auto;
}

.user-header {
  display: flex;
  align-items: center;
  margin-bottom: 24px;
  padding-bottom: 20px;
  border-bottom: 1px solid #f0f0f0;
}

.user-avatar {
  margin-right: 16px;
}

.user-info {
  flex: 1;
}

.user-name {
  font-size: 18px;
  font-weight: 600;
  color: #323233;
  margin-bottom: 4px;
}

.user-desc {
  font-size: 14px;
  color: #969799;
}

.qr-code-area {
  text-align: center;
  margin-bottom: 24px;
}

.qr-code-container {
  display: flex;
  justify-content: center;
  margin-bottom: 16px;
  padding: 16px;
  background: #f8f9fa;
  border-radius: 12px;
  border: 2px dashed #e0e0e0;
}

.qr-canvas {
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.qr-tips {
  text-align: center;
}

.qr-tips p {
  font-size: 14px;
  color: #969799;
  margin: 0;
}

.user-id-info {
  border-top: 1px solid #f0f0f0;
  padding-top: 20px;
}

.id-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 0;
}

.id-label {
  font-size: 14px;
  color: #969799;
}

.id-value {
  font-size: 14px;
  color: #323233;
  font-weight: 500;
  flex: 1;
  text-align: center;
}

.copy-btn {
  margin-left: 8px;
}

.actions {
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-width: 400px;
  margin: 0 auto;
}

.save-button,
.refresh-button {
  height: 48px;
  border-radius: 24px;
  font-size: 16px;
  font-weight: 600;
}

.refresh-button {
  background: transparent;
  border-color: #1989fa;
  color: #1989fa;
}

/* 平板和PC端适配 */
@media (min-width: 768px) {
  .qr-container {
    max-width: 500px;
    margin: 0 auto;
  }
  
  .actions {
    flex-direction: row;
    gap: 16px;
  }
  
  .save-button,
  .refresh-button {
    flex: 1;
  }
}


</style> 