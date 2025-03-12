<template>
    <div class="about-container">
      <div class="back-button" @click="goBack">
        <van-icon name="arrow-left" size="18" />
        <span class="page-title">关于我们</span>
      </div>
  
      <div class="about-content">
        <h2>欢迎使用 SmartClass</h2>
        <p>
          SmartClass 是一款专为学生、教师和管理员设计的在线学习平台。我们致力于提供一个高效、便捷的学习环境，帮助用户更好地进行知识管理和交流。
        </p>
  
        <h3>我们的使命</h3>
        <p>
          我们的使命是通过技术创新，推动教育行业的数字化转型，让每个人都能享受到优质的教育资源。我们不断优化平台功能，提升用户体验，力求为用户提供最优质的服务。
        </p>
  
        <h3>联系我们</h3>
        <div>
          <ul>
            <li><strong>邮箱:</strong> support@smartclass.com</li>
            <li><strong>电话:</strong> +86-123-456-7890</li>
            <li><strong>地址:</strong> 北京市朝阳区XX路XX号</li>
          </ul>
        </div>
  
        <h3>团队成员</h3>
        <div>
          <ul>
            <li><strong>项目经理:</strong> John Doe</li>
            <li><strong>前端开发:</strong> Jane Smith</li>
            <li><strong>后端开发:</strong> Bob Johnson</li>
            <li><strong>UI 设计:</strong> Emily Davis</li>
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
  .about-container {
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
  
  .about-content {
    margin-top: 20px;
  }
  
  /* 设置所有文本颜色为黑色 */
  .about-content * {
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
  </style>