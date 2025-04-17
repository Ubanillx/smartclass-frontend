<template>
  <div>
    <!-- 公告卡片 -->
    <van-cell-group class="notice-card">
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
          <!-- 默认只显示第一条公告 -->
          <div 
            class="notice-item"
            @click="notices[0] && showNoticeDetail(notices[0])"
          >
            <h4>{{ notices[0]?.title }}</h4>
            <p class="notice-brief">{{ notices[0]?.content }}</p>
            <div class="notice-footer">
              <span class="notice-date">{{ notices[0]?.date }}</span>
              <van-icon name="arrow" />
            </div>
          </div>
          
          <!-- 展开更多按钮 -->
          <div v-if="notices.length > 1 && !expanded" class="expand-button" @click="expanded = true">
            <div class="expand-button-content">
              <van-icon name="arrow-down" />
              <span>展开更多公告</span>
            </div>
          </div>
          
          <!-- 展开后显示的额外公告 -->
          <template v-if="expanded">
            <div 
              v-for="notice in notices.slice(1, 3)" 
              :key="notice.id" 
              class="notice-item"
              @click="showNoticeDetail(notice)"
            >
              <h4>{{ notice.title }}</h4>
              <p class="notice-brief">{{ notice.content }}</p>
              <div class="notice-footer">
                <span class="notice-date">{{ notice.date }}</span>
                <van-icon name="arrow" />
              </div>
            </div>
            
            <!-- 收起按钮 -->
            <div v-if="notices.length > 1" class="expand-button collapse" @click="expanded = false">
              <div class="expand-button-content">
                <van-icon name="arrow-up" />
                <span>收起</span>
              </div>
            </div>
          </template>
        </template>
        <template v-else>
          <div class="empty-notice">
            <h4>暂无公告</h4>
            <p class="notice-brief">当前没有任何公告信息</p>
          </div>
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
import { Notice } from '../../api/mock';

// 定义props
const props = defineProps<{
  notices: Notice[];
}>();

const router = useRouter();
const showDetail = ref(false);
const selectedNotice = ref<Notice | null>(null);
const expanded = ref(false); // 控制是否展开显示更多公告

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
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(100, 101, 102, 0.08);
}

.notice-preview {
  padding: 12px 16px 16px;
}

.notice-item {
  cursor: pointer;
  padding: 10px 0;
}

.notice-item:not(:last-child) {
  border-bottom: 1px dashed #ebedf0;
  margin-bottom: 8px;
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
  -webkit-line-clamp: 2; /* 限制显示两行 */
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

:deep(.van-cell) {
  position: relative;
  padding: 12px 16px !important;
  transition: all 0.3s ease;
  border-radius: 0 !important;
  background-color: transparent !important;
  margin: 0 !important;
}

:deep(.van-cell:hover) {
  background-color: transparent !important;
}

:deep(.van-cell::after) {
  display: none !important;
}

.empty-notice {
  padding: 20px 0;
  text-align: center;
  color: #969799;
}

.empty-notice h4 {
  font-size: var(--font-size-md);
  margin-bottom: 8px;
  color: #323233;
}

.expand-button {
  padding: 0;
  margin-top: 4px;
  border-top: 0;
  cursor: pointer;
  text-align: center;
}

.expand-button-content {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #1989fa;
  font-size: var(--font-size-sm);
  line-height: 1;
  height: 20px;
  padding: 5px 0;
}

.expand-button.collapse .expand-button-content {
  color: #969799;
}

.expand-button-content span {
  margin-left: 4px;
  display: inline-block;
  line-height: 20px;
  vertical-align: middle;
}

.expand-button-content .van-icon {
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 20px;
}
</style>
