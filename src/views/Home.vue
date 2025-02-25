<template>
  <div class="home">
    <!-- 搜索栏 -->
    <search-bar
      v-model="searchText"
      placeholder="搜索你想要的"
      @search="onSearch"
    />

    <!-- 修改加号按钮的位置，放在右上角 -->
    <van-icon 
      name="plus" 
      size="24" 
      class="add-button"
      @click="showActionSheet = true" 
    />

    <!-- 公告卡片 -->
    <van-cell-group inset class="notice-card">
      <van-cell title="最新公告" icon="volume-o">
        <template #right-icon>
          <span class="more-link" @click="showNoticePopup">更多</span>
        </template>
      </van-cell>
      <div class="notice-preview" @click="showNoticeDetail(notices[0])">
        <h4>{{ notices[0].title }}</h4>
        <p class="notice-brief">{{ notices[0].content }}</p>
        <div class="notice-footer">
          <span class="notice-date">{{ notices[0].date }}</span>
          <van-icon name="arrow" />
        </div>
      </div>
    </van-cell-group>

    <!-- AI助手列表 -->
    <van-cell-group inset class="ai-assistant-module">
      <van-cell title="AI智慧体">
        <template #right-icon>
          <span class="more-link" @click="router.push('/assistants')">更多</span>
        </template>
      </van-cell>
      
      <div class="assistant-list">
        <div 
          v-for="assistant in aiAssistants" 
          :key="assistant.id" 
          class="assistant-item"
          @click="startChat(assistant)"
        >
          <van-image
            :src="assistant.avatar"
            round
            width="50"
            height="50"
          />
          <div class="assistant-info">
            <div class="assistant-name">{{ assistant.name }}</div>
            <div class="assistant-desc">{{ assistant.description }}</div>
          </div>
          <van-icon name="chat-o" class="chat-icon" />
        </div>
      </div>
    </van-cell-group>

    <!-- 添加单词模块 -->
    <van-cell-group inset class="word-module">
      <van-cell title="每日单词">
        <template #right-icon>
          <span class="more-link" @click="router.push('/vocabulary')">更多</span>
        </template>
      </van-cell>
      
      <!-- 每日一词 -->
      <div class="daily-word" @click="showWordDetail">
        <div class="word-header">
          <span class="word-text">{{ dailyWord.text }}</span>
          <van-icon 
            :name="dailyWord.isCollected ? 'star' : 'star-o'" 
            :class="['collect-icon', { collected: dailyWord.isCollected }]"
            @click.stop="toggleCollect"
          />
        </div>
        <div class="word-phonetic">/{{ dailyWord.phonetic }}/</div>
        <div class="word-translation">{{ dailyWord.translation }}</div>
        <div class="word-example">{{ dailyWord.example }}</div>
      </div>

      <!-- 单词分类 -->
      <van-grid :column-num="4" :border="false">
        <van-grid-item 
          v-for="category in wordCategories" 
          :key="category.id"
          :icon="category.icon"
          :text="category.name"
          @click="router.push(category.path)"
        />
      </van-grid>
    </van-cell-group>

    <!-- 精美文章模块 -->
    <van-cell-group inset class="article-module">
      <van-cell title="每日美文">
        <template #right-icon>
          <span class="more-link" @click="router.push('/articles')">更多</span>
        </template>
      </van-cell>
      
      <div class="article-list">
        <div 
          v-for="article in articles" 
          :key="article.id" 
          class="article-item"
          @click="showArticleDetail(article)"
        >
          <div class="article-cover">
            <van-image
              :src="article.cover"
              fit="cover"
              radius="4"
            />
            <span class="article-tag">{{ article.category }}</span>
          </div>
          <div class="article-info">
            <h3 class="article-title">{{ article.title }}</h3>
            <p class="article-brief">{{ article.brief }}</p>
            <div class="article-meta">
              <span>{{ article.readTime }}分钟</span>
              <span>{{ article.difficulty }}</span>
            </div>
          </div>
        </div>
      </div>
    </van-cell-group>

    <!-- 公告列表弹出层 -->
    <van-popup
      v-model:show="showPopup"
      round
      position="bottom"
      :style="{ height: '60%' }"
    >
      <div class="notice-popup">
        <div class="notice-popup-header">
          <span class="title">全部公告</span>
          <van-icon name="cross" @click="showPopup = false" />
        </div>
        <div class="notice-list">
          <van-cell-group inset>
            <van-cell
              v-for="notice in notices"
              :key="notice.id"
              :title="notice.title"
              :label="notice.date"
              is-link

              @click="showNoticeDetail(notice)"
            />
          </van-cell-group>
        </div>
      </div>
    </van-popup>

    <!-- 公告详情弹出层 -->
    <van-popup
      v-model:show="showDetail"
      round
      position="bottom"
      :style="{ height: '60%' }"
    >
      <div class="notice-detail">
        <div class="notice-popup-header">
          <span class="title">公告详情</span>
          <van-icon name="cross" @click="showDetail = false" />
        </div>
        <div class="notice-content" v-if="selectedNotice">
          <h3>{{ selectedNotice.title }}</h3>
          <p class="notice-date">{{ selectedNotice.date }}</p>
          <div class="notice-text">{{ selectedNotice.content }}</div>
        </div>
      </div>
    </van-popup>

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
        <div class="word-content" v-if="dailyWord">
          <div class="word-main">
            <span class="word-text">{{ dailyWord.text }}</span>
            <van-icon 
              :name="dailyWord.isCollected ? 'star' : 'star-o'"
              :class="['collect-icon', { collected: dailyWord.isCollected }]"
              @click="toggleCollect"
            />
          </div>
          <div class="word-phonetic">/{{ dailyWord.phonetic }}/</div>
          <div class="word-meanings">
            <div class="meaning-item" v-for="(meaning, index) in dailyWord.meanings" :key="index">
              <div class="part-of-speech">{{ meaning.partOfSpeech }}</div>
              <div class="definition">{{ meaning.definition }}</div>
              <div class="example">{{ meaning.example }}</div>
            </div>
          </div>
        </div>
      </div>
    </van-popup>

    <!-- 文章详情弹出层 -->
    <van-popup
      v-model:show="showArticlePopup"
      round
      position="bottom"
      :style="{ height: '90%' }"
    >
      <div class="article-detail">
        <div class="popup-header">
          <span class="title">文章详情</span>
          <van-icon name="cross" @click="showArticlePopup = false" />
        </div>
        <div class="article-content" v-if="selectedArticle">
          <h2>{{ selectedArticle.title }}</h2>
          <div class="article-info">
            <span>{{ selectedArticle.category }}</span>
            <span>{{ selectedArticle.readTime }}分钟</span>
            <span>{{ selectedArticle.difficulty }}</span>
          </div>
          <van-image
            :src="selectedArticle.cover"
            fit="cover"
            width="100%"
          />
          <div class="article-text" v-html="selectedArticle.content"></div>
        </div>
      </div>
    </van-popup>

    <!-- 快捷操作面板 -->
    <van-action-sheet
      v-model:show="showActionSheet"
      :actions="actions"
      cancel-text="取消"
      close-on-click-action
      @select="onActionSelect"
    />

  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { showToast } from 'vant';
