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
            <div
              class="vocabulary-btn"
              @click.stop="showWordBookStats"
            >
              <van-icon name="bookmark-o" class="vocabulary-icon" />
              <span class="vocabulary-text">生词本</span>
              <span v-if="wordBookStats.length > 0" class="vocabulary-count">{{ wordBookStats[0] }}</span>
            </div>
            <span class="more-link" @click="$emit('more')">更多</span>
          </div>
        </template>
      </van-cell>

      <!-- 每日一词 -->
      <template v-if="word && word.text">
        <div class="daily-word" @click="showWordDetail">
          <div class="word-header">
            <span class="word-text">{{ word.text }}</span>
            <div class="header-actions">
              <div class="thumb-action" :class="{ thumbed: word.isThumbUp }">
                <van-icon
                  :name="word.isThumbUp ? 'good-job' : 'good-job-o'"
                  :class="['thumb-icon', { thumbed: word.isThumbUp }]"
                  @click.stop="toggleThumbUp"
                />
                <span
                  class="thumb-number"
                  :class="{ thumbed: word.isThumbUp }"
                >{{ word.likeCount || 0 }}</span>
              </div>
              <div
                class="collect-action"
                :class="{ collected: word.isCollected }"
              >
                <van-icon
                  :name="word.isCollected ? 'star' : 'star-o'"
                  :class="['collect-icon', { collected: word.isCollected }]"
                  @click.stop="toggleCollect"
                />
              </div>
              <van-icon
                v-if="word.id"
                name="success"
                class="study-icon"
                :class="{ studied: word.isStudied }"
                :loading="isMarkingStudied"
                @click.stop="markAsStudied"
              />
            </div>
          </div>
          <div class="word-phonetic">
            <span class="phonetic-text">/{{ word.phonetic }}/</span>
            <van-icon
              name="volume-o"
              class="audio-icon"
              @click.stop="playAudio"
              v-if="word.audioUrl"
            />
          </div>
          <div class="word-translation">{{ word.translation }}</div>
          <div class="word-info">
            <span class="word-category" v-if="word.category">{{
              word.category
            }}</span>
            <span class="word-difficulty" v-if="word.difficulty">{{
              word.difficulty
            }}</span>
          </div>
          <div class="word-example-wrapper">
            <div class="word-example">{{ word.example }}</div>
            <div
              class="word-example-translation"
              v-if="word.exampleTranslation"
            >
              {{ word.exampleTranslation }}
            </div>
          </div>
        </div>
      </template>
      <template v-else>
        <div class="empty-word">
          <van-empty description="暂无单词" />
        </div>
      </template>
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
              <van-icon
                name="volume-o"
                class="audio-icon"
                @click="playAudio"
                v-if="word.audioUrl"
              />
            </div>
            <div class="action-icons">
              <div class="thumb-action" :class="{ thumbed: word.isThumbUp }">
                <van-icon
                  :name="word.isThumbUp ? 'good-job' : 'good-job-o'"
                  :class="['thumb-icon', { thumbed: word.isThumbUp }]"
                  @click="toggleThumbUp"
                />
                <span
                  class="thumb-number"
                  :class="{ thumbed: word.isThumbUp }"
                >{{ word.likeCount || 0 }}</span>
              </div>
              <div
                class="collect-action"
                :class="{ collected: word.isCollected }"
              >
                <van-icon
                  :name="word.isCollected ? 'star' : 'star-o'"
                  :class="['collect-icon', { collected: word.isCollected }]"
                  @click="toggleCollect"
                />
              </div>
            </div>
          </div>
          <div class="word-phonetic">/{{ word.phonetic }}/</div>
          <div class="word-info-detail">
            <span class="tag category-tag" v-if="word.category">{{
              word.category
            }}</span>
            <span class="tag difficulty-tag" v-if="word.difficulty">{{
              word.difficulty
            }}</span>
          </div>
          <div class="word-translation detail-item">
            <div class="item-label">释义</div>
            <div class="item-content">{{ word.translation }}</div>
          </div>
          <div class="word-example-detail detail-item">
            <div class="item-label">例句</div>
            <div class="item-content">{{ word.example }}</div>
            <div
              class="item-content example-translation"
              v-if="word.exampleTranslation"
            >
              {{ word.exampleTranslation }}
            </div>
          </div>

          <!-- 掌握程度设置 -->
          <div
            class="word-mastery detail-item"
            v-if="word.isCollected && word.id"
          >
            <div class="item-label">掌握程度</div>
            <div class="mastery-slider">
              <van-slider
                v-model="masteryLevel"
                :min="1"
                :max="3"
                :step="1"
                bar-height="4px"
                active-color="#1989fa"
                inactive-color="#e8eaec"
                @change="updateMasteryLevel"
              >
                <template #button>
                  <div class="mastery-button">{{ masteryLevel }}</div>
                </template>
              </van-slider>
              <div class="mastery-progress">
                <div
                  class="mastery-level"
                  :class="{ active: masteryLevel >= 1 }"
                >
                  生疏
                </div>
                <div
                  class="mastery-level"
                  :class="{ active: masteryLevel >= 2 }"
                >
                  一般
                </div>
                <div
                  class="mastery-level"
                  :class="{ active: masteryLevel >= 3 }"
                >
                  掌握
                </div>
              </div>
            </div>
          </div>

          <!-- 个人笔记 -->
          <div class="word-notes detail-item">
            <div class="item-label-with-action">
              <span>笔记</span>
              <van-button
                v-if="isEditingNote"
                size="mini"
                type="primary"
                plain
                @click="saveWordNote"
                :loading="isSavingNote"
              >
                保存
              </van-button>
              <van-icon
                v-else
                name="edit"
                class="edit-icon"
                @click="startEditingNote"
              />
            </div>
            <div v-if="isEditingNote" class="note-editor">
              <van-field
                v-model="noteContent"
                type="textarea"
                rows="3"
                placeholder="添加个人笔记..."
                class="note-textarea"
              />
            </div>
            <div v-else-if="word.notes" class="item-content notes-content">
              {{ word.notes }}
            </div>
            <div v-else class="empty-note" @click="startEditingNote">
              点击添加笔记
            </div>
          </div>

          <!-- 其他单词意思 -->
          <div
            class="word-meanings"
            v-if="word.meanings && word.meanings.length > 0"
          >
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
import { ref, onMounted, watch } from 'vue';
import { showToast } from 'vant';
import {
  DailyWordLearningControllerService,
  DailyWordThumbControllerService,
  UserWordBookControllerService
} from '../../services';

