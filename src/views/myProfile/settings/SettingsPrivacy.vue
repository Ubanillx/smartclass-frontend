<template>
  <div class="privacy-container">
    <back-button title="隐私政策" />

    <div class="privacy-content">
      <div class="content-section">
        <h2 class="section-title">SmartClass 隐私政策</h2>
      </div>

      <div class="content-section">
        <h2 class="section-title">1. 收集的信息</h2>
        <div class="section-content">
          <p>我们可能会收集以下类型的信息：</p>
          <ul>
            <li>个人信息：如姓名、电子邮件地址、电话号码等。</li>
            <li>使用信息：您如何使用我们的服务的详细信息。</li>
            <li>设备信息：您的设备类型、操作系统版本、IP 地址等。</li>
          </ul>
        </div>
      </div>

      <div class="content-section">
        <h2 class="section-title">2. 信息的使用</h2>
        <div class="section-content">
          <p>我们收集的信息将用于以下目的：</p>
          <ul>
            <li>提供和改进我们的服务。</li>
            <li>与您沟通，包括发送通知、提醒和其他重要信息。</li>
            <li>分析和研究，以改进我们的产品和服务。</li>
          </ul>
        </div>
      </div>

      <div class="content-section">
        <h2 class="section-title">3. 信息的共享</h2>
        <div class="section-content">
          <p>
            我们不会向第三方出售或出租您的个人信息。我们可能会在以下情况下共享您的信息：
          </p>
          <ul>
            <li>获得您的同意。</li>
            <li>遵守法律义务。</li>
            <li>保护我们的权利和利益。</li>
          </ul>
        </div>
      </div>

      <div class="content-section">
        <h2 class="section-title">4. 数据安全</h2>
        <div class="section-content">
          <p>
            我们采取适当的技术和组织措施来保护您的个人信息免受未经授权的访问、使用、披露、修改或销毁。
          </p>
        </div>
      </div>

      <div class="content-section">
        <h2 class="section-title">5. 您的权利</h2>
        <div class="section-content">
          <p>
            您有权访问、更正、删除您的个人信息，以及撤回对处理您的个人信息的同意。如需行使这些权利，请联系我们：support@smartclass.com。
          </p>
        </div>
      </div>

      <div class="content-section">
        <h2 class="section-title">6. 隐私政策的更新</h2>
        <div class="section-content">
          <p>
            我们保留随时更新本隐私政策的权利。更新后的隐私政策将在发布后立即生效。如果您不同意更新后的隐私政策，请停止使用我们的服务。
          </p>
        </div>
      </div>

      <div class="content-section">
        <h2 class="section-title">7. 联系我们</h2>
        <div class="section-content">
          <p>
            如果您对本隐私政策有任何疑问或建议，请联系我们：support@smartclass.com。
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { BackButton } from '../../../components/Common';
</script>

<style scoped>
.privacy-container {
  min-height: 100vh;
  background: #f7f8fa;
  padding-bottom: 20px;
}

.privacy-content {
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

p {
  margin: 0 0 8px 0;
}

p:last-child {
  margin-bottom: 0;
}

ul {
  list-style-type: disc;
  padding-left: 20px;
  margin: 0 0 8px 0;
}

ul:last-child {
  margin-bottom: 0;
}

ul li {
  margin-bottom: 8px;
}

ul li:last-child {
  margin-bottom: 0;
}
</style>