import SearchBar from '../components/SearchBar.vue';

const router = useRouter();
const showPopup = ref(false);
const showDetail = ref(false);
const selectedNotice = ref(null);
const showWordPopup = ref(false);
const searchText = ref('');
const showArticlePopup = ref(false);
const selectedArticle = ref(null);
const showActionSheet = ref(false);

// Mock 公告数据
const notices = ref([
  {
    id: 1,
    title: '新功能上线：AI 口语助手',
    date: '2024-03-15',
    content: '我们很高兴地宣布，全新的 AI 口语助手功能现已上线！这个功能将帮助您提升口语水平，提供实时发音纠正和对话练习。欢迎体验并提供反馈。'
  },
  {
    id: 2,
    title: '系统维护通知',
    date: '2024-03-14',
    content: '为了给您提供更好的服务，系统将于本周日凌晨 2:00-4:00 进行例行维护，期间可能影响部分功能的使用。给您带来的不便敬请谅解。'
  },
  {
    id: 3,
    title: '课程更新预告',
    date: '2024-03-13',
    content: '下周将更新商务英语系列课程，包含电子邮件写作、商务谈判等实用主题。敬请期待！'
  }
]);

// Mock 每日单词数据
const dailyWord = ref({
  text: 'serendipity',
  phonetic: 'ˌserənˈdɪpəti',
  translation: '意外发现美好事物的能力',
  example: 'Finding this cafe was pure serendipity.',
  isCollected: false,
  meanings: [
    {
      partOfSpeech: 'n.',
      definition: '意外发现美好事物的能力',
      example: 'The discovery of penicillin was a perfect example of serendipity.'
    }
  ]
});

