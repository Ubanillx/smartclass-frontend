<template>
  <div>
    <!-- 公告卡片 -->
    <van-cell-group inset class="notice-card">
      <van-cell title="最新公告">
        <template #icon>
          <svg class="icon svg-icon notice-icon" aria-hidden="true">
            <use xlink:href="#icon-gongshigonggao"></use>
          </svg>
        </template>
        <template #right-icon>
          <span class="more-link" @click="goToNoticeList">更多</span>
        </template>
      </van-cell>
      <div class="notice-preview">
        <template v-if="notices && notices.length > 0">
          <div @click="showNoticeDetail(notices[0]!)">
            <h4>{{ notices[0]!.title }}</h4>
            <p class="notice-brief">{{ notices[0]!.content }}</p>
            <div class="notice-footer">
              <span class="notice-date">{{ notices[0]!.date }}</span>
              <van-icon name="arrow" />
            </div>
          </div>
        </template>
        <template v-else>
          <h4>暂无公告</h4>
        </template>
      </div>
    </van-cell-group>

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
import { ref } from 'vue';
import { useRouter } from 'vue-router';

interface Notice {
  id: number;
  title: string;
  date: string;
  content: string;
}

// 定义props
const props = defineProps<{
  notices: Notice[];
}>();

const router = useRouter();
const showDetail = ref(false);
const selectedNotice = ref<Notice | null>(null);

// 跳转到公告列表页面
const goToNoticeList = (): void => {
  router.push('/notices');
};

// 显示公告详情
const showNoticeDetail = (notice: Notice): void => {
  selectedNotice.value = notice;
  showDetail.value = true;
};
</script>

<style scoped>
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

.more-link {
  color: #1989fa;
  font-size: var(--font-size-md);
  font-weight: 700;
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

.notice-date {
  margin: 0 0 16px 0;
  font-size: var(--font-size-sm);
  color: #969799;
}

.notice-text {
  font-size: var(--font-size-base, 14px);
  line-height: 1.5;
  color: #323233;
  font-family: 'Noto Sans SC', sans-serif;
}

.svg-icon {
  width: 1em;
  height: 1em;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
}

.notice-icon {
  font-size: var(--font-size-lg);
  margin-right: 4px;
  color: #1989fa;
  vertical-align: middle;
  display: flex;
  align-items: center;
  height: 24px;
}

.notice-content p {
  font-size: var(--font-size-sm);
  line-height: 1.5;
  color: #323233;
  /* 全局样式已定义font-family */
}
</style> 