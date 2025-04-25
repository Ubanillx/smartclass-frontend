<template>
  <div class="task-plans-page">
    <back-button title="学习任务" />

    <div class="task-plans-container">
      <!-- 任务统计概览 -->
      <div class="task-stats">
        <div class="stat-item">
          <div class="stat-number">{{ pendingTasks.length }}</div>
          <div class="stat-label">待完成</div>
        </div>
        <div class="stat-item">
          <div class="stat-number">{{ completedTasks.length }}</div>
          <div class="stat-label">已完成</div>
        </div>
        <div class="stat-item">
          <div class="stat-number">{{ highPriorityTasks.length }}</div>
          <div class="stat-label">高优先级</div>
        </div>
      </div>

      <!-- 任务筛选 -->
      <div class="task-filters">
        <div
          v-for="filter in filterOptions"
          :key="filter.value"
          class="filter-option"
          :class="{ active: activeFilter === filter.value }"
          @click="activeFilter = filter.value"
        >
          {{ filter.label }}
        </div>
      </div>

      <!-- 任务列表 -->
      <div class="task-list">
        <van-empty v-if="filteredTasks.length === 0" description="暂无任务" />

        <div
          v-else
          v-for="task in filteredTasks"
          :key="task.id"
          class="task-card"
        >
          <div class="task-card-left">
            <div class="task-checkbox">
              <van-checkbox
                :checked="task.completed"
                @update:checked="toggleTaskStatus(task)"
                :icon-size="20"
              />
            </div>
          </div>

          <div
            class="task-card-content"
            @click="openTaskDetails(task)"
            :class="{ completed: task.completed }"
          >
            <div class="task-header">
              <div class="task-title">{{ task.title }}</div>
              <div :class="['task-priority', `priority-${task.priority}`]">
                {{ getPriorityText(task.priority) }}
              </div>
            </div>

            <div class="task-course">
              <span
                class="course-tag"
                :style="{ backgroundColor: task.color }"
                >{{ task.courseName }}</span
              >
            </div>

            <div class="task-description">{{ task.description }}</div>

            <div class="task-footer">
              <div class="task-dates">
                <van-icon name="clock-o" />
                <span>{{ formatDateRange(task.startDate, task.endDate) }}</span>
              </div>

              <div class="task-progress">
                <div class="progress-text">{{ task.progress }}%</div>
                <van-progress
                  :percentage="task.progress"
                  :color="getProgressColor(task)"
                  :show-pivot="false"
                  :stroke-width="3"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 添加任务按钮 -->
    <van-button
      class="add-task-btn"
      type="primary"
      icon="plus"
      round
      @click="showTaskForm = true"
    />

    <!-- 任务详情弹窗 -->
    <van-popup
      v-model:show="showTaskDetails"
      round
      position="bottom"
      :style="{ height: '60%' }"
    >
      <div v-if="selectedTask" class="task-details-popup">
        <div class="popup-header">
          <span class="popup-title">任务详情</span>
          <van-icon name="cross" @click="showTaskDetails = false" />
        </div>

        <div class="task-details-content">
          <div
            class="task-details-header"
            :style="{ backgroundColor: selectedTask.color }"
          >
            <h3>{{ selectedTask.title }}</h3>
            <div
              :class="[
                'task-priority-badge',
                `priority-${selectedTask.priority}`,
              ]"
            >
              {{ getPriorityText(selectedTask.priority) }}
            </div>
          </div>

          <div class="task-details-info">
            <div class="details-item">
              <div class="item-label">所属课程</div>
              <div class="item-value">{{ selectedTask.courseName }}</div>
            </div>

            <div class="details-item">
              <div class="item-label">任务时间</div>
              <div class="item-value">
                {{
                  formatDateRange(selectedTask.startDate, selectedTask.endDate)
                }}
              </div>
            </div>

            <div class="details-item">
              <div class="item-label">任务说明</div>
              <div class="item-value description">
                {{ selectedTask.description }}
              </div>
            </div>

            <div class="details-item">
              <div class="item-label">完成进度</div>
              <div class="progress-bar-container">
                <div class="progress-value">{{ selectedTask.progress }}%</div>
                <van-progress
                  :percentage="selectedTask.progress"
                  :color="getProgressColor(selectedTask)"
                  :stroke-width="4"
                />
              </div>
            </div>
          </div>

          <div class="task-action-buttons">
            <van-button
              block
              :type="selectedTask.completed ? 'default' : 'primary'"
              @click="toggleTaskStatus(selectedTask)"
            >
              {{ selectedTask.completed ? '标记为未完成' : '标记为已完成' }}
            </van-button>
          </div>
        </div>
      </div>
    </van-popup>

    <!-- 添加任务表单 -->
    <van-popup
      v-model:show="showTaskForm"
      position="bottom"
      :style="{ height: '70%' }"
      round
    >
      <div class="task-form">
        <div class="popup-header">
          <span class="popup-title">添加任务</span>
          <van-icon name="cross" @click="showTaskForm = false" />
        </div>

        <van-form @submit="onSubmitTask">
          <van-cell-group inset>
            <van-field
              v-model="newTask.title"
              name="title"
              label="任务标题"
              placeholder="请输入任务标题"
              :rules="[{ required: true, message: '请输入任务标题' }]"
            />

            <van-field
              v-model="newTask.description"
              name="description"
              label="任务描述"
              type="textarea"
              rows="3"
              placeholder="请输入任务描述"
            />

            <van-field
              readonly
              name="course"
              label="所属课程"
              placeholder="请选择所属课程"
              :value="newTask.courseName"
              @click="showCoursePopup = true"
              :rules="[{ required: true, message: '请选择所属课程' }]"
            />

            <van-field
              readonly
              name="dateRange"
              label="任务时间"
              placeholder="请选择任务起止时间"
              :value="dateRangeDisplay"
              @click="showDatePicker = true"
              :rules="[{ required: true, message: '请选择任务起止时间' }]"
            />

            <van-field name="priority" label="优先级">
              <template #input>
                <van-radio-group
                  v-model="newTask.priority"
                  direction="horizontal"
                >
                  <van-radio name="high">高</van-radio>
                  <van-radio name="medium">中</van-radio>
                  <van-radio name="low">低</van-radio>
                </van-radio-group>
              </template>
            </van-field>
          </van-cell-group>

          <div style="margin: 16px">
            <van-button round block type="primary" native-type="submit">
              添加任务
            </van-button>
          </div>
        </van-form>
      </div>
    </van-popup>

    <!-- 课程选择弹窗 -->
    <van-popup v-model:show="showCoursePopup" position="bottom" round>
      <van-picker
        title="选择课程"
        :columns="courseOptions"
        @confirm="onSelectCourse"
        @cancel="showCoursePopup = false"
        show-toolbar
      />
    </van-popup>

    <!-- 日期选择弹窗 -->
    <van-popup v-model:show="showDatePicker" position="bottom" round>
      <van-date-picker
        title="选择日期范围"
        :min-date="new Date()"
        :max-date="
          new Date(new Date().setFullYear(new Date().getFullYear() + 1))
        "
        @confirm="onSelectDateRange"
        @cancel="showDatePicker = false"
        show-toolbar
        type="range"
      />
    </van-popup>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { showToast } from 'vant';