interface WordMeaning {
  partOfSpeech: string;
  definition: string;
  example: string;
}

interface Word {
  id: number;
  text: string;
  phonetic: string;
  translation: string;
  example: string;
  isCollected: boolean;
  isThumbUp: boolean;
  thumbCount: number;
  likeCount: number;
  meanings: WordMeaning[];
  viewCount: number;
  collectCount: number;
  lastViewTime: string;
  difficulty: string;
  category: string;
  audioUrl?: string;
  exampleTranslation?: string;
  notes?: string;
  // UserWordBook相关属性
  learningStatus?: number;  // 学习状态
  isCollectedNumber?: number; // 后端返回的收藏状态（0或1）
  difficultyNumber?: number; // 后端返回的难度（数字）
  wordId?: number; // 单词ID
  pronunciation?: string; // 发音URL
  collectedTime?: string; // 收藏时间
  isStudied?: boolean; // 是否已学习
}

// 定义props
const props = defineProps<{
  word: Word;
}>();

// 定义事件
const emit = defineEmits<{
  (e: 'update:word', word: Word): void;
  (e: 'more'): void;
}>();

const showWordPopup = ref(false);

// 笔记编辑状态
const isEditingNote = ref(false);
const noteContent = ref('');
const isSavingNote = ref(false);

// 点赞状态
const isThumbUping = ref(false);

// 掌握程度
const masteryLevel = ref(1);
const isMarkingStudied = ref(false);

