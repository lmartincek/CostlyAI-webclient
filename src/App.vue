<script setup lang="ts">
import Signup from '@/components/user/SignUp.vue'

import { useNotificationsStore } from '@/stores/notificationsStore.ts'
import NotificationCostly from '@/components/common/NotificationCostly.vue'

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
</template>
