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
              :src="
                formData.userAvatar ||
                'https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg'
              "
              fit="cover"
              @click="previewAvatar"
            />
            <van-uploader
              :after-read="onAvatarSelected"
              class="avatar-uploader"
              accept="image/*"
            >
              <van-button
                size="small"
                type="primary"
                plain
                class="avatar-button"
                >更换头像</van-button
              >
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
        :rules="[
          {
            pattern: /^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/,
            message: '请输入正确的邮箱',
          },
        ]"
      />

      <van-field
        v-model="formData.wechatId"
        name="wechatId"
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
        :model-value="
          formData.birthday ? formatBirthday(formData.birthday) : ''
        "
        name="birthday"
        label="生日"
        readonly
        is-link
        placeholder="请选择生日"
        @click="showDatePicker = true"
      />

      <van-field
        :model-value="getLocationText()"
        name="location"
        label="所在地"
        readonly
        is-link
        placeholder="请选择所在地"
        @click="showAddressPicker = true"
      />
    </van-cell-group>

    <div class="button-container">
      <van-button
        round
        block
        type="primary"
        native-type="submit"
        @click="saveProfile"
        :loading="isSaving"
      >
        {{ isSaving ? '保存中...' : '保存' }}
      </van-button>
    </div>

    <!-- 性别选择器 -->
    <van-popup v-model:show="showGenderPicker" position="bottom" round>
      <van-picker
        title="选择性别"
        :columns="genderOptions"
        @confirm="onGenderConfirm"
        @cancel="showGenderPicker = false"
        show-toolbar
      />
    </van-popup>

    <!-- 日期选择器 -->
    <van-popup v-model:show="showDatePicker" position="bottom" round>
      <div class="date-picker-container">
        <div class="date-picker-header">
          <van-icon name="cross" @click="showDatePicker = false" />
          <div class="date-picker-title">选择生日</div>
          <van-button type="primary" size="small" @click="onDateConfirm"
            >确认</van-button
          >
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
    <van-popup v-model:show="showAddressPicker" position="bottom" round>
      <div class="area-picker-container">
        <div class="area-picker-header">
          <van-icon name="cross" @click="showAddressPicker = false" />
          <div class="area-picker-title">选择地区</div>
          <van-button type="primary" size="small" @click="onAddressConfirm"
            >确认</van-button
          >
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
import {
  showToast,
  showSuccessToast,
  showLoadingToast,
  showImagePreview,
} from 'vant';
import type { Area, UploaderFileListItem } from 'vant';
import { areaList } from '@vant/area-data';
import { BackButton } from '../../components/Common';
import { UserControllerService } from '../../services/services/UserControllerService';
import { FileControllerService } from '../../services/services/FileControllerService';
import { User } from '../../services/models/User';
import { UserUpdateMyRequest } from '../../services/models/UserUpdateMyRequest';
import { useUserStore } from '../../stores/userStore';

interface FormData {
  id?: number;
  userName: string;
  userAvatar: string;
  userPhone: string;
  userEmail: string;
  userProfile: string;
  userGender?: number;
  birthday?: string;
  wechatId?: string;
  province?: string;
  city?: string;
  district?: string;
}

interface PickerOption {
  selectedOptions: Array<{ text: string; value: any }>;
  selectedValues: any[];
  selectedIndexes: number[];
}

const router = useRouter();
const route = useRoute();

// 表单数据
const formData = ref<FormData>({
  userName: '',
  userAvatar: '',
  userPhone: '',
  userEmail: '',
  userProfile: '',
});

// 监听路由参数，获取裁剪后的头像
watch(
  () => route.query.avatar,
  (newAvatar) => {
    if (newAvatar) {
      console.log('接收到avatar参数:', newAvatar);
      formData.value.userAvatar = newAvatar as string;
      // 清除URL参数
      router.replace({ path: route.path });
    }
  },
);

// 监听路由参数，获取裁剪后的头像URL
watch(
  () => route.query.avatarUrl,
  (newAvatarUrl) => {
    if (newAvatarUrl) {
      console.log('接收到avatarUrl参数:', newAvatarUrl);
      formData.value.userAvatar = newAvatarUrl as string;
      // 清除URL参数
      router.replace({ path: route.path });
    }
  },
  { immediate: true },
);

