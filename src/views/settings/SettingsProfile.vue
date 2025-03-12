<!-- src/views/settings/SettingsProfile.vue -->
<template>
    <div class="profile-settings">
      <div class="back-button" @click="goBack">
        <van-icon name="arrow-left" size="18" />
        <span class="page-title">个人资料设置</span>
      </div>
      <van-cell-group inset>
        <van-cell title="头像">
          <template #right-icon>
            <van-uploader :after-read="onRead" />
          </template>
        </van-cell>
        <van-field
          v-model="formData.username"
          name="username"
          label="昵称"
          placeholder="请输入昵称"
          :rules="[{ required: true, message: '请输入昵称' }]"
        />
        <van-field
          v-model="formData.userAccount"
          name="userAccount"
          label="账号"
          placeholder="请输入账号"
          :rules="[{ required: true, message: '请输入账号' }]"
        />
        <van-field
          v-model="formData.userGender"
          name="userGender"
          label="性别"
          placeholder="请输入性别"
          :rules="[{ required: true, message: '请输入性别' }]"
        />
        <van-field
          v-model="formData.userBirthday"
          name="userBirthday"
          label="生日"
          placeholder="请输入生日"
          type="date"
          :rules="[{ required: true, message: '请输入生日' }]"
        />
        <van-field
          v-model="formData.userLocation"
          name="userLocation"
          label="所在地"
          placeholder="请输入所在地"
          :rules="[{ required: true, message: '请输入所在地' }]"
        />
        <van-field
          v-model="formData.userCompany"
          name="userCompany"
          label="公司"
          placeholder="请输入公司"
          :rules="[{ required: true, message: '请输入公司' }]"
        />
        <van-field
          v-model="formData.userPosition"
          name="userPosition"
          label="职位"
          placeholder="请输入职位"
          :rules="[{ required: true, message: '请输入职位' }]"
        />
        <van-field
          v-model="formData.userIndustry"
          name="userIndustry"
          label="行业"
          placeholder="请输入行业"
          :rules="[{ required: true, message: '请输入行业' }]"
        />
      </van-cell-group>
      <div class="button-container">
        <van-button round block type="primary" native-type="submit" @click="saveProfile">
          保存
        </van-button>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
  import { useRouter } from 'vue-router'
  import { Toast } from 'vant'
  import apiClient from '../../api/index.js' // 引入 Axios 实例
  
  const router = useRouter()
  
  const formData = ref({
    id: null,
    userAccount: '',
    userGender: '',
    userPhone: '',
    unionId: '',
    mpOpenId: '',
    userName: '',
    userAvatar: '',
    userProfile: '',
    userRole: '',
    createTime: '',
    updateTime: '',
    isDelete: 0,
    userBirthday: '',
    userLocation: '',
    userCompany: '',
    userPosition: '',
    userIndustry: ''
  })
  
  const showGradePicker = ref(false)
  const showSubjectPicker = ref(false)
  
  const gradeColumns = [
    '一年级', '二年级', '三年级',
    '四年级', '五年级', '六年级'
  ]
  
  const subjectColumns = [
    '语文', '数学', '英语', '科学'
  ]
  
  const onGradeConfirm = (value) => {
    formData.value.grade = value
    showGradePicker.value = false
  }
  
  const onSubjectConfirm = (value) => {
    formData.value.subject = value
    showSubjectPicker.value = false
  }
  
  const goBack = () => {
    router.back()
  }
  
  const onRead = (file) => {
    // 处理文件上传逻辑
    console.log(file)
    formData.value.userAvatar = file.content
    Toast.success('头像上传成功')
  }
  
  const fetchUserProfile = async () => {
    try {
      const response = await apiClient.get('/user/get/login')
      formData.value = response.data
    } catch (error) {
      console.error('获取用户信息失败:', error)
      Toast.fail('获取用户信息失败')
    }
  }
  
  const saveProfile = async () => {
    try {
      const response = await apiClient.put('/user/update', formData.value)
      console.log('保存个人资料:', response.data)
      Toast.success('个人资料保存成功')
    } catch (error) {
      console.error('保存个人资料失败:', error)
      Toast.fail('保存个人资料失败')
    }
  }
  
  // 页面加载时获取用户信息
  onMounted(() => {
    fetchUserProfile()
  })
  </script>
  
  <style scoped>
  .profile-settings {
    padding: 16px;
  }
  
  .button-container {
    margin-top: 20px;
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