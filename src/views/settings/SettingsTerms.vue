<template>
  <div class="agreement-container">
    <div class="back-button" @click="goBack">
      <van-icon name="arrow-left" size="18" />
      <span class="page-title">用户协议</span>
    </div>

    <div class="agreement-content">
      <h2>SmartClass 用户协议</h2>

      <h3>1. 协议的接受</h3>
      <p>
        欢迎使用 SmartClass！在使用我们的服务之前，请仔细阅读本用户协议。通过访问或使用我们的服务，您表示同意接受并遵守本协议的所有条款和条件。
      </p>

      <h3>2. 服务的使用</h3>
      <p>
        我们的服务仅供合法用途使用。您不得利用我们的服务进行任何非法、欺诈或其他违反法律法规的行为。我们有权随时终止或暂停您对服务的访问，而无需事先通知。
      </p>

      <h3>3. 用户信息</h3>
      <p>
        在注册和使用我们的服务时，您需要提供真实、准确、完整的信息。您有责任维护您的账户安全，并对您的账户下的所有活动负责。
      </p>

      <h3>4. 知识产权</h3>
      <p>
        SmartClass 及其关联公司拥有本服务中所有内容的知识产权，包括但不限于文字、图片、音频、视频等。未经我们书面许可，您不得复制、分发、修改或以其他方式使用这些内容。
      </p>

      <h3>5. 隐私政策</h3>
      <p>
        我们尊重用户的隐私，并承诺按照我们的隐私政策处理您的个人信息。请仔细阅读我们的隐私政策，了解我们如何收集、使用和保护您的个人信息。
      </p>

      <h3>6. 免责声明</h3>
      <p>
        我们尽力提供准确、可靠的服务，但不保证服务的绝对无误。对于因使用我们的服务而引起的任何直接或间接损失，我们不承担任何责任。
      </p>

      <h3>7. 协议的修改</h3>
      <p>
        我们保留随时修改本协议的权利。修改后的协议将在发布后立即生效。如果您不同意修改后的协议，请停止使用我们的服务。
      </p>

      <h3>8. 联系我们</h3>
      <div>
        <p>如果您对本协议有任何疑问或建议，请联系我们：</p>
        <ul>
          <li><strong>邮箱:</strong> support@smartclass.com</li>
          <li><strong>电话:</strong> +86-123-456-7890</li>
          <li><strong>地址:</strong> 北京市朝阳区XX路XX号</li>
        </ul>
      </div>
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
.agreement-container {
  padding: 16px;
}

.agreement-content {
  margin-top: 20px;
}

/* 设置所有文本颜色为黑色 */
.agreement-content * {
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
  list-style-type: none;
  padding: 0;
}

ul li {
  margin-bottom: 8px;
}

.back-button {
  display: flex;
  align-items: center;
  padding: 10px;
}

.page-title {
  font-size: 18px;
  margin-left: 10px;
}
</style>