// 性别选择器
const showGenderPicker = ref(false);
const genderOptions = [
  { text: '男', value: 0 },
  { text: '女', value: 1 },
  { text: '保密', value: 2 },
];

// 性别显示文本
const displayGender = ref('');

// 保存状态
const isSaving = ref(false);

// 根据性别值获取显示文本
const getGenderText = (gender?: number): string => {
  if (gender === undefined || gender === null) return '';
  const option = genderOptions.find((option) => option.value === gender);
  return option ? option.text : '';
};

// 性别确认事件
const onGenderConfirm = (option: { text: string; value: number }): void => {
  formData.value.userGender = option.value;
  displayGender.value = option.text;
  showGenderPicker.value = false;
};

// 日期选择器
const showDatePicker = ref(false);
const selectedDate = ref<string[]>([]);
const minDate = new Date(1900, 0, 1);
const maxDate = new Date();

// 生日确认事件
const onDateConfirm = (value: any): void => {
  selectedDate.value = value;
  const [year, month, day] = value;
  // 确保月份和日期是两位数
  const formattedMonth = month.padStart(2, '0');
  const formattedDay = day.padStart(2, '0');
  formData.value.birthday = `${year}-${formattedMonth}-${formattedDay}`;
  showDatePicker.value = false;
};

// 格式化生日显示
const formatBirthday = (birthday: string): string => {
  if (!birthday) return '';

  try {
    // 处理ISO 8601格式的日期
    if (birthday.includes('T')) {
      const date = new Date(birthday);
      if (!isNaN(date.getTime())) {
        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
      }
    }

    // 处理YYYY-MM-DD格式
    return birthday;
  } catch (e) {
    console.error('格式化生日失败:', e);
    return birthday;
  }
};

// 地址选择器
const showAddressPicker = ref(false);
const areaCode = ref('');
const areaRef = ref<any>(null);

// 获取地址文本显示
const getLocationText = (): string => {
  const parts = [];
  if (formData.value.province) parts.push(formData.value.province);
  if (formData.value.city) parts.push(formData.value.city);
  if (formData.value.district) parts.push(formData.value.district);
  return parts.join(' ');
};

// 地址确认事件
const onAddressConfirm = (): void => {
  if (areaRef.value) {
    try {
      // 获取当前选中的值
      const selectedValues = areaRef.value.getSelectedOptions();
      if (selectedValues && selectedValues.length > 0) {
        formData.value.province = selectedValues[0]?.text || '';
        formData.value.city = selectedValues[1]?.text || '';
        formData.value.district = selectedValues[2]?.text || '';
      }
    } catch (error) {
      console.error('获取地址选择数据失败:', error);
    }
  }
  showAddressPicker.value = false;
};

// 预览头像
const previewAvatar = (): void => {
  if (formData.value.userAvatar) {
    showImagePreview({
      images: [formData.value.userAvatar],
      showIndex: false,
    });
  }
};

