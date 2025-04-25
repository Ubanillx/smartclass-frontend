<template>
  <div class="course-schedule-page">
    <back-button title="课程表" />

    <div class="course-schedule">
      <div class="schedule-header">
        <div class="week-navigator">
          <span @click="prevWeek" class="week-nav-btn">上一周</span>
          <span class="current-week">{{ currentWeekText }}</span>
          <span @click="nextWeek" class="week-nav-btn">下一周</span>
        </div>
      </div>

      <div class="schedule-container">
        <div class="schedule-grid" ref="scheduleGridRef">
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
                  backgroundColor: course.color,
                }"
                @click="showCourseDetails(course)"
              >
                <div class="course-title">{{ course.title }}</div>
                <div class="course-time">
                  {{ course.startTime }}-{{ course.endTime }}
                </div>
                <div class="course-info">{{ course.classroom }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 课程详情弹出层 -->
      <van-popup
        v-model:show="showDetails"
        round
        position="bottom"
        :style="{ height: '40%' }"
      >
        <div v-if="selectedCourse" class="course-details">
          <div
            class="details-header"
            :style="{ backgroundColor: selectedCourse.color }"
          >
            <h3>{{ selectedCourse.title }}</h3>
            <p>{{ selectedCourse.subject }}</p>
          </div>
          <div class="details-content">
            <div class="details-item">
              <van-icon name="clock-o" />
              <span
                >{{ selectedCourse.startTime }} -
                {{ selectedCourse.endTime }}</span
              >
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
            <van-button type="primary" block @click="startLearning"
              >开始学习</van-button
            >
          </div>
        </div>
      </van-popup>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { showToast } from 'vant';
import { ScheduleCourse, getWeekSchedule } from '../api/mock';
import { BackButton } from '../components/Common';

const router = useRouter();
const currentWeek = ref(0); // 0表示当前周
const showDetails = ref(false);
const selectedCourse = ref<ScheduleCourse | null>(null);
const scheduleGridRef = ref<HTMLElement | null>(null);
const gridHeight = ref(600); // 默认高度
const slotHeightPx = ref(100); // 默认时间槽高度

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
  '17:00',
];

// 一周的天数
const weekdays = [
  { text: '周一', value: 1 },
  { text: '周二', value: 2 },
  { text: '周三', value: 3 },
  { text: '周四', value: 4 },
  { text: '周五', value: 5 },
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
  return schedule.value.filter((course) => course.day === day);
};

// 计算课程卡片的顶部位置
const getTopPosition = (course: ScheduleCourse) => {
  // 根据时间计算课程卡片的顶部位置
  const startHour = parseInt(course.startTime.substring(0, 2));
  const startMinute = parseInt(course.startTime.substring(3, 5));

  // 计算相对于08:00的分钟数
  const minutesFromStart = (startHour - 8) * 60 + startMinute;

  // 转化为像素位置 (每分钟的高度 = slotHeightPx/60min)
  return `${minutesFromStart * (slotHeightPx.value / 60)}px`;
};

