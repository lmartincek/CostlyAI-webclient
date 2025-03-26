import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'

import HomeView from '@/views/HomeView.vue'
const MyRecentSearchesView = () => import('@/views/MyRecentSearchesView.vue')
const NotFoundView = () => import('@/views/NotFoundView.vue')
const AuthCallbackView = () => import('@/views/AuthCallbackView.vue')

const routes = [
  { path: '/', component: HomeView },
  { path: '/auth/callback', component: AuthCallbackView },
  {
    path: '/my-recent-searches',
    component: MyRecentSearchesView,
    meta: { requiresAuth: true },
  },
  { path: '/:pathMatch(.*)*', component: NotFoundView },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next('/')
  } else {
    next()
  }
})

export default router
