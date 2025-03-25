import { ref } from 'vue'
import { defineStore } from 'pinia'

type NotificationType = 'success' | 'error' | 'default'

interface Notification {
  message: string
  type?: NotificationType
  duration?: number
}

export const useNotificationsStore = defineStore('notificationsStore', () => {
  const notifications = ref<Notification[]>([])

  const showNotification = (notification: Notification) => {
    if (!notification.message) {
      console.error('notification without message was received')
      return
    }

    notifications.value.push(notification)

    setTimeout(() => {
      notifications.value.shift()
    }, notification.duration || 1500)
  }

  return {
    notifications,
    showNotification,
  }
})
