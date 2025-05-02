import {
  createRouter,
  createWebHistory,
  RouteRecordRaw,
  NavigationGuardNext,
  RouteLocationNormalized,
} from 'vue-router';
import Home from '../views/home/Home.vue';
import Courses from '../views/course/Courses.vue';
import Profile from '../views/myProfile/Profile.vue';
import Login from '../views/user/Login.vue';
import Register from '../views/user/Register.vue';
import Circle from '../views/circle/Circle.vue';
import { ChatDetail, ChatContainer } from '../views/chat';
import AvatarCropper from '../views/myProfile/settings/AvatarCropper.vue';
import NoticeList from '../views/home/NoticeList.vue';
import PostDetail from '../views/circle/PostDetail.vue';

declare module 'vue-router' {
  interface RouteMeta {
    requiresAuth: boolean;
  }
}

const routes: Array<RouteRecordRaw> = [
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: {
      requiresAuth: false,
    },
  },
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/search',
    name: 'SearchPage',
    component: () => import('../views/common/SearchPage.vue'),
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/chat',
    name: 'Chat',
    component: ChatContainer,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/courses',
    name: 'Courses',
    component: Courses,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/course-schedule',
    name: 'CourseSchedule',
    component: () => import('../views/course/CourseSchedule.vue'),
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/task-plans',
    name: 'TaskPlans',
    component: () => import('../views/course/TaskPlans.vue'),
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/profile',
    name: 'Profile',
    component: Profile,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/register',
    name: 'Register',
    component: Register,
    meta: {
      requiresAuth: false,
    },
  },
  {
    path: '/settings',
    name: 'Settings',
    component: () => import('../views/myProfile/settings/Settings.vue'),
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/settings/profile',
    name: 'SettingsProfile',
    component: () => import('../views/myProfile/settings/SettingsProfile.vue'),
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/settings/about',
    name: 'SettingsAbout',
    component: () => import('../views/myProfile/settings/SettingsAbout.vue'),
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/settings/terms',
    name: 'SettingsTerms',
    component: () => import('../views/myProfile/settings/SettingsTerms.vue'),
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/settings/privacy',
    name: 'SettingsPrivacy',
    component: () => import('../views/myProfile/settings/SettingsPrivacy.vue'),
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/settings/feedback',
    name: 'SettingsFeedback',
    component: () => import('../views/myProfile/settings/SettingsFeedback.vue'),
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/settings/avatar-cropper',
    name: 'AvatarCropper',
    component: AvatarCropper,
    meta: {
      requiresAuth: true,
      title: '裁剪头像',
    },
  },
  {
    path: '/chat-detail',
    name: 'ChatDetail',
    component: ChatDetail,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/chat-detail/:assistantId',
    name: 'ChatDetailWithAssistant',
    component: ChatDetail,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/course-study/:id',
    name: 'CourseStudy',
    component: () => import('../views/course/CourseStudy.vue'),
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/notices',
    name: 'NoticeList',
    component: NoticeList,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/chat-history',
    redirect: '/chat',
  },
  {
    path: '/vocabulary',
    name: 'VocabularyList',
    component: () => import('../views/home/vocabulary/VocabularyList.vue'),
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/vocabulary/collected',
    name: 'CollectedWords',
    component: () => import('../views/home/vocabulary/CollectedWords.vue'),
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/articles',
    name: 'ArticlesList',
    component: () => import('../views/home/articles/ArticlesList.vue'),
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/popular-courses',
    name: 'PopularCourses',
    component: () => import('../views/course/PopularCourses.vue'),
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/achievements',
    name: 'Achievements',
    component: () => import('../views/myProfile/achievements/AchievementsPage.vue'),
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/history',
    name: 'History',
    component: () => import('../views/course/HistoryPage.vue'),
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/circle',
    name: 'Circle',
    component: Circle,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/circle/post/:id',
    name: 'PostDetail',
    component: PostDetail,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/circle/post/create',
    name: 'PostCreate',
    component: () => import('../views/circle/PostCreate.vue'),
    meta: {
      requiresAuth: true,
    },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(_to, _from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      // 在路由切换时立即滚动到顶部，没有平滑滚动效果
      return { top: 0, behavior: 'auto' };
    }
  },
});

// 路由守卫
router.beforeEach(
  async (
    to: RouteLocationNormalized,
    from: RouteLocationNormalized,
    next: NavigationGuardNext,
  ) => {
    // 导入userStore
    const { useUserStore } = await import('../stores/userStore');
    const userStore = useUserStore();

    // 检查localStorage中是否有用户信息来判断登录状态
    const userInfo = localStorage.getItem('userInfo');
    // 使用userStore中提供的方法或属性判断登录状态
    const isLoggedIn =
      userInfo !== null ||
      userStore.getUserAvatar() !== userStore.DEFAULT_USER_AVATAR;

    if (to.meta.requiresAuth && !isLoggedIn) {
      // 需要登录但未登录，重定向到登录页
      next({
        path: '/login',
        query: { redirect: to.fullPath },
      });
    } else if (to.path === '/login' && isLoggedIn) {
      // 已登录但访问登录页，重定向到首页
      next('/');
    } else {
      next();
    }
  },
);

export default router;
