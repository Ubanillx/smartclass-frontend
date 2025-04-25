<template>
  <div class="collected-words">
    <!-- 返回按钮 -->
    <back-button title="我的生词本" />

    <!-- 主要内容区域 -->
    <div class="content-container">
      <!-- 顶部统计信息 -->
      <div class="stats-card">
        <div class="stats-item">
          <div class="stats-value">{{ collectedWords.length }}</div>
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
              v-for="word in filteredWords"
              :key="word.id"
              @click="showWordDetail(word)"
            >
              <div class="word-header">
                <span class="word-text">{{ word.text }}</span>
                <div class="word-actions">
                  <van-icon
                    name="success"
                    class="mastered-icon"
                    :class="{ active: word.mastered }"
                    @click.stop="toggleMastered(word)"
                  />
                  <van-icon
                    name="delete-o"
                    class="delete-icon"
                    @click.stop="confirmRemove(word)"
                  />
                </div>
              </div>
              <div class="word-phonetic">/{{ word.phonetic }}/</div>
              <div class="word-translation">{{ word.translation }}</div>
              <div class="word-tags">
                <div
                  class="difficulty-tag"
                  :class="getDifficultyClass(word.difficulty)"
                >
                  {{ word.difficulty }}
                </div>
                <div class="date-tag">
                  {{ formatDate(word.collectedTime) }}收藏
                </div>
                <div v-if="word.mastered" class="mastered-tag">已掌握</div>
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
            <span class="word-text">{{ currentWord.text }}</span>
            <div class="word-actions">
              <van-icon
                name="success"
                class="mastered-icon"
                :class="{ active: currentWord.mastered }"
                @click="toggleMastered(currentWord)"
              />
              <van-icon
                name="delete-o"
                class="delete-icon"
                @click="confirmRemove(currentWord)"
              />
            </div>
          </div>
          <div class="word-phonetic">/{{ currentWord.phonetic }}/</div>
          <div class="word-meanings">
            <div
              class="meaning-item"
              v-for="(meaning, index) in currentWord.meanings"
              :key="index"
            >
              <div class="part-of-speech">{{ meaning.partOfSpeech }}</div>
              <div class="definition">{{ meaning.definition }}</div>
              <div class="example">{{ meaning.example }}</div>
            </div>
          </div>
          <div class="word-stats-detail">
            <div class="stat-title">单词数据</div>
            <div class="stats-grid">
              <div class="stat-grid-item">
                <div class="stat-label">收藏时间</div>
                <div class="stat-value">
                  {{ formatFullDate(currentWord.collectedTime) }}
                </div>
              </div>
              <div class="stat-grid-item">
                <div class="stat-label">查看次数</div>
                <div class="stat-value">{{ currentWord.viewCount }}</div>
              </div>
              <div class="stat-grid-item">
                <div class="stat-label">最近查看</div>
                <div class="stat-value">
                  {{ formatDate(currentWord.lastViewTime) }}
                </div>
              </div>
              <div class="stat-grid-item">
                <div class="stat-label">难度等级</div>
                <div class="stat-value">{{ currentWord.difficulty }}</div>
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
import { ref, computed, onMounted } from 'vue';
import { showToast, showSuccessToast } from 'vant';
import { BackButton } from '../../components/Common';
import SearchBar from '../../components/SearchBar.vue';
import { useRouter } from 'vue-router';
import {
  useCollectedWordsStore,
  CollectedWord,
} from '../../stores/collectedWordsStore';

const router = useRouter();
const collectedWordsStore = useCollectedWordsStore();

// 状态变量
const loading = ref(false);
const finished = ref(true); // 直接设为true，因为我们一次性从store获取所有数据
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

// 使用store的计算属性
const masteredCount = computed(() => collectedWordsStore.masteredCount);
const reviewCount = computed(() => collectedWordsStore.reviewCount);

// 计算属性：筛选和排序后的单词列表
const filteredWords = computed(() => {
  return collectedWordsStore.getFilteredWords(
    searchText.value,
    selectedDifficulty.value,
    sortOption.value,
  );
});

// 获取所有收藏单词
const collectedWords = computed(() => collectedWordsStore.getCollectedWords());

// 下拉刷新
const onRefresh = () => {
  // 模拟刷新操作
  setTimeout(() => {
    refreshing.value = false;
    showToast('刷新成功');
  }, 1000);
};

// 加载更多
const onLoad = () => {
  // 使用Store中的数据，无需分页加载
  loading.value = false;
  finished.value = true;
};

// 显示单词详情
const showWordDetail = (word: CollectedWord) => {
  currentWord.value = word;
  showWordPopup.value = true;

  // 通过store更新查看次数
  collectedWordsStore.updateWordView(word.id);
};

// 切换单词掌握状态
const toggleMastered = (word: CollectedWord) => {
  collectedWordsStore.toggleMastered(word.id);

  showToast({
    message: word.mastered ? '已标记为掌握' : '已取消掌握标记',
    position: 'bottom',
  });
};

// 确认删除单词
const confirmRemove = (word: CollectedWord) => {
  wordToDelete.value = word;
  showDeleteConfirm.value = true;
};

// 从生词本中移除单词
const removeWord = () => {
  if (!wordToDelete.value) return;

  if (collectedWordsStore.removeWord(wordToDelete.value.id)) {
    // 如果当前正在查看的是要删除的单词，关闭弹窗
    if (currentWord.value?.id === wordToDelete.value.id) {
      showWordPopup.value = false;
    }

    showSuccessToast('已从生词本中移除');
  }
};

// 应用难度筛选
const applyDifficultyFilter = () => {
  showDifficultyFilter.value = false;
};

// 应用排序选项
const applySortOption = () => {
  showSortOptions.value = false;
};

// 应用搜索
const applySearch = (text: string) => {
  searchText.value = text;
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

// 组件挂载时初始化
onMounted(() => {
  // 如果没有收藏数据，则添加一些示例数据（仅用于演示）
  if (collectedWords.value.length === 0) {
    // 添加一些示例数据
    const mockWord = {
      id: 1,
      text: 'ephemeral',
      phonetic: 'ɪˈfemərəl',
      translation: '短暂的，瞬息的',
      example: 'The beauty of cherry blossoms is ephemeral.',
      meanings: [
        {
          partOfSpeech: 'adj.',
          definition: '短暂的，瞬息的',
          example: 'Social media fame can be ephemeral.',
        },
      ],
      viewCount: 28,
      lastViewTime: new Date().toISOString(),
      difficulty: '中级',
    };

    collectedWordsStore.collectWord(mockWord);
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
