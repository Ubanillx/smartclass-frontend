<template>
  <div class="collected-words">
    <!-- 返回按钮 -->
    <back-button title="我的生词本" />

    <!-- 主要内容区域 -->
    <div class="content-container">
      <!-- 顶部统计信息 -->
      <div class="stats-card">
        <div class="stats-item">
          <div class="stats-value">{{ bookStats[0] || 0 }}</div>
          <div class="stats-label">收藏单词</div>
        </div>
        <div class="stats-item">
          <div class="stats-value">{{ masteredCount }}</div>
          <div class="stats-label">已掌握</div>
        </div>
        <div class="stats-item">
          <div class="stats-value">{{ reviewCount }}</div>
          <div class="stats-label">待复习</div>
        </div>
      </div>

      <!-- 筛选和排序 -->
      <div class="filter-bar">
        <div class="filter-item" @click="showDifficultyFilter = true">
          <span>难度</span>
          <van-icon name="arrow-down" />
        </div>
        <div class="filter-item" @click="showSortOptions = true">
          <span>排序</span>
          <van-icon name="arrow-down" />
        </div>
        <div class="search-box">
          <search-bar
            v-model="searchText"
            placeholder="搜索单词"
            @search="applySearch"
            :disable-redirect="true"
          />
        </div>
      </div>

      <!-- 单词列表 -->
      <div class="word-list">
        <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
          <van-list
            v-model:loading="loading"
            :finished="finished"
            finished-text="没有更多了"
            @load="onLoad"
          >
            <div
              v-if="filteredWords.length === 0 && !loading"
              class="empty-state"
            >
              <van-empty description="暂无收藏单词" />
            </div>
            <div
              class="word-card"
              v-for="(word, index) in filteredWords"
              :key="word?.id || index"
              @click="showWordDetail(word)"
            >
              <div class="word-header">
                <span class="word-text">{{ word?.text || '未知单词' }}</span>
                <div class="word-actions">
                  <van-icon
                    v-if="word?.pronunciation"
                    name="volume-o"
                    class="volume-icon"
                    @click.stop="playPronunciation(word.pronunciation)"
                  />
                  <van-icon
                    name="success"
                    class="mastered-icon"
                    :class="{ active: word?.mastered }"
                    @click.stop="toggleMastered(word)"
                  />
                  <van-icon
                    name="delete-o"
                    class="delete-icon"
                    @click.stop="confirmRemove(word)"
                  />
                </div>
              </div>
              <div class="word-phonetic">/{{ word?.phonetic || '' }}/</div>
              <div class="word-translation">{{ word?.translation || '' }}</div>
              <div v-if="word?.example" class="word-example">
                <div class="example-text">{{ word.example }}</div>
                <div v-if="word?.exampleTranslation" class="example-translation">
                  {{ word.exampleTranslation }}
                </div>
              </div>
              <div class="word-tags">
                <div
                  class="difficulty-tag"
                  :class="getDifficultyClass(word?.difficulty || '')"
                >
                  {{ word?.difficulty || '未知' }}
                </div>
                <div class="date-tag">
                  {{ formatDate(word?.collectedTime || '') }}收藏
                </div>
                <div v-if="word?.mastered" class="mastered-tag">已掌握</div>
              </div>
            </div>
          </van-list>
        </van-pull-refresh>
      </div>
    </div>

    <!-- 单词详情弹出层 -->
    <van-popup
      v-model:show="showWordPopup"
      round
      position="bottom"
      :style="{ height: '60%' }"
    >
      <div class="word-detail">
        <div class="popup-header">
          <span class="title">单词详情</span>
          <van-icon name="cross" @click="showWordPopup = false" />
        </div>
        <div class="word-content" v-if="currentWord">
          <div class="word-main">
            <span class="word-text">{{ currentWord?.text || '未知单词' }}</span>
            <div class="word-actions">
              <van-icon
                v-if="currentWord?.pronunciation"
                name="volume-o"
                class="volume-icon"
                @click="playPronunciation(currentWord.pronunciation)"
              />
              <van-icon
                name="success"
                class="mastered-icon"
                :class="{ active: currentWord?.mastered }"
                @click="toggleMastered(currentWord)"
              />
              <van-icon
                name="delete-o"
                class="delete-icon"
                @click="confirmRemove(currentWord)"
              />
            </div>
          </div>
          <div class="word-phonetic">/{{ currentWord?.phonetic || '' }}/</div>
          <div class="word-meanings">
            <div
              class="meaning-item"
              v-for="(meaning, index) in currentWord?.meanings || []"
              :key="index"
            >
              <div class="part-of-speech">{{ meaning?.partOfSpeech || '' }}</div>
              <div class="definition">{{ meaning?.definition || '' }}</div>
              <div class="example">{{ meaning?.example || '' }}</div>
              <div v-if="currentWord?.exampleTranslation" class="example-translation">
                {{ currentWord.exampleTranslation }}
              </div>
            </div>
          </div>
          <div class="word-stats-detail">
            <div class="stat-title">单词数据</div>
            <div class="stats-grid">
              <div class="stat-grid-item">
                <div class="stat-label">收藏时间</div>
                <div class="stat-value">
                  {{ formatFullDate(currentWord?.collectedTime || '') }}
                </div>
              </div>
              <div class="stat-grid-item">
                <div class="stat-label">查看次数</div>
                <div class="stat-value">{{ currentWord?.viewCount || 0 }}</div>
              </div>
              <div class="stat-grid-item">
                <div class="stat-label">最近查看</div>
                <div class="stat-value">
                  {{ formatDate(currentWord?.lastViewTime || '') }}
                </div>
              </div>
              <div class="stat-grid-item">
                <div class="stat-label">难度等级</div>
                <div class="stat-value">
                  <span :class="getDifficultyClass(currentWord?.difficulty || '')">
                    {{ currentWord?.difficulty || '未知' }}
                  </span>
                </div>
              </div>
              <div class="stat-grid-item">
                <div class="stat-label">学习状态</div>
                <div class="stat-value">
                  <span :class="{ 'mastered-text': currentWord?.mastered }">
                    {{ currentWord?.mastered ? '已掌握' : '学习中' }}
                  </span>
                </div>
              </div>
              <div class="stat-grid-item">
                <div class="stat-label">单词ID</div>
                <div class="stat-value">{{ currentWord?.wordId || currentWord?.id || '未知' }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </van-popup>

    <!-- 难度筛选弹出层 -->
    <van-popup
      v-model:show="showDifficultyFilter"
      round
      position="bottom"
      :style="{ height: '40%' }"
    >
      <div class="filter-popup">
        <div class="popup-header">
          <span class="title">选择难度</span>
          <van-icon name="cross" @click="showDifficultyFilter = false" />
        </div>
        <div class="filter-content">
          <van-radio-group v-model="selectedDifficulty">
            <van-cell-group>
              <van-cell title="全部" clickable @click="selectedDifficulty = ''">
                <template #right-icon>
                  <van-radio name="" />
                </template>
              </van-cell>
              <van-cell
                title="初级"
                clickable
                @click="selectedDifficulty = '初级'"
              >
                <template #right-icon>
                  <van-radio name="初级" />
                </template>
              </van-cell>
              <van-cell
                title="中级"
                clickable
                @click="selectedDifficulty = '中级'"
              >
                <template #right-icon>
                  <van-radio name="中级" />
                </template>
              </van-cell>
              <van-cell
                title="高级"
                clickable
                @click="selectedDifficulty = '高级'"
              >
                <template #right-icon>
                  <van-radio name="高级" />
                </template>
              </van-cell>
            </van-cell-group>
          </van-radio-group>
          <div class="filter-actions">
            <van-button
              type="primary"
              block
              round
              @click="applyDifficultyFilter"
            >
              确认
            </van-button>
          </div>
        </div>
      </div>
    </van-popup>

    <!-- 排序选项弹出层 -->
    <van-popup
      v-model:show="showSortOptions"
      round
      position="bottom"
      :style="{ height: '40%' }"
    >
      <div class="filter-popup">
        <div class="popup-header">
          <span class="title">排序方式</span>
          <van-icon name="cross" @click="showSortOptions = false" />
        </div>
        <div class="filter-content">
          <van-radio-group v-model="sortOption">
            <van-cell-group>
              <van-cell
                title="收藏时间（最新）"
                clickable
                @click="sortOption = 'time-desc'"
              >
                <template #right-icon>
                  <van-radio name="time-desc" />
                </template>
              </van-cell>
              <van-cell
                title="收藏时间（最早）"
                clickable
                @click="sortOption = 'time-asc'"
              >
                <template #right-icon>
                  <van-radio name="time-asc" />
                </template>
              </van-cell>
              <van-cell
                title="按字母顺序（A-Z）"
                clickable
                @click="sortOption = 'alpha-asc'"
              >
                <template #right-icon>
                  <van-radio name="alpha-asc" />
                </template>
              </van-cell>
              <van-cell
                title="按字母顺序（Z-A）"
                clickable
                @click="sortOption = 'alpha-desc'"
              >
                <template #right-icon>
                  <van-radio name="alpha-desc" />
                </template>
              </van-cell>
            </van-cell-group>
          </van-radio-group>
          <div class="filter-actions">
            <van-button type="primary" block round @click="applySortOption">
              确认
            </van-button>
          </div>
        </div>
      </div>
    </van-popup>

    <!-- 删除确认弹窗 -->
    <van-dialog
      v-model:show="showDeleteConfirm"
      title="删除单词"
      :message="
        wordToDelete
          ? `确定要从生词本中删除「${wordToDelete.text}」吗？`
          : '确定要删除这个单词吗？'
      "
      show-cancel-button
      @confirm="removeWord"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { showToast, showSuccessToast, showLoadingToast } from 'vant';
import { BackButton } from '../../../components/Common';
import SearchBar from '../../../components/Common/SearchBar.vue';
import { useRouter } from 'vue-router';
import {
  useCollectedWordsStore,
  CollectedWord,
} from '../../../stores/collectedWordsStore.ts';
import { UserWordBookControllerService } from '../../../services';

const router = useRouter();
const collectedWordsStore = useCollectedWordsStore();

// 状态变量
const loading = ref(false);
const finished = ref(false);
const refreshing = ref(false);
const showWordPopup = ref(false);
const currentWord = ref<CollectedWord | null>(null);
const searchText = ref('');
const selectedDifficulty = ref('');
const sortOption = ref('time-desc');
const showDifficultyFilter = ref(false);
const showSortOptions = ref(false);
const showDeleteConfirm = ref(false);
const wordToDelete = ref<CollectedWord | null>(null);
const currentPage = ref(1);
const pageSize = ref(10);
const total = ref(0);
const isCollected = ref<number | undefined>(undefined);
const learningStatus = ref<number | undefined>(undefined);
const wordsData = ref<CollectedWord[]>([]);
const bookStats = ref<number[]>([]);

// 使用计算属性获取统计信息
const masteredCount = computed(() => bookStats.value[1] || 0);
const reviewCount = computed(() => (bookStats.value[0] || 0) - (bookStats.value[1] || 0));

// 计算属性：筛选和排序后的单词列表
const filteredWords = computed(() => {
  return wordsData.value || [];
});

// 下拉刷新
const onRefresh = async () => {
  try {
    currentPage.value = 1;
    await fetchWordBookStats();
    await fetchWordBookData();
    showToast('刷新成功');
  } catch (error) {
    console.error('刷新失败:', error);
    showToast('刷新失败，请稍后再试');
  } finally {
    refreshing.value = false;
  }
};

// 获取生词本统计数据
const fetchWordBookStats = async () => {
  try {
    const response = await UserWordBookControllerService.getUserWordBookStatisticsUsingGet();
    if (response.code === 0 && response.data) {
      bookStats.value = response.data;
    }
  } catch (error) {
    console.error('获取生词本统计失败:', error);
  }
};

// 从后端获取单词本数据
const fetchWordBookData = async () => {
  loading.value = true;
  try {
    const queryParams = {
      current: currentPage.value,
      pageSize: pageSize.value,
      sortField: getSortField(),
      sortOrder: getSortOrder(),
      word: searchText.value || undefined,
      isCollected: isCollected.value,
      learningStatus: learningStatus.value,
      difficulty: getDifficultyValue(),
    };

    const response = await UserWordBookControllerService.listUserWordBookByPageUsingPost(queryParams);
    
    if (response.code === 0 && response.data) {
      const { records, total: totalCount } = response.data;
      total.value = totalCount || 0;
      
      if (currentPage.value === 1) {
        // 第一页，替换数据
        wordsData.value = mapToCollectedWords(records || []);
      } else {
        // 后续页，追加数据
        wordsData.value = [...wordsData.value, ...mapToCollectedWords(records || [])];
      }
      
      // 判断是否加载完所有数据
      finished.value = !records || records.length < pageSize.value || wordsData.value.length >= total.value;
    } else {
      showToast('获取单词数据失败');
      finished.value = true;
    }
  } catch (error) {
    console.error('获取生词本数据失败:', error);
    showToast('获取数据失败，请稍后再试');
    finished.value = true;
  } finally {
    loading.value = false;
  }
};

// 将后端数据映射为本地数据格式
const mapToCollectedWords = (records: any[]): CollectedWord[] => {
  return records.map(item => ({
    id: item.id || 0,
    wordId: item.wordId,
    text: item.word || '',
    phonetic: item.phonetic || '',
    translation: item.translation || '',
    example: item.example || '',
    meanings: [{
      partOfSpeech: '',
      definition: item.translation || '',
      example: item.example || ''
    }],
    viewCount: item.viewCount || 1,
    collectedTime: item.collectedTime || new Date().toISOString(),
    lastViewTime: item.updateTime || new Date().toISOString(),
    difficulty: convertDifficultyToText(item.difficulty),
    mastered: item.learningStatus === 1,
    learningStatus: item.learningStatus,
    difficultyNumber: item.difficulty,
    isCollected: item.isCollected,
    pronunciation: item.pronunciation || '',
    exampleTranslation: item.exampleTranslation || ''
  }));
};

// 加载更多
const onLoad = () => {
  if (!loading.value && !finished.value) {
    currentPage.value += 1;
    fetchWordBookData();
  }
};

// 显示单词详情
const showWordDetail = (word: CollectedWord) => {
  currentWord.value = word;
  showWordPopup.value = true;
};

// 切换单词掌握状态
const toggleMastered = async (word: CollectedWord) => {
  const loadingToast = showLoadingToast({
    message: '更新中...',
    forbidClick: true,
  });
  
  try {
    const newStatus = !word.mastered;
    const updateStatusRequest = {
      wordId: word.wordId || word.id,
      learningStatus: newStatus ? 1 : 0,
    };
    
    const response = await UserWordBookControllerService.updateLearningStatusUsingPost(updateStatusRequest);
    
    if (response.code === 0 && response.data) {
      // 更新本地状态
      word.mastered = newStatus;
      word.learningStatus = newStatus ? 1 : 0;
      
      showToast({
        message: newStatus ? '已标记为掌握' : '已取消掌握标记',
        position: 'bottom',
      });
      
      // 刷新统计数据
      fetchWordBookStats();
    } else {
      showToast(`更新失败: ${response.message || '未知错误'}`);
    }
  } catch (error) {
    console.error('更新单词掌握状态失败:', error);
    showToast('更新失败，请稍后再试');
  } finally {
    loadingToast.close();
  }
};

// 确认删除单词
const confirmRemove = (word: CollectedWord) => {
  wordToDelete.value = word;
  showDeleteConfirm.value = true;
};

// 从生词本中移除单词
const removeWord = async () => {
  if (!wordToDelete.value) return;
  
  const loadingToast = showLoadingToast({
    message: '删除中...',
    forbidClick: true,
  });
  
  try {
    const wordId = wordToDelete.value.wordId || wordToDelete.value.id;
    const response = await UserWordBookControllerService.removeFromWordBookUsingPost(wordId);
    
    if (response.code === 0 && response.data) {
      // 从本地列表移除
      wordsData.value = wordsData.value.filter(word => 
        word.id !== wordToDelete.value?.id && word.wordId !== wordToDelete.value?.wordId
      );
      
      // 如果当前正在查看的是要删除的单词，关闭弹窗
      if (currentWord.value?.id === wordToDelete.value.id || 
          currentWord.value?.wordId === wordToDelete.value.wordId) {
        showWordPopup.value = false;
      }
      
      showSuccessToast('已从生词本中移除');
      
      // 刷新统计数据
      fetchWordBookStats();
    } else {
      showToast(`删除失败: ${response.message || '未知错误'}`);
    }
  } catch (error) {
    console.error('删除单词失败:', error);
    showToast('删除失败，请稍后再试');
  } finally {
    loadingToast.close();
  }
};

// 应用难度筛选
const applyDifficultyFilter = () => {
  showDifficultyFilter.value = false;
  currentPage.value = 1;
  fetchWordBookData();
};

// 应用排序选项
const applySortOption = () => {
  showSortOptions.value = false;
  currentPage.value = 1;
  fetchWordBookData();
};

// 应用搜索
const applySearch = (text: string) => {
  searchText.value = text;
  currentPage.value = 1;
  fetchWordBookData();
};

// 获取排序字段
const getSortField = (): string => {
  if (sortOption.value.startsWith('time')) {
    return 'collectedTime';
  } else if (sortOption.value.startsWith('alpha')) {
    return 'word';
  }
  return 'collectedTime';
};

// 获取排序顺序
const getSortOrder = (): string => {
  if (sortOption.value.endsWith('desc')) {
    return 'desc';
  }
  return 'asc';
};

// 获取难度值
const getDifficultyValue = (): number | undefined => {
  switch (selectedDifficulty.value) {
    case '初级': return 1;
    case '中级': return 2;
    case '高级': return 3;
    default: return undefined;
  }
};

// 将数字难度转换为文本
const convertDifficultyToText = (difficulty: number | undefined): string => {
  switch (difficulty) {
    case 1: return '初级';
    case 2: return '中级';
    case 3: return '高级';
    default: return '未知';
  }
};

// 获取难度标签的样式类
const getDifficultyClass = (difficulty: string): string => {
  switch (difficulty) {
    case '初级':
      return 'easy';
    case '中级':
      return 'medium';
    case '高级':
      return 'hard';
    default:
      return '';
  }
};

// 播放单词发音
const playPronunciation = (url: string) => {
  if (!url) return;
  
  const audio = new Audio(url);
  audio.play().catch(error => {
    console.error('播放发音失败:', error);
    showToast('播放发音失败，请稍后再试');
  });
};

// 格式化日期（简短版本）
const formatDate = (dateString: string) => {
  if (!dateString) return '未知';

  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    return '今天';
  } else if (diffDays === 1) {
    return '昨天';
  } else if (diffDays < 7) {
    return `${diffDays}天前`;
  } else {
    return `${date.getMonth() + 1}月${date.getDate()}日`;
  }
};