// 生词本统计数据
const wordBookStats = ref<number[]>([]);

// 获取生词本统计信息
const getWordBookStats = async (): Promise<void> => {
  try {
    const response = await UserWordBookControllerService.getUserWordBookStatisticsUsingGet();
    if (response.code === 0 && response.data) {
      wordBookStats.value = response.data;
    }
  } catch (error) {
    console.error('获取生词本统计失败', error);
  }
};

// 显示生词本统计信息并跳转
const showWordBookStats = (): void => {
  // 如果有统计数据，显示提示
  if (wordBookStats.value.length > 0) {
    const totalWords = wordBookStats.value[0] || 0;
    const studiedWords = wordBookStats.value[1] || 0;
    const collectedWords = wordBookStats.value[2] || 0;
    
    showToast({
      message: `词汇量：${totalWords}，已学习：${studiedWords}，收藏：${collectedWords}`,
      position: 'bottom',
      duration: 2000,
    });
  }
  
  // 直接跳转到生词本页面
  emit('more');
};

// 显示单词详情
const showWordDetail = (): void => {
  showWordPopup.value = true;
};

// 检查单词是否已被收藏
const checkWordFavourStatus = async (): Promise<void> => {
  if (!props.word.id) return;

  try {
    // 使用UserWordBookControllerService检查单词是否在生词本中
    const response = await UserWordBookControllerService.isWordInUserBookUsingGet(props.word.id);

    if (response.code === 0 && response.data !== undefined) {
      // 如果当前收藏状态与后端不一致，更新本地状态
      if (props.word.isCollected !== response.data) {
        const updatedWord: Word = {
          ...props.word,
          isCollected: response.data,
        };
        emit('update:word', updatedWord);
      }
    }
  } catch (error) {
    console.error('检查单词收藏状态失败', error);
  }
};

// 检查单词是否已被点赞
const checkWordThumbStatus = async (): Promise<void> => {
  if (!props.word.id) return;

  try {
    const response = await DailyWordThumbControllerService.isThumbWordUsingGet(
      props.word.id,
    );

    if (response.code === 0 && response.data !== undefined) {
      // 如果当前点赞状态与后端不一致，更新本地状态
      if (props.word.isThumbUp !== response.data) {
        const updatedWord: Word = {
          ...props.word,
          isThumbUp: response.data,
          // 保持原有的likeCount
          likeCount: props.word.likeCount || 0,
        };
        emit('update:word', updatedWord);
      }
    }
  } catch (error) {
    console.error('检查单词点赞状态失败', error);
  }
};

// 检查单词是否已被学习
const checkWordStudiedStatus = async (): Promise<void> => {
  if (!props.word.id) return;

  try {
    // 从本地存储判断
    const studiedWords = JSON.parse(
      localStorage.getItem('studiedWords') || '{}',
    );
    const isStudied = studiedWords[props.word.id] === true;

    // 如果当前学习状态与存储不一致，更新本地状态
    if (props.word.isStudied !== isStudied) {
      const updatedWord: Word = {
        ...props.word,
        isStudied: isStudied,
      };
      emit('update:word', updatedWord);
    }
  } catch (error) {
    console.error('检查单词学习状态失败', error);
  }
};

// 收藏/取消收藏单词
const toggleCollect = async (): Promise<void> => {
  // 如果没有wordId，不能执行收藏操作
  if (!props.word.id) {
    showToast({
      message: '单词ID不存在，无法收藏',
      position: 'bottom',
    });
    return;
  }

  try {
    // 调用后端API进行收藏或取消收藏
    let response;
    if (!props.word.isCollected) {
      // 添加到生词本
      const addRequest = {
        wordId: props.word.id,
        word: props.word.text,
        phonetic: props.word.phonetic,
        translation: props.word.translation,
        example: props.word.example,
        exampleTranslation: props.word.exampleTranslation || ''
      };
      response = await UserWordBookControllerService.addToWordBookUsingPost(addRequest);
    } else {
      // 从生词本移除
      response = await UserWordBookControllerService.removeFromWordBookUsingDelete(props.word.id);
    }

    if (response.code === 0) {
      // API调用成功，更新本地状态
      const newCollectedStatus = !props.word.isCollected;
      const updatedWord: Word = {
        ...props.word,
        isCollected: newCollectedStatus,
      };

      // 通过事件更新父组件中的数据
      emit('update:word', updatedWord);

      // 更新生词本统计数据
      getWordBookStats();

      showToast({
        message: newCollectedStatus ? '已添加到生词本' : '已取消收藏',
        position: 'bottom',
      });
    } else {
      // API调用失败
      showToast({
        message: `操作失败: ${response.message || '未知错误'}`,
        position: 'bottom',
      });
    }
  } catch (error) {
    console.error('收藏/取消收藏单词失败', error);
    showToast({
      message: '操作失败，请稍后再试',
      position: 'bottom',
    });
  }
};

