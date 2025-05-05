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
import UserChatDetail from '../views/userChat/UserChatDetail.vue';
import AvatarCropper from '../views/myProfile/settings/AvatarCropper.vue';
import NoticeList from '../views/home/NoticeList.vue';
import PostDetail from '../views/circle/PostDetail.vue';
import UserProfile from '../views/user/UserProfile.vue';

declare module 'vue-router' {
  interface RouteMeta {
    requiresAuth: boolean;
  }
}

const routes: Array<RouteRecordRaw> = [
  // 认证相关路由
  {
    path: '/login',
    name: 'login',
    component: Login,
    meta: {
      requiresAuth: false,
    },
  },
  {
    path: '/register',
    name: 'register',
    component: Register,
    meta: {
      requiresAuth: false,
    },
  },
  
  // 主页相关路由
  {
    path: '/',
    name: 'home',
    component: Home,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/search',
    name: 'search',
    component: () => import('../views/common').then(m => m.SearchPage),
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/notices',
    name: 'notices',
    component: NoticeList,
    meta: {
      requiresAuth: true,
    },
  },
  
  // 聊天相关路由
  {
    path: '/chat',
    name: 'chat',
    component: ChatContainer,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/chat/detail',
    name: 'chat-detail',
    component: ChatDetail,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/chat/detail/:assistantId',
    name: 'chat-detail-with-assistant',
    component: ChatDetail,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/userchat/:userId',
    name: 'user-chat-detail',
    component: UserChatDetail,
    meta: {
      requiresAuth: true,
    },
    props: true,
  },
  {
    path: '/chat-history',
    redirect: '/chat',
  },
  
  // 好友相关路由
  {
    path: '/friends/requests',
    name: 'friend-requests',
    component: () => import('../views/friends/FriendRequests.vue'),
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/friends/add',
    name: 'add-friend',
    component: () => import('../views/friends/AddFriend.vue'),
    meta: {
      requiresAuth: true,
    },
  },
  
  // 课程相关路由
  {
    path: '/courses',
    name: 'courses',
    component: Courses,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/courses/schedule',
    name: 'course-schedule',
    component: () => import('../views/course/CourseSchedule.vue'),
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/courses/popular',
    name: 'popular-courses',
    component: () => import('../views/course/PopularCourses.vue'),
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/courses/task-plans',
    name: 'task-plans',
    component: () => import('../views/course/TaskPlans.vue'),
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/courses/study/:id',
    name: 'course-study',
    component: () => import('../views/course/CourseStudy.vue'),
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/courses/history',
    name: 'course-history',
    component: () => import('../views/course/HistoryPage.vue'),
    meta: {
      requiresAuth: true,
    },
  },
  
  // 个人中心相关路由
  {
    path: '/profile',
    name: 'profile',
    component: Profile,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/profile/achievements',
    name: 'achievements',
    component: () => import('../views/myProfile/achievements/AchievementsPage.vue'),
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/profile/settings',
    name: 'settings',
    component: () => import('../views/myProfile/settings/Settings.vue'),
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/profile/settings/info',
    name: 'settings-profile',
    component: () => import('../views/myProfile/settings/SettingsProfile.vue'),
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/profile/settings/about',
    name: 'settings-about',
    component: () => import('../views/myProfile/settings/SettingsAbout.vue'),
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/profile/settings/terms',
    name: 'settings-terms',
    component: () => import('../views/myProfile/settings/SettingsTerms.vue'),
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/profile/settings/privacy',
    name: 'settings-privacy',
    component: () => import('../views/myProfile/settings/SettingsPrivacy.vue'),
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/profile/settings/feedback',
    name: 'settings-feedback',
    component: () => import('../views/myProfile/settings/SettingsFeedback.vue'),
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/profile/settings/avatar-cropper',
    name: 'avatar-cropper',
    component: AvatarCropper,
    meta: {
      requiresAuth: true,
      title: '裁剪头像',
    },
  },
  
  // 词汇相关路由
  {
    path: '/vocabulary',
    name: 'vocabulary',
    component: () => import('../views/home/vocabulary/VocabularyList.vue'),
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/vocabulary/collected',
    name: 'collected-words',
    component: () => import('../views/home/vocabulary/CollectedWords.vue'),
    meta: {
      requiresAuth: true,
    },
  },
  
  // 文章相关路由
  {
    path: '/articles',
    name: 'articles',
    component: () => import('../views/home/articles/ArticlesList.vue'),
    meta: {
      requiresAuth: true,
    },
  },
  
  // 圈子相关路由
  {
    path: '/circle',
    name: 'circle',
    component: Circle,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/circle/post/:id',
    name: 'post-detail',
    component: PostDetail,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/circle/post/create',
    name: 'post-create',
    component: () => import('../views/circle/PostCreate.vue'),
    meta: {
      requiresAuth: true,
    },
  },
  
  // 用户相关路由
  {
    path: '/users/:id',
    name: 'user-profile',
    component: UserProfile,
    meta: {
      requiresAuth: true,
    },
  },
  
  // 404页面 - 放在最后匹配所有未找到的路由
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('../views/common/NotFound.vue'),
    meta: {
      requiresAuth: false,
      title: '页面未找到',
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
