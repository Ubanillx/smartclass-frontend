<template>
  <div class="settings">
    <!-- 返回按钮 -->
    <back-button title="设置" />

    <!-- 个人资料设置 -->
    <van-cell-group inset class="setting-group">
      <van-cell
        title="个人资料"
        is-link
        @click="router.push('/settings/profile')"
      >
      </van-cell>
    </van-cell-group>

    <!-- 学习设置 -->
    <van-cell-group inset class="setting-group">
      <van-cell title="学习目标" is-link @click="showGoalPicker = true">
        <template #value>
          <span>{{ learningSettings.dailyGoal }}分钟/天</span>
        </template>
      </van-cell>
      <van-cell title="学习提醒" is-link @click="showReminderPicker = true">
        <template #value>
          <span>{{ learningSettings.reminderTime || '未设置' }}</span>
        </template>
      </van-cell>
      <van-cell title="难度偏好" is-link @click="showDifficultyPicker = true">
        <template #value>
          <span>{{ learningSettings.difficulty }}</span>
        </template>
      </van-cell>
      <van-cell title="字体大小" is-link @click="showFontSizePicker = true">
        <template #value>
          <span>{{ getFontSizeLabel(settingsStore.fontSize) }}</span>
        </template>
      </van-cell>
    </van-cell-group>

    <!-- 通知设置 -->
    <van-cell-group inset class="setting-group">
      <van-cell title="推送通知" center>
        <template #right-icon>
          <van-switch v-model="notificationSettings.push" size="24" />
        </template>
      </van-cell>
      <van-cell title="每日词汇提醒" center>
        <template #right-icon>
          <van-switch v-model="notificationSettings.dailyWord" size="24" />
        </template>
      </van-cell>
      <van-cell title="学习进度提醒" center>
        <template #right-icon>
          <van-switch v-model="notificationSettings.progress" size="24" />
        </template>
      </van-cell>
    </van-cell-group>

    <!-- 其他设置 -->
    <van-cell-group inset class="setting-group">
      <van-cell title="清除缓存" is-link @click="clearCache" />
      <van-cell
        title="关于我们"
        is-link
        @click="router.push('/settings/about')"
      />
      <van-cell
        title="用户协议"
        is-link
        @click="router.push('/settings/terms')"
      />
      <van-cell
        title="隐私政策"
        is-link
        @click="router.push('/settings/privacy')"
      />
    </van-cell-group>

    <!-- 学习目标选择器 -->
    <van-popup v-model:show="showGoalPicker" position="bottom">
      <van-picker
        :columns="goalOptions"
        @confirm="onGoalConfirm"
        @cancel="showGoalPicker = false"
        show-toolbar
        title="设置每日学习目标"
      />
    </van-popup>

    <!-- 提醒时间选择器 -->
    <van-popup v-model:show="showReminderPicker" position="bottom">
      <van-picker
        :columns="timeColumns.map((time) => ({ text: time, value: time }))"
        @confirm="onReminderConfirm"
        @cancel="showReminderPicker = false"
        show-toolbar
        title="设置提醒时间"
        :default-index="defaultTimeIndex"
      />
    </van-popup>

    <!-- 难度选择器 -->
    <van-popup v-model:show="showDifficultyPicker" position="bottom">
      <van-picker
        :columns="difficultyOptions"
        @confirm="onDifficultyConfirm"
        @cancel="showDifficultyPicker = false"
        show-toolbar
        title="设置难度偏好"
      />
    </van-popup>

    <!-- 字体大小选择器 -->
    <van-popup v-model:show="showFontSizePicker" position="bottom">
      <van-picker
        :columns="fontSizeOptions"
        @confirm="onFontSizeConfirm"
        @cancel="showFontSizePicker = false"
        show-toolbar
        title="设置字体大小"
      />
    </van-popup>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { showToast, showDialog } from 'vant';
import { useSettingsStore } from '../stores/settingsStore';
import { useSearchStore } from '../stores/searchStore';
import { useCollectedWordsStore } from '../stores/collectedWordsStore';
import { useUserStore } from '../stores/userStore';
import { BackButton } from '../components/Common';

const router = useRouter();
const settingsStore = useSettingsStore();

// 学习设置
const learningSettings = ref({
  dailyGoal: 30,
  reminderTime: '09:00',
  difficulty: '中等',
});

// 通知设置
const notificationSettings = ref({
  push: true,
  dailyWord: true,
  progress: true,
});

// 选择器控制
const showGoalPicker = ref(false);
const showReminderPicker = ref(false);
const showDifficultyPicker = ref(false);
const showFontSizePicker = ref(false);