// 点赞/取消点赞单词
const toggleThumbUp = async (): Promise<void> => {
  // 如果没有wordId，不能执行点赞操作
  if (!props.word.id) {
    showToast({
      message: '单词ID不存在，无法点赞',
      position: 'bottom',
    });
    return;
  }

  if (isThumbUping.value) return; // 防止重复点击

  isThumbUping.value = true;

  try {
    let response;
    if (props.word.isThumbUp) {
      // 已点赞，执行取消点赞
      response = await DailyWordThumbControllerService.cancelThumbWordUsingDelete(props.word.id);
    } else {
      // 未点赞，执行点赞
      response = await DailyWordThumbControllerService.thumbWordUsingPost(props.word.id);
    }

    if (response && response.code === 0) {
      // API调用成功，更新本地状态
      const newThumbStatus = !props.word.isThumbUp;
      // 根据点赞状态计算新的点赞数
      const currentCount = props.word.likeCount || 0;
      const newLikeCount = newThumbStatus
        ? currentCount + 1
        : Math.max(currentCount - 1, 0);

      const updatedWord: Word = {
        ...props.word,
        isThumbUp: newThumbStatus,
        likeCount: newLikeCount,
      };

      // 通过事件更新父组件中的数据
      emit('update:word', updatedWord);

      showToast({
        message: newThumbStatus ? '点赞成功' : '已取消点赞',
        position: 'bottom',
      });
    } else if (response) {
      // API调用失败
      showToast({
        message: `操作失败: ${response.message || '未知错误'}`,
        position: 'bottom',
      });
    }
  } catch (error) {
    console.error('点赞/取消点赞单词失败', error);
    showToast({
      message: '操作失败，请稍后再试',
      position: 'bottom',
    });
  } finally {
    isThumbUping.value = false;
  }
};

// 开始编辑笔记
const startEditingNote = (): void => {
  noteContent.value = props.word.notes || '';
  isEditingNote.value = true;
};

// 保存单词笔记
const saveWordNote = async (): Promise<void> => {
  if (!props.word.id) {
    showToast({
      message: '单词ID不存在，无法保存笔记',
      position: 'bottom',
    });
    return;
  }

  isSavingNote.value = true;

  try {
    const response =
      await DailyWordLearningControllerService.saveWordNoteUsingPost(
        noteContent.value,
        props.word.id,
      );

    if (response.code === 0 && response.data) {
      // 更新本地单词数据
      const updatedWord: Word = {
        ...props.word,
        notes: noteContent.value,
      };

      emit('update:word', updatedWord);
      isEditingNote.value = false;
      showToast({
        message: '笔记保存成功',
        position: 'bottom',
      });
    } else {
      showToast({
        message: `保存失败: ${response.message || '未知错误'}`,
        position: 'bottom',
      });
    }
  } catch (error) {
    console.error('保存单词笔记失败', error);
    showToast({
      message: '保存失败，请稍后再试',
      position: 'bottom',
    });
  } finally {
    isSavingNote.value = false;
  }
};