import { BackButton } from '../components/Common';
import { TaskPlan, getAllTaskPlans, mockPopularCourses } from '../api/mock';
import dayjs from 'dayjs';

const router = useRouter();
const tasks = ref<TaskPlan[]>([]);
const selectedTask = ref<TaskPlan | null>(null);
const showTaskDetails = ref(false);
const showTaskForm = ref(false);
const showCoursePopup = ref(false);
const showDatePicker = ref(false);

// 过滤选项
const activeFilter = ref('all');
const filterOptions = [
  { label: '全部', value: 'all' },
  { label: '进行中', value: 'pending' },
  { label: '已完成', value: 'completed' },
  { label: '高优先级', value: 'high' },
];

// 新任务表单数据
const newTask = ref({
  title: '',
  description: '',
  courseId: 0,
  courseName: '',
  startDate: '',
  endDate: '',
  priority: 'medium' as 'high' | 'medium' | 'low',
  color: '',
});

// 课程选项
const courseOptions = computed(() => {
  return mockPopularCourses.map((course) => ({
    text: course.title,
    value: course.id,
    color: course.tagColor,
  }));
});

// 日期范围显示
const dateRangeDisplay = computed(() => {
  if (newTask.value.startDate && newTask.value.endDate) {
    return `${newTask.value.startDate} 至 ${newTask.value.endDate}`;
  }
  return '';
});

