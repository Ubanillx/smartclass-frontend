<template>
  <div class="privacy-container">
    <back-button title="隐私政策" />

    <div class="privacy-content">
      <div class="content-section">
        <h2 class="section-title">智云星课隐私政策</h2>
        <div class="section-content">
          <p>
            欢迎使用智云星课应用。保护您的隐私是我们的首要任务。本隐私政策旨在清晰地解释我们如何收集、使用和保护您的个人信息。
          </p>
        </div>
      </div>

      <div class="content-section">
        <h2 class="section-title">1. 收集的信息</h2>
        <div class="section-content">
          <p>我们可能会收集以下类型的信息：</p>
          <ul>
            <li><strong>个人信息</strong>：您提供的姓名、电子邮件地址、手机号码等基本信息。</li>
            <li><strong>学习数据</strong>：您的学习进度、课程选择、测试结果等学习相关信息。</li>
            <li><strong>使用信息</strong>：您如何使用我们的服务，包括功能使用频率、偏好设置等。</li>
            <li><strong>设备信息</strong>：设备类型、操作系统版本、唯一设备标识符、IP地址等技术数据。</li>
          </ul>
        </div>
      </div>

      <div class="content-section">
        <h2 class="section-title">2. 信息的使用</h2>
        <div class="section-content">
          <p>我们收集的信息将用于以下目的：</p>
          <ul>
            <li>提供、维护和优化我们的教育服务。</li>
            <li>个性化您的学习体验，推荐适合您需求的内容。</li>
            <li>发送重要通知，如系统更新、账户变更或服务调整。</li>
            <li>改进我们的产品，开发新功能和服务。</li>
            <li>分析使用趋势，评估服务效果。</li>
          </ul>
        </div>
      </div>

      <div class="content-section">
        <h2 class="section-title">3. 信息的共享</h2>
        <div class="section-content">
          <p>
            我们重视您的隐私，不会出售或出租您的个人信息。我们仅在以下情况下可能共享您的信息：
          </p>
          <ul>
            <li>在您明确同意的情况下。</li>
            <li>与我们的合作伙伴共享必要信息，以提供您请求的服务。</li>
            <li>遵守法律法规要求，保护用户权益和公共安全。</li>
            <li>保护智云星课及其用户的合法权益。</li>
          </ul>
        </div>
      </div>

      <div class="content-section">
        <h2 class="section-title">4. 数据安全</h2>
        <div class="section-content">
          <p>
            我们实施了多层次的安全措施，包括加密传输、访问控制、安全审计等技术手段保护您的个人信息。我们定期检查和更新这些措施，以确保您的数据安全。
          </p>
          <p>
            尽管我们采取了这些措施，但请理解互联网传输不可能保证100%的安全。我们会尽最大努力保护您的信息，但无法承诺绝对的安全性。
          </p>
        </div>
      </div>

      <div class="content-section">
        <h2 class="section-title">5. 您的权利</h2>
        <div class="section-content">
          <p>
            您对自己的个人信息拥有以下权利：
          </p>
          <ul>
            <li>访问和查看我们收集的关于您的信息。</li>
            <li>更正不准确或不完整的个人信息。</li>
            <li>删除您的个人信息（在法律允许的范围内）。</li>
            <li>限制或反对我们处理您的个人信息。</li>
            <li>导出您的个人数据。</li>
          </ul>
          <p>
            如需行使这些权利，请通过邮箱联系我们：<a href="mailto:support@ubanillx.cn">support@ubanillx.cn</a>。
          </p>
        </div>
      </div>

      <div class="content-section">
        <h2 class="section-title">6. 未成年人保护</h2>
        <div class="section-content">
          <p>
            我们重视未成年人的隐私保护。如果您是未满18岁的未成年人，请在监护人的指导下使用我们的服务。如果我们发现自己收集了未成年人的个人信息且未获得可验证的监护人同意，我们会尽快删除相关信息。
          </p>
        </div>
      </div>

      <div class="content-section">
        <h2 class="section-title">7. 隐私政策的更新</h2>
        <div class="section-content">
          <p>
            我们可能会不定期更新本隐私政策。当我们进行重大变更时，会在应用内发布通知并更新生效日期。建议您定期查看本政策以了解最新情况。继续使用我们的服务即表示您接受更新后的政策。
          </p>
        </div>
      </div>

      <div class="content-section">
        <h2 class="section-title">8. 联系我们</h2>
        <div class="section-content">
          <p>
            如您对本隐私政策有任何疑问、建议或投诉，请随时联系我们：
          </p>
          <p>
            邮箱：<a href="mailto:support@ubanillx.cn">support@ubanillx.cn</a>
          </p>
          <p>
            我们会在收到您的请求后15个工作日内回复。
          </p>
        </div>
      </div>

      <div class="content-section">
        <p class="policy-date">本隐私政策最后更新于：{{ currentDate }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { BackButton } from '../../../components/Common';
import { ref } from 'vue';

// 获取当前日期并格式化为"yyyy年MM月dd日"格式
const currentYear = new Date().getFullYear();
const currentMonth = String(new Date().getMonth() + 1).padStart(2, '0');
const currentDay = String(new Date().getDate()).padStart(2, '0');
const currentDate = ref(`${currentYear}年${currentMonth}月${currentDay}日`);
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

strong {
  font-weight: 600;
}

a {
  color: #1989fa;
  text-decoration: none;
}

.policy-date {
  font-size: 13px;
  color: #969799;
  text-align: center;
  margin-top: 10px;
}
</style>
