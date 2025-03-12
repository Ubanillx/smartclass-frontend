<template>
  <div class="terms-container">
    <back-button title="用户协议" />

    <van-cell-group inset class="terms-content">
      <van-cell title="SmartClass 用户协议" :border="false" />

      <van-cell title="1. 协议的接受" :border="false">
        <template #label>
          <p>
            欢迎使用 SmartClass！在使用我们的服务之前，请仔细阅读本用户协议。通过访问或使用我们的服务，您表示同意接受并遵守本协议的所有条款和条件。
          </p>
        </template>
      </van-cell>

      <van-cell title="2. 服务的使用" :border="false">
        <template #label>
          <p>
            我们的服务仅供合法用途使用。您不得利用我们的服务进行任何非法、欺诈或其他违反法律法规的行为。我们有权随时终止或暂停您对服务的访问，而无需事先通知。
          </p>
        </template>
      </van-cell>

      <van-cell title="3. 用户信息" :border="false">
        <template #label>
          <p>
            在注册和使用我们的服务时，您需要提供真实、准确、完整的信息。您有责任维护您的账户安全，并对您的账户下的所有活动负责。
          </p>
        </template>
      </van-cell>

      <van-cell title="4. 知识产权" :border="false">
        <template #label>
          <p>
            SmartClass 及其关联公司拥有本服务中所有内容的知识产权，包括但不限于文字、图片、音频、视频等。未经我们书面许可，您不得复制、分发、修改或以其他方式使用这些内容。
          </p>
        </template>
      </van-cell>

      <van-cell title="5. 隐私政策" :border="false">
        <template #label>
          <p>
            我们尊重用户的隐私，并承诺按照我们的隐私政策处理您的个人信息。请仔细阅读我们的隐私政策，了解我们如何收集、使用和保护您的个人信息。
          </p>
        </template>
      </van-cell>

      <van-cell title="6. 免责声明" :border="false">
        <template #label>
          <p>
            我们尽力提供准确、可靠的服务，但不保证服务的绝对无误。对于因使用我们的服务而引起的任何直接或间接损失，我们不承担任何责任。
          </p>
        </template>
      </van-cell>

      <van-cell title="7. 协议的修改" :border="false">
        <template #label>
          <p>
            我们保留随时修改本协议的权利。修改后的协议将在发布后立即生效。如果您不同意修改后的协议，请停止使用我们的服务。
          </p>
        </template>
      </van-cell>

      <van-cell title="8. 联系我们" :border="false">
        <template #label>
          <p>如果您对本协议有任何疑问或建议，请联系我们：</p>
          <ul>
            <li><strong>邮箱:</strong> support@smartclass.com</li>
            <li><strong>电话:</strong> +86-123-456-7890</li>
            <li><strong>地址:</strong> 北京市朝阳区XX路XX号</li>
          </ul>
        </template>
      </van-cell>
    </van-cell-group>
  </div>
</template>

<script setup lang="ts">
import { BackButton } from '../../components/common';
</script>

<style scoped>
.terms-container {
  min-height: 100vh;
  background: #f7f8fa;
}

.terms-content {
  margin-top: 12px;
}

:deep(.van-cell__title) {
  font-weight: bold;
  font-size: 16px;
}

:deep(.van-cell__label) {
  color: #333;
  font-size: 14px;
  line-height: 1.6;
}

:deep(.van-cell__label p) {
  margin-bottom: 8px;
}

:deep(.van-cell__label ul) {
  list-style-type: none;
  padding: 0;
  margin: 0;
}

:deep(.van-cell__label li) {
  margin-bottom: 8px;
}
</style>