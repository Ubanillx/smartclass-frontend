<template>
  <div class="intelligence-center-content">
    <!-- 智慧体中心内容 -->
    <van-empty description="智慧体中心功能即将上线">
      <template #image>
        <van-icon name="smile-o" size="80" color="#1989fa" />
      </template>
      <p class="coming-soon-text">敬请期待！</p>
    </van-empty>
  </div>
</template>

<script setup lang="ts">
// 暂无需要处理的逻辑
</script>

<style scoped>
.intelligence-center-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-top: 80px;
}

.coming-soon-text {
  font-size: var(--font-size-md, 16px);
  color: #969799;
  margin-top: 8px;
}
</style> 