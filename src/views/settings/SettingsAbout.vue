<template>
    <div class="about-container">
      <back-button title="关于我们" />
  
      <van-cell-group inset class="about-content">
        <van-cell title="欢迎使用 SmartClass" :border="false">
          <template #label>
            <p>
              SmartClass 是一款专为学生、教师和管理员设计的在线学习平台。我们致力于提供一个高效、便捷的学习环境，帮助用户更好地进行知识管理和交流。
            </p>
          </template>
        </van-cell>
  
        <van-cell title="我们的使命" :border="false">
          <template #label>
            <p>
              我们的使命是通过技术创新，推动教育行业的数字化转型，让每个人都能享受到优质的教育资源。我们不断优化平台功能，提升用户体验，力求为用户提供最优质的服务。
            </p>
          </template>
        </van-cell>
  
        <van-cell title="联系我们" :border="false">
          <template #label>
            <ul>
              <li><strong>邮箱:</strong> support@smartclass.com</li>
              <li><strong>电话:</strong> +86-123-456-7890</li>
              <li><strong>地址:</strong> 北京市朝阳区XX路XX号</li>
            </ul>
          </template>
        </van-cell>
  
        <van-cell title="团队成员" :border="false">
          <template #label>
            <ul>
              <li><strong>项目经理:</strong> John Doe</li>
              <li><strong>前端开发:</strong> Jane Smith</li>
              <li><strong>后端开发:</strong> Bob Johnson</li>
              <li><strong>UI 设计:</strong> Emily Davis</li>
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
  .about-container {
    min-height: 100vh;
    background: #f7f8fa;
  }
  
  .about-content {
    margin-top: 12px;
  }
  
  ul {
    list-style-type: none;
    padding: 0;
    margin: 0;
  }
  
  ul li {
    margin-bottom: 8px;
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
  </style>