import { defineStore } from 'pinia';
import { ref, watch } from 'vue';

export const useSearchStore = defineStore('search', () => {
  // 最大历史记录条数
  const maxHistory = 20;
  
  // 搜索历史记录
  const searchHistory = ref<string[]>([]);
  
  // 初始化搜索历史记录
  try {
    const savedHistory = localStorage.getItem('searchHistory');
    if (savedHistory) {
      searchHistory.value = JSON.parse(savedHistory);
    }
  } catch (error) {
    console.error('Failed to parse search history from localStorage', error);
  }
  
  // 监听历史记录变化，保存到本地存储
  watch(searchHistory, (newValue) => {
    localStorage.setItem('searchHistory', JSON.stringify(newValue));
  }, { deep: true });
  
  // 添加搜索历史
  const addSearchHistory = (query: string) => {
    if (!query.trim()) return;
    
    // 如果已存在，先移除
    const index = searchHistory.value.indexOf(query);
    if (index !== -1) {
      searchHistory.value.splice(index, 1);
    }
    
    // 添加到列表开头
    searchHistory.value.unshift(query);
    
    // 如果超出最大条数，删除最旧的
    if (searchHistory.value.length > maxHistory) {
      searchHistory.value = searchHistory.value.slice(0, maxHistory);
    }
  };
  
  // 删除单条历史记录
  const deleteSearchRecord = (index: number) => {
    if (index >= 0 && index < searchHistory.value.length) {
      searchHistory.value.splice(index, 1);
    }
  };
  
  // 清空所有历史记录
  const clearSearchHistory = () => {
    searchHistory.value = [];
  };
  
  return {
    searchHistory,
    addSearchHistory,
    deleteSearchRecord,
    clearSearchHistory,
  };
}); 