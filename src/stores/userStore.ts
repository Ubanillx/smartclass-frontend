import { defineStore } from 'pinia';
import { ref } from 'vue';
import { UserControllerService } from '../services/services/UserControllerService';
import type { LoginUserVO } from '../services/models/LoginUserVO';

// 默认用户头像路径
export const DEFAULT_USER_AVATAR = '/default.jpg';

export const useUserStore = defineStore('user', () => {
  // 状态
  const isLoggedIn = ref(localStorage.getItem('isLoggedIn') === 'true');
  const userInfo = ref<LoginUserVO | null>(null);

  // 初始化用户信息
  try {
    const storedUserInfo = localStorage.getItem('userInfo');
    if (storedUserInfo) {
      userInfo.value = JSON.parse(storedUserInfo);
    }
  } catch (error) {
    console.error('Failed to parse user info from localStorage', error);
  }

  // 获取当前登录用户信息
  const fetchCurrentUser = async () => {
    try {
      const response = await UserControllerService.getLoginUserUsingGet();
      if (response.code === 0 && response.data) {
        // 确保用户头像有默认值
        if (!response.data.userAvatar) {
          response.data.userAvatar = DEFAULT_USER_AVATAR;
        }
        userInfo.value = response.data;
        isLoggedIn.value = true;
        localStorage.setItem('userInfo', JSON.stringify(response.data));
        localStorage.setItem('isLoggedIn', 'true');
        return response.data;
      }
      return null;
    } catch (error) {
      console.error('Failed to fetch current user', error);
      return null;
    }
  };

  // 登录
  const login = async (userAccount: string, userPassword: string) => {
    try {
      const response = await UserControllerService.userLoginUsingPost({
        userAccount,
        userPassword,
      });

      if (response.code === 0 && response.data) {
        // 确保用户头像有默认值
        if (!response.data.userAvatar) {
          response.data.userAvatar = DEFAULT_USER_AVATAR;
        }
        userInfo.value = response.data;
        isLoggedIn.value = true;
        localStorage.setItem('userInfo', JSON.stringify(response.data));
        localStorage.setItem('isLoggedIn', 'true');
        return { success: true, data: response.data };
      }

      return { success: false, message: response.message || '登录失败' };
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : '登录失败，请检查网络连接';
      return {
        success: false,
        message: errorMessage,
      };
    }
  };

  // 登出
  const logout = async () => {
    try {
      await UserControllerService.userLogoutUsingPost();
    } catch (error) {
      console.error('Logout API call failed', error);
    } finally {
      // 无论API调用是否成功，都清除本地状态
      userInfo.value = null;
      isLoggedIn.value = false;
      localStorage.removeItem('userInfo');
      localStorage.removeItem('isLoggedIn');
    }
  };

  // 获取用户头像，确保有默认值
  const getUserAvatar = () => {
    return userInfo.value?.userAvatar || DEFAULT_USER_AVATAR;
  };

  return {
    isLoggedIn,
    userInfo,
    login,
    logout,
    fetchCurrentUser,
    getUserAvatar,
    DEFAULT_USER_AVATAR,
  };
});
