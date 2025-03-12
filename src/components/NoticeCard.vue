<template>
  <div>
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

<script setup>
import { ref } from 'vue';

// 定义props
const props = defineProps({
  notices: {
    type: Array,
    required: true
  }
});

const showPopup = ref(false);
const showDetail = ref(false);
const selectedNotice = ref(null);

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
</style> 