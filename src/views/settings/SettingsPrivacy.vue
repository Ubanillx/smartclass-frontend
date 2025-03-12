<template>
  <div class="privacy-container">
    <back-button title="隐私政策" />

    <van-cell-group inset class="privacy-content">
      <van-cell title="SmartClass 隐私政策" :border="false" />

      <van-cell title="1. 收集的信息" :border="false">
        <template #label>
          <p>我们可能会收集以下类型的信息：</p>
          <ul>
            <li>个人信息：如姓名、电子邮件地址、电话号码等。</li>
            <li>使用信息：您如何使用我们的服务的详细信息。</li>
            <li>设备信息：您的设备类型、操作系统版本、IP 地址等。</li>
          </ul>
        </template>
      </van-cell>

      <van-cell title="2. 信息的使用" :border="false">
        <template #label>
          <p>我们收集的信息将用于以下目的：</p>
          <ul>
            <li>提供和改进我们的服务。</li>
            <li>与您沟通，包括发送通知、提醒和其他重要信息。</li>
            <li>分析和研究，以改进我们的产品和服务。</li>
          </ul>
        </template>
      </van-cell>

      <van-cell title="3. 信息的共享" :border="false">
        <template #label>
          <p>我们不会向第三方出售或出租您的个人信息。我们可能会在以下情况下共享您的信息：</p>
          <ul>
            <li>获得您的同意。</li>
            <li>遵守法律义务。</li>
            <li>保护我们的权利和利益。</li>
          </ul>
        </template>
      </van-cell>

      <van-cell title="4. 数据安全" :border="false">
        <template #label>
          <p>
            我们采取适当的技术和组织措施来保护您的个人信息免受未经授权的访问、使用、披露、修改或销毁。
          </p>
        </template>
      </van-cell>

      <van-cell title="5. 您的权利" :border="false">
        <template #label>
          <p>
            您有权访问、更正、删除您的个人信息，以及撤回对处理您的个人信息的同意。如需行使这些权利，请联系我们：support@smartclass.com。
          </p>
        </template>
      </van-cell>

      <van-cell title="6. 隐私政策的更新" :border="false">
        <template #label>
          <p>
            我们保留随时更新本隐私政策的权利。更新后的隐私政策将在发布后立即生效。如果您不同意更新后的隐私政策，请停止使用我们的服务。
          </p>
        </template>
      </van-cell>

      <van-cell title="7. 联系我们" :border="false">
        <template #label>
          <p>
            如果您对本隐私政策有任何疑问或建议，请联系我们：support@smartclass.com。
          </p>
        </template>
      </van-cell>
    </van-cell-group>
  </div>
</template>

<script setup lang="ts">
import { BackButton } from '../../components/common';
</script>

<style scoped>
.privacy-container {
  min-height: 100vh;
  background: #f7f8fa;
}

.privacy-content {
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
  list-style-type: disc;
  padding-left: 20px;
  margin: 0;
}

:deep(.van-cell__label li) {
  margin-bottom: 8px;
}
</style>