<template>
  <div class="today-goals">
    <div class="goals-header">
      <h3 class="section-title">今日学习目标</h3>
      <div class="add-goal-button" @click="showAddGoalPopup">
        <svg class="add-icon" viewBox="0 0 24 24" width="22" height="22">
          <path
            fill="currentColor"
            d="M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z"
          />
        </svg>
      </div>
    </div>
    <div class="progress-container">
      <van-progress
        :percentage="progress"
        :show-pivot="false"
        color="#1989fa"
        :stroke-width="8"
      />
    </div>
    <div class="goal-items">
      <div
        class="goal-item"
        :class="{ completed: goal.completed }"
        v-for="goal in goals"
        :key="goal.id"
      >
        <van-icon
          :name="goal.completed ? 'checked' : 'circle'"
          @click="toggleGoalStatus(goal)"
        />
        <span>{{ goal.text }}</span>
      </div>
    </div>
  </div>

  <!-- 添加目标弹出层 -->
  <van-popup
    v-model:show="showPopup"
    position="bottom"
    round
    class="add-goal-popup"
  >
    <div class="popup-header">
      <div class="popup-title">添加学习目标</div>
      <van-icon name="cross" class="close-icon" @click="showPopup = false" />
    </div>
    <div class="popup-content">
      <van-field
        v-model="newGoalText"
        placeholder="请输入学习目标"
        maxlength="50"
        show-word-limit
      />
      <div class="popup-buttons">
        <van-button
          block
          type="primary"
          class="add-button"
          :disabled="!newGoalText.trim()"
          @click="addNewGoal"
        >
          添加
        </van-button>
      </div>
    </div>
  </van-popup>
</template>

<script setup lang="ts">
import { ref } from 'vue';

interface Goal {
  id: number;
  text: string;
  completed: boolean;
}

defineProps<{
  progress: number;
  goals: Goal[];
}>();

const emit = defineEmits<{
  (e: 'add-goal', goal: string): void;
  (e: 'toggle-goal', goalId: number): void;
}>();

// 弹出层控制
const showPopup = ref(false);
const newGoalText = ref('');

// 显示添加目标弹出层
const showAddGoalPopup = () => {
  showPopup.value = true;
  newGoalText.value = '';
};

// 添加新目标
const addNewGoal = () => {
  if (newGoalText.value.trim()) {
    emit('add-goal', newGoalText.value.trim());
    showPopup.value = false;
    newGoalText.value = '';
  }
};

// 切换目标完成状态
const toggleGoalStatus = (goal: Goal) => {
  emit('toggle-goal', goal.id);
};
</script>

<style scoped>
.today-goals {
  margin-bottom: 12px;
  border-radius: 12px;
  overflow: hidden;
  background-color: #ffffff;
  box-shadow: 0 2px 12px rgba(100, 101, 102, 0.08);
  padding: 16px;
}

.goals-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  position: relative;
}

.section-title {
  font-weight: 600;
  font-family: 'Noto Sans SC', sans-serif;
  font-size: var(--font-size-md);
  color: #323233;
  margin: 0;
}

.progress-container {
  margin-bottom: 12px;
}

.goal-items {
  padding: 0;
}

.goal-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 0;
  color: #323233;
  font-size: var(--font-size-base);
  transition: all 0.3s ease;
  position: relative;
  line-height: 24px;
}

.goal-item .van-icon {
  font-size: 20px;
  cursor: pointer;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
}

.goal-item span {
  flex: 1;
  padding-top: 1px;
}

.goal-item.completed {
  color: #1989fa;
}

.goal-item.completed .van-icon {
  color: #1989fa;
  background-color: rgba(25, 137, 250, 0.1);
  border-radius: 50%;
}

.add-goal-button {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: #1989fa;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(25, 137, 250, 0.3);
  color: white;
}

.add-goal-button:hover {
  background-color: #1675db;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(25, 137, 250, 0.4);
}

.add-goal-button:active {
  transform: scale(0.95) translateY(0);
  box-shadow: 0 2px 4px rgba(25, 137, 250, 0.3);
}

.add-icon {
  width: 22px;
  height: 22px;
}

:deep(.van-cell__title) {
  font-weight: 600;
  font-size: var(--font-size-md);
  color: #323233;
}

:deep(.van-progress) {
  margin-top: 6px;
}

:deep(.van-progress__pivot) {
  background-color: #1989fa;
  color: #ffffff;
  font-weight: 500;
}

:deep(.van-cell) {
  padding: 10px 0 !important;
  border-radius: 0 !important;
  background-color: transparent !important;
  margin: 0 !important;
}

:deep(.van-cell:hover) {
  background-color: transparent !important;
}

:deep(.van-cell::after) {
  display: none !important;
}

/* 弹出层样式 */
.add-goal-popup {
  height: auto;
  max-height: 40%;
}

.popup-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid #f5f5f5;
}

.popup-title {
  font-size: var(--font-size-md);
  font-weight: 600;
  color: #323233;
}

.close-icon {
  font-size: var(--font-size-lg);
  color: #969799;
  cursor: pointer;
}

.popup-content {
  padding: 16px;
}

.popup-buttons {
  margin-top: 16px;
}

.add-button {
  height: 40px;
  border-radius: 8px;
}
</style>
