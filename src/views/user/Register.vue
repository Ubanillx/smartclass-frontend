<template>
  <div class="register">
    <back-button
      title="注册账号"
      :custom-path="route.query.redirect ? undefined : '/'"
    />

    <div class="register-header">
      <van-image class="logo" width="80" height="80" src="/logo.svg" />
      <h2>创建账号</h2>
      <p class="subtitle">注册后开启您的学习之旅</p>
    </div>

    <!-- 注册方式导航 -->
    <van-tabs v-model:active="registerType" class="register-tabs">
      <van-tab name="account" title="用户名注册" />
      <van-tab name="phone" title="手机号注册" />
    </van-tabs>

    <div class="register-form">
      <!-- 基本信息 -->
      <van-cell-group inset class="form-group">
        <template v-if="registerType === 'account'">
          <van-field
            v-model="formData.userAccount"
            label="用户名"
            placeholder="请输入用户名"
            :rules="[{ required: true, message: '请填写用户名' }]"
            label-width="80"
          />
        </template>
        <template v-else>
          <van-field
            v-model="formData.userPhone"
            type="tel"
            label="手机号"
            placeholder="请输入手机号"
            :rules="[{ required: true, message: '请填写手机号' }]"
            label-width="80"
          />
        </template>
        <van-field
          v-model="formData.nickname"
          label="昵称"
          placeholder="请输入昵称"
          :rules="[{ required: true, message: '请填写昵称' }]"
          label-width="80"
        />
        <van-field
          v-model="formData.password"
          type="password"
          label="密码"
          placeholder="请输入密码"
          :rules="[{ required: true, message: '请填写密码' }]"
          label-width="80"
        />
        <van-field
          v-model="formData.confirmPassword"
          type="password"
          label="确认密码"
          placeholder="请再次输入密码"
          :rules="[{ required: true, message: '请确认密码' }]"
          label-width="80"
        />
      </van-cell-group>

      <div class="form-actions">
        <van-button
          type="primary"
          block
          round
          @click="handleRegister"
          :loading="loading"
        >
          注册
        </van-button>
      </div>

      <div class="login-link">
        已有账号？<span class="link-text" @click="router.push('/login')"
          >立即登录</span
        >
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { showToast } from 'vant';
import { UserControllerService } from '../../services/services/UserControllerService';
import { BackButton } from '../../components/Common';

const router = useRouter();
const route = useRoute();

const registerType = ref('account'); // 注册方式：account - 用户名注册，phone - 手机号注册
const loading = ref(false);

const formData = ref({
  userAccount: '',
  userPhone: '',
  nickname: '',
  password: '',
  confirmPassword: '',
});

const validateForm = () => {
  // 表单验证
  if (registerType.value === 'account' && !formData.value.userAccount) {
    showToast('请填写用户名');
    return false;
  }

  if (registerType.value === 'phone' && !formData.value.userPhone) {
    showToast('请填写手机号');
    return false;
  }

  if (!formData.value.password || !formData.value.confirmPassword) {
    showToast('请填写密码');
    return false;
  }

  if (formData.value.password !== formData.value.confirmPassword) {
    showToast('两次输入的密码不一致');
    return false;
  }

  return true;
};

const handleRegister = async () => {
  if (!validateForm()) {
    return;
  }

  loading.value = true;
  try {
    let response;
    if (registerType.value === 'account') {
      response = await UserControllerService.userRegisterUsingPost({
        userAccount: formData.value.userAccount,
        userPassword: formData.value.password,
        checkPassword: formData.value.confirmPassword,
      });
    } else {
      response = await UserControllerService.userPhoneRegisterUsingPost({
        userPhone: formData.value.userPhone,
        userPassword: formData.value.password,
        checkPassword: formData.value.confirmPassword,
      });
    }

    if (response.code === 0) {
      showToast({
        type: 'success',
        message: '注册成功',
        onClose: () => {
          router.push('/login');
        },
      });
    } else {
      showToast({
        type: 'fail',
        message: response.message || '注册失败',
      });
    }
  } catch (error) {
    showToast({
      type: 'fail',
      message: error.message || '注册失败，请检查网络连接',
    });
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.register {
  min-height: 100vh;
  background-color: #fff;
  padding-bottom: 32px;
  display: flex;
  flex-direction: column;
}

.register-header {
  text-align: center;
  margin: 32px 0;
}

.logo {
  margin-bottom: 16px;
}

.register-header h2 {
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

.register-form {
  padding: 0 16px;
}

.form-group {
  margin-top: 12px;
}

.form-actions {
  margin: 24px 0;
}

.login-link {
  margin-top: 16px;
  text-align: center;
  font-size: 14px;
  color: #969799;
}

.link-text {
  color: #1989fa;
  cursor: pointer;
}

:deep(.van-field__label) {
  color: #323233;
  font-size: 14px;
  width: 80px !important;
}

:deep(.van-field__value) {
  flex: 1;
}

:deep(.van-cell) {
  padding: 12px 16px;
  line-height: 24px;
  align-items: center;
  min-height: 48px;
}

:deep(.van-field__control) {
  font-size: 14px;
  height: 24px;
  line-height: 24px;
  padding: 0 8px;
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

.register-tabs {
  margin-bottom: 16px;
}

:deep(.van-tabs__line) {
  background-color: #1989fa;
}

:deep(.van-tab--active) {
  color: #1989fa;
  font-weight: 500;
}
</style>
