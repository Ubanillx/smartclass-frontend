<template>
  <div class="articles-list">
    <!-- 返回按钮 -->
    <back-button title="精美文章" />

    <!-- 主要内容区域 -->
    <div class="content-container">
      <!-- 分类标签页 -->
      <van-tabs v-model:active="activeCategory" sticky swipeable>
        <van-tab title="全部">
          <article-content 
            :articles="filteredArticles" 
            :loading="loading"
            :finished="finished"
            :refreshing="refreshing"
            @article-click="showArticleDetail"
            @load="loadArticles"
            @refresh="onRefresh"
          />
        </van-tab>
        <van-tab v-for="category in categories" :key="category" :title="category">
          <article-content 
            :articles="filteredArticles" 
            :loading="loading"
            :finished="finished"
            :refreshing="refreshing"
            @article-click="showArticleDetail"
            @load="loadArticles"
            @refresh="onRefresh"
          />
        </van-tab>
      </van-tabs>
    </div>

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
            <span class="detail-tag" :style="getTagStyle(selectedArticle.category)">{{ selectedArticle.category }}</span>
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
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { BackButton } from '../../components/Common';
import { useRouter } from 'vue-router';
import ArticleContent from './components/ArticleContent.vue';

const router = useRouter();

// 文章接口
interface Article {
  id: number;
  title: string;
  brief: string;
  cover: string;
  category: string;
  readTime: number;
  difficulty: string;
  content: string;
  publishDate: string;
  viewCount: number;
  likeCount: number;
}

// 状态变量
const activeCategory = ref(0);
const articles = ref<Article[]>([]);
const showArticlePopup = ref(false);
const selectedArticle = ref<Article | null>(null);
const loading = ref(false);
const finished = ref(false);
const refreshing = ref(false);

// 文章分类
const categories = ref<string[]>(['励志', '历史', '科技', '文化', '旅行']);

// 根据当前选中的分类筛选文章
const filteredArticles = computed(() => {
  if (activeCategory.value === 0) {
    return articles.value;
  } else {
    const category = categories.value[activeCategory.value - 1];
    return articles.value.filter(article => article.category === category);
  }
});

// 显示文章详情
const showArticleDetail = (article: Article): void => {
  selectedArticle.value = article;
  showArticlePopup.value = true;
  
  // 增加查看次数
  article.viewCount += 1;
};

// 根据文章类别返回不同的样式
const getTagStyle = (category: string): Record<string, string> => {
  const styles: Record<string, string> = {};
  
  switch (category) {
    case '励志':
      styles.background = 'linear-gradient(135deg, #ff9a9e 0%, #fad0c4 99%)';
      break;
    case '历史':
      styles.background = 'linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%)';
      break;
    case '科技':
      styles.background = 'linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%)';
      break;
    case '文化':
      styles.background = 'linear-gradient(135deg, #fbc2eb 0%, #a6c1ee 100%)';
      break;
    case '旅行':
      styles.background = 'linear-gradient(135deg, #f6d365 0%, #fda085 100%)';
      break;
    default:
      styles.background = 'linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%)';
  }
  
  return styles;
};

// 加载文章数据
const loadArticles = () => {
  loading.value = true;
  
  // 模拟异步加载
  setTimeout(() => {
    const newArticles = generateMockArticles(10);
    articles.value = [...articles.value, ...newArticles];
    
    loading.value = false;
    
    // 判断是否已加载完所有数据
    if (articles.value.length >= 30) {
      finished.value = true;
    }
  }, 1000);
};

// 下拉刷新
const onRefresh = () => {
  finished.value = false;
  articles.value = [];
  loadArticles();
  refreshing.value = false;
};