// 更新掌握程度
const updateMasteryLevel = async (): Promise<void> => {
  if (!props.word.id) return;

  try {
    // 更新单词的难度
    const difficultyRequest = {
      wordId: props.word.id,
      difficulty: masteryLevel.value,
    };
    const response = await UserWordBookControllerService.updateDifficultyUsingPut(difficultyRequest, props.word.id);

    if (response.code === 0 && response.data) {
      showToast({
        message: '掌握程度已更新',
        position: 'bottom',
      });
    } else {
      showToast({
        message: `更新失败: ${response.message || '未知错误'}`,
        position: 'bottom',
      });
    }
  } catch (error) {
    console.error('更新单词掌握程度失败', error);
    showToast({
      message: '更新失败，请稍后再试',
      position: 'bottom',
    });
  }
};

// 标记单词为已学习
const markAsStudied = async (): Promise<void> => {
  if (!props.word.id) return;

  isMarkingStudied.value = true;

  try {
    const newStudiedStatus = !props.word.isStudied;
    
    // 更新学习状态
    const updateStatusRequest = {
      wordId: props.word.id,
      learningStatus: newStudiedStatus ? 1 : 0,
    };
    
    // 更新学习状态
    const response = await UserWordBookControllerService.updateLearningStatusUsingPut(
      updateStatusRequest,
      props.word.id
    );

    if (response.code === 0) {
      // 更新本地状态
      const updatedWord: Word = {
        ...props.word,
        isStudied: newStudiedStatus,
        learningStatus: newStudiedStatus ? 1 : 0,
      };
      emit('update:word', updatedWord);

      // 更新本地存储
      try {
        const studiedWords = JSON.parse(
          localStorage.getItem('studiedWords') || '{}'
        );
        studiedWords[props.word.id as number] = newStudiedStatus;
        localStorage.setItem('studiedWords', JSON.stringify(studiedWords));
      } catch (error) {
        console.error('保存学习状态到本地存储失败', error);
      }

      showToast({
        message: newStudiedStatus ? '已标记为学习完成' : '已取消学习标记',
        position: 'bottom',
      });
    } else {
      showToast({
        message: `操作失败: ${response.message || '未知错误'}`,
        position: 'bottom',
      });
    }
  } catch (error) {
    console.error('标记单词为已学习失败', error);
    showToast({
      message: '操作失败，请稍后再试',
      position: 'bottom',
    });
  } finally {
    isMarkingStudied.value = false;
  }
};

// 组件挂载时检查单词收藏状态与初始化数据
onMounted(() => {
  if (props.word.id) {
    checkWordFavourStatus();
    checkWordThumbStatus();
    checkWordStudiedStatus();
    // 初始化笔记内容
    noteContent.value = props.word.notes || '';
    // 初始化默认掌握程度
    masteryLevel.value = 1;
  }
  
  // 获取生词本统计
  getWordBookStats();
});

// 在props变化时也检查状态
watch(
  () => props.word.id,
  (newId) => {
    if (newId) {
      checkWordFavourStatus();
      checkWordThumbStatus();
      checkWordStudiedStatus();
    }
  },
);