// Mock 单词分类数据
const wordCategories = ref([
  {
    id: 1,
    name: '商务',
    icon: 'shop-o',
    path: '/vocabulary/business'
  },
  {
    id: 2,
    name: '日常',
    icon: 'clock-o',
    path: '/vocabulary/daily'
  },
  {
    id: 3,
    name: '考试',
    icon: 'records',
    path: '/vocabulary/exam'
  },
  {
    id: 4,
    name: '生词本',
    icon: 'bookmark-o',
    path: '/vocabulary/collected'
  }
]);

// Mock 文章数据
const articles = ref([
  {
    id: 1,
    title: 'The Power of Positive Thinking',
    brief: 'How optimism can change your life and lead to success...',
    cover: 'https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg',
    category: '励志',
    readTime: 5,
    difficulty: '初级',
    content: `<p>Positive thinking is more than just a catchphrase. It changes the way we behave. And I firmly believe that when I am positive, it not only makes me better, but it also makes those around me better.</p>
              <p>I think that's something that we all have within us...</p>`
  },
  {
    id: 2,
    title: 'A Journey Through Time',
    brief: 'Exploring the history of human civilization...',
    cover: 'https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg',
    category: '历史',
    readTime: 8,
    difficulty: '中级',
    content: '文章内容...'
  },
  {
    id: 3,
    title: 'The Future of Technology',
    brief: 'What innovations will shape our tomorrow...',
    cover: 'https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg',
    category: '科技',
    readTime: 6,
    difficulty: '高级',
    content: '文章内容...'
  }
]);

// Mock AI助手数据
const aiAssistants = ref([
  {
    id: 1,
    name: '英语教师 Emma',
    description: '专业英语教学，语法讲解，口语指导',
    avatar: 'https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg'
  },
  {
    id: 2,
    name: '口语伙伴 Mike',
    description: '日常英语对话，地道表达，场景练习',
    avatar: 'https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg'
  },
  {
    id: 3,
    name: '写作助手 Sarah',
    description: '作文指导，文章润色，写作技巧',
    avatar: 'https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg'
  }
]);

// 快捷操作列表
const actions = [
  { name: '添加生词', icon: 'edit', color: '#1989fa' },
  { name: '上传笔记', icon: 'notes-o', color: '#07c160' },
  { name: '发起对话', icon: 'chat-o', color: '#ff976a' },
  { name: '分享内容', icon: 'share-o', color: '#ee0a24' },
];

// 显示公告列表
const showNoticePopup = () => {
  showPopup.value = true;
};

// 显示公告详情
const showNoticeDetail = (notice) => {
  selectedNotice.value = notice;
  showPopup.value = false;
  showDetail.value = true;
};

// 显示单词详情
const showWordDetail = () => {
  showWordPopup.value = true;
};

// 收藏/取消收藏单词
const toggleCollect = () => {
  dailyWord.value.isCollected = !dailyWord.value.isCollected;
  showToast({
    message: dailyWord.value.isCollected ? '已添加到生词本' : '已取消收藏',
    position: 'bottom'
  });
};

// 搜索处理
const onSearch = (text) => {
  console.log('搜索:', text);
  // 这里添加实际的搜索逻辑
};

// 显示文章详情
const showArticleDetail = (article) => {
  selectedArticle.value = article;
  showArticlePopup.value = true;
};

// 开始对话
const startChat = (assistant) => {
  router.push({
    path: '/chat',
    query: { assistantId: assistant.id }
  });
};

// 处理快捷操作选择
const onActionSelect = (action) => {
  switch (action.name) {
    case '添加生词':
      router.push('/vocabulary/add');
      break;
    case '上传笔记':
      router.push('/notes/add');
      break;
    case '发起对话':
      router.push('/chat');
      break;
    case '分享内容':
      showToast('分享功能开发中');
      break;
  }
};
</script>

<style scoped>
.home {
  padding: 16px;
  padding-bottom: 66px;
}

.notice-card {
  margin-bottom: 16px;
  background: #fff;
}

.notice-preview {
  padding: 12px 16px 16px;
  cursor: pointer;
}

.notice-preview h4 {
  margin: 0 0 8px 0;
  font-size: 16px;
  color: #323233;
}

.notice-brief {
  margin: 0 0 12px 0;
  font-size: 14px;
  color: #646566;
  line-height: 1.5;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
}

.notice-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12px;
  color: #969799;
}

