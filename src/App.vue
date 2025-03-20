<script setup lang="ts">
import Footer from './components/FooterCostly.vue'
import Signup from './components/SignUp.vue'

import { useNotificationsStore } from './stores/notificationsStore.ts'
import NotificationCostly from '@/components/NotificationCostly.vue'
import { useAuthStore } from '@/stores/authStore.ts'
import {onMounted} from "vue";

const notificationsStore = useNotificationsStore()
const { rehydrate } = useAuthStore()

onMounted(async () => {
  if (localStorage.getItem('costly-remember-me')) await rehydrate()
})
</script>

<template>
  <template v-for="(notification, i) in notificationsStore.notifications" :key="'notification' + i">
    <NotificationCostly
      :message="notification.message"
      :type="notification.type"
      :duration="notification.duration"
    />
  </template>
  <Signup />

  <RouterView />

  <Footer />
</template>
