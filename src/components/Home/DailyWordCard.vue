<template>
  <div>
    <!-- 每日单词模块 -->
    <van-cell-group class="word-module">
      <van-cell title="每日单词">
        <template #icon>
          <svg class="icon svg-icon word-icon" aria-hidden="true">
            <use xlink:href="#icon-yingyu"></use>
          </svg>
        </template>
        <template #right-icon>
          <div class="right-actions">
            <van-icon
              name="bookmark-o"
              class="vocabulary-icon"
              @click.stop="$emit('category-click', vocabularyCategory)"
            />
            <span class="more-link" @click="$emit('more')">更多</span>
          </div>
        </template>
      </van-cell>

      <!-- 每日一词 -->
      <div class="daily-word" @click="showWordDetail">
        <div class="word-header">
          <span class="word-text">{{ word.text }}</span>
          <van-icon
            :name="word.isCollected ? 'star' : 'star-o'"
            :class="['collect-icon', { collected: word.isCollected }]"
            @click.stop="toggleCollect"
          />
        </div>
        <div class="word-phonetic">
          /{{ word.phonetic }}/
          <van-icon name="volume-o" class="audio-icon" @click.stop="playAudio" v-if="word.audioUrl" />
        </div>
        <div class="word-translation">{{ word.translation }}</div>
        <div class="word-info">
          <span class="word-category" v-if="word.category">{{ word.category }}</span>
          <span class="word-difficulty" v-if="word.difficulty">{{ word.difficulty }}</span>
        </div>
        <div class="word-example-wrapper">
          <div class="word-example">{{ word.example }}</div>
          <div class="word-example-translation" v-if="word.exampleTranslation">{{ word.exampleTranslation }}</div>
        </div>
      </div>
    </van-cell-group>

    <!-- 单词详情弹出层 -->
    <van-popup
      v-model:show="showWordPopup"
      round
      position="bottom"
      :style="{ height: '70%' }"
    >
      <div class="word-detail">
        <div class="popup-header">
          <span class="title">单词详情</span>
          <van-icon name="cross" @click="showWordPopup = false" />
        </div>
        <div class="word-content" v-if="word">
          <div class="word-main">
            <div class="word-title">
              <span class="word-text">{{ word.text }}</span>
              <van-icon name="volume-o" class="audio-icon" @click="playAudio" v-if="word.audioUrl" />
            </div>
            <van-icon
              :name="word.isCollected ? 'star' : 'star-o'"
              :class="['collect-icon', { collected: word.isCollected }]"
              @click="toggleCollect"
            />
          </div>
          <div class="word-phonetic">/{{ word.phonetic }}/</div>
          <div class="word-info-detail">
            <span class="tag category-tag" v-if="word.category">{{ word.category }}</span>
            <span class="tag difficulty-tag" v-if="word.difficulty">{{ word.difficulty }}</span>
          </div>
          <div class="word-translation detail-item">
            <div class="item-label">释义</div>
            <div class="item-content">{{ word.translation }}</div>
          </div>
          <div class="word-example-detail detail-item">
            <div class="item-label">例句</div>
            <div class="item-content">{{ word.example }}</div>
            <div class="item-content example-translation" v-if="word.exampleTranslation">
              {{ word.exampleTranslation }}
            </div>
          </div>
          <div class="word-notes detail-item" v-if="word.notes">
            <div class="item-label">笔记</div>
            <div class="item-content notes-content">{{ word.notes }}</div>
          </div>
          <div class="word-meanings">
            <div
              class="meaning-item"
              v-for="(meaning, index) in word.meanings"
              :key="index"
            >
              <div class="part-of-speech">{{ meaning.partOfSpeech }}</div>
              <div class="definition">{{ meaning.definition }}</div>
              <div class="example">{{ meaning.example }}</div>
            </div>
          </div>
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { showToast } from 'vant';
import { useCollectedWordsStore } from '../../stores/collectedWordsStore';

interface WordMeaning {
  partOfSpeech: string;
  definition: string;
  example: string;
}

