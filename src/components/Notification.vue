<template>
    <transition name="slide-fade">
        <div :class="['notification', type]">
            <span class="notification-message">{{ message }}</span>
        </div>
    </transition>
</template>

<script setup lang="ts">
defineProps({
    message: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        default: 'success',
        validator: (value: string) => ['success', 'error', 'default'].includes(value),
    },
});
</script>

<style scoped lang="scss">
.notification {
    position: fixed;
    top: 20px;
    right: 50%;
    transform: translateX(50%);
    padding: 1rem 2rem;
    border-radius: 4px;
    color: $white-color;
    text-align: center;
    display: flex;
    align-items: center;
    gap: 12px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    z-index: 1000;
    max-width: 350px;
    width: 100%;

    &.success {
        background-color: $success-color;
    }

    &.error {
        background-color: $error-color;
    }

    &.default {
        background-color: $headline-color;
    }
}

.notification-message {
    flex-grow: 1;
}

.notification-close {
    background: none;
    border: none;
    color: inherit;
    cursor: pointer;
    font-size: 16px;
    padding: 0;
    margin-left: 8px;
}

.slide-fade-enter-active,
.slide-fade-leave-active {
    transition: all 0.3s ease;
}

.slide-fade-enter-from,
.slide-fade-leave-to {
    opacity: 0;
    transform: translateX(100%);
}
</style>