// 播放单词发音
const playAudio = (): void => {
  if (props.word.audioUrl) {
    const audio = new Audio(props.word.audioUrl);
    audio.play().catch((error) => {
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

.header-actions {
  display: flex;
  gap: 10px;
  align-items: center;
  height: 32px;
}

.action-icons {
  display: flex;
  gap: 10px;
  align-items: center;
  height: 32px;
}

.thumb-action {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  background-color: #f8f8f8;
  padding: 2px 8px;
  border-radius: 12px;
  transition: all 0.3s ease;
  line-height: 1;
  height: 24px;
}

.thumb-action.thumbed {
  background-color: #ffebee;
}

.thumb-number {
  font-size: var(--font-size-sm);
  color: #969799;
  font-weight: 500;
  display: inline-flex;
  align-items: center;
  line-height: 1;
}

.thumb-number.thumbed {
  color: #ee0a24;
}

.thumb-icon {
  font-size: var(--font-size-md);
  color: #969799;
  transition: color 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
  height: 24px;
}

.thumb-icon.thumbed {
  color: #ee0a24;
}

.collect-action {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f8f8f8;
  padding: 2px 8px;
  border-radius: 12px;
  transition: all 0.3s ease;
  line-height: 1;
  height: 24px;
  width: 32px;
}

.collect-action.collected {
  background-color: #fffbe5;
}

.collect-icon {
  font-size: var(--font-size-lg);
  color: #969799;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 24px;
  transition: color 0.3s ease;
}

.collect-icon.collected {
  color: #ffd21e;
}

.word-phonetic {
  font-size: var(--font-size-sm);
  color: #969799;
  margin-bottom: 8px;
  display: flex;
  align-items: center;
}

.phonetic-text {
  display: inline-block;
  line-height: 1;
}

.audio-icon {
  font-size: var(--font-size-md);
  color: #1989fa;
  margin-left: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  height: 24px;
  width: 24px;
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

.vocabulary-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  background-color: #f2f8ff;
  padding: 4px 10px;
  border-radius: 16px;
  transition: all 0.3s ease;
  cursor: pointer;
  position: relative;
}

.vocabulary-btn:hover {
  background-color: #e6f1ff;
}

.vocabulary-text {
  font-size: var(--font-size-sm);
  color: #1989fa;
  font-weight: 500;
}

.vocabulary-icon {
  font-size: 18px;
  color: #1989fa;
  vertical-align: middle;
}

.word-info {
  display: flex;
  gap: 8px;
  margin-bottom: 8px;
}

.word-category,
.word-difficulty {
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

.word-mastery {
  margin-bottom: 20px;
  background-color: #f8fafc;
  padding: 16px;
  border-radius: 8px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
}

.mastery-slider {
  padding: 0 4px;
  margin-top: 12px;
}

.mastery-progress {
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
  position: relative;
}

.mastery-progress::before {
  content: '';
  position: absolute;
  top: 10px;
  left: 0;
  right: 0;
  height: 2px;
  background-color: #e8eaec;
  z-index: 0;
}

.mastery-level {
  position: relative;
  z-index: 1;
  font-size: var(--font-size-xs);
  color: #969799;
  padding: 4px 8px;
  background-color: #fff;
  border-radius: 12px;
  border: 1px solid #ebedf0;
  transition: all 0.3s ease;
}

.mastery-level.active {
  color: #1989fa;
  background-color: #e6f7ff;
  border-color: #a7d0ff;
  font-weight: 500;
}

.mastery-button {
  width: 24px;
  height: 24px;
  background-color: #1989fa;
  border-radius: 50%;
  color: white;
  font-size: 13px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 4px rgba(25, 137, 250, 0.3);
}

.item-label-with-action {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: var(--font-size-sm);
  color: #969799;
  margin-bottom: 4px;
}

.edit-icon {
  color: #1989fa;
  font-size: 16px;
}

.note-editor {
  margin-top: 8px;
  margin-bottom: 10px;
}

.note-textarea {
  background-color: #f7f8fa;
  border-radius: 8px;
}

.empty-note {
  padding: 12px;
  background-color: #f7f8fa;
  border-radius: 8px;
  color: #c8c9cc;
  text-align: center;
  font-size: var(--font-size-sm);
  margin-top: 8px;
  cursor: pointer;
}

/* 添加学习图标样式 */
.study-icon {
  font-size: 20px;
  color: #c8c9cc;
  transition: all 0.3s ease;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f7f8fa;
  border: 1px solid #e8e8e8;
}

.study-icon.studied {
  color: #fff;
  background-color: #07c160;
  border-color: #07c160;
  box-shadow: 0 2px 4px rgba(7, 193, 96, 0.2);
}

.empty-word {
  padding: 30px 0;
  text-align: center;
}

.vocabulary-count {
  position: absolute;
  top: -6px;
  right: -6px;
  background-color: #ee0a24;
  color: #fff;
  font-size: 10px;
  border-radius: 10px;
  min-width: 16px;
  height: 16px;
  line-height: 16px;
  text-align: center;
  padding: 0 4px;
  font-weight: bold;
}
</style>
