<template>
  <div class="course-schedule">
    <div class="schedule-header">
      <div class="week-navigator">
        <span @click="prevWeek">上一周</span>
        <span class="current-week">{{ currentWeekText }}</span>
        <span @click="nextWeek">下一周</span>
      </div>
    </div>

    <div class="schedule-grid">
      <!-- 时间轴 -->
      <div class="time-column">
        <div class="weekday-header"></div>
        <div class="time-slot" v-for="time in timeSlots" :key="time">
          {{ time }}
        </div>
      </div>

      <!-- 每天的课程列 -->
      <div v-for="day in weekdays" :key="day.value" class="day-column">
        <div class="weekday-header">{{ day.text }}</div>
        
        <!-- 课程卡片 -->
        <div class="course-slots">
          <div 
            v-for="course in getDayCourses(day.value)" 
            :key="course.id" 
            class="course-card"
            :style="{
              top: getTopPosition(course),
              height: getHeight(course),
              backgroundColor: course.color
            }"
            @click="showCourseDetails(course)"
          >
            <div class="course-title">{{ course.title }}</div>
            <div class="course-info">{{ course.startTime }}-{{ course.endTime }}</div>
            <div class="course-info">{{ course.classroom }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 课程详情弹出层 -->
    <van-popup v-model:show="showDetails" round position="bottom" :style="{ height: '40%' }">
      <div v-if="selectedCourse" class="course-details">
        <div class="details-header" :style="{ backgroundColor: selectedCourse.color }">
          <h3>{{ selectedCourse.title }}</h3>
          <p>{{ selectedCourse.subject }}</p>
        </div>
        <div class="details-content">
          <div class="details-item">
            <van-icon name="clock-o" />
            <span>{{ selectedCourse.startTime }} - {{ selectedCourse.endTime }}</span>
          </div>
          <div class="details-item">
            <van-icon name="location-o" />
            <span>{{ selectedCourse.classroom }}</span>
          </div>
          <div class="details-item">
            <van-icon name="manager-o" />
            <span>{{ selectedCourse.teacher }}</span>
          </div>
        </div>
        <div class="details-actions">
          <van-button type="primary" block @click="startLearning">开始学习</van-button>
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, defineEmits } from 'vue';
import { useRouter } from 'vue-router';
import { showToast } from 'vant';
import { ScheduleCourse, getWeekSchedule } from '../../api/mock';

const router = useRouter();
const currentWeek = ref(0); // 0表示当前周
const showDetails = ref(false);
const selectedCourse = ref<ScheduleCourse | null>(null);

// 定义关闭事件
const emit = defineEmits<{
  (e: 'close'): void;
}>();

// 时间段
const timeSlots = [
  '08:00',
  '09:00',
  '10:00',
  '11:00',
  '12:00',
  '13:00',
  '14:00',
  '15:00',
  '16:00',
  '17:00'
];

// 一周的天数
const weekdays = [
  { text: '周一', value: 1 },
  { text: '周二', value: 2 },
  { text: '周三', value: 3 },
  { text: '周四', value: 4 },
  { text: '周五', value: 5 }
];

// 计算当前周文本
const currentWeekText = computed(() => {
  if (currentWeek.value === 0) {
    return '本周';
  } else if (currentWeek.value < 0) {
    return `前${Math.abs(currentWeek.value)}周`;
  } else {
    return `后${currentWeek.value}周`;
  }
});

// 获取一周的课程表
const schedule = computed(() => {
  // 实际项目中可以根据currentWeek来请求不同周的数据
  return getWeekSchedule();
});

// 获取指定日期的课程
const getDayCourses = (day: number) => {
  return schedule.value.filter(course => course.day === day);
};

