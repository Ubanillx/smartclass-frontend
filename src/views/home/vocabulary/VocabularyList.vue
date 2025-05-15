<template>
  <div class="vocabulary-list">
    <!-- 返回按钮 -->
    <back-button title="词汇列表" />

    <!-- 主要内容区域 -->
    <div class="content-container">
      <!-- 单词列表 -->
      <div class="word-list">
        <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
          <div v-if="loading" class="loading-container">
            <van-loading color="#1989fa" />
          </div>
          <div v-else-if="words.length === 0" class="empty-container">
            <van-empty description="暂无词汇" />
          </div>
          <template v-else>
            <div
              class="word-card"
              v-for="word in words"
              :key="word.id"
              @click="showWordDetail(word)"
            >
              <div class="word-header">
                <span class="word-text">{{ word.word }}</span>
                <div class="actions">
                  <van-icon
                    name="good-job-o"
                    :class="['like-icon', { liked: word.isLiked }]"
                    @click.stop="toggleLike(word)"
                  />
                  <van-icon
                    :name="word.isCollected ? 'star' : 'star-o'"
                    :class="['collect-icon', { collected: word.isCollected }]"
                    @click.stop="toggleCollect(word)"
                  />
                </div>
              </div>
              <div class="word-phonetic">{{ word.pronunciation }}</div>
              <div class="word-translation">{{ word.translation }}</div>
              <div class="word-category">{{ word.category }}</div>
              <div class="word-example" v-if="word.example">
                <div class="example-text">{{ word.example }}</div>
                <div class="example-translation">{{ word.exampleTranslation }}</div>
              </div>
            </div>
          </template>
        </van-pull-refresh>
      </div>
      
      <!-- 分页组件 -->
      <div class="pagination-wrapper" v-show="words.length > 0 && !loading">
        <chat-pagination
          :total-items="totalItems"
          :page-size="pageSize"
          :total-pages="totalPages"
          :initial-page="currentPage"
          @page-change="handlePageChange"
        />
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
        <div class="word-content" v-if="currentWord">
          <div class="word-main">
            <span class="word-text">{{ currentWord.word }}</span>
            <div class="actions">
              <van-icon
                name="good-job-o"
                :class="['like-icon', { liked: currentWord.isLiked }]"
                @click="toggleLike(currentWord)"
              />
              <van-icon
                :name="currentWord.isCollected ? 'star' : 'star-o'"
                :class="['collect-icon', { collected: currentWord.isCollected }]"
                @click="toggleCollect(currentWord)"
              />
            </div>
          </div>
          <div class="word-phonetic-row">
            <div class="word-phonetic">{{ currentWord.pronunciation }}</div>
            <van-icon name="volume" class="audio-icon" @click="playAudio(currentWord.audioUrl)" v-if="currentWord.audioUrl"/>
          </div>
          <div class="word-translation-detail">{{ currentWord.translation }}</div>
          <div class="word-category-detail">分类：{{ currentWord.category }}</div>
          
          <div class="word-example-detail" v-if="currentWord.example">
            <div class="example-title">例句：</div>
            <div class="example-text">{{ currentWord.example }}</div>
            <div class="example-translation">{{ currentWord.exampleTranslation }}</div>
          </div>
          
          <div class="word-notes" v-if="currentWord.notes">
            <div class="notes-title">笔记：</div>
            <div class="notes-content">{{ currentWord.notes }}</div>
          </div>
          
          <div class="word-stats-detail">
            <div class="stat-title">单词数据</div>
            <div class="stats-grid">
              <div class="stat-grid-item">
                <div class="stat-label">点赞数</div>
                <div class="stat-value">{{ currentWord.likeCount || 0 }}</div>
              </div>
              <div class="stat-grid-item">
                <div class="stat-label">收藏次数</div>
                <div class="stat-value">{{ currentWord.collectCount || 0 }}</div>
              </div>
              <div class="stat-grid-item">
                <div class="stat-label">难度等级</div>
                <div class="stat-value">{{ currentWord.difficulty || 1 }}</div>
              </div>
              <div class="stat-grid-item">
                <div class="stat-label">发布日期</div>
                <div class="stat-value">{{ formatFullDate(currentWord.publishDate) }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { showToast } from 'vant';
import { BackButton } from '../../../components/Common';
import { ChatPagination } from '../../../components/Dialogue';
import { DailyWordControllerService } from '../../../services/services/DailyWordControllerService';

// 状态变量
const loading = ref(false);
const refreshing = ref(false);
const showWordPopup = ref(false);
const currentWord = ref<any>(null);

// 单词数据与分页
const words = ref<any[]>([]);
const currentPage = ref(1);
const pageSize = 20;
const totalItems = ref(0);
const totalPages = computed(() => {
  return Math.ceil(totalItems.value / pageSize);
});

// 播放音频
const playAudio = (audioUrl: string) => {
  if (!audioUrl) return;
  
  const audio = new Audio(audioUrl);
  audio.play().catch(error => {
    console.error('播放音频失败:', error);
    showToast('音频播放失败');
  });
};

// 页码变化处理
const handlePageChange = (page: number) => {
  // 避免重复加载当前页
  if (page === currentPage.value) return;
  
  currentPage.value = page;
  loadData();
};

// 加载数据
const loadData = async () => {
  loading.value = true;
  
  try {
    const response = await DailyWordControllerService.listDailyWordVoByPageUsingGet(
      undefined, // adminId
      undefined, // category
      undefined, // createTime
      currentPage.value, // current page
      undefined, // difficulty
      undefined, // id
      pageSize, // pageSize - 设置为20
      undefined, // publishDateEnd
      undefined, // publishDateStart
      undefined, // sortField
      undefined, // sortOrder
      undefined, // translation
      undefined // word
    );
    
    if (response.code === 0 && response.data && response.data.records) {
      // 处理返回的数据
      words.value = response.data.records.map((item: any) => ({
        ...item,
        isCollected: false, // 默认未收藏
        isLiked: false, // 默认未点赞
        viewCount: item.viewCount || 0,
        collectCount: item.collectCount || 0,
        lastViewTime: item.updateTime || new Date().toISOString()
      }));
      
      // 更新总记录数，用于分页
      if (response.data.total !== undefined) {
        totalItems.value = response.data.total;
      }
    } else {
      showToast('获取数据失败');
    }
  } catch (error) {
    console.error('加载单词数据出错:', error);
    showToast('加载失败，请稍后重试');
  } finally {
    loading.value = false;
  }
};

// 下拉刷新
const onRefresh = () => {
  // 重置页码
  currentPage.value = 1;
  
  // 重新加载数据
  loadData();
  
  // 结束刷新状态
  refreshing.value = false;
};

// 显示单词详情
const showWordDetail = (word: any) => {
  currentWord.value = word;
  showWordPopup.value = true;

  // 增加查看次数
  word.viewCount = (word.viewCount || 0) + 1;
  word.lastViewTime = new Date().toISOString();
};

// 收藏/取消收藏单词
const toggleCollect = (word: any) => {
  word.isCollected = !word.isCollected;

  if (word.isCollected) {
    word.collectCount = (word.collectCount || 0) + 1;
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
  
  // 这里可以添加后端API调用，将收藏状态同步到服务器
};

// 点赞/取消点赞单词
const toggleLike = (word: any) => {
  word.isLiked = !word.isLiked;

  if (word.isLiked) {
    word.likeCount = (word.likeCount || 0) + 1;
    showToast({
      message: '点赞成功',
      position: 'bottom',
    });
  } else {
    word.likeCount = Math.max((word.likeCount || 0) - 1, 0);
    showToast({
      message: '已取消点赞',
      position: 'bottom',
    });
  }
  
  // 这里可以添加后端API调用，将点赞状态同步到服务器
};

// 格式化完整日期
const formatFullDate = (dateString: string) => {
  if (!dateString) return '未发布';
  
  const date = new Date(dateString);
  return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
};

// 组件挂载时加载初始数据
onMounted(() => {
  loadData();
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
  padding: 0 16px;
}

.word-list {
  padding: 12px 0;
  position: relative;
  min-height: 200px;
}

.loading-container {
  display: flex;
  justify-content: center;
  padding: 40px 0;
}

.empty-container {
  padding: 40px 0;
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

.actions {
  display: flex;
  align-items: center;
}

.like-icon {
  font-size: var(--font-size-lg, 16px);
  color: #969799;
  margin-right: 12px;
}

.like-icon.liked {
  color: #ee0a24;
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
  margin-bottom: 8px;
  font-weight: 500;
}

.word-category {
  font-size: var(--font-size-sm, 12px);
  color: #1989fa;
  background-color: rgba(25, 137, 250, 0.1);
  border-radius: 10px;
  padding: 2px 8px;
  display: inline-block;
  margin-bottom: 8px;
}

.word-example {
  background-color: #f7f8fa;
  border-radius: 8px;
  padding: 8px 12px;
  margin-bottom: 12px;
}

.example-text {
  font-size: var(--font-size-sm, 12px);
  color: #323233;
  margin-bottom: 4px;
}

.example-translation {
  font-size: var(--font-size-sm, 12px);
  color: #969799;
}

.pagination-wrapper {
  padding: 16px 0 24px;
  margin-top: 8px;
  background-color: rgba(242, 247, 253, 0.95);
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.05);
  border-radius: 16px 16px 0 0;
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

.word-phonetic-row {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
}

.audio-icon {
  margin-left: 8px;
  color: #1989fa;
  font-size: 18px;
}

.word-translation-detail {
  font-size: var(--font-size-lg, 16px);
  color: #323233;
  font-weight: 500;
  margin-bottom: 16px;
}

.word-category-detail {
  font-size: var(--font-size-md, 14px);
  color: #323233;
  margin-bottom: 16px;
}

.word-example-detail {
  background-color: #f7f8fa;
  border-radius: 8px;
  padding: 12px;
  margin-bottom: 16px;
}

.example-title {
  font-size: var(--font-size-md, 14px);
  font-weight: 500;
  color: #323233;
  margin-bottom: 8px;
}

.word-notes {
  background-color: #fff7e6;
  border-radius: 8px;
  padding: 12px;
  margin-bottom: 16px;
}

.notes-title {
  font-size: var(--font-size-md, 14px);
  font-weight: 500;
  color: #323233;
  margin-bottom: 8px;
}

.notes-content {
  font-size: var(--font-size-md, 14px);
  color: #646566;
  line-height: 1.5;
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
