<template>
  <div class="banner-carousel">
    <van-swipe
      class="swipe"
      :autoplay="3000"
      indicator-color="rgba(255, 255, 255, 0.5)"
      :show-indicators="true"
      :loop="true"
      @change="onSwiperChange"
    >
      <van-swipe-item
        v-for="(banner, index) in banners"
        :key="index"
        @click="onBannerClick(banner)"
      >
        <div class="banner-item">
          <img :src="banner.imageUrl" :alt="banner.title" class="banner-image" />
          <div class="banner-overlay">
            <div class="banner-content">
              <h3 class="banner-title">{{ banner.title }}</h3>
              <p class="banner-description">{{ banner.description }}</p>
              <div class="banner-tag">
                <span class="tag" :style="{ backgroundColor: banner.tagColor }">
                  {{ banner.tag }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </van-swipe-item>
    </van-swipe>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { mockPopularCourses } from '../../api/mock'

// 轮播图数据接口
interface Banner {
  id: number
  title: string
  description: string
  imageUrl: string
  tag: string
  tagColor: string
}

const router = useRouter()

// 轮播图数据
const banners = ref<Banner[]>([])

// 点击轮播图事件
const onBannerClick = (banner: Banner) => {
  router.push('/courses')
}

// 轮播图切换事件
const onSwiperChange = (index: number) => {
  console.log('当前轮播图索引:', index)
}

// 从课程数据中生成轮播图数据
const generateBannersFromCourses = () => {
  // 选择最热门的几个课程作为轮播图
  const selectedCourses = mockPopularCourses
    .sort((a, b) => b.studentsCount - a.studentsCount)
    .slice(0, 5) // 取前5个最热门的课程

  banners.value = selectedCourses.map((course, index) => ({
    id: course.id,
    title: course.title,
    description: course.brief,
    imageUrl: course.cover,
    tag: course.tag,
    tagColor: course.tagColor
  }))
}

// 组件挂载时生成轮播图数据
onMounted(() => {
  generateBannersFromCourses()
})
</script>

<style scoped>
.banner-carousel {
  margin: 16px 0;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.swipe {
  height: 180px;
  border-radius: 12px;
}

.banner-item {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.banner-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.banner-item:hover .banner-image {
  transform: scale(1.05);
}

.banner-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    135deg,
    rgba(0, 0, 0, 0.3) 0%,
    rgba(0, 0, 0, 0.1) 50%,
    rgba(0, 0, 0, 0.4) 100%
  );
  display: flex;
  align-items: flex-end;
  padding: 20px;
}

.banner-content {
  color: white;
  width: 100%;
}

.banner-title {
  font-size: 18px;
  font-weight: 600;
  margin: 0 0 6px 0;
  line-height: 1.3;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
}

.banner-description {
  font-size: 13px;
  margin: 0 0 10px 0;
  line-height: 1.4;
  opacity: 0.9;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.banner-tag {
  display: flex;
  align-items: center;
}

.tag {
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 500;
  background-color: #1989fa;
  color: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

/* 自定义指示器样式 */
:deep(.van-swipe__indicator) {
  width: 6px;
  height: 6px;
  background-color: rgba(255, 255, 255, 0.5);
  border-radius: 3px;
  margin: 0 3px;
  transition: all 0.3s ease;
}

:deep(.van-swipe__indicator--active) {
  background-color: #fff;
  width: 20px;
  border-radius: 3px;
}

:deep(.van-swipe__indicators) {
  bottom: 12px;
}

/* 响应式设计 */
@media (max-width: 375px) {
  .swipe {
    height: 160px;
  }
  
  .banner-overlay {
    padding: 16px;
  }
  
  .banner-title {
    font-size: 16px;
  }
  
  .banner-description {
    font-size: 12px;
  }
}

@media (min-width: 414px) {
  .swipe {
    height: 200px;
  }
  
  .banner-overlay {
    padding: 24px;
  }
  
  .banner-title {
    font-size: 20px;
  }
  
  .banner-description {
    font-size: 14px;
  }
}

/* 添加加载状态 */
.banner-carousel:empty::before {
  content: '';
  display: block;
  width: 100%;
  height: 180px;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
  border-radius: 12px;
}

@keyframes loading {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}
</style> 