import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router';
import Vant from 'vant';
import 'vant/lib/index.css';
// 引入iconfont图标
import '../public/icons/iconfont.js';
import '../public/icons/iconfont.css';

// 导入Capacitor核心功能
import { SplashScreen } from '@capacitor/splash-screen';
import { Capacitor } from '@capacitor/core';
import capacitor from './capacitor';

// 设置网页标题
document.title = '智云星课';

// 添加全局返回按钮处理
window.handleBackButton = () => {
  try {
    const currentRoute = router.currentRoute.value;
    const path = currentRoute.path;

    console.log('处理返回按钮，当前路径:', path);

    // 一级页面列表（底部导航栏页面）
    const mainRoutes = ['/', '/chat', '/circle', '/courses', '/profile'];

    if (mainRoutes.includes(path)) {
      if (path !== '/') {
        // 如果在底部导航页面但不是主页，则返回到主页
        router.push('/');
        return true;
      }
      // 在主页，返回false允许默认行为
      return false;
    } else {
      // 如果不在一级页面，执行路由返回
      router.back();
      return true;
    }
  } catch (error) {
    return false;
  }
};

const app = createApp(App);
const pinia = createPinia();

// 注册Capacitor服务
app.config.globalProperties.$capacitor = capacitor;

// 初始化Capacitor插件
const initCapacitor = async () => {
  if (Capacitor.isNativePlatform()) {
    // 隐藏启动页
    await SplashScreen.hide();

    // 检查网络状态
    const networkStatus = await capacitor.networkServices.getNetworkStatus();

    // 监听网络变化
    capacitor.networkServices.addNetworkListener((status) => {
    });
  }
};

app.use(router);
app.use(Vant);
app.use(pinia);

// 挂载应用
app.mount('#app');

// 初始化Capacitor (在挂载之后)
initCapacitor().catch((error) => console.error('Capacitor初始化失败:', error));

// 声明全局类型
declare global {
  interface Window {
    handleBackButton: () => boolean;
  }
}
