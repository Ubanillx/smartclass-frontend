<template>
  <van-cell-group inset class="today-goals">
    <van-cell title="今日学习目标">
      <template #label>
        <van-progress 
          :percentage="progress" 
          :pivot-text="`${progress}%`"
          color="#1989fa"
        />
      </template>
    </van-cell>
    <div class="goal-items">
      <div 
        class="goal-item" 
        :class="{ completed: goal.completed }" 
        v-for="goal in goals" 
        :key="goal.id"
      >
        <van-icon :name="goal.completed ? 'checked' : 'circle'" />
        <span>{{ goal.text }}</span>
      </div>
    </div>
  </van-cell-group>
</template>

<script setup>
import { defineProps } from 'vue';

const props = defineProps({
  progress: {
    type: Number,
    required: true
  },
  goals: {
    type: Array,
    required: true
  }
});
</script>

<style scoped>
.today-goals {
  margin-bottom: 16px;
}

.goal-items {
  padding: 12px 16px;
}

.goal-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 0;
  color: #323233;
}

.goal-item.completed {
  color: #1989fa;
}

.goal-item .van-icon {
  font-size: 18px;
}
</style> 