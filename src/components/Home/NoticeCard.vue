<template>
  <div>
    <!-- 公告卡片 -->
    <van-cell-group inset class="notice-card">
      <van-cell title="最新公告" icon="volume-o">
        <template #right-icon>
          <span class="more-link" @click="showNoticePopup">更多</span>
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
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

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

const showPopup = ref(false);
const showDetail = ref(false);
const selectedNotice = ref<Notice | null>(null);

// 显示公告列表
const showNoticePopup = (): void => {
  showPopup.value = true;
};

// 显示公告详情
const showNoticeDetail = (notice: Notice): void => {
  selectedNotice.value = notice;
  showPopup.value = false;
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
  font-size: 16px;
  color: #323233;
  font-weight: 700;
  font-family: 'Noto Sans SC', sans-serif;
}

.notice-brief {
  margin: 0 0 12px 0;
  font-size: var(--font-size-base, 14px);
  color: #646566;
  line-height: 1.5;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  font-family: 'Noto Sans SC', sans-serif;
}

.notice-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: var(--font-size-sm, 12px);
  color: #969799;
}

.notice-date {
  font-size: var(--font-size-sm, 12px);
  color: #969799;
  font-family: 'Noto Sans SC', sans-serif;
}

.more-link {
  color: #1989fa;
  font-size: var(--font-size-base, 14px);
  font-weight: 700;
  font-family: 'Noto Sans SC', sans-serif;
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
  font-size: var(--font-size-md, 16px);
  font-weight: 700;
  font-family: 'Noto Sans SC', sans-serif;
}

.notice-content {
  padding: 16px 4px;
}

.notice-content h3 {
  margin: 0 0 8px 0;
  font-size: var(--font-size-lg, 18px);
  color: #323233;
  font-weight: 700;
  font-family: 'Noto Sans SC', sans-serif;
}

.notice-date {
  margin: 0 0 16px 0;
  font-size: var(--font-size-base, 14px);
  color: #969799;
  font-family: 'Noto Sans SC', sans-serif;
}

.notice-text {
  font-size: var(--font-size-base, 14px);
  line-height: 1.5;
  color: #323233;
  font-family: 'Noto Sans SC', sans-serif;
}

.notice-list {
  margin-top: 16px;
}

/* 强制覆盖组件标题样式 */
:deep(.van-cell__title) {
  font-weight: 700 !important;
  font-family: 'Noto Sans SC', sans-serif !important;
  font-size: var(--font-size-md, 16px) !important;
}

:deep(.van-cell__label) {
  font-size: var(--font-size-sm, 12px) !important;
  font-family: 'Noto Sans SC', sans-serif !important;
}
</style> 