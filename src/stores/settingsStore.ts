import { defineStore } from 'pinia';
import { ref, watch } from 'vue';

export const useSettingsStore = defineStore('settings', () => {
  // 字体大小选项
  const fontSizeOptions = [
    { text: '超级小', value: 'x-small' },
    { text: '小', value: 'small' },
    { text: '中', value: 'medium' },
    { text: '大', value: 'large' },
    { text: '超级大', value: 'x-large' },
  ];

  // 从本地存储加载字体大小设置，默认为中等
  const fontSize = ref(localStorage.getItem('fontSize') || 'medium');
  
  // 从本地存储加载位置信息，默认为未知
  const location = ref(localStorage.getItem('userLocation') || '未知');

  // 监听字体大小变化，保存到本地存储
  watch(fontSize, (newValue) => {
    localStorage.setItem('fontSize', newValue);
    // 更新根元素的字体大小类名
    updateFontSizeClass(newValue);
  });
  
  // 监听位置信息变化，保存到本地存储
  watch(location, (newValue) => {
    localStorage.setItem('userLocation', newValue);
  });

  // 更新根元素的字体大小类名
  const updateFontSizeClass = (size: string) => {
    // 移除所有字体大小类名
    document.documentElement.classList.remove(
      'font-x-small',
      'font-small',
      'font-medium',
      'font-large',
      'font-x-large',
    );
    // 添加当前字体大小类名
    document.documentElement.classList.add(`font-${size}`);
  };

  // 初始化字体大小类名
  updateFontSizeClass(fontSize.value);

  // 设置字体大小
  const setFontSize = (size: string) => {
    if (['x-small', 'small', 'medium', 'large', 'x-large'].includes(size)) {
      fontSize.value = size;
    }
  };
  
  // 设置位置信息
  const setLocation = (newLocation: string) => {
    location.value = newLocation || '未知';
  };

  return {
    fontSize,
    fontSizeOptions,
    setFontSize,
    location,
    setLocation,
  };
});
