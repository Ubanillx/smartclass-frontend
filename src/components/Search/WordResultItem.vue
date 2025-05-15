<template>
  <div class="word-result-item" @click="navigateToDetail">
    <div class="word-info">
      <h3 class="word-title">{{ word.word }}</h3>
      <p class="word-phonetic" v-if="word.pronunciation">[{{ word.pronunciation }}]</p>
      <p class="word-translation">{{ word.translation }}</p>
      <div class="word-meta">
        <span class="category">{{ word.category }}</span>
        <span class="difficulty" :class="getDifficultyClass">
          {{ getDifficultyText }}
        </span>
        <span class="publish-date">{{ formatDate(word.publishDate) }}</span>
      </div>
      <p class="word-example" v-if="word.example">{{ word.example }}</p>
    </div>
  </div>
  
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
      <div class="word-content" v-if="wordDetail">
        <div class="word-main">
          <span class="word-text">{{ wordDetail.word }}</span>
          <div class="word-actions">
            <van-icon
              v-if="wordDetail.audioUrl"
              name="volume-o"
              class="volume-icon"
              @click="playPronunciation(wordDetail.audioUrl)"
            />
            <van-icon
              :name="wordDetail.isCollected ? 'star' : 'star-o'"
              :class="['collect-icon', { collected: wordDetail.isCollected }]"
              @click="toggleCollect"
            />
          </div>
        </div>

        <!-- 发音 -->
        <div class="word-phonetic" v-if="wordDetail.pronunciation">/{{ wordDetail.pronunciation }}/</div>
        
        <!-- 翻译 -->
        <div class="word-translation">{{ wordDetail.translation }}</div>
        
        <!-- 分类和难度 -->
        <div class="word-info-detail">
          <span class="tag category-tag" v-if="wordDetail.category">{{ wordDetail.category }}</span>
          <span 
            class="tag difficulty-tag" 
            :class="getDifficultyClassById(wordDetail.difficulty)"
          >
            {{ getDifficultyTextById(wordDetail.difficulty) }}
          </span>
        </div>
        
        <!-- 例句 -->
        <div class="word-example-wrapper" v-if="wordDetail.example">
          <div class="word-example">{{ wordDetail.example }}</div>
          <div class="word-example-translation" v-if="wordDetail.exampleTranslation">
            {{ wordDetail.exampleTranslation }}
          </div>
        </div>
        
        <!-- 笔记 -->
        <div class="word-notes" v-if="wordDetail.notes">
          <div class="notes-header">笔记</div>
          <div class="notes-content">{{ wordDetail.notes }}</div>
        </div>
        
        <!-- 发布日期与统计 -->
        <div class="word-statistics">
          <div class="stat-item">
            <span class="stat-label">发布日期:</span>
            <span class="stat-value">{{ formatDate(wordDetail.publishDate) }}</span>
          </div>
          <div class="stat-item">
            <van-icon name="like-o" />
            <span class="stat-value">{{ wordDetail.likeCount || 0 }}</span>
          </div>
        </div>
      </div>
    </div>
  </van-popup>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { formatDate } from '../../utils/dateUtils';
import { showToast } from 'vant';
import { UserWordBookControllerService, DailyWordControllerService } from '../../services';

const props = defineProps<{
  word: any
}>();

// 单词详情弹出层控制
const showWordPopup = ref(false);
const wordDetail = ref<any>(null);

// 获取难度等级文本
const getDifficultyText = computed(() => {
  return getDifficultyTextById(props.word.difficulty);
});

// 获取难度等级样式
const getDifficultyClass = computed(() => {
  return getDifficultyClassById(props.word.difficulty);
});

// 根据难度ID获取文本
const getDifficultyTextById = (difficultyId: number) => {
  const difficultyMap: Record<number, string> = {
    1: '初级',
    2: '中级',
    3: '高级'
  };
  return difficultyMap[difficultyId] || '未知';
};

// 根据难度ID获取样式类
const getDifficultyClassById = (difficultyId: number) => {
  const difficultyClassMap: Record<number, string> = {
    1: 'easy',
    2: 'medium',
    3: 'hard'
  };
  return difficultyClassMap[difficultyId] || '';
};

// 跳转到单词详情（打开弹出层）
const navigateToDetail = async () => {
  try {
    // 初始化详情弹出层
    wordDetail.value = {
      ...props.word,
      isCollected: false // 默认未收藏，稍后检查
    };
    
    // 显示弹出层
    showWordPopup.value = true;
    
    // 加载完整单词详情
    await loadWordDetail();
    
    // 检查单词是否已收藏
    await checkWordCollectionStatus();
  } catch (error) {
    console.error('加载单词详情失败', error);
    showToast('加载失败，请稍后再试');
  }
};

// 加载单词详情
const loadWordDetail = async () => {
  try {
    // 调用API获取完整单词详情
    const response = await DailyWordControllerService.getDailyWordVoByIdUsingGet(props.word.id);
    
    if (response.code === 0 && response.data) {
      const data = response.data;
      
      console.log('获取到的单词详情:', data); // 调试用
      
      // 直接使用API返回的数据更新wordDetail
      wordDetail.value = {
        ...data,
        isCollected: wordDetail.value?.isCollected || false
      };
    } else {
      showToast('获取单词详情失败');
    }
  } catch (error) {
    console.error('获取单词详情失败', error);
    showToast('获取单词详情失败，请稍后再试');
  }
};

// 检查单词是否已被收藏
const checkWordCollectionStatus = async () => {
  if (!wordDetail.value || !wordDetail.value.id) return;
  
  try {
    const response = await UserWordBookControllerService.isWordInUserBookUsingGet(wordDetail.value.id);
    
    if (response.code === 0) {
      // 更新收藏状态
      wordDetail.value.isCollected = response.data === true;
    }
  } catch (error) {
    console.error('检查单词收藏状态失败', error);
  }
};

