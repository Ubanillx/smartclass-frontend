<template>
  <div class="register">
    <van-nav-bar
      title="注册账号"
      left-arrow
      @click-left="handleBack"
    />
    
    <div class="register-header">
      <van-image
        class="logo"
        width="80"
        height="80"
        src="https://fastly.jsdelivr.net/npm/@vant/assets/logo.png"
      />
      <h2>创建账号</h2>
      <p class="subtitle">注册后开启您的学习之旅</p>
    </div>
    
    <div class="register-form">
      <!-- 用户类型选择 -->
      <van-cell-group inset>
        <van-field name="userType" label="注册类型" label-width="60">
          <template #input>
            <van-radio-group v-model="formData.userType" direction="horizontal">
              <van-radio name="student">学生</van-radio>
              <van-radio name="teacher">老师</van-radio>
              <van-radio name="admin">管理员</van-radio>
            </van-radio-group>
          </template>
        </van-field>
      </van-cell-group>

      <!-- 基本信息 -->
      <van-cell-group inset class="form-group">
        <van-field
          v-model="formData.username"
          label="用户名"
          placeholder="请输入用户名"
          :rules="[{ required: true, message: '请填写用户名' }]"
          label-width="80"
        />
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
        <van-field
          v-model="formData.phone"
          type="tel"
          label="手机号"
          placeholder="请输入手机号"
          :rules="[{ required: true, message: '请填写手机号' }]"
          label-width="80"
        />
      </van-cell-group>

      <!-- 管理员特有字段 -->
      <van-cell-group inset class="form-group" v-if="formData.userType === 'admin'">
        <van-field
          v-model="formData.employeeId"
          label="工号"
          placeholder="请输入管理员工号"
          :rules="[{ required: true, message: '请填写工号' }]"
          label-width="80"
        />
      </van-cell-group>

      <!-- 学生特有字段 -->
      <van-cell-group inset class="form-group" v-if="formData.userType === 'student'">
        <van-field
          v-model="formData.grade"
          label="年级"
          placeholder="请选择年级"
          readonly
          @click="showGradePicker = true"
          label-width="80"
        />
      </van-cell-group>

      <!-- 老师特有字段 -->
      <van-cell-group inset class="form-group" v-if="formData.userType === 'teacher'">
        <van-field
          v-model="formData.subject"
          label="任教学科"
          placeholder="请选择学科"
          readonly
          @click="showSubjectPicker = true"
          label-width="80"
        />
      </van-cell-group>

      <div class="form-actions">
        <van-button type="primary" block round @click="handleRegister">
          注册
        </van-button>
      </div>

      <div class="login-link">
        已有账号？<span class="link-text" @click="router.push('/login')">立即登录</span>
      </div>
    </div>

    <!-- 年级选择器 -->
    <van-popup v-model:show="showGradePicker" position="bottom">
      <van-picker
        :columns="gradeColumns"
        @confirm="onGradeConfirm"
        @cancel="showGradePicker = false"
        show-toolbar
        title="选择年级"
      />
    </van-popup>

    <!-- 学科选择器 -->
    <van-popup v-model:show="showSubjectPicker" position="bottom">
      <van-picker
        :columns="subjectColumns"
        @confirm="onSubjectConfirm"
        @cancel="showSubjectPicker = false"
        show-toolbar
        title="选择学科"
      />
    </van-popup>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { showToast } from 'vant';

const router = useRouter();
const route = useRoute();

const formData = ref({
  userType: 'student',
  username: '',
  nickname: '',
  password: '',
  confirmPassword: '',
  phone: '',
  employeeId: '', // 管理员工号
  grade: '', // 学生年级
  subject: '' // 教师学科
});

const showGradePicker = ref(false);
const showSubjectPicker = ref(false);

const gradeColumns = [
  '一年级', '二年级', '三年级',
  '四年级', '五年级', '六年级'
];

const subjectColumns = [
  '语文', '数学', '英语', '科学'
];

const onGradeConfirm = (value) => {
  formData.value.grade = value;
  showGradePicker.value = false;
};

const onSubjectConfirm = (value) => {
  formData.value.subject = value;
  showSubjectPicker.value = false;
};

// 处理返回按钮点击
const handleBack = () => {
  if (route.query.redirect) {
    router.back();
  } else {
    router.push('/');
  }
};

const handleRegister = () => {
  // 表单验证
  if (!formData.value.username || !formData.value.password || !formData.value.phone) {
    showToast('请填写完整信息');
    return;
  }

  if (formData.value.password !== formData.value.confirmPassword) {
    showToast('两次输入的密码不一致');
    return;
  }

  // 特殊字段验证
  if (formData.value.userType === 'admin' && !formData.value.employeeId) {
    showToast('请填写管理员工号');
    return;
  }

  if (formData.value.userType === 'student' && !formData.value.grade) {
    showToast('请选择年级');
    return;
  }

  if (formData.value.userType === 'teacher' && !formData.value.subject) {
    showToast('请选择任教学科');
    return;
  }

  // TODO: 调用注册接口
  console.log('注册信息：', formData.value);
  
  showToast({
    type: 'success',
    message: '注册成功',
    onClose: () => {
      router.push('/login');
    }
  });
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

:deep(.van-radio-group) {
  display: flex;
  justify-content: flex-start;
  padding: 10px 0;
}

:deep(.van-radio) {
  margin-right: 32px;
}

:deep(.van-radio__label) {
  margin-left: 6px;
  font-size: 14px;
  color: #323233;
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

:deep(.van-radio__icon) {
  font-size: 16px;
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