<template>
  <div class="notice-list-page">
    <!-- 使用全局返回按钮 -->
    <back-button title="公告中心" />
    
    <!-- 公告列表 -->
    <div class="notice-container">
      <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
        <van-list
          v-model:loading="loading"
          :finished="finished"
          finished-text="没有更多了"
          @load="onLoad"
        >
          <van-cell-group inset v-for="notice in notices" :key="notice.id" class="notice-item">
            <div class="notice-card" @click="showNoticeDetail(notice)">
              <h3 class="notice-title">{{ notice.title }}</h3>
              <p class="notice-brief">{{ notice.content }}</p>
              <div class="notice-footer">
                <span class="notice-date">{{ notice.date }}</span>
                <van-icon name="arrow" />
              </div>
            </div>
          </van-cell-group>
        </van-list>
      </van-pull-refresh>
    </div>

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
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { BackButton } from '../components/Common';

interface Notice {
  id: number;
  title: string;
  date: string;
  content: string;
}

const router = useRouter();
const notices = ref<Notice[]>([]);
const loading = ref(false);
const finished = ref(false);
const refreshing = ref(false);
const showDetail = ref(false);
const selectedNotice = ref<Notice | null>(null);

// 模拟获取公告数据
const fetchNotices = (): Promise<Notice[]> => {
  // 这里应该是实际的API调用
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
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
        },
        {
          id: 4,
          title: '用户体验调查',
          date: '2024-03-10',
          content: '为了不断改进我们的产品，我们诚邀您参与用户体验调查。完成调查的用户将获得7天VIP会员奖励。感谢您的宝贵意见！'
        },
        {
          id: 5,
          title: '新增学习资源',
          date: '2024-03-08',
          content: '我们新增了大量英语学习资源，包括各类考试真题、模拟试卷和学习材料。现在就去资源中心探索吧！'
        }
      ]);
    }, 1000);
  });
};

// 加载更多数据
const onLoad = async () => {
  // 如果是刷新，则清空列表
  if (refreshing.value) {
    notices.value = [];
    refreshing.value = false;
  }

  try {
    const newNotices = await fetchNotices();
    notices.value = [...notices.value, ...newNotices];
    loading.value = false;
    
    // 模拟数据加载完成
    finished.value = true;
  } catch (error) {
    console.error('加载公告失败', error);
    loading.value = false;
  }
};

// 下拉刷新
const onRefresh = () => {
  finished.value = false;
  loading.value = true;
  onLoad();
};

// 显示公告详情
const showNoticeDetail = (notice: Notice): void => {
  selectedNotice.value = notice;
  showDetail.value = true;
};

// 组件挂载时加载数据
onMounted(() => {
  loading.value = true;
  onLoad();
});
</script>

<style scoped>
.notice-list-page {
  min-height: 100vh;
  background-color: #f7f8fa;
}

.notice-container {
  padding: 16px;
  padding-bottom: 32px;
}

.notice-item {
  margin-bottom: 12px;
}

.notice-card {
  padding: 16px;
  background: #fff;
  border-radius: 8px;
  cursor: pointer;
}

.notice-title {
  margin: 0 0 8px 0;
  font-size: var(--font-size-md);
  color: #323233;
  font-weight: 700;
}

.notice-brief {
  margin: 0 0 12px 0;
  font-size: var(--font-size-sm);
  color: #646566;
  line-height: 1.5;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.notice-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: var(--font-size-sm);
  color: #969799;
}

.notice-date {
  font-size: var(--font-size-sm);
  color: #969799;
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
  font-size: var(--font-size-md);
  font-weight: 700;
}

.notice-content {
  padding: 16px 4px;
}

.notice-content h3 {
  margin: 0 0 8px 0;
  font-size: var(--font-size-lg);
  color: #323233;
  font-weight: 700;
}

.notice-text {
  font-size: var(--font-size-base, 14px);
  line-height: 1.5;
  color: #323233;
  font-family: 'Noto Sans SC', sans-serif;
}
</style> 