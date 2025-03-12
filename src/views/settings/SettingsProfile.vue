<!-- src/views/settings/SettingsProfile.vue -->
<template>
  <div class="profile-settings">
    <back-button title="个人资料设置" />
    
    <van-cell-group inset class="profile-form">
      <van-cell title="头像" center>
        <template #right-icon>
          <div class="avatar-container">
            <van-image
              round
              width="60"
              height="60"
              :src="formData.userAvatar || 'https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg'"
              fit="cover"
              @click="previewAvatar"
            />
            <van-uploader 
              :after-read="onAvatarSelected" 
              class="avatar-uploader"
              accept="image/*"
            >
              <van-button size="small" type="primary" round icon="photograph">更换头像</van-button>
            </van-uploader>
          </div>
        </template>
      </van-cell>
      
      <van-field
        v-model="formData.userName"
        name="username"
        label="昵称"
        placeholder="请输入昵称"
        :rules="[{ required: true, message: '请输入昵称' }]"
      />
      
      <van-field
        v-model="formData.userPhone"
        name="userPhone"
        label="手机号"
        placeholder="请输入手机号"
        type="tel"
        maxlength="11"
        :rules="[{ pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号' }]"
      />
      
      <van-field
        v-model="formData.userEmail"
        name="userEmail"
        label="邮箱"
        placeholder="请输入邮箱"
        type="email"
        :rules="[{ pattern: /^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/, message: '请输入正确的邮箱' }]"
      />
      
      <van-field
        v-model="formData.userWechat"
        name="userWechat"
        label="微信"
        placeholder="请输入微信号"
      />
      
      <van-field
        v-model="formData.userProfile"
        name="userProfile"
        label="个人简介"
        type="textarea"
        rows="3"
        autosize
        placeholder="请输入个人简介"
        show-word-limit
        maxlength="100"
      />
    </van-cell-group>
    
    <van-cell-group inset class="profile-form">
      <van-field
        v-model="displayGender"
        name="userGender"
        label="性别"
        readonly
        is-link
        placeholder="请选择性别"
        @click="showGenderPicker = true"
      />
      
      <van-field
        v-model="formData.userBirthday"
        name="userBirthday"
        label="生日"
        readonly
        is-link
        placeholder="请选择生日"
        @click="showDatePicker = true"
      />
      
      <van-field
        v-model="formData.userLocation"
        name="userLocation"
        label="所在地"
        readonly
        is-link
        placeholder="请选择所在地"
        @click="showAddressPicker = true"
      />
    </van-cell-group>
    
    <div class="button-container">
      <van-button round block type="primary" native-type="submit" @click="saveProfile">
        保存
      </van-button>
    </div>
    
    <!-- 性别选择器 -->
    <van-popup v-model:show="showGenderPicker" position="bottom">
      <van-picker
        title="选择性别"
        :columns="genderOptions"
        @confirm="onGenderConfirm"
        @cancel="showGenderPicker = false"
        show-toolbar
      />
    </van-popup>
    
    <!-- 日期选择器 -->
    <van-popup v-model:show="showDatePicker" position="bottom">
      <div class="date-picker-container">
        <div class="date-picker-header">
          <van-icon name="cross" @click="showDatePicker = false" />
          <div class="date-picker-title">选择生日</div>
          <van-button type="primary" size="small" @click="onDateConfirm">确认</van-button>
        </div>
        <van-date-picker
          v-model="selectedDate"
          :min-date="minDate"
          :max-date="maxDate"
          :show-toolbar="false"
        />
      </div>
    </van-popup>
    
    <!-- 地址选择器 -->
    <van-popup v-model:show="showAddressPicker" position="bottom">
      <div class="area-picker-container">
        <div class="area-picker-header">
          <van-icon name="cross" @click="showAddressPicker = false" />
          <div class="area-picker-title">选择地区</div>
          <van-button type="primary" size="small" @click="onAreaConfirm">确认</van-button>
        </div>
        <van-area
          :area-list="areaList"
          :value="areaCode"
          ref="areaRef"
          :show-toolbar="false"
        />
      </div>
    </van-popup>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { showToast, showSuccessToast, showLoadingToast, showImagePreview } from 'vant';
import type { UploaderFileListItem } from 'vant';
import { areaList } from '@vant/area-data';
import apiClient from '../../api/index.js'; // 引入 Axios 实例
import { BackButton } from '../../components/common';

interface UserProfile {
  id: number | null;
  userAccount: string;
  userGender: string;
  userPhone: string;
  unionId: string;
  mpOpenId: string;
  userName: string;
  userAvatar: string;
  userProfile: string;
  userRole: string;
  createTime: string;
  updateTime: string;
  isDelete: number;
  userBirthday: string;
  userLocation: string;
  userEmail: string;
  userWechat: string;
}

interface PickerOption {
  selectedOptions: Array<{text: string, value: any}>;
  selectedValues: any[];
  selectedIndexes: number[];
}

const router = useRouter();
const route = useRoute();

// 表单数据
const formData = ref<UserProfile>({
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
  userEmail: '',
  userWechat: ''
});

// 监听路由参数，获取裁剪后的头像
watch(() => route.query.avatar, (newAvatar) => {
  if (newAvatar) {
    formData.value.userAvatar = newAvatar as string;
    // 清除URL参数
    router.replace({ path: route.path });
  }
});

