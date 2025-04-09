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
          <van-cell-group
            inset
            v-for="notice in notices"
            :key="notice.id"
            class="notice-item"
          >
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
import { Notice, fetchMockNotices } from '../api/mock';

const router = useRouter();
const notices = ref<Notice[]>([]);
const loading = ref(false);
const finished = ref(false);
const refreshing = ref(false);
const showDetail = ref(false);
const selectedNotice = ref<Notice | null>(null);

// 加载更多数据
const onLoad = async () => {
  // 如果是刷新，则清空列表
  if (refreshing.value) {
    notices.value = [];
    refreshing.value = false;
  }

  try {
    const newNotices = await fetchMockNotices();
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
