<template>
  <div class="about-container">
    <back-button title="关于我们" />

    <div class="about-content">
      <div class="content-section">
        <h2 class="section-title">欢迎使用 SmartClass</h2>
        <div class="section-content">
          <p>
            SmartClass
            是一款专为学生、教师和管理员设计的在线学习平台。我们致力于提供一个高效、便捷的学习环境，帮助用户更好地进行知识管理和交流。
          </p>
        </div>
      </div>

      <div class="content-section">
        <h2 class="section-title">我们的使命</h2>
        <div class="section-content">
          <p>
            我们的使命是通过技术创新，推动教育行业的数字化转型，让每个人都能享受到优质的教育资源。我们不断优化平台功能，提升用户体验，力求为用户提供最优质的服务。
          </p>
        </div>
      </div>

      <div class="content-section">
        <h2 class="section-title">联系我们</h2>
        <div class="section-content">
          <ul>
            <li><strong>邮箱:</strong> support@smartclass.com</li>
            <li><strong>电话:</strong> +86-123-456-7890</li>
            <li><strong>地址:</strong> 北京市朝阳区XX路XX号</li>
          </ul>
        </div>
      </div>

      <div class="content-section">
        <h2 class="section-title">团队成员</h2>
        <div class="section-content">
          <ul>
            <li><strong>项目经理:</strong> John Doe</li>
            <li><strong>前端开发:</strong> Jane Smith</li>
            <li><strong>后端开发:</strong> Bob Johnson</li>
            <li><strong>UI 设计:</strong> Emily Davis</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { BackButton } from '../../../components/Common';
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

ul {
  list-style-type: none;
  padding: 0;
  margin: 0;
}

ul li {
  margin-bottom: 8px;
}

p {
  margin: 0;
}
</style>
