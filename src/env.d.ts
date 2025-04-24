/// <reference types="@rsbuild/core/types" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue';

  // biome-ignore lint/complexity/noBannedTypes: reason
  const component: DefineComponent<{}, {}, any>;
  export default component;
}

// 添加Vue全局属性类型声明
import capacitor from './capacitor';

declare module 'vue' {
  interface ComponentCustomProperties {
    $capacitor: typeof capacitor;
  }
}

// Capacitor相关类型声明
declare module '@capacitor/core' {
  interface PluginRegistry {
    SplashScreen: any;
    StatusBar: any;
    Keyboard: any;
    Network: any;
    Camera: any;
    Preferences: any;
  }
}
