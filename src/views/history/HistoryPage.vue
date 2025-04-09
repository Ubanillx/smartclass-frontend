<template>
  <div class="history-page">
    <!-- 返回按钮 -->
    <back-button title="学习历史" />
    
    <!-- 统计信息 -->
    <div class="stats-card">
      <div class="stats-item">
        <div class="stats-value">{{ totalDays }}</div>
        <div class="stats-label">学习天数</div>
      </div>
      <div class="stats-item">
        <div class="stats-value">{{ totalHours }}</div>
        <div class="stats-label">总学习时长</div>
      </div>
      <div class="stats-item">
        <div class="stats-value">{{ totalActivities }}</div>
        <div class="stats-label">学习活动</div>
      </div>
    </div>

    <!-- 分类标签页 -->
    <div class="tab-container">
      <van-tabs v-model:active="activeTab" class="custom-tabs">
        <van-tab title="全部记录" name="all"></van-tab>
        <van-tab title="按类型" name="category"></van-tab>
      </van-tabs>
    </div>
    
    <div class="history-list">
      <!-- 日期分组 -->
      <div v-for="(group, groupIndex) in groupedHistoryItems" :key="groupIndex" class="history-group">
        <div class="date-header">{{ group.date }}</div>
        
        <!-- 分组内的历史记录项 -->
        <div 
          v-for="item in group.items" 
          :key="item.id" 
          class="history-item"
        >
          <div class="history-content">
            <div class="icon-wrapper" :style="{ backgroundColor: getIconBgColor(item.icon) }">
              <van-icon :name="item.icon" class="history-icon" :color="getIconColor(item.icon)" />
            </div>
            <div class="history-info">
              <div class="history-title">{{ item.title }}</div>
              <div class="history-desc">{{ item.description }}</div>
            </div>
            <div class="history-time">{{ item.time }}</div>
          </div>
        </div>
      </div>
      
      <!-- 加载更多 -->
      <div class="load-more">
        <van-loading v-if="loading" type="spinner" size="24px" />
        <van-button v-else @click="loadMoreHistory" size="small" plain type="primary" block>加载更多</van-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { BackButton } from '../../components/Common';

interface HistoryItem {
  id: number;
  date: string;
  time: string;
  icon: string;
  title: string;
  description: string;
  category?: string;
}

interface GroupedHistory {
  date: string;
  items: HistoryItem[];
}

const activeTab = ref('all');
const loading = ref(false);
const page = ref(1);
const pageSize = ref(10);
const hasMore = ref(true);

// 统计数据
const totalDays = ref(18);
const totalHours = ref(37);
const totalActivities = ref(42);

// 历史记录数据
const historyItems = ref<HistoryItem[]>([
  {
    id: 1,
    date: '今天',
    time: '14:30',
    icon: 'records',
    title: '完成单词测试',
    description: '正确率 85%',
    category: 'test',
  },
  {
    id: 2,
    date: '今天',
    time: '10:15',
    icon: 'smile-o',
    title: '完成每日任务',
    description: '获得5颗星星',
    category: 'daily',
  },
  {
    id: 3,
    date: '昨天',
    time: '16:45',
    icon: 'play-circle-o',
    title: '观看视频课程',
    description: '《英语口语进阶》第3课',
    category: 'video',
  },
  {
    id: 4,
    date: '昨天',
    time: '10:20',
    icon: 'music-o',
    title: '完成听力练习',
    description: '得分 90分',
    category: 'listening',
  },
  {
    id: 5,
    date: '2023-10-15',
    time: '19:30',
    icon: 'edit',
    title: '写作训练',
    description: '《我的家乡》',
    category: 'writing',
  },
  {
    id: 6,
    date: '2023-10-15',
    time: '15:00',
    icon: 'user-o',
    title: '与外教对话',
    description: '30分钟口语训练',
    category: 'speaking',
  },
  {
    id: 7,
    date: '2023-10-14',
    time: '20:10',
    icon: 'bookmark',
    title: '阅读文章',
    description: '《The History of English》',
    category: 'reading',
  },
  {
    id: 8,
    date: '2023-10-13',
    time: '19:00',
    icon: 'chart-trending-o',
    title: '知识点测验',
    description: '词汇与语法',
    category: 'test',
  },
  {
    id: 9,
    date: '2023-10-12',
    time: '16:30',
    icon: 'label-o',
    title: '单词复习',
    description: '复习了150个单词',
    category: 'vocabulary',
  },
  {
    id: 10,
    date: '2023-10-11',
    time: '18:20',
    icon: 'certificate',
    title: '完成课程',
    description: '获得课程证书',
    category: 'achievement',
  },
]);

