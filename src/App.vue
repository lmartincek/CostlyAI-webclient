<script setup lang="ts">
import Layout from "./components/Layout.vue";
import Footer from "./components/Footer.vue";
import Signup from "./components/Signup.vue";
import RecentlySearched from "./components/RecentlySearched.vue";

import Notification from './components/Notification.vue';
import {useNotificationsStore} from "./stores/notificationsStore.ts";
import SearchCosts from "./components/SearchCosts.vue";
import CostsWrapper from "./components/CostsWrapper.vue";
import {onMounted} from "vue";
import {setUserSession} from "./services/authService.ts";
import {useAuthStore} from "./stores/authStore.ts";

const { notifications, showNotification } = useNotificationsStore();
const authStore = useAuthStore()

async function handleOAuthCallback() {
    const hash = window.location.hash.substring(1);
    const params = new URLSearchParams(hash);

    const accessToken = params.get("access_token");
    const refreshToken = params.get("refresh_token");

    if (accessToken) {
        try {
            await setUserSession(accessToken, refreshToken)
            showNotification({
                message: "Successfully logged in"
            })
        } catch (e) {
            showNotification({
                message: e.message,
                type: "error"
            })
        }
        window.history.pushState({}, document.title, "/");
    }
}

onMounted(async () => {
    await handleOAuthCallback();

    if (!authStore.accessToken && localStorage.getItem('costly-remember-me')) {
        await authStore.rehydrate();
    }
})

</script>

<template>
    <template v-for="(notification, _i) in notifications" :key="_i">
        <Notification
            :message="notification.message"
            :type="notification.type"
            :duration="notification.duration"
        />
    </template>
    <Signup/>

    <Layout>
        <template v-slot:headline>
            <h1>CostlyAI</h1>
            <p>Discover living costs worldwide, compare prices and plan your travel budget with real-time data from cities around the globe</p>
        </template>

        <template v-slot:content>
            <SearchCosts/>
            <CostsWrapper/>
            <RecentlySearched/>
        </template>
    </Layout>

    <Footer/>
</template>