.more-link {
  color: #1989fa;
  font-size: 14px;
}

.notice-popup {
  padding: 16px;
}

.notice-detail {
  padding: 16px;
}

.notice-popup-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 4px 16px;
  border-bottom: 1px solid #ebedf0;
}

.notice-popup-header .title {
  font-size: 16px;
  font-weight: 500;
}

.notice-content {
  padding: 16px 4px;
}

.notice-content h3 {
  margin: 0 0 8px 0;
  font-size: 18px;
  color: #323233;
}

.notice-date {
  margin: 0 0 16px 0;
  font-size: 14px;
  color: #969799;
}

.notice-text {
  font-size: 14px;
  line-height: 1.5;
  color: #323233;
}

.notice-list {
  margin-top: 16px;
}

.word-module {
  margin-bottom: 16px;
  background: #fff;
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
  font-size: 24px;
  font-weight: 500;
  color: #323233;
}

.collect-icon {
  font-size: 20px;
  color: #969799;
}

.collect-icon.collected {
  color: #ffd21e;
}

.word-phonetic {
  font-size: 14px;
  color: #969799;
  margin-bottom: 8px;
}

.word-translation {
  font-size: 16px;
  color: #323233;
  margin-bottom: 8px;
}

.word-example {
  font-size: 14px;
  color: #646566;
  font-style: italic;
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
  font-size: 16px;
  font-weight: 500;
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
  font-size: 14px;
  color: #969799;
  margin-bottom: 4px;
}

.definition {
  font-size: 16px;
  color: #323233;
  margin-bottom: 8px;
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
}

:deep(.van-grid-item__icon) {
  font-size: 24px;
  color: #1989fa;
}

:deep(.van-grid-item__content) {
  padding: 16px 8px;
}

.article-module {
  margin-bottom: 16px;
}

.article-list {
  padding: 0 16px 16px;
}

.article-item {
  display: flex;
  padding: 16px 0;
  border-bottom: 1px solid #ebedf0;
  cursor: pointer;
}

.article-item:last-child {
  border-bottom: none;
}

.article-cover {
  position: relative;
  width: 120px;
  height: 80px;
  margin-right: 12px;
  flex-shrink: 0;
}

.article-tag {
  position: absolute;
  top: 4px;
  left: 4px;
  padding: 2px 6px;
  font-size: 12px;
  color: #fff;
  background: rgba(0, 0, 0, 0.6);
  border-radius: 4px;
}

.article-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  overflow: hidden;
}

.article-title {
  margin: 0;
  font-size: 16px;
  line-height: 1.4;
  color: #323233;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.article-brief {
  margin: 4px 0;
  font-size: 14px;
  color: #646566;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
}

.article-meta {
  display: flex;
  gap: 12px;
  font-size: 12px;
  color: #969799;
}

.article-detail {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.article-content {
  flex: 1;
  padding: 16px;
  overflow-y: auto;
}

.article-content h2 {
  margin: 0 0 12px;
  font-size: 20px;
  color: #323233;
}

.article-content .article-info {
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
  font-size: 14px;
  color: #969799;
}

.article-text {
  margin-top: 16px;
  font-size: 16px;
  line-height: 1.6;
  color: #323233;
}

.article-text p {
  margin: 12px 0;
}

.ai-assistant-module {
  margin-bottom: 16px;
  background: #fff;
}

.assistant-list {
  padding: 8px 16px;
}

.assistant-item {
  display: flex;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #ebedf0;
  cursor: pointer;
}

.assistant-item:last-child {
  border-bottom: none;
}

.assistant-info {
  flex: 1;
  margin-left: 12px;
}

.assistant-name {
  font-size: 16px;
  color: #323233;
  margin-bottom: 4px;
}

.assistant-desc {
  font-size: 14px;
  color: #969799;
}

.chat-icon {
  font-size: 20px;
  color: #1989fa;
}

/* 修改加号按钮的样式 */
.add-button {
  position: fixed;
  top: 16px;
  right: 16px;
  z-index: 999;
  color: #1989fa;
  padding: 8px;
  background: #fff;
  border-radius: 50%;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

/* 删除不需要的导航栏相关样式 */
.nav-bar,
:deep(.van-nav-bar__content),
:deep(.van-nav-bar__right) {
  display: none;
}

/* 自定义动作面板样式 */
:deep(.van-action-sheet__item) {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

:deep(.van-action-sheet__item .van-icon) {
  font-size: 20px;
}
</style> 