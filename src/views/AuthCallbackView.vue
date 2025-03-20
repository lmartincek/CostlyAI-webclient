<template>
  <LayoutCostly>
    <template v-slot:headline>
      <h1>CostlyAI</h1>
      <hr />
      <h2>Logging in...</h2>
      <SpinnerCostly />
    </template>
  </LayoutCostly>
</template>

<script setup lang="ts">
import LayoutCostly from '@/components/LayoutCostly.vue'
import SpinnerCostly from '@/components/SpinnerCostly.vue'
import { useNotificationsStore } from '@/stores/notificationsStore'

import { useRouter } from 'vue-router'
import { useOAuthCallback } from '@/composables/useOAuthCallback.ts'
import { onMounted } from 'vue'

const router = useRouter()

const { showNotification } = useNotificationsStore()

onMounted(async () => {
  try {
    await useOAuthCallback()
    showNotification({ message: 'Successfully logged in' })
  } catch (e) {
    showNotification({ message: e.message, type: 'error' })
  } finally {
    await router.replace('/')
  }
})
</script>
