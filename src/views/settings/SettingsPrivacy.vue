<template>
  <div class="privacy-container">
    <div class="back-button" @click="goBack">
      <van-icon name="arrow-left" size="18" />
      <span class="page-title">隐私政策</span>
    </div>

    <div class="privacy-content">
      <h2>SmartClass 隐私政策</h2>

      <h3>1. 收集的信息</h3>
      <div>
        <p>我们可能会收集以下类型的信息：</p>
        <ul>
          <li>个人信息：如姓名、电子邮件地址、电话号码等。</li>
          <li>使用信息：您如何使用我们的服务的详细信息。</li>
          <li>设备信息：您的设备类型、操作系统版本、IP 地址等。</li>
        </ul>
      </div>

      <h3>2. 信息的使用</h3>
      <div>
        <p>我们收集的信息将用于以下目的：</p>
        <ul>
          <li>提供和改进我们的服务。</li>
          <li>与您沟通，包括发送通知、提醒和其他重要信息。</li>
          <li>分析和研究，以改进我们的产品和服务。</li>
        </ul>
      </div>

      <h3>3. 信息的共享</h3>
      <div>
        <p>我们不会向第三方出售或出租您的个人信息。我们可能会在以下情况下共享您的信息：</p>
        <ul>
          <li>获得您的同意。</li>
          <li>遵守法律义务。</li>
          <li>保护我们的权利和利益。</li>
        </ul>
      </div>

      <h3>4. 数据安全</h3>
      <p>
        我们采取适当的技术和组织措施来保护您的个人信息免受未经授权的访问、使用、披露、修改或销毁。
      </p>

      <h3>5. 您的权利</h3>
      <p>
        您有权访问、更正、删除您的个人信息，以及撤回对处理您的个人信息的同意。如需行使这些权利，请联系我们：support@smartclass.com。
      </p>

      <h3>6. 隐私政策的更新</h3>
      <p>
        我们保留随时更新本隐私政策的权利。更新后的隐私政策将在发布后立即生效。如果您不同意更新后的隐私政策，请停止使用我们的服务。
      </p>

      <h3>7. 联系我们</h3>
      <p>
        如果您对本隐私政策有任何疑问或建议，请联系我们：support@smartclass.com。
      </p>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();

const goBack = () => {
  router.back();
};
</script>

<style scoped>
.privacy-container {
  padding: 16px;
}

.back-button {
  display: flex;
  align-items: center;
  padding: 10px 0;
  margin-bottom: 10px;
}

.page-title {
  font-size: 18px;
  margin-left: 10px;
  font-weight: 500;
}

.privacy-content {
  margin-top: 20px;
}

/* 设置所有文本颜色为黑色 */
.privacy-content * {
  color: #000;
}

h2, h3 {
  color: #333; /* 可以根据需要调整标题颜色 */
  margin-bottom: 10px;
}

p {
  line-height: 1.6;
  margin-bottom: 15px;
}

ul {
  list-style-type: disc;
  padding-left: 20px;
}

ul li {
  margin-bottom: 8px;
}
</style>