// 生成模拟文章数据
const generateMockArticles = (count: number): Article[] => {
  const mockArticles: Article[] = [
    {
      id: 1,
      title: 'The Power of Positive Thinking',
      brief: 'How optimism can change your life and lead to success...',
      cover: 'https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg',
      category: '励志',
      readTime: 5,
      difficulty: '初级',
      content: `<p>Positive thinking is more than just a catchphrase. It changes the way we behave. And I firmly believe that when I am positive, it not only makes me better, but it also makes those around me better.</p>
                <p>I think that's something that we all have within us. When we're positive, it has an impact on our health, our relationships, and our careers. Here are some ways to cultivate a more positive mindset:</p>
                <p><strong>1. Start the day with positive affirmations.</strong> How you start your morning sets the tone for the rest of the day. Instead of focusing on how tired you are, try thinking of something positive.</p>
                <p><strong>2. Focus on the good things, however small.</strong> When challenges occur, focus on the benefits, no matter how slight or unimportant they seem.</p>
                <p><strong>3. Find humor in bad situations.</strong> Allow yourself to experience humor in even the darkest or most trying situations. Remind yourself that this situation will probably make for a good story later.</p>
                <p><strong>4. Turn failures into lessons.</strong> You aren't perfect. You're going to make mistakes and experience failure in multiple contexts, at multiple jobs, and with multiple people. Instead of focusing on how you failed, think about what you're going to do next time.</p>
                <p><strong>5. Practice gratitude.</strong> Gratitude has been proven to reduce stress, improve self-esteem, and foster resilience even in very difficult times.</p>
                <p>Remember, positive thinking isn't about burying your head in the sand and ignoring life's less pleasant situations. It's about approaching the good and the bad in life with the expectation that things will go well.</p>`,
      publishDate: '2024-03-15T10:30:00Z',
      viewCount: 128,
      likeCount: 42
    },
    {
      id: 2,
      title: 'A Journey Through Ancient Rome',
      brief: 'Exploring the history and legacy of the Roman Empire...',
      cover: 'https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg',
      category: '历史',
      readTime: 8,
      difficulty: '中级',
      content: `<p>The Roman Empire stands as one of the most influential civilizations in world history. At its height, it encompassed vast territories spanning from Britain to Egypt, from Spain to Mesopotamia.</p>
                <p>Founded traditionally in 753 BCE, Rome grew from a small settlement on the Italian Peninsula to become the center of one of the largest empires in the ancient world. The Roman legacy includes remarkable achievements in governance, law, architecture, engineering, language, and culture that continue to shape our world today.</p>
                <p>The Roman Republic, established around 509 BCE, developed a complex political system that balanced power between different institutions. The Senate, composed of aristocratic elders, provided guidance and leadership. Elected officials called consuls served as chief executives, while various assemblies represented the common citizens.</p>
                <p>This republican system influenced many modern governments, including the United States, which adopted elements like separation of powers and checks and balances.</p>
                <p>Roman architecture and engineering achievements were equally impressive. The Romans perfected the use of concrete, arches, and domes, enabling them to construct massive and durable structures. The Colosseum, Pantheon, and countless amphitheaters, aqueducts, and roads demonstrate their technical prowess.</p>
                <p>Roman roads, spanning over 250,000 miles, connected the empire and facilitated trade, communication, and military movement. Many of these roads remained in use for centuries after the empire's fall.</p>
                <p>The legacy of Rome extends far beyond its physical monuments. Roman law forms the foundation of many modern legal systems. Latin, the language of Rome, evolved into the Romance languages (Italian, French, Spanish, Portuguese, and Romanian) and contributed countless words to English and other languages.</p>
                <p>As we reflect on ancient Rome, we recognize not just a historical civilization but a cultural and intellectual heritage that continues to influence our world in profound ways.</p>`,
      publishDate: '2024-03-14T14:45:00Z',
      viewCount: 95,
      likeCount: 31
    },
    {
      id: 3,
      title: 'The Future of Artificial Intelligence',
      brief: 'How AI is transforming our world and what lies ahead...',
      cover: 'https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg',
      category: '科技',
      readTime: 6,
      difficulty: '高级',
      content: `<p>Artificial Intelligence (AI) is rapidly transforming our world in ways that were once confined to science fiction. From virtual assistants and recommendation systems to autonomous vehicles and advanced medical diagnostics, AI technologies are becoming increasingly integrated into our daily lives and professional environments.</p>
                <p>At its core, AI refers to computer systems designed to perform tasks that typically require human intelligence. These include learning from experience, recognizing patterns, understanding language, making decisions, and solving problems. The field has experienced remarkable growth in recent years, driven by advances in computing power, algorithm development, and the availability of vast amounts of data.</p>
                <p>Machine Learning (ML), a subset of AI, has been particularly revolutionary. ML systems can analyze large datasets, identify patterns, and make predictions without explicit programming. Deep Learning, a specialized form of ML using neural networks, has enabled breakthroughs in image and speech recognition, natural language processing, and game playing.</p>
                <p>The impact of AI extends across numerous sectors:</p>
                <p><strong>Healthcare:</strong> AI systems can analyze medical images to detect diseases, predict patient outcomes, discover new drugs, and personalize treatment plans.</p>
                <p><strong>Transportation:</strong> Self-driving vehicles promise to revolutionize mobility, potentially reducing accidents, congestion, and emissions.</p>
                <p><strong>Finance:</strong> AI algorithms detect fraudulent transactions, assess credit risk, optimize investment portfolios, and provide personalized financial advice.</p>
                <p><strong>Education:</strong> Adaptive learning systems tailor educational content to individual students' needs, while AI tutors provide personalized assistance.</p>
                <p>As AI continues to advance, it raises important questions about the future of work, privacy, security, and ethical decision-making. Will automation lead to widespread job displacement or create new opportunities? How can we ensure AI systems make fair and unbiased decisions? Who is responsible when AI systems cause harm?</p>
                <p>The future of AI will depend not only on technological developments but also on how we as a society choose to design, deploy, and regulate these powerful tools. By approaching AI development thoughtfully and inclusively, we can harness its potential to address global challenges while mitigating risks.</p>`,
      publishDate: '2024-03-13T09:15:00Z',
      viewCount: 156,
      likeCount: 53
    }
  ];
  
  // 复制并修改模拟数据以生成更多文章
  const result: Article[] = [];
  for (let i = 0; i < count; i++) {
    const index = i % mockArticles.length;
    const baseArticle = mockArticles[index];
    
    if (!baseArticle) continue; // 额外的安全检查
    
    const newId = articles.value.length + i + 1;
    const daysAgo = Math.floor(Math.random() * 30); // 0-30天前发布
    const publishDate = new Date();
    publishDate.setDate(publishDate.getDate() - daysAgo);
    
    result.push({
      id: newId,
      title: baseArticle.title,
      brief: baseArticle.brief,
      cover: baseArticle.cover,
      category: baseArticle.category,
      readTime: baseArticle.readTime,
      difficulty: baseArticle.difficulty,
      content: baseArticle.content,
      publishDate: publishDate.toISOString(),
      viewCount: Math.floor(Math.random() * 200) + 50,
      likeCount: Math.floor(Math.random() * 80) + 10
    });
  }
  
  return result;
};

