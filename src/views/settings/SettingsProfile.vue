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
              <van-button size="small" type="primary" round icon="photograph" plain class="avatar-button">更换头像</van-button>
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
        clearable
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
        :model-value="formData.userBirthday ? formatBirthday(formData.userBirthday) : ''"
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
      <van-button round block type="primary" native-type="submit" @click="saveProfile" :loading="isSaving">
        {{ isSaving ? '保存中...' : '保存' }}
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
import { BackButton } from '../../components/common';
import { UserControllerService } from '../../services';
import type { UserVO } from '../../services/models/UserVO';
import type { UserUpdateMyRequest } from '../../services/models/UserUpdateMyRequest';
import { useUserStore } from '../../stores/userStore';

interface UserProfile {
  id: number | null;
  userAccount: string;
  userGender: string | number;
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
    console.log('接收到avatar参数:', newAvatar);
    formData.value.userAvatar = newAvatar as string;
    // 清除URL参数
    router.replace({ path: route.path });
  }
});

// 监听路由参数，获取裁剪后的头像URL
watch(() => route.query.avatarUrl, (newAvatarUrl) => {
  if (newAvatarUrl) {
    console.log('接收到avatarUrl参数:', newAvatarUrl);
    formData.value.userAvatar = newAvatarUrl as string;
    // 清除URL参数
    router.replace({ path: route.path });
  }
}, { immediate: true }); // 添加immediate: true确保页面加载时立即检查

// 性别选择器
const showGenderPicker = ref(false);
const genderOptions = [
  { text: '男', value: 0 },
  { text: '女', value: 1 },
  { text: '保密', value: 2 }
];

// 性别显示文本
const displayGender = ref('');

// 保存状态
const isSaving = ref(false);

