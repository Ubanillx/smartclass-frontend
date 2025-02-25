<template>
  <div class="settings">
    <!-- 顶部导航栏 -->
    <van-nav-bar
      title="设置"
      left-arrow
      @click-left="router.back()"
    />

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
      <van-cell title="关于我们" is-link @click="router.push('/about')" />
      <van-cell title="用户协议" is-link @click="router.push('/terms')" />
      <van-cell title="隐私政策" is-link @click="router.push('/privacy')" />
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
      <van-datetime-picker
        type="time"
        title="设置提醒时间"
        :min-hour="6"
        :max-hour="22"
        @confirm="onReminderConfirm"
        @cancel="showReminderPicker = false"
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
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { showToast } from 'vant';

const router = useRouter();

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

// 选项数据
const goalOptions = [15, 30, 45, 60, 90, 120].map(min => `${min}分钟/天`);
const difficultyOptions = ['初级', '中等', '高级'];

// 处理选择器确认
const onGoalConfirm = (value) => {
  learningSettings.value.dailyGoal = parseInt(value);
  showGoalPicker.value = false;
  showToast('设置已保存');
};

const onReminderConfirm = (value) => {
  learningSettings.value.reminderTime = value;
  showReminderPicker.value = false;
  showToast('设置已保存');
};

const onDifficultyConfirm = (value) => {
  learningSettings.value.difficulty = value;
  showDifficultyPicker.value = false;
  showToast('设置已保存');
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
</style> 