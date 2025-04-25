<template>
  <div class="vocabulary-list">
    <!-- 返回按钮 -->
    <back-button title="词汇列表" />

    <!-- 主要内容区域 -->
    <div class="content-container">
      <!-- 词汇分类标签页 -->
      <van-tabs
        v-model:active="activeCategory"
        sticky
        @change="handleCategoryChange"
      >
        <van-tab
          v-for="category in categories"
          :key="category.id"
          :title="category.name"
        >
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
                  class="word-card"
                  v-for="word in words"
                  :key="word.id"
                  @click="showWordDetail(word)"
                >
                  <div class="word-header">
                    <span class="word-text">{{ word.text }}</span>
                    <van-icon
                      :name="word.isCollected ? 'star' : 'star-o'"
                      :class="['collect-icon', { collected: word.isCollected }]"
                      @click.stop="toggleCollect(word)"
                    />
                  </div>
                  <div class="word-phonetic">/{{ word.phonetic }}/</div>
                  <div class="word-translation">{{ word.translation }}</div>
                  <div class="word-stats">
                    <div class="stat-item">
                      <van-icon name="eye-o" />
                      <span>{{ word.viewCount }}</span>
                    </div>
                    <div class="stat-item">
                      <van-icon name="star-o" />
                      <span>{{ word.collectCount }}</span>
                    </div>
                    <div class="stat-item">
                      <van-icon name="clock-o" />
                      <span>{{ formatDate(word.lastViewTime) }}</span>
                    </div>
                  </div>
                </div>
              </van-list>
            </van-pull-refresh>
          </div>
        </van-tab>
      </van-tabs>
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
            <van-icon
              :name="currentWord.isCollected ? 'star' : 'star-o'"
              :class="['collect-icon', { collected: currentWord.isCollected }]"
              @click="toggleCollect(currentWord)"
            />
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
                <div class="stat-label">查看次数</div>
                <div class="stat-value">{{ currentWord.viewCount }}</div>
              </div>
              <div class="stat-grid-item">
                <div class="stat-label">收藏次数</div>
                <div class="stat-value">{{ currentWord.collectCount }}</div>
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
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { showToast } from 'vant';
import { BackButton } from '../../components/Common';
import {
  vocabularyCategories,
  generateMockWords,
  Word,
  VocabularyCategory,
} from '../../api/mock';

// 状态变量
const activeCategory = ref(0);
const loading = ref(false);
const finished = ref(false);
const refreshing = ref(false);
const showWordPopup = ref(false);
const currentWord = ref<Word | null>(null);

// 分类数据 - 从mock.ts中获取
const categories = ref<VocabularyCategory[]>(vocabularyCategories);

// 单词数据
const words = ref<Word[]>([]);

// 处理分类切换
const handleCategoryChange = (index: number) => {
  // 重置状态
  words.value = [];
  loading.value = false;
  finished.value = false;

  // 加载新分类的数据
  onLoad();
};

// 模拟加载数据
const onLoad = () => {
  // 模拟异步加载
  setTimeout(() => {
    // 根据当前选中的分类加载对应的单词
    const newWords = generateMockWords(10, activeCategory.value);
    words.value = [...words.value, ...newWords];

    // 加载状态结束
    loading.value = false;

    // 判断是否已加载完所有数据
    if (words.value.length >= 30) {
      finished.value = true;
    }
  }, 1000);
};

// 下拉刷新
const onRefresh = () => {
  // 重置加载状态
  finished.value = false;

  // 清空列表数据
  words.value = [];

  // 重新加载数据
  onLoad();

  // 结束刷新状态
  refreshing.value = false;
};

// 显示单词详情
const showWordDetail = (word: Word) => {
  currentWord.value = word;
  showWordPopup.value = true;

  // 增加查看次数
  word.viewCount += 1;
  word.lastViewTime = new Date().toISOString();
};

// 收藏/取消收藏单词
const toggleCollect = (word: Word) => {
  word.isCollected = !word.isCollected;

  if (word.isCollected) {
    word.collectCount += 1;
    showToast({
      message: '已添加到生词本',
      position: 'bottom',
    });
  } else {
    showToast({
      message: '已取消收藏',
      position: 'bottom',
    });
  }
};

// 格式化日期
const formatDate = (dateString: string) => {
  if (!dateString) return '未查看';

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

// 组件挂载时加载初始数据
onMounted(() => {
  onLoad();
});
</script>

<style scoped>
.vocabulary-list {
  min-height: 100vh;
  background-color: #f7f8fa;
  display: flex;
  flex-direction: column;
}

.content-container {
  flex: 1;
  margin-top: 8px; /* 为返回按钮留出空间 */
}

:deep(.van-tabs__wrap) {
  position: sticky;
  top: 46px;
  z-index: 2;
  background-color: #fff;
}

:deep(.van-tabs__content) {
  padding: 0 16px;
}

:deep(.van-tab) {
  font-size: var(--font-size-md);
  font-weight: 500;
  color: #323233;
}

:deep(.van-tab--active) {
  font-weight: 700;
  color: #1989fa;
}

:deep(.van-tabs__line) {
  background-color: #1989fa;
}

.word-list {
  padding: 12px 0;
}

.word-card {
  background-color: #fff;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
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

.collect-icon {
  font-size: var(--font-size-lg, 16px);
  color: #969799;
}

.collect-icon.collected {
  color: #ffd21e;
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

.word-stats {
  display: flex;
  justify-content: space-between;
  border-top: 1px solid #f2f3f5;
  padding-top: 12px;
}

.stat-item {
  display: flex;
  align-items: center;
  color: #969799;
  font-size: var(--font-size-sm, 12px);
}

.stat-item .van-icon {
  margin-right: 4px;
  font-size: 14px;
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
  gap: 16px;
}

.stat-grid-item {
  display: flex;
  flex-direction: column;
}

.stat-label {
  font-size: var(--font-size-sm, 12px);
  color: #969799;
  margin-bottom: 4px;
}

.stat-value {
  font-size: var(--font-size-md, 14px);
  color: #323233;
  font-weight: 500;
}
</style>
