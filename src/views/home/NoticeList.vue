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
          :immediate-check="true"
          offset="300"
        >
          <template v-if="notices.length > 0">
            <div
              class="notice-item-wrapper"
              v-for="notice in notices"
              :key="notice.id"
            >
              <div class="notice-card" @click="showNoticeDetail(notice)">
                <!-- 公告封面图 -->
                <div class="notice-cover" v-if="notice.coverImage">
                  <van-image
                    :src="notice.coverImage"
                    alt="公告封面"
                    fit="cover"
                    error-icon="photo-fail"
                    lazy
                    loading="skeleton"
                    radius="8px"
                  />
                </div>
                
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

                <!-- 箭头指示器 -->
                <div class="arrow-indicator">
                  <van-icon name="arrow" />
                </div>
              </div>
            </div>
          </template>
          
          <!-- 骨架屏加载状态 -->
          <template v-else-if="loading && !refreshing">
            <div class="notice-item-wrapper skeleton" v-for="i in 3" :key="i">
              <div class="notice-card">
                <div class="notice-cover skeleton-block"></div>
                <div class="notice-content-area">
                  <div class="skeleton-title"></div>
                  <div class="skeleton-brief"></div>
                  <div class="skeleton-brief" style="width: 85%"></div>
                  <div class="notice-footer">
                    <div class="skeleton-date"></div>
                    <div class="skeleton-stats"></div>
                  </div>
                </div>
              </div>
            </div>
          </template>
          
          <!-- 空状态 -->
          <van-empty v-else-if="!loading && notices.length === 0" description="暂无公告" />
        </van-list>
      </van-pull-refresh>
    </div>

    <!-- 公告详情弹出层 -->
    <van-popup
      v-model:show="showDetail"
      round
      position="bottom"
      :style="{ height: '60%' }"
      :lazy-render="true"
      :lock-scroll="true"
    >
      <div class="notice-detail">
        <div class="notice-popup-header">
          <span class="title">公告详情</span>
          <van-icon name="cross" @click="showDetail = false" />
        </div>
        <div class="notice-popup-content" v-if="selectedNotice">
          <!-- 封面图片（如果有） -->
          <div class="notice-detail-cover" v-if="selectedNotice.coverImage">
            <van-image
              :src="selectedNotice.coverImage"
              alt="公告封面"
              fit="cover"
              error-icon="photo-fail"
              lazy
              loading="skeleton"
              radius="12px"
            />
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
import { ref, onMounted, watch } from 'vue';
import { BackButton } from '../../components/Common';
import { Notice } from '../../api/mock.ts';
import { AnnouncementControllerService } from '../../services/services/AnnouncementControllerService.ts';
import { AnnouncementVO } from '../../services/models/AnnouncementVO.ts';
import { showToast } from 'vant';

// 定义请求参数类型
interface AnnouncementQueryRequest {
  current: number;
  pageSize: number;
  sortField: string;
  sortOrder: string;
}

// 扩展Notice接口，添加viewCount和hasRead字段
interface ExtendedNotice extends Notice {
  viewCount?: number;
  hasRead?: boolean;
  coverImage?: string;
}

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
    } else {
      showToast('未找到对应公告信息');
    }
  } catch (error) {
    showToast('标记已读失败');
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
      await AnnouncementControllerService.listAnnouncementVoByPageUsingGet(
        undefined, // adminId
        undefined, // content
        undefined, // coverImage
        undefined, // createTime
        queryRequest.current, // current
        undefined, // endTime
        undefined, // id
        undefined, // isValid
        queryRequest.pageSize, // pageSize
        undefined, // priority
        queryRequest.sortField, // sortField
        queryRequest.sortOrder, // sortOrder
        undefined, // startTime
        undefined, // status
        undefined // title
      );

    if (response.code === 0 && response.data) {
      const newNotices =
        response.data.records?.map(convertAnnouncementToNotice) || [];
      
      // 将新公告添加到列表中
      notices.value = [...notices.value, ...newNotices];
      
      // 批量获取所有新公告的已读状态
      await fetchAllNoticesReadStatus(newNotices);

      // 判断是否还有更多数据
      const apiCurrentPage = response.data.current || 0;
      const totalPages = response.data.pages || 0;
      
      if (apiCurrentPage >= totalPages || newNotices.length === 0) {
        finished.value = true;
      } else {
        currentPage.value++;
      }
    } else {
      showToast('获取公告失败');
      finished.value = true;
    }
  } catch (error) {
    showToast('获取公告失败');
    finished.value = true;
  } finally {
    loading.value = false;
  }
};

