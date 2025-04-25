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
          <div
            class="notice-item-wrapper"
            v-for="notice in notices"
            :key="notice.id"
          >
            <div class="notice-card" @click="showNoticeDetail(notice)">
              <!-- 公告内容区域 -->
              <div class="notice-content-area">
                <h3 class="notice-title">{{ notice.title }}</h3>
                <p class="notice-brief">{{ notice.content }}</p>
                <div class="notice-footer">
                  <span class="notice-date">{{ notice.date }}</span>
                  <div class="notice-stats">
                    <div class="view-count-wrapper">
                      <van-icon name="eye-o" class="eye-icon" />
                      <span class="count-number">{{
                        notice.viewCount || 0
                      }}</span>
                    </div>
                    <div
                      class="read-status-wrapper"
                      :class="{ read: notice.hasRead }"
                    >
                      <span class="read-status">{{
                        notice.hasRead ? '已读' : ''
                      }}</span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- 公告封面图 -->
              <div class="notice-cover" v-if="notice.coverImage">
                <img :src="notice.coverImage" alt="公告封面" />
              </div>

              <!-- 箭头指示器 -->
              <div class="arrow-indicator">
                <van-icon name="arrow" />
              </div>
            </div>
          </div>
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
        <div class="notice-popup-content" v-if="selectedNotice">
          <!-- 封面图片（如果有） -->
          <div class="notice-detail-cover" v-if="selectedNotice.coverImage">
            <img :src="selectedNotice.coverImage" alt="公告封面" />
          </div>

          <h3>{{ selectedNotice.title }}</h3>
          <div class="notice-detail-info">
            <span class="notice-date">{{ selectedNotice.date }}</span>
            <div class="view-count-wrapper detail">
              <van-icon name="eye-o" class="eye-icon" />
              <span class="count-number"
                >{{ selectedNotice.viewCount || 0 }} 人已读</span
              >
            </div>
          </div>
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
import { Notice } from '../api/mock';
import { AnnouncementControllerService } from '../services/services/AnnouncementControllerService.ts';
import { AnnouncementVO } from '../services/models/AnnouncementVO.ts';
import { AnnouncementQueryRequest } from '../services/models/AnnouncementQueryRequest.ts';
import { showToast } from 'vant';

// 扩展Notice接口，添加viewCount和hasRead字段
interface ExtendedNotice extends Notice {
  viewCount?: number;
  hasRead?: boolean;
  coverImage?: string;
}

const router = useRouter();
const notices = ref<ExtendedNotice[]>([]);
const loading = ref(false);
const finished = ref(false);
const refreshing = ref(false);
const showDetail = ref(false);
const selectedNotice = ref<ExtendedNotice | null>(null);
const currentPage = ref(1);
const pageSize = 10;

// 将后端公告数据转换为前端需要的格式
const convertAnnouncementToNotice = (
  announcement: AnnouncementVO,
): ExtendedNotice => {
  return {
    id: announcement.id || 0,
    title: announcement.title || '未命名公告',
    content: announcement.content || '',
    date: announcement.createTime
      ? new Date(announcement.createTime).toLocaleDateString()
      : '',
    viewCount: announcement.viewCount,
    hasRead: announcement.hasRead,
    coverImage: announcement.coverImage,
  };
};

// 标记公告为已读
const markNoticeAsRead = async (id: number) => {
  try {
    await AnnouncementControllerService.readAnnouncementUsingPost(id);
    // 更新本地已读状态
    const notice = notices.value.find((item) => item.id === id);
    if (notice) {
      notice.hasRead = true;
      // 增加已读计数
      if (notice.viewCount !== undefined) {
        notice.viewCount++;
      }
    }
  } catch (error) {
    console.error('标记公告已读失败', error);
  }
};

// 获取公告数据
const onLoad = async () => {
  // 如果是刷新，则重置页码
  if (refreshing.value) {
    notices.value = [];
    currentPage.value = 1;
    refreshing.value = false;
  }

  try {
    // 创建请求参数
    const queryRequest: AnnouncementQueryRequest = {
      current: currentPage.value,
      pageSize: pageSize,
      sortField: 'createTime',
      sortOrder: 'desc', // 按创建时间倒序排列
    };

    // 请求数据
    const response =
      await AnnouncementControllerService.listAnnouncementVoByPageUsingPost(
        queryRequest,
      );

    if (response.code === 0 && response.data) {
      const newNotices =
        response.data.records?.map(convertAnnouncementToNotice) || [];
      notices.value = [...notices.value, ...newNotices];

      // 检查每个公告的已读状态
      await checkReadStatus(newNotices);

      // 判断是否还有更多数据
      if (
        response.data.current >= response.data.pages ||
        newNotices.length === 0
      ) {
        finished.value = true;
      } else {
        currentPage.value++;
      }
    } else {
      showToast('获取公告失败');
      finished.value = true;
    }
  } catch (error) {
    console.error('加载公告失败', error);
    showToast('获取公告失败');
    finished.value = true;
  } finally {
    loading.value = false;
  }
};