interface Word {
  id?: number;
  text: string;
  phonetic: string;
  translation: string;
  example: string;
  isCollected: boolean;
  meanings: WordMeaning[];
  viewCount?: number;
  collectCount?: number;
  lastViewTime?: string;
  difficulty?: string;
  category?: string;
  audioUrl?: string;
  exampleTranslation?: string;
  notes?: string;
}

interface Category {
  id: number;
  name: string;
  icon: string;
  path: string;
}

// 定义props
const props = defineProps<{
  word: Word;
  categories: Category[];
}>();

// 定义事件
const emit = defineEmits<{
  (e: 'update:word', word: Word): void;
  (e: 'more'): void;
  (e: 'category-click', category: Category): void;
}>();

const showWordPopup = ref(false);
const collectedWordsStore = useCollectedWordsStore();

// 获取生词本分类
const vocabularyCategory = computed(() => {
  return (
    props.categories.find(
      (category) => category.path === '/vocabulary/collected',
    ) || {
      id: 4,
      name: '生词本',
      icon: 'bookmark-o',
      path: '/vocabulary/collected',
    }
  );
});

// 显示单词详情
const showWordDetail = (): void => {
  showWordPopup.value = true;
};

// 收藏/取消收藏单词
const toggleCollect = (): void => {
  const updatedWord: Word = {
    ...props.word,
    isCollected: !props.word.isCollected,
  };

  // 通过事件更新父组件中的数据
  emit('update:word', updatedWord);

  // 如果是收藏操作，添加到生词本
  if (updatedWord.isCollected) {
    const wordToCollect = {
      id: Date.now(), // 使用时间戳作为临时ID
      text: updatedWord.text,
      phonetic: updatedWord.phonetic,
      translation: updatedWord.translation,
      example: updatedWord.example,
      meanings: updatedWord.meanings,
      viewCount: 1,
      lastViewTime: new Date().toISOString(),
      difficulty: getDifficulty(updatedWord),
    };
    
    collectedWordsStore.collectWord(wordToCollect);
  } else {
    // 如果是取消收藏，需要从生词本中移除
    // 由于我们没有直接的ID映射关系，所以需要先查找对应单词
    const collectedWords = collectedWordsStore.getCollectedWords();
    const wordToRemove = collectedWords.find(w => w.text.toLowerCase() === updatedWord.text.toLowerCase());
    
    if (wordToRemove) {
      collectedWordsStore.removeWord(wordToRemove.id);
    }
  }

  showToast({
    message: updatedWord.isCollected ? '已添加到生词本' : '已取消收藏',
    position: 'bottom',
  });
};

// 根据单词信息估计难度
const getDifficulty = (word: Word): string => {
  // 简单根据单词长度估计难度，实际应用中可能需要更复杂的逻辑
  if (word.text.length <= 5) {
    return '初级';
  } else if (word.text.length <= 8) {
    return '中级';
  } else {
    return '高级';
  }
};

// 播放单词发音
const playAudio = (): void => {
  if (props.word.audioUrl) {
    const audio = new Audio(props.word.audioUrl);
    audio.play().catch(error => {
      console.error('播放音频失败', error);
      showToast({
        message: '音频播放失败',
        position: 'bottom',
      });
    });
  }
};
</script>

<style scoped>
.word-module {
  margin-bottom: 16px;
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(100, 101, 102, 0.08);
}

.more-link {
  color: #1989fa;
  font-size: var(--font-size-md);
  font-weight: 700;
}

.daily-word {
  padding: 16px;
  cursor: pointer;
}

.word-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.word-text {
  font-size: var(--font-size-xl);
  font-weight: 700;
  color: #323233;
}

.collect-icon {
  font-size: var(--font-size-lg);
  color: #969799;
}

.collect-icon.collected {
  color: #ffd21e;
}

.word-phonetic {
  font-size: var(--font-size-sm);
  color: #969799;
  margin-bottom: 8px;
}

