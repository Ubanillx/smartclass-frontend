<!-- src/views/settings/SettingsProfile.vue -->
<template>
    <div class="profile-settings">
      <van-nav-bar
        title="个人资料设置"
        left-arrow
        @click-left="goBack"
      />
      <van-cell-group inset>
        <van-cell title="头像">
          <template #right-icon>
            <van-uploader :after-read="onRead" />
          </template>
        </van-cell>
        <van-field
          v-model="userName"
          name="username"
          label="昵称"
          placeholder="请输入昵称"
          :rules="[{ required: true, message: '请输入昵称' }]"
        />
        <van-field
          v-model="userAccount"
          name="userAccount"
          label="账号"
          placeholder="请输入账号"
          :rules="[{ required: true, message: '请输入账号' }]"
        />
        <van-field
          v-model="userGender"
          name="userGender"
          label="性别"
          placeholder="请输入性别"
          :rules="[{ required: true, message: '请输入性别' }]"
        />
        <van-field
          v-model="userBirthday"
          name="userBirthday"
          label="生日"
          placeholder="请输入生日"
          type="date"
          :rules="[{ required: true, message: '请输入生日' }]"
        />
        <van-field
          v-model="userLocation"
          name="userLocation"
          label="所在地"
          placeholder="请输入所在地"
          :rules="[{ required: true, message: '请输入所在地' }]"
        />
        <van-field
          v-model="userCompany"
          name="userCompany"
          label="公司"
          placeholder="请输入公司"
          :rules="[{ required: true, message: '请输入公司' }]"
        />
        <van-field
          v-model="userPosition"
          name="userPosition"
          label="职位"
          placeholder="请输入职位"
          :rules="[{ required: true, message: '请输入职位' }]"
        />
        <van-field
          v-model="userIndustry"
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
  import { ref } from 'vue'
  import { useRouter } from 'vue-router'
  import { Toast } from 'vant'
  
  const router = useRouter()
  
  // 假设从后端获取用户信息
  const userInfo = {
    id: 1,
    userAccount: 'user123',
    userPassword: 'password123',
    userGender: '男',
    userPhone: '1234567890',
    unionId: 'union123',
    mpOpenId: 'mp123',
    userName: 'John Doe',
    userAvatar: 'https://example.com/avatar.jpg',
    userProfile: 'Hello, I am John Doe.',
    userRole: 'student',
    createTime: '2023-01-01 00:00:00',
    updateTime: '2023-01-01 00:00:00',
    isDelete: 0,
    userBirthday: '2000-01-01',
    userLocation: '北京',
    userCompany: '公司A',
    userPosition: '前端开发',
    userIndustry: 'IT'
  }
  
  const userName = ref(userInfo.userName)
  const userAccount = ref(userInfo.userAccount)
  const userGender = ref(userInfo.userGender)
  const userPhone = ref(userInfo.userPhone)
  const userProfile = ref(userInfo.userProfile)
  const userAvatar = ref(userInfo.userAvatar)
  const userBirthday = ref(userInfo.userBirthday)
  const userLocation = ref(userInfo.userLocation)
  const userCompany = ref(userInfo.userCompany)
  const userPosition = ref(userInfo.userPosition)
  const userIndustry = ref(userInfo.userIndustry)
  
  const goBack = () => {
    router.back()
  }
  
  const onRead = (file) => {
    // 处理文件上传逻辑
    console.log(file)
    userAvatar.value = file.content
    Toast.success('头像上传成功')
  }
  
  const saveProfile = () => {
    // 处理保存逻辑
    console.log('保存个人资料:', {
      userName: userName.value,
      userAccount: userAccount.value,
      userGender: userGender.value,
      userPhone: userPhone.value,
      userProfile: userProfile.value,
      userAvatar: userAvatar.value,
      userBirthday: userBirthday.value,
      userLocation: userLocation.value,
      userCompany: userCompany.value,
      userPosition: userPosition.value,
      userIndustry: userIndustry.value
    })
    Toast.success('个人资料保存成功')
  }
  </script>
  
  <style scoped>
  .profile-settings {
    padding: 16px;
  }
  
  .button-container {
    margin-top: 20px;
  }
  </style>