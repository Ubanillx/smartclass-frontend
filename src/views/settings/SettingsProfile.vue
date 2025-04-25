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
              :src="formData.userAvatar || userStore.DEFAULT_USER_AVATAR"
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
        v-model="formData.userAccount"
        name="userAccount"
        label="账号"
        readonly
        placeholder="暂无账号"
      />

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
      <van-date-picker
        title="选择生日"
        :min-date="minDate"
        :max-date="maxDate"
        @confirm="onDateConfirm"
        @cancel="showDatePicker = false"
        show-toolbar
      />
    </van-popup>

    <!-- 地址选择器 -->
    <van-popup v-model:show="showAddressPicker" position="bottom" round>
      <van-area
        :area-list="areaList"
        title="选择地区"
        @confirm="onAddressConfirm"
        @cancel="showAddressPicker = false"
        show-toolbar
      />
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
import type { UploaderFileListItem } from 'vant';
import { areaList } from '@vant/area-data';
import { BackButton } from '../../components/Common';
import { UserControllerService } from '../../services/services/UserControllerService';
import { User } from '../../services/models/User';
import { UserUpdateMyRequest } from '../../services/models/UserUpdateMyRequest';
import { useUserStore } from '../../stores/userStore';

interface FormData {
  id?: number;
  userAccount?: string;
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

const router = useRouter();
const route = useRoute();
const userStore = useUserStore();

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
      formData.value.userAvatar = newAvatar as string;
      router.replace({ path: route.path });
    }
  },
);

// 监听路由参数，获取裁剪后的头像URL
watch(
  () => route.query.avatarUrl,
  (newAvatarUrl) => {
    if (newAvatarUrl) {
      formData.value.userAvatar = newAvatarUrl as string;
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
const onGenderConfirm = (value: any): void => {
  try {
    if (value && typeof value === 'object') {
      if (Array.isArray(value.selectedValues)) {
        const option = value.selectedOptions?.[0];
        if (option) {
          formData.value.userGender = option.value;
          displayGender.value = option.text;
        }
      } else if (value.value !== undefined) {
        const option = genderOptions.find((opt) => opt.value === value.value);
        if (option) {
          formData.value.userGender = option.value;
          displayGender.value = option.text;
        }
      } else if (value.text && value.value !== undefined) {
        formData.value.userGender = value.value;
        displayGender.value = value.text;
      }
    }
  } catch (error) {
    console.error('处理性别选择数据失败:', error);
  }

  showGenderPicker.value = false;
};

// 日期选择器
const showDatePicker = ref(false);
const minDate = new Date(1900, 0, 1);
const maxDate = new Date();

// 日期确认事件
const onDateConfirm = (value: any): void => {
  try {
    let date: Date | null = null;

    if (value instanceof Date) {
      date = value;
    } else if (value && typeof value === 'object') {
      if (value.selectedValues && Array.isArray(value.selectedValues)) {
        const [yearStr, monthStr, dayStr] = value.selectedValues;
        const year = parseInt(String(yearStr), 10);
        const month = parseInt(String(monthStr), 10) - 1;
        const day = parseInt(String(dayStr), 10);
        date = new Date(year, month, day);
      } else if (value.value instanceof Date) {
        date = value.value;
      }
    }

    if (date && !isNaN(date.getTime())) {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      formData.value.birthday = `${year}-${month}-${day}`;
    }
  } catch (error) {
    console.error('处理日期选择数据失败:', error);
  }

  showDatePicker.value = false;
};

// 格式化生日显示
const formatBirthday = (birthday: string): string => {
  if (!birthday) return '';

  try {
    if (birthday.includes('T')) {
      const date = new Date(birthday);
      if (!isNaN(date.getTime())) {
        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
      }
    }
    return birthday;
  } catch (e) {
    console.error('格式化生日失败:', e);
    return birthday;
  }
};

// 地址选择器
const showAddressPicker = ref(false);

// 获取地址文本显示
const getLocationText = (): string => {
  const parts = [];
  if (formData.value.province) parts.push(formData.value.province);
  if (formData.value.city) parts.push(formData.value.city);
  if (formData.value.district) parts.push(formData.value.district);
  return parts.join(' ');
};

// 地址确认事件
const onAddressConfirm = (value: any): void => {
  try {
    if (value && typeof value === 'object') {
      if (value.selectedOptions && Array.isArray(value.selectedOptions)) {
        const options = value.selectedOptions;
        formData.value.province = options[0]?.text || '';
        formData.value.city = options[1]?.text || '';
        formData.value.district = options[2]?.text || '';
      } else if (
        value.values &&
        Array.isArray(value.values) &&
        value.items &&
        Array.isArray(value.items)
      ) {
        const codes = value.values;
        const columns = value.items;

        const findTextByCode = (code: string, options: any[]) => {
          const option = options.find((opt) => opt.value === code);
          return option ? option.text : '';
        };

        if (codes.length >= 3 && columns.length >= 3) {
          formData.value.province = findTextByCode(codes[0], columns[0]);
          formData.value.city = findTextByCode(codes[1], columns[1]);
          formData.value.district = findTextByCode(codes[2], columns[2]);
        }
      }
    }
  } catch (error) {
    console.error('处理地址选择数据失败:', error);
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
    const userStore = useUserStore();
    const userId = userStore.userInfo?.id;

    if (!userId) {
      try {
        const userInfoStr = localStorage.getItem('userInfo');
        if (userInfoStr) {
          const userInfo = JSON.parse(userInfoStr);
          if (userInfo && userInfo.id) {
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
    const response = await UserControllerService.getUserByIdUsingGet(userId);

    if (response.code === 0 && response.data) {
      const user: User = response.data;

      formData.value = {
        id: user.id,
        userAccount: user.userAccount || '',
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

      if (formData.value.userGender !== undefined) {
        displayGender.value = getGenderText(formData.value.userGender);
      }

      if (formData.value.birthday) {
        try {
          if (formData.value.birthday.includes('T')) {
            const dateObj = new Date(formData.value.birthday);
            if (!isNaN(dateObj.getTime())) {
              const year = String(dateObj.getFullYear());
              const month = String(dateObj.getMonth() + 1).padStart(2, '0');
              const day = String(dateObj.getDate()).padStart(2, '0');
              formData.value.birthday = `${year}-${month}-${day}`;
            }
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

    const response =
      await UserControllerService.updateMyUserUsingPost(updateData);

    if (response.code === 0 && response.data) {
      showSuccessToast('个人资料保存成功');
      fetchUserProfile();
    } else if (response.code === 40100) {
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