// 格式化日期（完整版本）
const formatFullDate = (dateString: string) => {
  if (!dateString) return '未知';

  const date = new Date(dateString);
  return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日 ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
};

// 监听筛选条件变化
watch([searchText, selectedDifficulty, sortOption], () => {
  currentPage.value = 1;
  fetchWordBookData();
});

// 组件挂载时初始化
onMounted(async () => {
  try {
    // 初始化统计数据，如果失败也不影响列表显示
    try {
      await fetchWordBookStats();
    } catch (error) {
      console.error('获取统计数据失败:', error);
    }
    
    // 加载单词数据
    await fetchWordBookData();
  } catch (error) {
    console.error('初始化生词本数据失败:', error);
    showToast('加载数据失败，请稍后重试');
  }
});
</script>

<style scoped>
.collected-words {
  min-height: 100vh;
  background-color: #f7f8fa;
  display: flex;
  flex-direction: column;
}

.content-container {
  flex: 1;
  padding: 12px 12px 60px;
  margin-top: 8px; /* 为返回按钮留出空间 */
}

.stats-card {
  display: flex;
  justify-content: space-around;
  background-color: #fff;
  padding: 16px;
  margin-bottom: 12px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.stats-item {
  text-align: center;
}

.stats-value {
  font-size: 24px;
  font-weight: 700;
  color: #323233;
}

.stats-label {
  font-size: 12px;
  color: #969799;
  margin-top: 4px;
}

.filter-bar {
  display: flex;
  align-items: center;
  padding: 8px 12px;
  background-color: #fff;
  margin-bottom: 12px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.filter-item {
  display: flex;
  align-items: center;
  padding: 0 12px;
  height: 36px;
  font-size: 14px;
  color: #323233;
  border-right: 1px solid #ebedf0;
}

.filter-item .van-icon {
  margin-left: 4px;
  color: #969799;
}

.search-box {
  flex: 1;
  margin-left: 8px;
}

:deep(.search-bar) {
  padding: 0;
  margin: 0;
  position: static;
}

:deep(.van-search) {
  padding: 0;
}

.word-list {
  padding: 0;
}

.word-card {
  background-color: #fff;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
}

.word-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.word-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.word-text {
  font-size: var(--font-size-xl, 18px);
  font-weight: 700;
  color: #323233;
}

.word-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.volume-icon {
  font-size: 20px;
  color: #1989fa;
}

.mastered-icon {
  font-size: 20px;
  color: #c8c9cc;
}

.mastered-icon.active {
  color: #07c160;
}

.delete-icon {
  font-size: 20px;
  color: #ee0a24;
}

.word-phonetic {
  font-size: var(--font-size-sm, 12px);
  color: #969799;
  margin-bottom: 8px;
}

.word-translation {
  font-size: var(--font-size-md, 14px);
  color: #323233;
  margin-bottom: 12px;
  font-weight: 500;
}

.word-example {
  margin-bottom: 12px;
  border-left: 3px solid #f2f3f5;
  padding-left: 8px;
}

.example-text {
  font-size: 13px;
  color: #646566;
  font-style: italic;
}

.word-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.difficulty-tag {
  display: inline-block;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 12px;
  color: #fff;
}

.difficulty-tag.easy {
  background-color: #07c160;
}

.difficulty-tag.medium {
  background-color: #1989fa;
}

.difficulty-tag.hard {
  background-color: #ee0a24;
}

.date-tag {
  display: inline-block;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 12px;
  background-color: #f2f3f5;
  color: #969799;
}

.mastered-tag {
  display: inline-block;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 12px;
  background-color: #07c160;
  color: #fff;
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
  font-size: var(--font-size-md, 14px);
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
  font-size: var(--font-size-sm, 12px);
  color: #969799;
  margin-bottom: 4px;
}

.definition {
  font-size: var(--font-size-md, 14px);
  color: #323233;
  margin-bottom: 8px;
  font-weight: 500;
}

.example {
  font-size: 14px;
  color: #646566;
  font-style: italic;
}

.example-translation {
  font-size: 13px;
  color: #909399;
  margin-top: 4px;
  border-left: 3px solid #dcdfe6;
  padding-left: 8px;
}

.word-stats-detail {
  margin-top: 24px;
  border-top: 1px solid #ebedf0;
  padding-top: 16px;
}

.stat-title {
  font-size: var(--font-size-md, 14px);
  font-weight: 700;
  margin-bottom: 12px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.stat-grid-item {
  background-color: #f7f8fa;
  border-radius: 8px;
  padding: 12px;
}

.stat-label {
  font-size: var(--font-size-sm, 12px);
  color: #969799;
  margin-bottom: 4px;
}

.stat-value {
  font-size: var(--font-size-md, 14px);
  color: #323233;
  font-weight: 700;
}

.stat-value .easy {
  color: #07c160;
}

.stat-value .medium {
  color: #1989fa;
}

.stat-value .hard {
  color: #ee0a24;
}

.mastered-text {
  color: #07c160;
}

.filter-popup {
  padding: 16px;
}

.filter-content {
  padding: 16px 0;
}

.filter-actions {
  margin-top: 24px;
}

.empty-state {
  padding: 32px 0;
}
</style>