// 选项数据
const goalOptions = [15, 30, 45, 60, 90, 120].map((min) => ({
  text: `${min}分钟/天`,
  value: min,
}));
const difficultyOptions = ['初级', '中等', '高级'].map((difficulty) => ({
  text: difficulty,
  value: difficulty,
}));

// 字体大小选项
const fontSizeOptions = [
  { text: '小', value: 'small' },
  { text: '中', value: 'medium' },
  { text: '大', value: 'large' },
];

// 获取字体大小显示标签
const getFontSizeLabel = (size: string): string => {
  const option = fontSizeOptions.find((opt) => opt.value === size);
  return option ? option.text : '中';
};

// 时间选择器列数据
const timeColumns = Array.from({ length: 17 }, (_, i) => {
  const hour = (6 + i).toString().padStart(2, '0');
  return Array.from({ length: 12 }, (_, j) => {
    const minute = (j * 5).toString().padStart(2, '0');
    return `${hour}:${minute}`;
  });
}).flat();

// 当前选择的时间
const selectedHour = ref('09');
const selectedMinute = ref('00');

// 默认时间索引
const defaultTimeIndex = computed(() => {
  const currentTime = `${selectedHour.value}:${selectedMinute.value}`;
  return timeColumns.indexOf(currentTime) !== -1
    ? timeColumns.indexOf(currentTime)
    : 0;
});

interface PickerOption {
  selectedOptions: Array<{ text: string; value: any }>;
  selectedValues: string[];
  selectedIndexes: number[];
}

// 处理选择器确认
const onGoalConfirm = (value: PickerOption): void => {
  learningSettings.value.dailyGoal = parseInt(
    value.selectedValues[0] as string,
  );
  showGoalPicker.value = false;
  showToast('设置已保存');
};

const onReminderConfirm = (value: PickerOption): void => {
  const formattedTime = value.selectedValues[0] as string;
  learningSettings.value.reminderTime = formattedTime;

  // 更新选中的小时和分钟值
  const [hour, minute] = formattedTime.split(':');
  if (hour && minute) {
    selectedHour.value = hour;
    selectedMinute.value = minute;
  }

  showReminderPicker.value = false;
  showToast('设置已保存');
};

const onDifficultyConfirm = (value: PickerOption): void => {
  learningSettings.value.difficulty = value.selectedValues[0] as string;
  showDifficultyPicker.value = false;
  showToast('设置已保存');
};

const onFontSizeConfirm = (value: PickerOption): void => {
  settingsStore.setFontSize(value.selectedValues[0] as string);
  showFontSizePicker.value = false;
  showToast('字体大小已更新');
};

// 清除缓存
const clearCache = async (): Promise<void> => {
  showDialog({
    title: '清除缓存',
    message: '确定要清除缓存吗？这将会清除除登录信息外的所有数据。',
    showCancelButton: true,
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    closeOnPopstate: true
  }).then(() => {
    // 清除localStorage中的数据（保留用户登录相关信息）
    const keysToKeep = ['isLoggedIn', 'userInfo'];
    const keysToRemove = [];
    
    // 获取所有localStorage的key
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && !keysToKeep.includes(key)) {
        keysToRemove.push(key);
      }
    }
    
    // 移除不需要保留的key
    keysToRemove.forEach(key => {
      localStorage.removeItem(key);
    });
    
    // 重置各个store（不包括userStore）
    const settingsStore = useSettingsStore();
    const searchStore = useSearchStore();
    const collectedWordsStore = useCollectedWordsStore();
    
    // 重置settingsStore中的字体大小为默认值
    settingsStore.setFontSize('medium');
    
    // 清空搜索历史
    searchStore.clearSearchHistory();
    
    // 清空收藏单词
    // 收藏单词存储使用的是ref数组，直接清空
    if (collectedWordsStore.collectedWords) {
      collectedWordsStore.collectedWords.length = 0;
    }

    // 重置学习设置和通知设置
    learningSettings.value = {
      dailyGoal: 30,
      reminderTime: '09:00',
      difficulty: '中等',
    };
    
    notificationSettings.value = {
      push: true,
      dailyWord: true,
      progress: true,
    };
    
    showToast({
      message: '缓存已清除，正在刷新页面...',
      duration: 1500,
      onClose: () => {
        // 刷新页面确保所有组件重新初始化
        window.location.reload();
      }
    });
  }).catch(() => {
    // 用户取消操作
  });
};
</script>

<style scoped>
.settings {
  min-height: 100vh;
  background: #f7f8fa;
  padding-bottom: 20px;
}

.setting-group {
  margin: 12px 0;
}

.setting-label {
  font-size: 12px;
  color: #969799;
}

:deep(.van-cell__value) {
  color: #969799;
}

:deep(.van-switch) {
  margin-left: 8px;
}
</style>