// 批量获取所有公告的已读状态
const fetchAllNoticesReadStatus = async (noticesList: ExtendedNotice[]) => {
  
  // 使用Promise.all并行请求所有公告的已读状态
  const readStatusPromises = noticesList.map(async (notice) => {
    if (!notice.id) return;
    
    try {
      const hasReadResponse = await AnnouncementControllerService.hasReadAnnouncementUsingGet(notice.id);
      
      if (hasReadResponse.code === 0) {
        const isRead = hasReadResponse.data === true;
        
        // 更新本地公告的已读状态
        const localNotice = notices.value.find(item => item.id === notice.id);
        if (localNotice) {
          localNotice.hasRead = isRead;
        }
      }
    } catch (error) {
      showToast(`获取公告${notice.id}的已读状态失败`);
    }
  });
  
  // 等待所有请求完成
  await Promise.all(readStatusPromises);
};

// 下拉刷新
const onRefresh = () => {
  finished.value = false;
  loading.value = true;
  onLoad();
};

// 显示公告详情
const showNoticeDetail = (notice: ExtendedNotice): void => {
  selectedNotice.value = notice;
  showDetail.value = true;
};

// 监听弹出层显示状态 - 只负责标记已读
watch(showDetail, async (newVal) => {
  if (newVal && selectedNotice.value && selectedNotice.value.id) {
    // 如果公告未读，则调用标记已读接口
    if (!selectedNotice.value.hasRead) {
      await markNoticeAsRead(selectedNotice.value.id);
    } else {
      // 已读状态不需要处理
    }
  }
}, { immediate: false });

// 组件挂载时加载数据
onMounted(() => {
  loading.value = true;
  onLoad();
});
</script>

<style scoped>
.notice-list-page {
  min-height: 100vh;
  background-color: var(--background-primary, #f7f8fa);
  display: flex;
  flex-direction: column;
}

.notice-container {
  padding: 12px 16px 32px;
  flex: 1;
}

.notice-item-wrapper {
  margin-bottom: 16px;
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
}

.notice-item-wrapper:active {
  transform: scale(0.98);
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.03);
}

.notice-card {
  position: relative;
  padding: 16px;
  display: flex;
  flex-direction: column;
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
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
}

.notice-cover {
  width: 100%;
  height: 160px;
  flex-shrink: 0;
  overflow: hidden;
  border-radius: 8px;
  margin-bottom: 12px;
  background-color: #f5f5f5;
}

.notice-cover :deep(.van-image) {
  width: 100%;
  height: 100%;
  border-radius: 8px;
}

