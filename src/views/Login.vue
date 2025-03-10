<template>
  <div class="login">
    <!-- 顶部导航栏 -->
    <van-nav-bar
      title="登录"
      left-arrow
      @click-left="router.back()"
    />

    <div class="login-header">
      <van-image
        class="logo"
        width="80"
        height="80"
        src="https://fastly.jsdelivr.net/npm/@vant/assets/logo.png"
      />
      <h2>欢迎回来</h2>
      <p class="subtitle">登录后开启您的学习之旅</p>
    </div>

    <van-form @submit="onSubmit" class="login-form">
      <van-cell-group inset>
        <van-field
          v-model="username"
          name="username"
          label="用户名"
          placeholder="请输入用户名"
          :rules="[{ required: true, message: '请填写用户名' }]"
          label-width="60"
        />
        <van-field
          v-model="password"
          type="password"
          name="password"
          label="密码"
          placeholder="请输入密码"
          :rules="[{ required: true, message: '请填写密码' }]"
          label-width="60"
        />
      </van-cell-group>

      <div class="form-actions">
        <van-button
          round
          block
          type="primary"
          native-type="submit"
          :loading="loading"
        >
          登录
        </van-button>
      </div>

      <div class="additional-links">
        <span class="link-text" @click="router.push('/forgot-password')">忘记密码？</span>
        <span class="link-text" @click="router.push('/register')">注册新账号</span>
      </div>
    </van-form>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { showToast } from 'vant';

const router = useRouter();
const username = ref('');
const password = ref('');
const loading = ref(false);

const onSubmit = async (values) => {
  loading.value = true;
  try {
    // 这里替换为实际的登录 API 调用
    await mockLogin(values);
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('userInfo', JSON.stringify({
      username: values.username,
      // 其他用户信息
    }));
    showToast({
      type: 'success',
      message: '登录成功',
      onClose: () => {
        router.push('/');
      },
    });
  } catch (error) {
    showToast({
      type: 'fail',
      message: error.message || '登录失败',
    });
  } finally {
    loading.value = false;
  }
};

// Mock 登录函数
const mockLogin = (values) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (values.username === 'admin' && values.password === '123456') {
        resolve();
      } else {
        reject(new Error('用户名或密码错误'));
      }
    }, 1000);
  });
};
</script>

<style scoped>
.login {
  min-height: 100vh;
  background-color: #fff;
  display: flex;
  flex-direction: column;
}

.login-header {
  text-align: center;
  margin: 32px 0;
}

.logo {
  margin-bottom: 16px;
}

.login-header h2 {
  margin: 0;
  font-size: 24px;
  color: #323233;
  font-weight: 600;
}

.subtitle {
  margin: 8px 0 0;
  font-size: 14px;
  color: #969799;
}

.login-form {
  padding: 0 16px;
}

.form-actions {
  margin: 24px 0;
}

.additional-links {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  margin-top: 8px;
}

.link-text {
  font-size: 14px;
  color: #1989fa;
  cursor: pointer;
}

:deep(.van-field__label) {
  color: #323233;
}

:deep(.van-nav-bar) {
  background-color: transparent;
}

:deep(.van-nav-bar__title) {
  color: #323233;
}

:deep(.van-nav-bar .van-icon) {
  color: #323233;
}
</style> 