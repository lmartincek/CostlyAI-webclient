import { createRouter, createWebHistory } from 'vue-router'

import HomeView from '@/views/HomeView.vue'
import MyRecentSearchesView from '@/views/MyRecentSearchesView.vue'
import NotFoundView from '@/views/NotFoundView.vue'
import { useAuthStore } from '@/stores/authStore'
import AuthCallbackView from '@/views/AuthCallbackView.vue'

const routes = [
  { path: '/', component: HomeView },
  { path: '/auth/callback', component: AuthCallbackView },
  {
    path: '/my-recent-searches',
    component: MyRecentSearchesView,
    meta: { requiresAuth: true },
    beforeEnter: () => {
      const authStore = useAuthStore()

      if (!authStore.isAuthenticated) {
        return '/'
      }
    },
  },
  { path: '/:pathMatch(.*)*', component: NotFoundView },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router
