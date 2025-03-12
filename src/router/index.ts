import { createRouter, createWebHistory, RouteRecordRaw, NavigationGuardNext, RouteLocationNormalized } from 'vue-router'
import Home from '../views/Home.vue'
import Courses from '../views/Courses.vue'
import Profile from '../views/Profile.vue'
import Login from '../views/user/Login.vue'
import Register from '../views/user/Register.vue'
import { ChatHistory, ChatDetail } from '../views/Chat'

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
      requiresAuth: false
    }
  },
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/chat-history',
    name: 'ChatHistory',
    component: ChatHistory,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/courses',
    name: 'Courses',
    component: Courses,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/profile',
    name: 'Profile',
    component: Profile,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/register',
    name: 'Register',
    component: Register,
    meta: {
      requiresAuth: false
    }
  },
  {
    path: '/settings',
    name: 'Settings',
    component: () => import('../views/Settings.vue'),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/settings/profile',
    name: 'SettingsProfile',
    component: () => import('../views/settings/SettingsProfile.vue'),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/settings/about',
    name: 'SettingsAbout',
    component: () => import('../views/settings/SettingsAbout.vue'),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/settings/terms',
    name: 'SettingsTerms',
    component: () => import('../views/settings/SettingsTerms.vue'),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/settings/privacy',
    name: 'SettingsPrivacy',
    component: () => import('../views/settings/SettingsPrivacy.vue'),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/chat-detail',
    name: 'ChatDetail',
    component: ChatDetail,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/course-study/:id',
    name: 'CourseStudy',
    component: () => import('../views/CourseStudy.vue'),
    meta: {
      requiresAuth: true
    }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 路由守卫
router.beforeEach((
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext
) => {
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true'

  if (to.meta.requiresAuth && !isLoggedIn) {
    // 需要登录但未登录，重定向到登录页
    next({
      path: '/login',
      query: { redirect: to.fullPath }
    })
  } else if (to.path === '/login' && isLoggedIn) {
    // 已登录但访问登录页，重定向到首页
    next('/')
  } else {
    next()
  }
})

export default router 