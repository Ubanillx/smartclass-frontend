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
          <!-- 只显示前三条公告 -->
          <div
            v-for="notice in displayNotices"
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

          <!-- 加载更多按钮 -->
          <div
            v-if="notices.length > displayLimit && !showAll"
            class="expand-button"
            @click="loadMore"
          >
            <div class="expand-button-content">
              <van-icon name="arrow-down" />
              <span>展开更多公告</span>
            </div>
          </div>
        </template>
        <template v-else>
          <div class="empty-notice">
            <van-empty description="暂无公告" />
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
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { showToast } from 'vant';
import { AnnouncementControllerService } from '../../services/services/AnnouncementControllerService.ts';
import { AnnouncementVO } from '../../services/models/AnnouncementVO.ts';

// 定义Notice类型
interface Notice {
  id: number;
  title: string;
  date: string;
  content: string;
}

// 定义props，可以接收外部传入的公告数据
const props = defineProps<{
  notices?: Notice[];
  showLoadMore?: boolean;
}>();

// 定义事件
const emit = defineEmits<{
  (e: 'loadMore'): void;
}>();

const router = useRouter();
const showDetail = ref(false);
const selectedNotice = ref<Notice | null>(null);
const localNotices = ref<Notice[]>([]); // 本地存储公告数据

// 默认显示条数
const displayLimit = ref(1);
// 是否显示全部
const showAll = ref(false);

// 计算最终使用的公告数据，优先使用props传入的数据，如果没有则使用本地数据
const notices = computed(() => {
  return props.notices || localNotices.value;
});

// 计算需要显示的公告列表
const displayNotices = computed(() => {
  if (showAll.value) {
    return notices.value.slice(0, 3); // 展开时最多显示3条
  } else {
    return notices.value.slice(0, displayLimit.value);
  }
});

// 加载更多
const loadMore = () => {
  showAll.value = true;
  emit('loadMore');
};

// 将后端公告数据转换为组件使用的格式
const convertAnnouncementToNotice = (announcement: AnnouncementVO): Notice => {
  return {
    id: announcement.id || 0,
    title: announcement.title || '未命名公告',
    content: announcement.content || '',
    date: announcement.createTime
      ? new Date(announcement.createTime).toLocaleDateString()
      : '',
  };
};

// 获取公告数据
const fetchNotices = async () => {
  try {
    // 调用list/page/vo接口，只传入必要的参数
    const response =
      await AnnouncementControllerService.listAnnouncementVoByPageUsingGet(
        undefined, // adminId
        undefined, // content
        undefined, // coverImage
        undefined, // createTime
        1, // current
        undefined, // endTime
        undefined, // id
        undefined, // isValid
        3, // pageSize - 默认只请求3条数据
        undefined, // priority
        'createTime', // sortField
        'desc', // sortOrder
        undefined, // startTime
        undefined, // status
        undefined // title
      );

    if (
      response.code === 0 &&
      response.data &&
      response.data.records &&
      response.data.records.length > 0
    ) {
      // 直接使用返回的记录转换为Notice格式
      localNotices.value = response.data.records.map(convertAnnouncementToNotice);
    } else {
      // 如果API请求失败，使用空数组
      localNotices.value = [];
    }
  } catch (error) {
    showToast('获取公告数据失败');
    localNotices.value = [];
  }
};

// 跳转到公告列表页面
const goToNoticeList = (): void => {
  router.push('/notices');
};

// 显示公告详情
const showNoticeDetail = (notice: Notice): void => {
  selectedNotice.value = notice;
  showDetail.value = true;

  // 如果需要，可以在这里调用标记公告为已读的API
  if (notice.id) {
    markNoticeAsRead(notice.id);
  }
};

// 标记公告为已读
const markNoticeAsRead = async (id: number) => {
  try {
    await AnnouncementControllerService.readAnnouncementUsingPost(id);
  } catch (error) {
    // 忽略错误
  }
};

// 组件挂载时，如果没有传入notices，则自动获取数据
onMounted(() => {
  if (!props.notices) {
    fetchNotices();
  }
});
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
  line-clamp: 2; /* 添加标准属性以提高兼容性 */
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
