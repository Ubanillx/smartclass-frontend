import { Capacitor } from '@capacitor/core';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Preferences } from '@capacitor/preferences';
import { Network } from '@capacitor/network';
import { Toast } from '@capacitor/toast';

// 检测是否在移动设备上运行
export const isNativePlatform = Capacitor.isNativePlatform();
export const isAndroid = Capacitor.getPlatform() === 'android';
export const isIOS = Capacitor.getPlatform() === 'ios';

// 网络状态监测
export const networkServices = {
  async getNetworkStatus() {
    return await Network.getStatus();
  },

  addNetworkListener(callback: (status: { connected: boolean }) => void) {
    return Network.addListener('networkStatusChange', callback);
  },
};

// 本地存储服务
export const storageServices = {
  async set(key: string, value: string | number | boolean | object) {
    await Preferences.set({
      key,
      value: JSON.stringify(value),
    });
  },

  async get(key: string) {
    const item = await Preferences.get({ key });
    if (item && item.value) {
      try {
        return JSON.parse(item.value);
      } catch {
        return item.value;
      }
    }
    return null;
  },

  async remove(key: string) {
    await Preferences.remove({ key });
  },

  async clear() {
    await Preferences.clear();
  },
};

// 相机服务
export const cameraServices = {
  async takePicture() {
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: true,
        resultType: CameraResultType.Uri,
        source: CameraSource.Camera,
      });

      return image;
    } catch (error) {
      console.error('相机错误:', error);
      throw error;
    }
  },

  async pickFromGallery() {
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: true,
        resultType: CameraResultType.Uri,
        source: CameraSource.Photos,
      });

      return image;
    } catch (error) {
      console.error('相册错误:', error);
      throw error;
    }
  },

  async checkPermissions() {
    return await Camera.checkPermissions();
  },

  async requestPermissions() {
    return await Camera.requestPermissions();
  },
};

// 设备信息
export const getDeviceInfo = async () => {
  return {
    platform: Capacitor.getPlatform(),
    isNative: Capacitor.isNativePlatform(),
    isWeb: !Capacitor.isNativePlatform(),
  };
};

// 添加Toast服务
export const toastServices = {
  async show(message: string, duration: 'short' | 'long' = 'short') {
    if (isNativePlatform) {
      await Toast.show({
        text: message,
        duration: duration,
      });
    } else {
      // 在Web上使用alert或自定义Toast
      console.log('Toast:', message);
    }
  },
};

export default {
  isNativePlatform,
  isAndroid,
  isIOS,
  networkServices,
  storageServices,
  cameraServices,
  toastServices,
  getDeviceInfo,
};