// 计算课程卡片的高度
const getHeight = (course: ScheduleCourse) => {
  // 解析开始和结束时间
  const startHour = parseInt(course.startTime.substring(0, 2));
  const startMinute = parseInt(course.startTime.substring(3, 5));
  const endHour = parseInt(course.endTime.substring(0, 2));
  const endMinute = parseInt(course.endTime.substring(3, 5));

  // 计算总分钟数
  const durationMinutes =
    (endHour - startHour) * 60 + (endMinute - startMinute);

  // 转化为像素高度
  return `${durationMinutes * (slotHeightPx.value / 60)}px`;
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

// 根据屏幕大小调整课程表视图
const adjustScheduleLayout = () => {
  const isMobile = window.innerWidth < 768;
  const isLandscape = window.innerWidth > window.innerHeight;

  // 设置时间槽高度
  if (isMobile) {
    if (isLandscape) {
      slotHeightPx.value = 70; // 横屏手机使用较小高度
    } else {
      slotHeightPx.value = 80; // 竖屏手机
    }
  } else {
    slotHeightPx.value = 100; // 桌面设备
  }

  // 计算总高度
  gridHeight.value = timeSlots.length * slotHeightPx.value + 40; // 40是标题行高度

  // 应用高度到网格
  if (scheduleGridRef.value) {
    scheduleGridRef.value.style.minHeight = `${gridHeight.value}px`;
  }

  // 更新CSS变量
  document.documentElement.style.setProperty(
    '--slot-height',
    `${slotHeightPx.value}px`,
  );

  // 调整设备特定样式
  if (isMobile) {
    document.body.classList.add('mobile-schedule-view');
  } else {
    document.body.classList.remove('mobile-schedule-view');
  }
};

// 组件挂载后处理初始化
onMounted(() => {
  // 调整布局适配不同设备
  adjustScheduleLayout();

  // 监听窗口大小变化
  window.addEventListener('resize', adjustScheduleLayout);

  // 初始滚动定位到当前时间
  scrollToCurrentTime();
});

// 在组件卸载时移除事件监听器
onUnmounted(() => {
  window.removeEventListener('resize', adjustScheduleLayout);
});

// 滚动到当前时间
const scrollToCurrentTime = () => {
  const now = new Date();
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();

  // 只在8:00-17:00之间的工作时间滚动
  if (currentHour >= 8 && currentHour < 17) {
    // 计算当前时间相对于8:00的分钟数
    const minutesFromStart = (currentHour - 8) * 60 + currentMinute;

    // 转化为像素位置
    const scrollPosition = minutesFromStart * (slotHeightPx.value / 60);

    // 获取容器并滚动
    const container = document.querySelector('.schedule-container');
    if (container) {
      // 减去一些偏移，使当前时间在视图中间
      const offset = Math.max(0, scrollPosition - 100);
      container.scrollTop = offset;
    }
  }
};
</script>

<style scoped>
:root {
  --slot-height: 100px;
}

.course-schedule-page {
  background-color: #fff;
  min-height: 100vh;
  padding: 0;
  box-sizing: border-box;
  font-family: 'Noto Sans SC', sans-serif;
  display: flex;
  flex-direction: column;
}

.course-schedule {
  width: 100%;
  height: calc(100vh - 50px); /* 减去头部高度 */
  background-color: #fff;
  overflow: hidden;
  margin: 0;
  display: flex;
  flex-direction: column;
}

.schedule-header {
  padding: 12px 16px;
  border-bottom: 1px solid #f2f2f2;
  flex-shrink: 0;
}

.week-navigator {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #f7f8fa;
  border-radius: 8px;
  padding: 10px;
}

.week-nav-btn {
  color: #2196f3;
  font-size: 14px;
  padding: 4px 8px;
}

.current-week {
  font-size: 16px;
  font-weight: bold;
  color: #333;
}

.schedule-container {
  flex: 1;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
}

.schedule-grid {
  display: flex;
  position: relative;
  overflow-x: auto;
  min-height: 600px;
  -webkit-overflow-scrolling: touch;
  width: 100%;
}

.time-column {
  width: 50px;
  flex-shrink: 0;
  text-align: center;
  border-right: 1px solid #f2f2f2;
  position: sticky;
  left: 0;
  z-index: 2;
  background-color: #fff;
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
  background-color: #fff;
  border-bottom: 1px solid #f2f2f2;
  position: sticky;
  top: 0;
  z-index: 1;
  color: #333;
}

.time-column .weekday-header {
  z-index: 3;
}

.time-slot {
  height: var(--slot-height);
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding-top: 10px;
  font-size: 12px;
  color: #999;
  border-bottom: 1px solid #f5f5f5;
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
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
}

.course-card:active {
  opacity: 0.9;
}

.course-title {
  font-weight: bold;
  margin-bottom: 3px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 12px;
}

.course-time {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 10px;
  margin-bottom: 2px;
}

.course-info {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 10px;
}

.course-details {
  height: 100%;
  display: flex;
  flex-direction: column;
  border-radius: 16px 16px 0 0;
  overflow: hidden;
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
  opacity: 0.9;
}

.details-content {
  flex: 1;
  padding: 20px 16px;
}

.details-item {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
}

.details-item .van-icon {
  margin-right: 12px;
  color: #666;
  font-size: 18px;
}

.details-actions {
  padding: 16px;
  border-top: 1px solid #f5f5f5;
}

/* 移动端特殊样式 */
@media (max-width: 768px) {
  .course-schedule {
    height: calc(100vh - 50px);
  }

  .schedule-header {
    padding: 10px;
  }

  .week-navigator {
    padding: 8px 10px;
  }

  .day-column {
    min-width: 80px;
  }

  .time-column {
    width: 40px;
  }

  .course-card {
    padding: 6px;
  }

  .course-title {
    font-size: 12px;
    margin-bottom: 2px;
  }

  .course-time,
  .course-info {
    font-size: 10px;
    margin-bottom: 1px;
  }
}

/* 确保在横屏模式下仍然可用 */
@media (max-width: 932px) and (orientation: landscape) {
  .course-schedule {
    height: calc(100vh - 40px);
  }

  .schedule-header {
    padding: 6px;
  }

  .week-navigator {
    padding: 4px 8px;
  }

  .weekday-header {
    height: 32px;
  }

  .time-slot {
    height: 70px;
  }
}

/* 低高度屏幕如iPhone SE需要更紧凑的布局 */
@media (max-height: 700px) {
  .schedule-header {
    padding: 6px;
  }

  .time-slot {
    height: 65px;
  }

  .course-schedule {
    margin: 0;
  }
}
</style>
