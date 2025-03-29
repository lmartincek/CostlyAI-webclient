import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import { useModalStore } from '@/stores/modalsStore.ts'

import HomeView from '@/views/HomeView.vue'
const MyRecentSearchesView = () => import('@/views/MyRecentSearchesView.vue')
const NotFoundView = () => import('@/views/NotFoundView.vue')
const AuthCallbackView = () => import('@/views/AuthCallbackView.vue')
const CommunitiesView = () => import('@/views/CommunitiesView.vue')

const routes = [
  { path: '/', component: HomeView },
  { path: '/auth/callback', component: AuthCallbackView },
  {
    path: '/my-recent-searches',
    component: MyRecentSearchesView,
    meta: { requiresAuth: true },
  },
  {
    path: '/communities',
    component: CommunitiesView,
  },
  { path: '/:pathMatch(.*)*', component: NotFoundView },
] as const
export type RoutePaths = (typeof routes)[number]['path']

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior() {
    return { top: 0 }
  },
})

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()
  const modalStore = useModalStore()

  if (modalStore.isOpen) {
    modalStore.closeModal()
  }

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next('/')
  } else {
    next()
  }
})

export default router
