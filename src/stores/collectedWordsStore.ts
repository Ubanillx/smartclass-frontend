import { defineStore } from 'pinia';
import { ref, computed, watch } from 'vue';

// 单词含义接口
export interface WordMeaning {
  partOfSpeech: string;
  definition: string;
  example: string;
}

// 收藏单词接口
export interface CollectedWord {
  id: number;
  text: string;
  phonetic: string;
  translation: string;
  example: string;
  meanings: WordMeaning[];
  viewCount: number;
  collectedTime: string;
  lastViewTime: string;
  difficulty: string;
  mastered: boolean;
}

export const useCollectedWordsStore = defineStore('collectedWords', () => {
  // 状态
  const collectedWords = ref<CollectedWord[]>([]);

  // 计算属性：已掌握单词数量
  const masteredCount = computed(() => {
    return collectedWords.value.filter((word) => word.mastered).length;
  });

  // 计算属性：待复习单词数量
  const reviewCount = computed(() => {
    return collectedWords.value.length - masteredCount.value;
  });

  // 初始化从localStorage加载数据
  const initFromStorage = () => {
    try {
      const stored = localStorage.getItem('collectedWords');
      if (stored) {
        collectedWords.value = JSON.parse(stored);
      }
    } catch (e) {
      console.error('Failed to load collected words from localStorage:', e);
    }
  };

  // 保存数据到localStorage
  const saveToStorage = () => {
    localStorage.setItem(
      'collectedWords',
      JSON.stringify(collectedWords.value),
    );
  };

  // 收藏单词
  const collectWord = (
    word: Omit<CollectedWord, 'collectedTime' | 'mastered'>,
  ) => {
    // 检查单词是否已收藏
    const existingIndex = collectedWords.value.findIndex(
      (w) => w.text.toLowerCase() === word.text.toLowerCase(),
    );

    if (existingIndex !== -1) {
      // 单词已存在，返回false表示操作未成功
      return false;
    }

    // 添加新单词到收藏
    const newCollectedWord: CollectedWord = {
      ...word,
      collectedTime: new Date().toISOString(),
      mastered: false,
    };

    collectedWords.value.push(newCollectedWord);
    return true;
  };

  // 从收藏夹中移除单词
  const removeWord = (wordId: number) => {
    const index = collectedWords.value.findIndex((w) => w.id === wordId);
    if (index !== -1) {
      collectedWords.value.splice(index, 1);
      return true;
    }
    return false;
  };

  // 更新单词掌握状态
  const toggleMastered = (wordId: number) => {
    const word = collectedWords.value.find((w) => w.id === wordId);
    if (word) {
      word.mastered = !word.mastered;
      return true;
    }
    return false;
  };

  // 更新单词查看次数和最近查看时间
  const updateWordView = (wordId: number) => {
    const word = collectedWords.value.find((w) => w.id === wordId);
    if (word) {
      word.viewCount += 1;
      word.lastViewTime = new Date().toISOString();
      return true;
    }
    return false;
  };

  // 判断单词是否已收藏
  const isWordCollected = (wordText: string) => {
    return collectedWords.value.some(
      (w) => w.text.toLowerCase() === wordText.toLowerCase(),
    );
  };

  // 获取收藏的单词
  const getCollectedWords = () => {
    return collectedWords.value;
  };

  // 获取筛选和排序后的单词列表
  const getFilteredWords = (
    searchText = '',
    difficulty = '',
    sortOption = 'time-desc',
  ) => {
    // 先筛选
    let result = collectedWords.value.filter((word) => {
      // 搜索文本筛选
      const matchesSearch =
        searchText === '' ||
        word.text.toLowerCase().includes(searchText.toLowerCase()) ||
        word.translation.includes(searchText);

      // 难度筛选
      const matchesDifficulty =
        difficulty === '' || word.difficulty === difficulty;

      return matchesSearch && matchesDifficulty;
    });

    // 再排序
    switch (sortOption) {
      case 'time-desc':
        result.sort(
          (a, b) =>
            new Date(b.collectedTime).getTime() -
            new Date(a.collectedTime).getTime(),
        );
        break;
      case 'time-asc':
        result.sort(
          (a, b) =>
            new Date(a.collectedTime).getTime() -
            new Date(b.collectedTime).getTime(),
        );
        break;
      case 'alpha-asc':
        result.sort((a, b) => a.text.localeCompare(b.text));
        break;
      case 'alpha-desc':
        result.sort((a, b) => b.text.localeCompare(a.text));
        break;
    }

    return result;
  };

  // 监听状态变化，保存到localStorage
  watch(
    collectedWords,
    () => {
      saveToStorage();
    },
    { deep: true },
  );

  // 初始化
  initFromStorage();

  return {
    collectedWords,
    masteredCount,
    reviewCount,
    collectWord,
    removeWord,
    toggleMastered,
    updateWordView,
    isWordCollected,
    getCollectedWords,
    getFilteredWords,
  };
});