// 监听路由参数，获取裁剪后的头像URL
watch(() => route.query.avatarUrl, (newAvatarUrl) => {
  if (newAvatarUrl) {
    formData.value.userAvatar = newAvatarUrl as string;
    // 清除URL参数
    router.replace({ path: route.path });
  }
});

// 性别选择器
const showGenderPicker = ref(false);
const genderOptions = [
  { text: '男', value: '1' },
  { text: '女', value: '2' },
  { text: '保密', value: '0' }
];

// 性别显示文本
const displayGender = ref('');

// 根据性别值获取显示文本
const getGenderText = (value: string): string => {
  const option = genderOptions.find(item => item.value === value);
  return option ? option.text : '';
};

// 处理性别选择
const onGenderConfirm = (value: PickerOption): void => {
  console.log('性别选择:', value);
  const selectedValue = value.selectedValues[0];
  const selectedOption = value.selectedOptions[0];
  
  if (selectedValue && selectedOption) {
    formData.value.userGender = selectedValue;
    displayGender.value = selectedOption.text;
  }
  
  showGenderPicker.value = false;
};

// 日期选择器
const showDatePicker = ref(false);
const minDate = new Date(1950, 0, 1);
const maxDate = new Date();
const selectedDate = ref<string[]>([
  String(new Date().getFullYear()),
  String(new Date().getMonth() + 1),
  String(new Date().getDate())
]);

// 地址选择器
const showAddressPicker = ref(false);
const areaCode = ref('');
const selectedArea = ref<string[]>([]);
const areaRef = ref<any>(null);

// 头像预览
const previewAvatar = () => {
  const avatar = formData.value.userAvatar || 'https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg';
  showImagePreview([avatar]);
};

// 选择头像后跳转到裁剪页面
const onAvatarSelected = (file: UploaderFileListItem | UploaderFileListItem[]): void => {
  if (!Array.isArray(file) && file.file) {
    const URL = window.URL || window.webkitURL;
    const imageUrl = URL.createObjectURL(file.file);
    // 跳转到裁剪页面
    router.push({
      path: '/settings/avatar-cropper',
      query: {
        imageUrl: encodeURIComponent(imageUrl)
      }
    });
  }
};

// 处理日期选择
const onDateConfirm = (): void => {
  const [year, month, day] = selectedDate.value;
  const formattedMonth = (month || '').padStart(2, '0');
  const formattedDay = (day || '').padStart(2, '0');
  formData.value.userBirthday = `${year}-${formattedMonth}-${formattedDay}`;
  showDatePicker.value = false;
};

// 处理地址选择
const onAreaConfirm = (): void => {
  if (areaRef.value) {
    try {
      // 获取当前选中的值
      const selectedValues = areaRef.value.getSelectedOptions();
      const areaNames = selectedValues.map((item: any) => item.text);
      selectedArea.value = areaNames;
      formData.value.userLocation = areaNames.join(' ');
    } catch (error) {
      console.error('获取地址选择数据失败:', error);
      showToast('获取地址选择数据失败');
    }
  }
  showAddressPicker.value = false;
};

// 获取用户信息
const fetchUserProfile = async (): Promise<void> => {
  const loading = showLoadingToast({
    message: '加载中...',
    forbidClick: true,
  });
  
  try {
    const response = await apiClient.get('/user/get/login');
    formData.value = response.data;
    
    // 设置性别显示文本
    if (formData.value.userGender) {
      displayGender.value = getGenderText(formData.value.userGender);
      console.log('设置性别显示文本:', formData.value.userGender, displayGender.value);
    }
    
    // 如果有生日数据，初始化日期选择器
    if (formData.value.userBirthday) {
      const dateParts = formData.value.userBirthday.split('-');
      if (dateParts.length === 3) {
        selectedDate.value = dateParts as string[];
      }
    }
  } catch (error) {
    console.error('获取用户信息失败:', error);
    showToast('获取用户信息失败');
  } finally {
    loading.close();
  }
};

// 保存个人资料
const saveProfile = async (): Promise<void> => {
  const loading = showLoadingToast({
    message: '保存中...',
    forbidClick: true,
  });
  
  try {
    // 构建符合UserUpdateMyRequest的数据结构
    const updateData = {
      userAvatar: formData.value.userAvatar,
      userName: formData.value.userName,
      userPhone: formData.value.userPhone,
      userProfile: formData.value.userProfile,
      userEmail: formData.value.userEmail,
      userWechat: formData.value.userWechat
    };
    
    const response = await apiClient.put('/user/update', updateData);
    console.log('保存个人资料:', response.data);
    showSuccessToast('个人资料保存成功');
  } catch (error) {
    console.error('保存个人资料失败:', error);
    showToast('保存个人资料失败');
  } finally {
    loading.close();
  }
};

// 页面加载时获取用户信息
onMounted(() => {
  fetchUserProfile();
});
</script>

<style scoped>
.profile-settings {
  min-height: 100vh;
  background: #f7f8fa;
}

.profile-form {
  margin-top: 12px;
}

.button-container {
  margin: 20px 16px;
}

.avatar-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.avatar-uploader {
  margin-top: 8px;
}

.area-picker-container,
.date-picker-container {
  background-color: #fff;
  height: 50vh;
  display: flex;
  flex-direction: column;
}

.area-picker-header,
.date-picker-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 16px;
  border-bottom: 1px solid #ebedf0;
}

.area-picker-title,
.date-picker-title {
  font-size: 16px;
  font-weight: 500;
}

:deep(.van-cell__title) {
  flex: 0 0 80px;
}

:deep(.van-field__label) {
  width: 80px;
}
</style>