<template>
  <div class="settings">
    <!-- 返回按钮 -->
    <div class="back-button" @click="router.back()">
      <van-icon name="arrow-left" size="18" />
      <span class="page-title">设置</span>
    </div>

    <!-- 个人资料设置 -->
    <van-cell-group inset class="setting-group">
      <van-cell title="个人资料" is-link @click="router.push('/settings/profile')">
        <template #label>
          <span class="setting-label">修改头像、用户名等基本信息</span>
        </template>
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
      <van-cell title="关于我们" is-link @click="router.push('/settings/about')" />
      <van-cell title="用户协议" is-link @click="router.push('/settings/terms')" />
      <van-cell title="隐私政策" is-link @click="router.push('/settings/privacy')" />
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
        :columns="timeColumns"
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

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { showToast } from 'vant';
import { useSettingsStore } from '../stores/settingsStore';

const router = useRouter();
const settingsStore = useSettingsStore();

// 学习设置
const learningSettings = ref({
  dailyGoal: 30,
  reminderTime: '09:00',
  difficulty: '中等'
});

// 通知设置
const notificationSettings = ref({
  push: true,
  dailyWord: true,
  progress: true
});

// 选择器控制
const showGoalPicker = ref(false);
const showReminderPicker = ref(false);
const showDifficultyPicker = ref(false);
const showFontSizePicker = ref(false);

// 选项数据
const goalOptions = [15, 30, 45, 60, 90, 120].map(min => ({
  text: `${min}分钟/天`,
  value: min
}));
const difficultyOptions = ['初级', '中等', '高级'].map(difficulty => ({
  text: difficulty,
  value: difficulty
}));

// 字体大小选项
const fontSizeOptions = [
  { text: '小', value: 'small' },
  { text: '中', value: 'medium' },
  { text: '大', value: 'large' }
];

// 获取字体大小显示标签
const getFontSizeLabel = (size) => {
  const option = fontSizeOptions.find(opt => opt.value === size);
  return option ? option.text : '中';
};

// 时间选择器列数据
const timeColumns = [
  {
    values: Array.from({ length: 17 }, (_, i) => 6 + i).map(hour => hour.toString().padStart(2, '0')),
    className: 'column1'
  },
  {
    values: Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, '0')),
    className: 'column2'
  }
];

// 当前选择的时间
const selectedHour = ref('09');
const selectedMinute = ref('00');

// 默认时间索引
const defaultTimeIndex = computed(() => [
  timeColumns[0].values.indexOf(selectedHour.value),
  timeColumns[1].values.indexOf(selectedMinute.value)
]);

// 处理选择器确认
const onGoalConfirm = (value) => {
  learningSettings.value.dailyGoal = parseInt(value.selectedValues[0]);
  showGoalPicker.value = false;
  showToast('设置已保存');
};

const onReminderConfirm = (value) => {
  const formattedTime = `${value.selectedValues[0]}:${value.selectedValues[1]}`;
  learningSettings.value.reminderTime = formattedTime;
  showReminderPicker.value = false;
  showToast('设置已保存');
};

const onDifficultyConfirm = (value) => {
  learningSettings.value.difficulty = value.selectedValues[0];
  showDifficultyPicker.value = false;
  showToast('设置已保存');
};

const onFontSizeConfirm = (value) => {
  settingsStore.setFontSize(value.selectedValues[0]);
  showFontSizePicker.value = false;
  showToast('字体大小已更新');
};

// 清除缓存
const clearCache = async () => {
  showToast('缓存已清除');
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