.notice-title {
  margin: 0 0 8px 0;
  font-size: 16px;
  color: var(--text-color-primary, #323233);
  font-weight: 600;
  line-height: 1.4;
}

.notice-brief {
  margin: 0 0 12px 0;
  font-size: 14px;
  color: var(--text-color-regular, #646566);
  line-height: 1.6;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  line-clamp: 2;
}

.notice-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12px;
  color: var(--text-color-secondary, #969799);
  border-top: 1px dashed #f2f3f5;
  padding-top: 12px;
}

.notice-stats {
  display: flex;
  align-items: center;
  gap: 12px;
}

/* 眼睛图标样式 */
.view-count-wrapper {
  display: flex;
  align-items: center;
  gap: 4px;
  color: #909399;
  height: 18px;
  line-height: 1;
}

.eye-icon {
  font-size: 15px;
  color: #c0c4cc;
  display: flex;
  align-items: center;
  justify-content: center;
}

.count-number {
  font-size: 12px;
  line-height: 18px;
}

/* 已读状态样式 */
.read-status-wrapper {
  display: flex;
  align-items: center;
  height: 18px;
  line-height: 1;
}

.read-status-wrapper.read {
  background-color: #e8f5e9;
  border-radius: 10px;
  padding: 0 8px;
  height: 18px;
  line-height: 18px;
}

.read-status {
  color: var(--success-color, #07c160);
  font-size: 12px;
  font-weight: 500;
  line-height: 18px;
}

.notice-date {
  font-size: 12px;
  color: #969799;
  line-height: 16px;
  display: flex;
  align-items: center;
}

/* 详情弹窗样式 */
.notice-detail {
  padding: 20px;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.notice-popup-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 0 16px 0;
  border-bottom: 1px solid #ebedf0;
  margin-bottom: 16px;
}

.notice-popup-header .title {
  font-size: 18px;
  font-weight: 600;
  color: var(--text-color-primary, #323233);
}

.notice-popup-header :deep(.van-icon) {
  font-size: 20px;
  color: #c8c9cc;
  cursor: pointer;
}

.notice-popup-content {
  padding: 0;
  flex: 1;
  overflow-y: auto;
}

.notice-detail-cover {
  width: 100%;
  height: 180px;
  margin-bottom: 20px;
  border-radius: 12px;
  overflow: hidden;
  background-color: #f2f3f5;
}

.notice-detail-cover :deep(.van-image) {
  width: 100%;
  height: 100%;
  border-radius: 12px;
}

.notice-popup-content h3 {
  margin: 0 0 12px 0;
  font-size: 20px;
  color: var(--text-color-primary, #323233);
  font-weight: 600;
  line-height: 1.4;
}

.notice-detail-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  font-size: 13px;
  color: var(--text-color-secondary, #969799);
  padding-bottom: 16px;
  border-bottom: 1px solid #f5f5f5;
}

/* 详情页中的已读数样式 */
.view-count-wrapper.detail {
  color: #909399;
}

.notice-text {
  font-size: 15px;
  line-height: 1.8;
  color: var(--text-color-primary, #323233);
  font-family: 'Noto Sans SC', sans-serif;
  word-break: break-word;
  white-space: pre-line;
}

/* 覆盖Vant样式 */
:deep(.van-list__finished-text) {
  color: #969799;
  font-size: 12px;
  padding: 20px 0;
}

:deep(.van-list__loading) {
  padding: 20px 0;
}

:deep(.van-pull-refresh__track) {
  min-height: calc(100vh - 46px);
}

:deep(.van-popup) {
  border-radius: 16px 16px 0 0;
}

/* 添加页面级过渡动画 */
:deep(.van-popup-slide-bottom-enter-active),
:deep(.van-popup-slide-bottom-leave-active) {
  transition-timing-function: cubic-bezier(0.23, 1, 0.32, 1);
}

/* 添加媒体查询，适配不同屏幕尺寸 */
@media (min-width: 768px) {
  .notice-container {
    max-width: 600px;
    margin: 0 auto;
  }
  
  .notice-cover {
    height: 200px;
  }
  
  .notice-detail-cover {
    height: 240px;
  }
}

/* 骨架屏样式 */
.skeleton-block {
  background: #f2f3f5;
  height: 160px;
  width: 100%;
  border-radius: 8px;
  margin-bottom: 12px;
  position: relative;
  overflow: hidden;
}

.skeleton-title {
  background: #f2f3f5;
  height: 20px;
  width: 60%;
  margin-bottom: 12px;
  border-radius: 4px;
  position: relative;
  overflow: hidden;
}

.skeleton-brief {
  background: #f2f3f5;
  height: 16px;
  width: 100%;
  margin-bottom: 8px;
  border-radius: 4px;
  position: relative;
  overflow: hidden;
}

.skeleton-date {
  background: #f2f3f5;
  height: 12px;
  width: 80px;
  border-radius: 4px;
  position: relative;
  overflow: hidden;
}

.skeleton-stats {
  background: #f2f3f5;
  height: 12px;
  width: 60px;
  border-radius: 4px;
  position: relative;
  overflow: hidden;
}

/* 骨架屏动画 */
.skeleton-block::after,
.skeleton-title::after,
.skeleton-brief::after,
.skeleton-date::after,
.skeleton-stats::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0) 0%,
    rgba(255, 255, 255, 0.3) 50%,
    rgba(255, 255, 255, 0) 100%
  );
  animation: skeleton-loading 1.5s infinite;
}

@keyframes skeleton-loading {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}
</style>