// 根据性别值获取显示文本
const getGenderText = (value: string): string => {
  console.log('获取性别文本，值:', value, '类型:', typeof value);
  const option = genderOptions.find(item => item.value === Number(value));
  console.log('匹配到的性别选项:', option);
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
    console.log('设置性别值:', formData.value.userGender, '显示文本:', displayGender.value);
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

// 直接处理头像上传响应
const handleAvatarUploadResponse = (response: any): void => {
  if (response && response.code === 0 && response.data) {
    // 设置新的头像URL到表单
    formData.value.userAvatar = response.data;
    // 不再自动保存个人资料，避免覆盖其他表单数据
    showSuccessToast('头像更新成功');
  } else {
    showToast(response.message || '头像更新失败');
  }
};

// 处理直接传入的JSON字符串
const handleDirectJsonInput = (jsonStr: string): void => {
  try {
    console.log('处理直接传入的JSON字符串:', jsonStr);
    const response = JSON.parse(jsonStr);
    if (response && response.code === 0 && response.data) {
      // 设置新的头像URL到表单
      formData.value.userAvatar = response.data;
      console.log('已更新头像URL:', response.data);
    }
  } catch (e) {
    console.error('解析JSON字符串失败:', e);
  }
};

// 格式化生日显示
const formatBirthday = (date: string): string => {
  console.log('格式化生日，原始值:', date);
  
  if (!date) return '';
  
  try {
    // 处理ISO 8601格式的日期（如：2025-03-12T16:00:00.000+00:00）
    if (date.includes('T')) {
      const dateObj = new Date(date);
      if (isNaN(dateObj.getTime())) {
        console.log('无效的日期对象');
        return date; // 如果日期无效，返回原始字符串
      }
      
      const year = dateObj.getFullYear();
      // getMonth()返回0-11，需要+1
      const month = (dateObj.getMonth() + 1).toString().padStart(2, '0');
      const day = dateObj.getDate().toString().padStart(2, '0');
      
      const formatted = `${year}年${month}月${day}日`;
      console.log('格式化后的ISO日期:', formatted);
      return formatted;
    }
    
    // 处理普通的YYYY-MM-DD格式
    const dateParts = date.split('-');
    if (dateParts.length !== 3) {
      console.log('无效的日期格式');
      return date;
    }
    
    const [year, month, day] = dateParts;
    const formatted = `${year}年${month}月${day}日`;
    console.log('格式化后的标准日期:', formatted);
    return formatted;
  } catch (error) {
    console.error('格式化生日失败:', error, date);
    return date;
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
    // 从用户存储中获取用户ID
    const userStore = useUserStore();
    const userId = userStore.userInfo?.id;
    
    if (!userId) {
      // 尝试从本地存储中获取
      try {
        const userInfoStr = localStorage.getItem('userInfo');
        if (userInfoStr) {
          const userInfo = JSON.parse(userInfoStr);
          if (userInfo && userInfo.id) {
            console.log('从本地存储获取的用户ID:', userInfo.id);
            await fetchUserProfileById(userInfo.id);
            return;
          }
        }
      } catch (e) {
        console.error('解析本地存储用户信息失败:', e);
      }
      
      showToast('未找到用户ID，请重新登录');
      setTimeout(() => {
        router.replace('/login');
      }, 1500);
      return;
    }
    
    console.log('从用户存储获取的用户ID:', userId);
    await fetchUserProfileById(userId);
  } catch (error) {
    console.error('获取用户信息失败:', error);
    showToast('获取用户信息失败');
  } finally {
    loading.close();
  }
};

// 根据用户ID获取用户信息
const fetchUserProfileById = async (userId: number): Promise<void> => {
  try {
    // 使用UserControllerService获取用户信息，传入用户ID
    const response = await UserControllerService.getUserVoByIdUsingGet(userId);
    console.log('获取用户信息响应:', response);
    
    if (response.code === 0 && response.data) {
      const userVO: UserVO = response.data;
      console.log('获取到的用户信息:', userVO);
      console.log('wechatId字段:', userVO.wechatId, '类型:', typeof userVO.wechatId);
      console.log('birthday字段:', userVO.birthday, '类型:', typeof userVO.birthday);
      
      // 将UserVO数据映射到formData
      formData.value = {
        ...formData.value,
        id: userVO.id || null,
        userName: userVO.userName || '',
        userAvatar: userVO.userAvatar || '',
        userPhone: userVO.userPhone || '',
        userEmail: userVO.userEmail || '',
        userProfile: userVO.userProfile || '',
        userRole: userVO.userRole || '',
        userGender: userVO.userGender !== undefined ? String(userVO.userGender) : '',
        userBirthday: userVO.birthday || '',
        userWechat: userVO.wechatId || '',
        createTime: userVO.createTime || '',
      };
      
      console.log('映射后的表单数据:', formData.value);
      console.log('userWechat字段:', formData.value.userWechat, '类型:', typeof formData.value.userWechat);
      console.log('userBirthday字段:', formData.value.userBirthday, '类型:', typeof formData.value.userBirthday);
      
      // 设置性别显示文本
      if (formData.value.userGender !== undefined && formData.value.userGender !== '') {
        displayGender.value = getGenderText(String(formData.value.userGender));
        console.log('设置性别显示文本:', formData.value.userGender, displayGender.value);
      }
      
      // 如果有生日数据，初始化日期选择器
      if (formData.value.userBirthday) {
        try {
          let year, month, day;
          
          // 处理ISO 8601格式的日期
          if (formData.value.userBirthday.includes('T')) {
            const dateObj = new Date(formData.value.userBirthday);
            if (!isNaN(dateObj.getTime())) {
              year = String(dateObj.getFullYear());
              // getMonth()返回0-11，需要+1
              month = String(dateObj.getMonth() + 1);
              day = String(dateObj.getDate());
              
              // 更新formData中的生日格式为YYYY-MM-DD
              const formattedMonth = month.padStart(2, '0');
              const formattedDay = day.padStart(2, '0');
              formData.value.userBirthday = `${year}-${formattedMonth}-${formattedDay}`;
            }
          } else {
            // 处理普通的YYYY-MM-DD格式
            const dateParts = formData.value.userBirthday.split('-');
            if (dateParts.length === 3) {
              [year, month, day] = dateParts;
            }
          }
          
          if (year && month && day) {
            selectedDate.value = [year, month, day];
            console.log('初始化日期选择器:', selectedDate.value);
          }
        } catch (error) {
          console.error('初始化日期选择器失败:', error, formData.value.userBirthday);
        }
      }
      
      // 如果有地址数据，初始化地址选择器
      if (userVO.province || userVO.city || userVO.district) {
        const locationParts = [];
        if (userVO.province) locationParts.push(userVO.province);
        if (userVO.city) locationParts.push(userVO.city);
        if (userVO.district) locationParts.push(userVO.district);
        
        if (locationParts.length > 0) {
          formData.value.userLocation = locationParts.join(' ');
        }
      }
    } else {
      showToast(response.message || '获取用户信息失败');
    }
  } catch (error) {
    console.error('获取用户信息失败:', error);
    throw error;
  }
};

// 保存个人资料
const saveProfile = async (): Promise<void> => {
  if (isSaving.value) return;
  
  isSaving.value = true;
  const loading = showLoadingToast({
    message: '保存中...',
    forbidClick: true,
  });
  
  try {
    console.log('保存前的表单数据:', formData.value);
    console.log('userWechat字段:', formData.value.userWechat, '类型:', typeof formData.value.userWechat);
    console.log('userBirthday字段:', formData.value.userBirthday, '类型:', typeof formData.value.userBirthday);
    
    // 构建符合UserUpdateMyRequest的数据结构
    const updateData: UserUpdateMyRequest = {
      userAvatar: formData.value.userAvatar,
      userName: formData.value.userName,
      userPhone: formData.value.userPhone,
      userProfile: formData.value.userProfile,
      userEmail: formData.value.userEmail,
      wechatId: formData.value.userWechat,
      userGender: formData.value.userGender !== undefined && formData.value.userGender !== '' 
        ? Number(formData.value.userGender) 
        : undefined,
      birthday: formData.value.userBirthday || undefined
    };
    
    console.log('wechatId字段:', updateData.wechatId, '类型:', typeof updateData.wechatId);
    console.log('birthday字段:', updateData.birthday, '类型:', typeof updateData.birthday);
    
    // 如果有地址信息，添加到请求中
    if (formData.value.userLocation) {
      const locationParts = formData.value.userLocation.split(' ');
      if (locationParts.length >= 1) updateData.province = locationParts[0];
      if (locationParts.length >= 2) updateData.city = locationParts[1];
      if (locationParts.length >= 3) updateData.district = locationParts[2];
    }
    
    console.log('准备更新的用户数据:', updateData);
    
    // 使用UserControllerService更新用户信息
    const response = await UserControllerService.updateMyUserUsingPost(updateData);
    console.log('保存个人资料响应:', response);
    
    if (response.code === 0 && response.data) {
      showSuccessToast('个人资料保存成功');
      // 重新获取用户信息
      fetchUserProfile();
    } else if (response.code === 40100) {
      // 未登录
      showToast('登录已过期，请重新登录');
      setTimeout(() => {
        router.replace('/login');
      }, 1500);
    } else {
      showToast(response.message || '保存个人资料失败');
    }
  } catch (error) {
    console.error('保存个人资料失败:', error);
    showToast('保存个人资料失败');
  } finally {
    loading.close();
    isSaving.value = false;
  }
};

// 页面加载时获取用户信息
onMounted(() => {
  console.log('页面加载，开始获取用户信息');
  fetchUserProfile();
  
  // 添加一个定时器，在页面加载后打印出所有表单字段的值
  setTimeout(() => {
    console.log('表单字段值:');
    console.log('userName:', formData.value.userName);
    console.log('userPhone:', formData.value.userPhone);
    console.log('userEmail:', formData.value.userEmail);
    console.log('userWechat:', formData.value.userWechat);
    console.log('userProfile:', formData.value.userProfile);
    console.log('userGender:', formData.value.userGender);
    console.log('userBirthday:', formData.value.userBirthday);
    console.log('userLocation:', formData.value.userLocation);
  }, 2000);
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
  align-items: center;
  gap: 10px;
  justify-content: space-between;
  width: 100%;
}

.avatar-uploader {
  margin-left: 10px;
}

.avatar-button {
  border: none;
  color: #1989fa;
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