// 计算课程卡片的顶部位置
const getTopPosition = (course: ScheduleCourse) => {
  // 假设每小时高度为100px，8:00为起始时间
  const startHour = parseInt(course.startTime);
  const startMinute = parseInt(course.startTime.substring(3));
  
  // 计算相对于08:00的分钟数
  const minutesFromStart = (startHour - 8) * 60 + startMinute;
  
  // 转化为像素位置 (每分钟的高度 = 100px/60min)
  return `${minutesFromStart * (100/60)}px`;
};

// 计算课程卡片的高度
const getHeight = (course: ScheduleCourse) => {
  // 解析开始和结束时间
  const startHour = parseInt(course.startTime.substring(0, 2));
  const startMinute = parseInt(course.startTime.substring(3, 5));
  const endHour = parseInt(course.endTime.substring(0, 2));
  const endMinute = parseInt(course.endTime.substring(3, 5));
  
  // 计算总分钟数
  const durationMinutes = (endHour - startHour) * 60 + (endMinute - startMinute);
  
  // 转化为像素高度
  return `${durationMinutes * (100/60)}px`;
};

// 上一周
const prevWeek = () => {
  currentWeek.value--;
  // 在真实项目中，这里应该重新获取上一周的数据
};

// 下一周
const nextWeek = () => {
  currentWeek.value++;
  // 在真实项目中，这里应该重新获取下一周的数据
};

// 显示课程详情
const showCourseDetails = (course: ScheduleCourse) => {
  selectedCourse.value = course;
  showDetails.value = true;
};

// 开始学习
const startLearning = () => {
  showDetails.value = false;
  if (selectedCourse.value) {
    showToast('开始学习课程：' + selectedCourse.value.title);
    // 这里可以跳转到相应的学习页面
    // router.push(`/course-study/${selectedCourse.value.id}`);
  }
};
</script>

<style scoped>
.course-schedule {
  width: 100%;
  background-color: #fff;
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 16px;
}

.schedule-header {
  padding: 12px 16px;
  border-bottom: 1px solid #f2f2f2;
}

.week-navigator {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #f2f2f2;
  border-radius: 8px;
  padding: 8px 16px;
}

.week-navigator span {
  font-size: 14px;
  color: #333;
  cursor: pointer;
}

.week-navigator span:first-child,
.week-navigator span:last-child {
  color: #1989fa;
  font-weight: 500;
}

.current-week {
  font-size: 16px;
  font-weight: bold;
}

.schedule-grid {
  display: flex;
  position: relative;
  overflow-x: auto;
  min-height: 600px;
}

.time-column {
  width: 60px;
  flex-shrink: 0;
  text-align: center;
  border-right: 1px solid #f2f2f2;
}

.day-column {
  flex: 1;
  min-width: 100px;
  position: relative;
  border-right: 1px solid #f2f2f2;
}

.day-column:last-child {
  border-right: none;
}

.weekday-header {
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  background-color: #f8f8f8;
  border-bottom: 1px solid #f2f2f2;
}

.time-slot {
  height: 100px;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding-top: 4px;
  font-size: 12px;
  color: #999;
  border-bottom: 1px solid #f2f2f2;
}

.course-slots {
  position: relative;
  height: 100%;
}

.course-card {
  position: absolute;
  left: 4px;
  right: 4px;
  padding: 8px;
  border-radius: 6px;
  color: white;
  overflow: hidden;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s;
}

.course-card:hover {
  transform: scale(1.02);
  z-index: 10;
}

.course-title {
  font-weight: bold;
  margin-bottom: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.course-info {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.course-details {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.details-header {
  padding: 20px 16px;
  color: white;
}

.details-header h3 {
  margin: 0 0 8px 0;
  font-size: 18px;
}

.details-header p {
  margin: 0;
  font-size: 14px;
}

.details-content {
  flex: 1;
  padding: 16px;
}

.details-item {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
}

.details-item .van-icon {
  margin-right: 8px;
  color: #666;
}

.details-actions {
  padding: 16px;
  border-top: 1px solid #f2f2f2;
}
</style> 