// 获取任务列表
onMounted(() => {
  tasks.value = getAllTaskPlans();
});

// 筛选任务
const pendingTasks = computed(() => {
  return tasks.value.filter((task) => !task.completed);
});

const completedTasks = computed(() => {
  return tasks.value.filter((task) => task.completed);
});

const highPriorityTasks = computed(() => {
  return tasks.value.filter((task) => task.priority === 'high');
});

const filteredTasks = computed(() => {
  switch (activeFilter.value) {
    case 'pending':
      return pendingTasks.value;
    case 'completed':
      return completedTasks.value;
    case 'high':
      return highPriorityTasks.value;
    default:
      return tasks.value;
  }
});

// 切换任务状态
const toggleTaskStatus = (task: TaskPlan) => {
  task.completed = !task.completed;
  if (task.completed) {
    task.progress = 100;
    showToast('任务已完成');
  } else {
    if (task.progress === 100) {
      task.progress = 80;
    }
    showToast('已取消完成状态');
  }
};

// 打开任务详情
const openTaskDetails = (task: TaskPlan) => {
  selectedTask.value = task;
  showTaskDetails.value = true;
};

// 格式化日期范围
const formatDateRange = (start: string, end: string) => {
  return `${start} 至 ${end}`;
};

// 获取优先级文本
const getPriorityText = (priority: string): string => {
  switch (priority) {
    case 'high':
      return '高';
    case 'medium':
      return '中';
    case 'low':
      return '低';
    default:
      return '中';
  }
};

// 获取进度条颜色
const getProgressColor = (task: TaskPlan): string => {
  if (task.completed) {
    return '#07c160';
  }

  if (task.priority === 'high') {
    return '#ee0a24';
  } else if (task.priority === 'medium') {
    return '#1989fa';
  } else {
    return '#ff976a';
  }
};

// 选择课程
const onSelectCourse = (course: {
  text: string;
  value: number;
  color: string;
}) => {
  newTask.value.courseId = course.value;
  newTask.value.courseName = course.text;
  newTask.value.color = course.color;
  showCoursePopup.value = false;
};

// 选择日期范围
const onSelectDateRange = (values: Date[]) => {
  const [startDate, endDate] = values;
  newTask.value.startDate = dayjs(startDate).format('YYYY-MM-DD');
  newTask.value.endDate = dayjs(endDate).format('YYYY-MM-DD');
  showDatePicker.value = false;
};

// 提交任务表单
const onSubmitTask = () => {
  if (
    !newTask.value.courseId ||
    !newTask.value.startDate ||
    !newTask.value.endDate
  ) {
    showToast('请完善任务信息');
    return;
  }

  // 创建新任务对象
  const newTaskObj: TaskPlan = {
    id: tasks.value.length + 1,
    title: newTask.value.title,
    description: newTask.value.description,
    courseId: newTask.value.courseId,
    courseName: newTask.value.courseName,
    startDate: newTask.value.startDate,
    endDate: newTask.value.endDate,
    completed: false,
    progress: 0,
    priority: newTask.value.priority,
    color: newTask.value.color,
  };

  // 添加到任务列表
  tasks.value.unshift(newTaskObj);

  // 重置表单
  newTask.value = {
    title: '',
    description: '',
    courseId: 0,
    courseName: '',
    startDate: '',
    endDate: '',
    priority: 'medium',
    color: '',
  };

  showTaskForm.value = false;
  showToast('任务已添加');
};
</script>