// 处理头像选择
const onAvatarSelected = (
  file: UploaderFileListItem | UploaderFileListItem[],
): void => {
  if (!Array.isArray(file) && file.file) {
    const URL = window.URL || window.webkitURL;
    const imageUrl = URL.createObjectURL(file.file);
    // 跳转到裁剪页面
    router.push({
      path: '/settings/avatar-cropper',
      query: {
        imageUrl: encodeURIComponent(imageUrl),
      },
    });
  }
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
    // 使用UserControllerService.getUserByIdUsingGet获取用户信息
    const response = await UserControllerService.getUserByIdUsingGet(userId);
    console.log('获取用户信息响应:', response);

    if (response.code === 0 && response.data) {
      const user: User = response.data;
      console.log('获取到的用户信息:', user);

      // 映射用户数据到表单
      formData.value = {
        id: user.id,
        userName: user.userName || '',
        userAvatar: user.userAvatar || '',
        userPhone: user.userPhone || '',
        userEmail: user.userEmail || '',
        userProfile: user.userProfile || '',
        userGender: user.userGender,
        birthday: user.birthday,
        wechatId: user.wechatId,
        province: user.province,
        city: user.city,
        district: user.district,
      };

      // 设置性别显示文本
      if (formData.value.userGender !== undefined) {
        displayGender.value = getGenderText(formData.value.userGender);
      }

      // 如果有生日数据，初始化日期选择器
      if (formData.value.birthday) {
        try {
          let year, month, day;

          // 处理ISO 8601格式的日期
          if (formData.value.birthday.includes('T')) {
            const dateObj = new Date(formData.value.birthday);
            if (!isNaN(dateObj.getTime())) {
              year = String(dateObj.getFullYear());
              month = String(dateObj.getMonth() + 1).padStart(2, '0');
              day = String(dateObj.getDate()).padStart(2, '0');

              // 更新formData中的生日格式为YYYY-MM-DD
              formData.value.birthday = `${year}-${month}-${day}`;
            }
          } else {
            // 处理普通的YYYY-MM-DD格式
            const dateParts = formData.value.birthday.split('-');
            if (dateParts.length === 3) {
              [year, month, day] = dateParts;
            }
          }

          if (year && month && day) {
            selectedDate.value = [year, month, day];
          }
        } catch (error) {
          console.error('初始化日期选择器失败:', error);
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
    // 构建符合UserUpdateMyRequest的数据结构
    const updateData: UserUpdateMyRequest = {
      userName: formData.value.userName,
      userAvatar: formData.value.userAvatar,
      userPhone: formData.value.userPhone,
      userEmail: formData.value.userEmail,
      userProfile: formData.value.userProfile,
      userGender: formData.value.userGender,
      birthday: formData.value.birthday,
      wechatId: formData.value.wechatId,
      province: formData.value.province,
      city: formData.value.city,
      district: formData.value.district,
    };

    console.log('准备更新的用户数据:', updateData);

    // 使用UserControllerService更新用户信息
    const response =
      await UserControllerService.updateMyUserUsingPost(updateData);

    if (response.code === 0 && response.data) {
      showSuccessToast('个人资料保存成功');
      // 重新获取最新的用户信息
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
});
</script>

<style scoped>
.profile-settings {
  min-height: 100vh;
  background: #f7f8fa;
  padding-bottom: 30px;
}

.profile-form {
  margin-top: 12px;
}

.button-container {
  margin: 20px 16px;
}

:deep(.van-button--primary) {
  background-color: #1989fa;
  border-color: #1989fa;
}

:deep(.van-button--round) {
  border-radius: 22px;
  height: 44px;
  line-height: 44px;
  font-size: 16px;
}

.avatar-container {
  display: flex;
  align-items: center;
  gap: 16px;
  width: auto;
}

.avatar-uploader {
  margin-left: 5px;
}

.avatar-button {
  padding: 0 12px;
  color: #1989fa;
  border-radius: 16px;
  font-size: 14px;
  background-color: transparent;
  border: 1px solid #1989fa;
  height: 28px;
  line-height: 26px;
}

:deep(.van-button--plain) {
  background: transparent;
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
  padding: 16px;
  border-bottom: 1px solid #ebedf0;
}

.area-picker-title,
.date-picker-title {
  font-weight: 500;
  font-size: 16px;
}

.area-picker-close,
.date-picker-close {
  font-size: 14px;
  color: #1989fa;
}

.area-picker-content,
.date-picker-content {
  flex: 1;
  overflow: hidden;
}

:deep(.van-field__label) {
  color: #323233;
  font-weight: normal;
  width: 80px;
}

:deep(.van-cell__title) {
  flex: none;
  width: 80px;
}

:deep(.van-cell) {
  padding: 15px 16px;
  line-height: 24px;
  font-size: 14px;
}

:deep(.van-field__control) {
  color: #323233;
}

:deep(.van-cell-group--inset) {
  margin: 12px 16px;
  border-radius: 8px;
  overflow: hidden;
}

:deep(.van-field__word-limit) {
  margin-top: 4px;
  text-align: right;
  margin-right: 0;
  color: #969799;
}
</style>
