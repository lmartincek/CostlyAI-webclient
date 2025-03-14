import { ref } from 'vue';
import {defineStore} from "pinia";

type NotificationType = 'success' | 'error';

interface Notification {
    message: string;
    type?: NotificationType;
    duration?: number;
}

export const useNotificationsStore = defineStore('notificationsStore', () => {
    const notifications = ref<Notification[]>([]);

    const showNotification = (notification: Notification) => {
        notifications.value.push(notification);

        setTimeout(() => {
            notifications.value.shift();
        }, notification.duration || 3000);
    };

    return {
        notifications,
        showNotification,
    };
})