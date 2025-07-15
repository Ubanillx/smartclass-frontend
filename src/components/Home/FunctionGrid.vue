<template>
  <div class="function-grid">
    <div class="grid-container">
      <!-- 第一行 -->
      <div class="grid-item" @click="goToPage('/chat?tab=intelligence')">
        <div class="icon-wrapper">
          <van-icon name="chat-o" size="24" />
        </div>
        <span class="item-text">AI对话</span>
      </div>
      
      <div class="grid-item" @click="goToPage('/courses')">
        <div class="icon-wrapper">
          <van-icon name="play-circle-o" size="24" />
        </div>
        <span class="item-text">课程学习</span>
      </div>
      
      <div class="grid-item" @click="goToPage('/circle')">
        <div class="icon-wrapper">
          <van-icon name="friends-o" size="24" />
        </div>
        <span class="item-text">社交圈子</span>
      </div>
      
      <div class="grid-item" @click="goToPage('/profile')">
        <div class="icon-wrapper">
          <van-icon name="user-o" size="24" />
        </div>
        <span class="item-text">个人中心</span>
      </div>
      
      <!-- 第二行 -->
      <div class="grid-item" @click="goToPage('/vocabulary/collected')">
        <div class="icon-wrapper">
          <van-icon name="bookmark-o" size="24" />
        </div>
        <span class="item-text">单词记忆</span>
      </div>
      
      <div class="grid-item" @click="goToPage('/articles')">
        <div class="icon-wrapper">
          <van-icon name="notes-o" size="24" />
        </div>
        <span class="item-text">精美文章</span>
      </div>
      
      <div class="grid-item" @click="goToPage('/courses/schedule')">
        <div class="icon-wrapper">
          <van-icon name="calendar-o" size="24" />
        </div>
        <span class="item-text">课程表</span>
      </div>
      
      <div class="grid-item" @click="goToPage('/profile?tab=history')">
        <div class="icon-wrapper">
          <van-icon name="records" size="24" />
        </div>
        <span class="item-text">学习历史</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

// 页面跳转函数
const goToPage = (path: string) => {
  router.push(path)
}
</script>

<style scoped>
.function-grid {
  background: #fff;
  border-radius: 12px;
  padding: 16px;
  margin: 16px 0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.grid-container {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: repeat(2, 1fr);
  gap: 12px;
}

.grid-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 8px 6px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  min-height: 65px;
}

.grid-item:hover {
  background-color: #f5f7fa;
  transform: translateY(-2px);
}

.grid-item:active {
  transform: translateY(0);
  background-color: #ebedf0;
}

.icon-wrapper {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 8px;
  color: #fff;
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
}

.grid-item:nth-child(2) .icon-wrapper {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  box-shadow: 0 2px 8px rgba(240, 147, 251, 0.3);
}

.grid-item:nth-child(3) .icon-wrapper {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
  box-shadow: 0 2px 8px rgba(79, 172, 254, 0.3);
}

.grid-item:nth-child(4) .icon-wrapper {
  background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
  box-shadow: 0 2px 8px rgba(67, 233, 123, 0.3);
}

.grid-item:nth-child(5) .icon-wrapper {
  background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);
  box-shadow: 0 2px 8px rgba(250, 112, 154, 0.3);
}

.grid-item:nth-child(6) .icon-wrapper {
  background: linear-gradient(135deg, #a8edea 0%, #fed6e3 100%);
  box-shadow: 0 2px 8px rgba(168, 237, 234, 0.3);
}

.grid-item:nth-child(7) .icon-wrapper {
  background: linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%);
  box-shadow: 0 2px 8px rgba(255, 236, 210, 0.3);
}

.grid-item:nth-child(8) .icon-wrapper {
  background: linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%);
  box-shadow: 0 2px 8px rgba(161, 140, 209, 0.3);
}

.item-text {
  font-size: 12px;
  color: #323233;
  text-align: center;
  line-height: 1.2;
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 100%;
}

/* 响应式设计 */
@media (max-width: 375px) {
  .grid-container {
    gap: 8px;
  }
  
  .grid-item {
    min-height: 55px;
    padding: 6px 4px;
  }
  
  .icon-wrapper {
    width: 36px;
    height: 36px;
  }
  
  .item-text {
    font-size: 11px;
  }
}

@media (min-width: 414px) {
  .grid-container {
    gap: 16px;
  }
  
  .grid-item {
    min-height: 75px;
    padding: 12px 8px;
  }
  
  .icon-wrapper {
    width: 44px;
    height: 44px;
  }
  
  .item-text {
    font-size: 13px;
  }
}
</style> 