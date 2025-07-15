<template>
  <div class="qr-scan-page">
    <QRCodeScanner 
      @scan-result="handleScanResult" 
      @scan-cancel="handleScanCancel"
    />
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { showToast, showSuccessToast } from 'vant';
import { QRCodeScanner } from '../../components/Common';
import { FriendRequestControllerService } from '../../services/services/FriendRequestControllerService';
import { useUserStore } from '../../stores/userStore';
import { parseQRData, handleUserQRResult, getQRTypeDisplayName } from '../../utils/qrUtils';

const router = useRouter();
const userStore = useUserStore();

// 处理扫描结果
const handleScanResult = async (result: string) => {
  try {
    // 解析二维码内容
    const parseResult = parseQRData(result);
    
    if (!parseResult.success) {
      showToast(parseResult.error || '二维码解析失败');
      return;
    }
    
    // 根据类型处理
    switch (parseResult.type) {
      case 'user_card':
        if (parseResult.data && 'userId' in parseResult.data) {
          await handleAddFriendQR(parseResult.data);
        }
        break;
      case 'url':
        if (parseResult.data && 'url' in parseResult.data) {
          showToast(`网址: ${parseResult.data.url}`);
        }
        break;
      case 'text':
        if (parseResult.data && 'text' in parseResult.data) {
          showToast(`文本: ${parseResult.data.text}`);
        }
        break;
      default:
        showToast(`${getQRTypeDisplayName(parseResult.type)}: ${result}`);
    }
  } catch (error) {
    console.error('处理扫描结果失败:', error);
    showToast('处理扫描结果失败');
  }
};

// 处理好友添加二维码
const handleAddFriendQR = async (userData: any) => {
  try {
    // 使用工具函数处理用户QR码结果
    const result = handleUserQRResult(userData, userStore.userInfo?.id);
    
    if (!result.success) {
      showToast(result.message);
      return;
    }

    // 跳转到用户资料页面或直接发送好友请求
    router.push({
      path: '/chat/friends/add',
      query: {
        userId: userData.userId.toString(),
        userName: userData.userName || '',
        fromQR: 'true'
      }
    });

    showSuccessToast('识别成功，即将跳转');

  } catch (error) {
    console.error('解析好友二维码失败:', error);
    showToast('处理失败，请重试');
  }
};

// 处理扫描取消
const handleScanCancel = () => {
  router.back();
};
</script>

<style scoped>
.qr-scan-page {
  height: 100vh;
  width: 100%;
}
</style> 