// 检查公告的已读状态
const checkReadStatus = async (announcementList: ExtendedNotice[]) => {
  try {
    for (const notice of announcementList) {
      if (notice.id) {
        try {
          const response =
            await AnnouncementControllerService.hasReadAnnouncementUsingGet(
              notice.id,
            );

          // 仅当响应成功且数据为布尔值时更新状态
          if (
            response &&
            typeof response.data === 'boolean' &&
            response.code === 0
          ) {
            const index = notices.value.findIndex(
              (item) => item.id === notice.id,
            );
            if (index !== -1) {
              notices.value[index].hasRead = response.data;
            }
          }
        } catch (error) {
          console.error(`检查公告 ${notice.id} 已读状态失败`, error);
        }
      }
    }
  } catch (error) {
    console.error('获取公告已读状态失败', error);
  }
};

// 下拉刷新
const onRefresh = () => {
  finished.value = false;
  loading.value = true;
  onLoad();
};

// 显示公告详情
const showNoticeDetail = async (notice: ExtendedNotice): Promise<void> => {
  selectedNotice.value = notice;
  showDetail.value = true;

  // 标记公告为已读
  if (notice.id && !notice.hasRead) {
    await markNoticeAsRead(notice.id);

    // 更新当前所有公告的已读状态
    await checkReadStatus(notices.value);
  }
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
  padding: 12px 16px 32px;
}

.notice-item-wrapper {
  margin-bottom: 12px;
  background: #fff;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
}

.notice-card {
  position: relative;
  padding: 14px 16px;
  display: flex;
  gap: 12px;
}

.notice-content-area {
  flex: 1;
  overflow: hidden;
  padding-right: 20px; /* 为箭头留出空间 */
}

.arrow-indicator {
  position: absolute;
  right: 16px;
  top: 50%;
  transform: translateY(-50%);
  color: #c8c9cc;
}

.notice-cover {
  width: 64px;
  height: 64px;
  flex-shrink: 0;
  overflow: hidden;
  border-radius: 4px;
}

.notice-cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.notice-title {
  margin: 0 0 6px 0;
  font-size: 15px;
  color: #323233;
  font-weight: 600;
  line-height: 1.4;
}

.notice-brief {
  margin: 0 0 10px 0;
  font-size: 13px;
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
  font-size: 12px;
  color: #969799;
}

.notice-stats {
  display: flex;
  align-items: center;
  gap: 10px;
}

/* 眼睛图标样式 */
.view-count-wrapper {
  display: flex;
  align-items: center;
  gap: 3px;
  color: #909399;
  height: 16px;
  line-height: 1;
}

.eye-icon {
  font-size: 14px;
  color: #c0c4cc;
  display: flex;
  align-items: center;
  justify-content: center;
}

.count-number {
  font-size: 12px;
  line-height: 16px;
}

/* 已读状态样式 */
.read-status-wrapper {
  display: flex;
  align-items: center;
  height: 16px;
  line-height: 1;
}

.read-status-wrapper.read {
  background-color: #e8f5e9;
  border-radius: 10px;
  padding: 0 8px;
  height: 16px;
  line-height: 16px;
}

.read-status {
  color: #07c160;
  font-size: 12px;
  font-weight: 500;
  line-height: 16px;
}

.notice-date {
  font-size: 12px;
  color: #969799;
  line-height: 16px;
  display: flex;
  align-items: center;
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
  font-weight: 600;
}

.notice-popup-content {
  padding: 16px 4px;
}

.notice-detail-cover {
  width: 100%;
  height: 140px;
  margin-bottom: 16px;
  border-radius: 6px;
  overflow: hidden;
  background-color: #f2f3f5;
}

.notice-detail-cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.notice-popup-content h3 {
  margin: 0 0 8px 0;
  font-size: 18px;
  color: #323233;
  font-weight: 600;
}

.notice-detail-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  font-size: 12px;
  color: #969799;
  line-height: 16px;
}

/* 详情页中的已读数样式 */
.view-count-wrapper.detail {
  color: #909399;
}

.notice-text {
  font-size: 14px;
  line-height: 1.6;
  color: #323233;
  font-family: 'Noto Sans SC', sans-serif;
  word-break: break-word;
}

/* 覆盖Vant样式 */
:deep(.van-list__finished-text) {
  color: #969799;
  font-size: 12px;
  padding: 16px 0;
}

:deep(.van-list__loading) {
  padding: 16px 0;
}
</style>