// 组件挂载时加载初始数据
onMounted(() => {
  loadArticles();
});
</script>

<style scoped>
.articles-list {
  min-height: 100vh;
  background-color: #f7f8fa;
  display: flex;
  flex-direction: column;
}

.content-container {
  flex: 1;
  margin-top: 8px; /* 为返回按钮留出空间 */
}

.article-detail {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.popup-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid #ebedf0;
}

.popup-header .title {
  font-size: var(--font-size-md, 14px);
  font-weight: 700;
}

.article-content {
  flex: 1;
  padding: 16px;
  overflow-y: auto;
}

.article-content h2 {
  margin: 0 0 12px;
  font-size: var(--font-size-xl, 18px);
  color: #323233;
  font-weight: 700;
}

.article-info {
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
  font-size: var(--font-size-sm, 12px);
  color: #969799;
  align-items: center;
}

.detail-tag {
  padding: 3px 8px;
  font-size: var(--font-size-sm, 12px);
  color: #fff;
  border-radius: 4px;
  font-weight: 500;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.15);
  letter-spacing: 0.5px;
}

.article-text {
  margin-top: 16px;
  font-size: var(--font-size-md, 14px);
  line-height: 1.6;
  color: #323233;
}

.article-text p {
  margin: 12px 0;
}
</style> 