// 播放发音
const playPronunciation = (url: string) => {
  if (!url) return;
  
  const audio = new Audio(url);
  audio.play().catch(error => {
    console.error('播放音频失败:', error);
    showToast('播放失败，请稍后再试');
  });
};

// 收藏/取消收藏单词
const toggleCollect = async () => {
  if (!wordDetail.value) return;
  
  try {
    // 根据当前收藏状态决定操作
    let response;
    if (!wordDetail.value.isCollected) {
      // 添加到生词本
      const addRequest = {
        wordId: wordDetail.value.id,
        word: wordDetail.value.word,
        phonetic: wordDetail.value.pronunciation,
        translation: wordDetail.value.translation,
        example: wordDetail.value.example,
        exampleTranslation: wordDetail.value.exampleTranslation || ''
      };
      response = await UserWordBookControllerService.addToWordBookUsingPost(addRequest);
    } else {
      // 从生词本移除
      response = await UserWordBookControllerService.removeFromWordBookUsingDelete(wordDetail.value.id);
    }

    if (response.code === 0) {
      // 更新收藏状态
      wordDetail.value.isCollected = !wordDetail.value.isCollected;
      
      showToast({
        message: wordDetail.value.isCollected ? '已添加到生词本' : '已从生词本移除',
        position: 'bottom'
      });
    } else {
      showToast({
        message: `操作失败: ${response.message || '未知错误'}`,
        position: 'bottom'
      });
    }
  } catch (error) {
    console.error('收藏/取消收藏失败', error);
    showToast('操作失败，请稍后再试');
  }
};

// 监听点击事件，替换emit('click')
const emit = defineEmits(['click']);
</script>

<style scoped>
.word-result-item {
  padding: 16px;
  border-bottom: 1px solid #ebedf0;
  background-color: #fff;
  cursor: pointer;
  transition: background-color 0.2s;
}

.word-result-item:last-child {
  border-bottom: none;
}

.word-result-item:active {
  background-color: #f2f3f5;
}

.word-title {
  font-size: var(--font-size-xl);
  font-weight: 500;
  color: #323233;
  margin: 0 0 4px 0;
}

.word-phonetic {
  font-size: var(--font-size-md);
  color: #969799;
  font-style: italic;
  margin: 0 0 8px 0;
}

.word-translation {
  font-size: var(--font-size-lg);
  color: #323233;
  margin: 0 0 12px 0;
  line-height: 1.5;
}

.word-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 12px;
  align-items: center;
}

.category {
  display: inline-block;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: var(--font-size-sm);
  color: #1989fa;
  background-color: #ecf5ff;
}

.difficulty {
  display: inline-block;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: var(--font-size-sm);
}

.difficulty.easy {
  background-color: #07c160;
  color: #fff;
}

.difficulty.medium {
  background-color: #ff976a;
  color: #fff;
}

.difficulty.hard {
  background-color: #ee0a24;
  color: #fff;
}

.publish-date {
  font-size: var(--font-size-sm);
  color: #969799;
}

.word-example {
  font-size: var(--font-size-md);
  color: #646566;
  margin: 0;
  line-height: 1.6;
  font-style: italic;
  padding-left: 12px;
  border-left: 3px solid #1989fa;
}

/* 单词详情弹出层样式 */
.popup-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid #ebedf0;
}

.popup-header .title {
  font-size: var(--font-size-lg);
  font-weight: 600;
  color: #323233;
}

.word-detail {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.word-content {
  flex: 1;
  padding: 16px;
  overflow-y: auto;
}

.word-main {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.word-text {
  font-size: 24px;
  font-weight: 700;
  color: #323233;
}

.word-actions {
  display: flex;
  gap: 12px;
}

.volume-icon,
.collect-icon {
  font-size: 24px;
  color: #969799;
  cursor: pointer;
}

.volume-icon:active {
  color: #1989fa;
}

.collect-icon.collected {
  color: #ff976a;
}

.word-phonetic {
  font-size: var(--font-size-md);
  color: #969799;
  margin-bottom: 12px;
}

.word-info-detail {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin: 12px 0;
}

.tag {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: var(--font-size-sm);
}

.category-tag {
  background-color: #ecf5ff;
  color: #1989fa;
}

.difficulty-tag {
  padding: 4px 8px;
  border-radius: 4px;
}

.word-example-wrapper {
  margin-top: 16px;
  padding: 12px;
  background-color: #f7f8fa;
  border-radius: 8px;
}

.word-example {
  font-size: var(--font-size-md);
  color: #323233;
  line-height: 1.6;
  font-style: italic;
}

.word-example-translation {
  margin-top: 8px;
  font-size: var(--font-size-sm);
  color: #646566;
}

/* 笔记部分样式 */
.word-notes {
  margin-top: 16px;
  background-color: #fffbe8;
  border-radius: 8px;
  padding: 12px;
  border-left: 3px solid #ffd666;
}

.notes-header {
  font-weight: 600;
  color: #323233;
  margin-bottom: 8px;
  font-size: var(--font-size-md);
}

.notes-content {
  font-size: var(--font-size-md);
  color: #646566;
  line-height: 1.6;
}

/* 统计信息样式 */
.word-statistics {
  margin-top: 24px;
  display: flex;
  justify-content: space-between;
  border-top: 1px solid #ebedf0;
  padding-top: 12px;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 4px;
  color: #969799;
  font-size: var(--font-size-sm);
}

.stat-label {
  color: #969799;
}

.stat-value {
  color: #646566;
}
</style> 