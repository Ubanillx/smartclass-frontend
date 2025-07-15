<template>
  <div class="qr-scanner">
    <van-nav-bar
      title="扫描二维码"
      left-arrow
      @click-left="handleBack"
      fixed
      placeholder
    />
    
    <div class="scanner-container">
      <div class="scanner-content">
        <div class="camera-tips">
          <p>将二维码对准框内，即可自动扫描</p>
        </div>
        
        <div class="scan-area">
          <div class="scan-frame">
            <div class="scan-corners">
              <div class="corner top-left"></div>
              <div class="corner top-right"></div>
              <div class="corner bottom-left"></div>
              <div class="corner bottom-right"></div>
            </div>
            <div class="scan-line" :class="{ scanning: isScanning }"></div>
          </div>
        </div>
        
        <div class="scanner-actions">
          <van-button 
            type="primary" 
            size="large"
            @click="captureAndScan"
            :loading="isScanning"
            class="scan-button"
          >
            {{ isScanning ? '扫描中...' : '拍照扫描' }}
          </van-button>
          
          <van-button 
            plain 
            type="primary" 
            size="normal"
            @click="selectFromGallery"
            :disabled="isScanning"
            class="gallery-button"
          >
            从相册选择
          </van-button>
        </div>
      </div>
    </div>
    
    <!-- 扫描结果弹窗 -->
    <van-dialog
      v-model:show="showResultDialog"
      title="扫描结果"
      show-cancel-button
      @confirm="handleConfirm"
      @cancel="handleCancel"
      confirm-button-text="确认"
      cancel-button-text="重新扫描"
    >
      <div class="result-content">
        <van-icon name="passed" color="#07c160" size="48px" />
        <p class="result-text">{{ scanResult }}</p>
      </div>
    </van-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { showToast } from 'vant';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import jsQR from 'jsqr';

interface QRScannerEmits {
  (e: 'scan-result', result: string): void;
  (e: 'scan-cancel'): void;
}

const emit = defineEmits<QRScannerEmits>();
const router = useRouter();

const isScanning = ref(false);
const showResultDialog = ref(false);
const scanResult = ref('');

// 返回上一页
const handleBack = () => {
  emit('scan-cancel');
  router.back();
};

// 拍照并扫描
const captureAndScan = async () => {
  try {
    isScanning.value = true;
    
    // 请求相机权限并拍照
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Camera,
    });

    if (image.dataUrl) {
      await processImage(image.dataUrl);
    }
  } catch (error) {
    console.error('拍照失败:', error);
    showToast('拍照失败，请重试');
  } finally {
    isScanning.value = false;
  }
};

// 从相册选择
const selectFromGallery = async () => {
  try {
    isScanning.value = true;
    
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Photos,
    });

    if (image.dataUrl) {
      await processImage(image.dataUrl);
    }
  } catch (error) {
    console.error('选择图片失败:', error);
    showToast('选择图片失败，请重试');
  } finally {
    isScanning.value = false;
  }
};

// 处理图片并识别二维码
const processImage = async (dataUrl: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      try {
        // 创建canvas来处理图片
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        if (!ctx) {
          reject(new Error('无法创建canvas上下文'));
          return;
        }

        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);

        // 获取图片数据
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        
        // 使用jsQR识别二维码
        const code = jsQR(imageData.data, imageData.width, imageData.height);
        
        if (code) {
          scanResult.value = code.data;
          showResultDialog.value = true;
          resolve();
        } else {
          showToast('未识别到二维码，请重试');
          resolve();
        }
      } catch (error) {
        console.error('处理图片失败:', error);
        showToast('处理图片失败，请重试');
        reject(error);
      }
    };
    
    img.onerror = () => {
      reject(new Error('图片加载失败'));
    };
    
    img.src = dataUrl;
  });
};

// 确认扫描结果
const handleConfirm = () => {
  emit('scan-result', scanResult.value);
  showResultDialog.value = false;
  router.back();
};

// 取消或重新扫描
const handleCancel = () => {
  showResultDialog.value = false;
  scanResult.value = '';
};

// 组件卸载时清理
onUnmounted(() => {
  // 清理任何可能的定时器或监听器
});
</script>

<style scoped>
.qr-scanner {
  height: 100vh;
  background: #000;
  position: relative;
  overflow: hidden;
}

.scanner-container {
  height: 100%;
  display: flex;
  flex-direction: column;
  padding-top: 46px; /* nav-bar height */
}

.scanner-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  gap: 40px;
}

.camera-tips {
  text-align: center;
  margin-bottom: 40px;
}

.camera-tips p {
  color: #fff;
  font-size: 16px;
  margin: 0;
  opacity: 0.8;
}

.scan-area {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  max-width: 300px;
}

.scan-frame {
  position: relative;
  width: 250px;
  height: 250px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 8px;
}

.scan-corners {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}

.corner {
  position: absolute;
  width: 20px;
  height: 20px;
  border: 3px solid #1989fa;
}

.corner.top-left {
  top: -3px;
  left: -3px;
  border-right: none;
  border-bottom: none;
}

.corner.top-right {
  top: -3px;
  right: -3px;
  border-left: none;
  border-bottom: none;
}

.corner.bottom-left {
  bottom: -3px;
  left: -3px;
  border-right: none;
  border-top: none;
}

.corner.bottom-right {
  bottom: -3px;
  right: -3px;
  border-left: none;
  border-top: none;
}

.scan-line {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg, transparent, #1989fa, transparent);
  opacity: 0;
}

.scan-line.scanning {
  animation: scanMove 2s ease-in-out infinite;
  opacity: 1;
}

@keyframes scanMove {
  0% {
    top: 0;
    opacity: 0;
  }
  10% {
    opacity: 1;
  }
  90% {
    opacity: 1;
  }
  100% {
    top: 100%;
    opacity: 0;
  }
}

.scanner-actions {
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
  max-width: 280px;
}

.scan-button {
  height: 48px;
  border-radius: 24px;
  font-size: 16px;
  font-weight: 600;
}

.gallery-button {
  height: 40px;
  border-radius: 20px;
  color: #1989fa;
  border-color: #1989fa;
  background: #fff;
}

.result-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px 16px;
}

.result-text {
  margin-top: 16px;
  word-break: break-all;
  color: #323233;
  text-align: center;
  line-height: 1.5;
  max-height: 120px;
  overflow-y: auto;
}

/* 平板和PC端适配 */
@media (min-width: 768px) {
  .scanner-content {
    max-width: 500px;
    margin: 0 auto;
  }
  
  .scan-area {
    max-width: 350px;
  }
  
  .scan-frame {
    width: 300px;
    height: 300px;
  }
}

</style>