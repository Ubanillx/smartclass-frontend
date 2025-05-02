<template>
  <div class="profile-section content-section">
    <div class="section-title">我的内容</div>
    <div class="profile-tabs-container">
      <div class="profile-tabs">
        <div
          v-for="(tab, index) in tabs"
          :key="index"
          :class="['profile-tab', { active: activeTabIndex === index }]"
          @click="switchTab(index)"
        >
          {{ tab.name }}
          <div class="tab-indicator" v-if="activeTabIndex === index"></div>
        </div>
      </div>
    </div>

    <!-- 导航内容展示区域 -->
    <div class="tab-content-area">
      <div v-if="activeTabIndex === 0" class="tab-content-placeholder">
        <van-empty description="暂无帖子内容" />
      </div>
      <div v-else-if="activeTabIndex === 1" class="tab-content-placeholder">
        <van-empty description="暂无评论内容" />
      </div>
      <div v-else-if="activeTabIndex === 2" class="tab-content-placeholder">
        <van-empty description="暂无笔记内容" />
      </div>
      <div v-else-if="activeTabIndex === 3" class="tab-content-placeholder">
        <van-empty description="暂无问答内容" />
      </div>
      <div v-else-if="activeTabIndex === 4" class="tab-content-placeholder">
        <van-empty description="暂无专栏内容" />
      </div>
      <div v-else-if="activeTabIndex === 5" class="tab-content-placeholder">
        <van-empty description="暂无资料内容" />
      </div>
      <div v-else-if="activeTabIndex === 6" class="tab-content-placeholder">
        <van-empty description="暂无收藏内容" />
      </div>
      <div v-else-if="activeTabIndex === 7" class="tab-content-placeholder">
        <van-empty description="暂无关注内容" />
      </div>
      <div v-else-if="activeTabIndex === 8" class="tab-content-placeholder">
        <van-empty description="暂无粉丝内容" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { showToast } from 'vant';

// 导航栏选项
const tabs = [
  { name: '帖子', type: 'posts' },
  { name: '评论', type: 'comments' },
  { name: '笔记', type: 'notes' },
  { name: '问答', type: 'qa' },
  { name: '专栏', type: 'columns' },
  { name: '资料', type: 'resources' },
  { name: '收藏', type: 'favorites' },
  { name: '关注', type: 'following' },
  { name: '粉丝', type: 'followers' },
];
const activeTabIndex = ref(0);

// 切换标签页
const switchTab = (index: number) => {
  activeTabIndex.value = index;
  // 这里可以加载对应标签的数据
  if (tabs && tabs[index]) {
    showToast(`${tabs[index].name}功能开发中`);
  }
};
</script>

<style scoped>
/* 内容区域样式 */
.profile-section {
  margin: 16px 0;
  background-color: #ffffff;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(100, 101, 102, 0.08);
  overflow: hidden;
}

.section-title {
  font-size: var(--font-size-lg);
  font-weight: bold;
  color: #323233;
  padding: 16px;
  border-bottom: 1px solid #f5f5f5;
}

/* 导航栏样式 */
.profile-tabs-container {
  background-color: #ffffff;
  width: 100%;
  border-bottom: 1px solid #ebedf0;
}

.profile-tabs {
  display: flex;
  overflow-x: auto;
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE and Edge */
  white-space: nowrap;
}

/* 隐藏滚动条 */
.profile-tabs::-webkit-scrollbar {
  display: none;
}

.profile-tab {
  position: relative;
  padding: 14px 20px;
  font-size: var(--font-size-md);
  font-weight: 500;
  color: #646566;
  cursor: pointer;
  transition: all 0.2s ease;
}

.profile-tab.active {
  color: #1989fa;
  font-weight: 700;
}

.tab-indicator {
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 20px;
  height: 3px;
  background-color: #1989fa;
  border-radius: 3px 3px 0 0;
}

/* 导航内容区域 */
.tab-content-area {
  min-height: 40vh;
  padding: 16px;
}

.tab-content-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  min-height: 300px;
}
</style>
