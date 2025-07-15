<template>
  <div class="about-container">
    <back-button title="关于我们" />

    <div class="about-content">
      <div class="content-section logo-section">
        <div class="app-logo">
          <img src="/logo.svg" alt="智云星课" />
          <h1>智云星课</h1>
          <p class="version">版本 1.0.0</p>
        </div>
      </div>

      <div class="content-section">
        <h2 class="section-title">关于智云星课</h2>
        <div class="section-content">
          <p>
            智云星课是一款集智能陪练、个性化学习和知识管理于一体的在线教育平台。我们利用人工智能技术，为用户提供高效、便捷、个性化的学习体验，助力每一位学习者实现自我提升。
          </p>
        </div>
      </div>

      <div class="content-section">
        <h2 class="section-title">我们的理念</h2>
        <div class="section-content">
          <p>
            我们坚信，教育应该是开放、公平且富有创造力的。智云星课致力于打破传统教育的时空限制，让每个人都能根据自己的节奏和方式获取知识，培养能力。通过智能技术赋能教育，我们希望让学习变得更加高效、有趣且富有成就感。
          </p>
        </div>
      </div>

      <div class="content-section">
        <h2 class="section-title">产品特色</h2>
        <div class="section-content feature-list">
          <div class="feature-item">
            <van-icon name="chat" size="24" color="#1989fa" />
            <span>智能对话辅导</span>
          </div>
          <div class="feature-item">
            <van-icon name="bar-chart-o" size="24" color="#1989fa" />
            <span>学习数据分析</span>
          </div>
          <div class="feature-item">
            <van-icon name="bookmark" size="24" color="#1989fa" />
            <span>智能生词管理</span>
          </div>
          <div class="feature-item">
            <van-icon name="video" size="24" color="#1989fa" />
            <span>精品课程资源</span>
          </div>
        </div>
      </div>

      <div class="content-section">
        <h2 class="section-title">联系我们</h2>
        <div class="section-content">
          <ul>
            <li><van-icon name="envelop-o" /><strong>客服邮箱:</strong> <a href="mailto:support@ubanillx.cn">support@ubanillx.cn</a></li>
            <li><van-icon name="service-o" /><strong>服务时间:</strong> 周一至周五 9:00-18:00</li>
            <li><van-icon name="location-o" /><strong>公司地址:</strong> 北京市海淀区中关村科技园</li>
          </ul>
        </div>
      </div>

      <div class="content-section">
        <div class="copyright">
          <p>© {{ currentYear }} 智云星课 版权所有</p>
          <p>感谢您的支持与信任</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { BackButton } from '../../../components/Common';
import { Icon as VanIcon } from 'vant';
import { ref } from 'vue';

// 获取当前年份
const currentYear = ref(new Date().getFullYear());
</script>

<style scoped>
.about-container {
  min-height: 100vh;
  background: #f7f8fa;
  padding-bottom: 20px;
}

.about-content {
  margin: 12px 16px;
  background: #fff;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.content-section {
  padding: 16px;
  border-bottom: 1px solid #f5f5f5;
}

.content-section:last-child {
  border-bottom: none;
}

.section-title {
  font-size: 16px;
  font-weight: bold;
  color: #323233;
  margin: 0 0 12px 0;
}

.section-content {
  font-size: 14px;
  color: #333;
  line-height: 1.6;
}

.logo-section {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 24px 16px;
}

.app-logo {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.app-logo img {
  width: 72px;
  height: 72px;
  border-radius: 16px;
  margin-bottom: 12px;
}

.app-logo h1 {
  font-size: 18px;
  font-weight: 600;
  color: #323233;
  margin: 0 0 4px 0;
}

.version {
  font-size: 13px;
  color: #969799;
  margin: 0;
}

.feature-list {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

ul {
  list-style-type: none;
  padding: 0;
  margin: 0;
}

ul li {
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  gap: 8px;
}

ul li:last-child {
  margin-bottom: 0;
}

p {
  margin: 0 0 8px 0;
}

p:last-child {
  margin-bottom: 0;
}

a {
  color: #1989fa;
  text-decoration: none;
}

.copyright {
  text-align: center;
  color: #969799;
  font-size: 13px;
}
</style>
