import axios, {
  AxiosInstance,
  InternalAxiosRequestConfig,
  AxiosResponse,
  AxiosError,
} from 'axios';

// 直接使用环境变量定义API基础URL
const API_BASE = import.meta.env.VITE_API_BASE_URL;

const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 请求拦截器
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  },
);

// 清除登录状态函数
const clearLoginState = () => {
  localStorage.removeItem('userInfo');
  localStorage.removeItem('token');
  window.location.href = '/login';
};

// 响应拦截器
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    // 检查响应数据中的code是否为40100（未登录）
    if (response.data && response.data.code === 40100) {
      console.log('检测到未登录状态（40100），正在清除登录状态并跳转到登录页');
      clearLoginState();
    }
    return response;
  },
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      console.log('检测到未授权状态（401），正在清除登录状态并跳转到登录页');
      clearLoginState();
    }
    return Promise.reject(error);
  },
);

export default apiClient;