.word-translation {
  font-size: var(--font-size-md);
  color: #323233;
  margin-bottom: 8px;
  font-weight: 500;
}

.word-example-wrapper {
  margin-top: 10px;
}

.word-example {
  font-size: var(--font-size-sm);
  color: #646566;
  font-style: italic;
  margin-bottom: 4px;
}

.word-example-translation {
  font-size: var(--font-size-xs);
  color: #969799;
  font-style: normal;
  margin-top: 2px;
}

.word-detail {
  padding: 16px;
}

.popup-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 16px;
  border-bottom: 1px solid #ebedf0;
}

.popup-header .title {
  font-size: var(--font-size-md);
  font-weight: 700;
}

.word-content {
  padding: 16px 0;
}

.word-main {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.meaning-item {
  margin-bottom: 16px;
}

.part-of-speech {
  font-size: var(--font-size-sm);
  color: #969799;
  margin-bottom: 4px;
}

.definition {
  font-size: var(--font-size-md);
  color: #323233;
  margin-bottom: 8px;
  font-weight: 500;
}

.example {
  font-size: 14px;
  color: #646566;
  font-style: italic;
}

:deep(.van-grid-item__text) {
  font-size: 14px;
  color: #323233;
  margin-top: 4px;
  font-weight: 700;
  font-family: 'Noto Sans SC', sans-serif;
}

:deep(.van-grid-item__icon) {
  font-size: 24px;
  color: #1989fa;
}

:deep(.van-grid-item__content) {
  padding: 16px 8px;
}

/* 强制覆盖组件标题样式 */
:deep(.van-cell) {
  position: relative;
  padding: 12px 16px !important;
  transition: all 0.3s ease;
  border-radius: 0 !important;
  background-color: transparent !important;
  margin: 0 !important;
}

:deep(.van-cell:hover) {
  background-color: transparent !important;
}

:deep(.van-cell::after) {
  display: none !important;
}

:deep(.van-cell__title) {
  font-weight: 700 !important;
  font-family: 'Noto Sans SC', sans-serif !important;
}

.svg-icon {
  width: 1em;
  height: 1em;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
}

.word-icon {
  font-size: 20px;
  margin-right: 4px;
  color: #1989fa;
  vertical-align: middle;
  display: flex;
  align-items: center;
  height: 24px;
}

.right-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.vocabulary-icon {
  font-size: 20px;
  color: #1989fa;
  vertical-align: middle;
}

.audio-icon {
  font-size: var(--font-size-md);
  color: #1989fa;
  margin-left: 6px;
  vertical-align: middle;
  cursor: pointer;
}

.word-info {
  display: flex;
  gap: 8px;
  margin-bottom: 8px;
}

.word-category, .word-difficulty {
  font-size: var(--font-size-xs);
  padding: 2px 6px;
  border-radius: 10px;
  color: #fff;
}

.word-category {
  background-color: #1989fa;
}

.word-difficulty {
  background-color: #ff976a;
}

.word-title {
  display: flex;
  align-items: center;
}

.word-info-detail {
  display: flex;
  gap: 8px;
  margin: 8px 0 16px;
}

.tag {
  font-size: var(--font-size-xs);
  padding: 2px 8px;
  border-radius: 10px;
  color: #fff;
}

.category-tag {
  background-color: #1989fa;
}

.difficulty-tag {
  background-color: #ff976a;
}

.detail-item {
  margin-bottom: 16px;
}

.item-label {
  font-size: var(--font-size-sm);
  color: #969799;
  margin-bottom: 4px;
}

.item-content {
  font-size: var(--font-size-md);
  color: #323233;
  line-height: 1.5;
}

.example-translation {
  color: #969799;
  font-size: var(--font-size-sm);
  margin-top: 4px;
  font-style: italic;
}

.notes-content {
  font-size: var(--font-size-sm);
  background-color: #f7f8fa;
  padding: 8px;
  border-radius: 4px;
  border-left: 3px solid #1989fa;
}
</style>
