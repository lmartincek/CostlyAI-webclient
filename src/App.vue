<script setup lang="ts">
import Footer from './components/FooterCostly.vue'
import Signup from './components/SignUp.vue'

import { useNotificationsStore } from './stores/notificationsStore.ts'
import NotificationCostly from '@/components/NotificationCostly.vue'

const notificationsStore = useNotificationsStore()
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