// 按日期分组
const groupedHistoryItems = computed<GroupedHistory[]>(() => {
  const groups: Record<string, HistoryItem[]> = {};
  
  // 根据标签页过滤
  let filteredItems = [...historyItems.value];
  if (activeTab.value === 'category') {
    // 此处可以添加按类型过滤的逻辑
  }
  
  // 按日期分组
  filteredItems.forEach(item => {
    if (!groups[item.date]) {
      groups[item.date] = [];
    }
    groups[item.date].push(item);
  });
  
  // 转换为数组格式并排序
  return Object.keys(groups).map(date => ({
    date,
    items: groups[date]
  }));
});

// 获取图标背景色
const getIconBgColor = (icon: string) => {
  const colorMap: Record<string, string> = {
    'records': 'rgba(25, 137, 250, 0.1)',
    'play-circle-o': 'rgba(255, 151, 106, 0.1)',
    'music-o': 'rgba(7, 193, 96, 0.1)',
    'edit': 'rgba(114, 50, 221, 0.1)',
    'bookmark': 'rgba(238, 10, 36, 0.1)',
    'smile-o': 'rgba(255, 205, 50, 0.1)',
    'user-o': 'rgba(0, 206, 209, 0.1)',
    'chart-trending-o': 'rgba(255, 105, 180, 0.1)',
    'label-o': 'rgba(118, 199, 83, 0.1)',
    'certificate': 'rgba(156, 39, 176, 0.1)',
  };
  
  return colorMap[icon] || 'rgba(25, 137, 250, 0.1)';
};

// 获取图标颜色
const getIconColor = (icon: string) => {
  const colorMap: Record<string, string> = {
    'records': '#1989fa',
    'play-circle-o': '#ff976a',
    'music-o': '#07c160',
    'edit': '#7232dd',
    'bookmark': '#ee0a24',
    'smile-o': '#ffcd32',
    'user-o': '#00ced1',
    'chart-trending-o': '#ff69b4',
    'label-o': '#76c753',
    'certificate': '#9c27b0',
  };
  
  return colorMap[icon] || '#1989fa';
};

// 加载更多历史记录
const loadMoreHistory = async () => {
  if (!hasMore.value) return;
  
  loading.value = true;
  
  try {
    // 模拟API请求延迟
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // 增加页码
    page.value++;
    
    // 模拟加载更多数据
    // 这里只是简单地复制前10条记录并修改id
    const moreItems = historyItems.value.slice(0, 5).map(item => ({
      ...item,
      id: item.id + historyItems.value.length,
      date: '2023-10-10', // 更早的日期
    }));
    
    // 添加到列表中
    historyItems.value.push(...moreItems);
    
    // 模拟没有更多数据的情况
    if (page.value >= 3) {
      hasMore.value = false;
    }
  } catch (error) {
    console.error('加载历史记录失败:', error);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  // 页面加载时可以获取历史记录数据
  // 实际应用中会从API获取数据
});
</script>

<style scoped>
.history-page {
  padding: 0 0 16px 0;
  background-color: #F2F7FD;
  min-height: 100vh;
}

.stats-card {
  display: flex;
  justify-content: space-between;
  padding: 16px;
  background-color: #ffffff;
  border-radius: 0px;
  margin: 0 0 8px 0;
}

.stats-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
}

.stats-value {
  font-size: 24px;
  font-weight: bold;
  color: #323233;
  margin-bottom: 4px;
}

.stats-label {
  font-size: 14px;
  color: #969799;
}

.tab-container {
  background-color: #ffffff;
  margin-bottom: 8px;
}

.custom-tabs :deep(.van-tabs__wrap) {
  padding: 0 16px;
}

.custom-tabs :deep(.van-tabs__line) {
  background-color: #1989fa;
}

.history-list {
  padding: 0 16px;
}

.history-group {
  margin-bottom: 16px;
}

.date-header {
  font-size: 14px;
  color: #969799;
  margin-bottom: 8px;
  font-weight: 500;
}

.history-item {
  background-color: #ffffff;
  border-radius: 12px;
  margin-bottom: 8px;
  padding: 16px;
  box-shadow: 0 2px 8px rgba(100, 101, 102, 0.05);
}

.history-content {
  display: flex;
  align-items: center;
  gap: 12px;
}

.icon-wrapper {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.history-icon {
  font-size: 20px;
}

.history-info {
  flex: 1;
}

.history-title {
  font-size: 16px;
  font-weight: 600;
  color: #323233;
  margin-bottom: 4px;
}

.history-desc {
  font-size: 14px;
  color: #646566;
}

.history-time {
  font-size: 12px;
  color: #969799;
  padding: 2px 8px;
  background-color: #f7f8fa;
  border-radius: 10px;
  white-space: nowrap;
}

.load-more {
  display: flex;
  justify-content: center;
  padding: 16px 0;
}
</style> 