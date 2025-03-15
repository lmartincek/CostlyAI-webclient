<template>
    <div class="profile-badge">
        <Dropdown>
            <template #trigger>
                <Icon name="login" width="20" height="20" alt="profile" class="profile-icon" />
            </template>

            <template #content>
                <div class="dropdown-item">{{ auth.user.email }}</div>
                <div class="dropdown-item" @click="logout">Logout</div>
            </template>
        </Dropdown>
    </div>
</template>

<script setup lang="ts">
import Dropdown from './Dropdown.vue';
import Icon from "./Icon.vue";
import {useAuthStore} from "../stores/authStore.ts";
import {useNotificationsStore} from "../stores/notificationsStore.ts";

const auth = useAuthStore()

const { showNotification } = useNotificationsStore()

const logout = async () => {
    try {
        await auth.logout()
        showNotification({
            message: "Logged out",
            type: "default"
        })
    } catch (e) {
        showNotification({
            message: e.message,
            type: "error"
        })
    }
};
</script>

<style scoped lang="scss">
.profile-badge {
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    background: $primary-gradient;
    border-radius: 3rem;
    height: 2.5rem;
    width: 2.5rem;

    .profile-icon {
        display: flex;
        align-items: center;
        justify-content: center;
    }
}

.dropdown-item {
    padding: 8px 16px;
    cursor: pointer;
    text-align: center;

    &:first-of-type {
        cursor: text;
        font-size: .8rem;

    }

    //&:last-of-type {
    //    color: red;
    //}

    &:not(:first-of-type) {
        font-weight: bold;
        font-size: .9rem;
    }
}

.dropdown-item:hover:not(:first-of-type) {
    background-color: #f0f0f0;
}
</style>