<style scoped>
.task-plans-page {
  background-color: #f8f8f8;
  min-height: 100vh;
  padding-bottom: 80px;
  box-sizing: border-box;
  position: relative;
}

.task-plans-container {
  padding: 16px;
}

.task-stats {
  display: flex;
  margin-bottom: 16px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  overflow: hidden;
}

.stat-item {
  flex: 1;
  text-align: center;
  padding: 16px 0;
}

.stat-number {
  font-size: 24px;
  font-weight: bold;
  color: #1989fa;
  margin-bottom: 4px;
}

.stat-label {
  font-size: 12px;
  color: #666;
}

.task-filters {
  display: flex;
  overflow-x: auto;
  margin-bottom: 16px;
  padding: 4px 0;
  -webkit-overflow-scrolling: touch;
}

.filter-option {
  padding: 8px 16px;
  margin-right: 8px;
  background-color: white;
  border-radius: 16px;
  font-size: 14px;
  color: #666;
  white-space: nowrap;
  border: 1px solid #eee;
}

.filter-option.active {
  background-color: #1989fa;
  color: white;
  border-color: #1989fa;
}

.task-list {
  margin-bottom: 16px;
}

.task-card {
  display: flex;
  background-color: white;
  border-radius: 8px;
  margin-bottom: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  overflow: hidden;
}

.task-card-left {
  padding: 12px;
  display: flex;
  align-items: center;
}

.task-card-content {
  flex: 1;
  padding: 12px 12px 12px 0;
  overflow: hidden;
}

.task-card-content.completed {
  opacity: 0.6;
}

.task-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.task-title {
  font-weight: bold;
  font-size: 16px;
  color: #333;
}

.task-priority {
  padding: 2px 6px;
  font-size: 12px;
  border-radius: 4px;
  color: white;
}

.priority-high {
  background-color: #ee0a24;
}

.priority-medium {
  background-color: #1989fa;
}

.priority-low {
  background-color: #ff976a;
}

.task-course {
  margin-bottom: 8px;
}

.course-tag {
  display: inline-block;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 12px;
  color: white;
}

.task-description {
  font-size: 14px;
  color: #666;
  margin-bottom: 8px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.task-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 12px;
  color: #999;
}

.task-dates {
  display: flex;
  align-items: center;
}

.task-dates .van-icon {
  margin-right: 4px;
}

.task-progress {
  width: 100px;
}

.progress-text {
  text-align: right;
  margin-bottom: 2px;
  font-size: 10px;
}

.add-task-btn {
  position: fixed;
  right: 16px;
  bottom: 16px;
  width: 56px;
  height: 56px;
  padding: 0;
  border-radius: 28px;
  font-size: 24px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.add-task-btn .van-icon {
  margin: 0;
}

.popup-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid #eee;
}

.popup-title {
  font-size: 16px;
  font-weight: bold;
}

.task-details-popup {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.task-details-content {
  flex: 1;
  overflow-y: auto;
}

.task-details-header {
  padding: 20px 16px;
  color: white;
}

.task-details-header h3 {
  margin: 0 0 8px 0;
  font-size: 18px;
}

.task-priority-badge {
  display: inline-block;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 12px;
  color: white;
  background-color: rgba(255, 255, 255, 0.3);
}

.task-details-info {
  padding: 16px;
}

.details-item {
  margin-bottom: 16px;
}

.item-label {
  font-size: 14px;
  color: #999;
  margin-bottom: 4px;
}

.item-value {
  font-size: 16px;
  color: #333;
}

.item-value.description {
  font-size: 14px;
  line-height: 1.5;
  white-space: pre-line;
}

.progress-bar-container {
  padding-top: 8px;
}

.progress-value {
  text-align: right;
  margin-bottom: 4px;
  font-size: 12px;
  color: #666;
}

.task-action-buttons {
  padding: 16px;
  border-top: 1px solid #f5f5f5;
}

.task-form {
  height: 100%;
  display: flex;
  flex-direction: column;
}

:deep(.van-field) {
  padding: 12px 16px;
}

:deep(.van-radio) {
  margin-right: 16px;
}
</style>
