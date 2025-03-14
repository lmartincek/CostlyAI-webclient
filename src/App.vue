<script setup lang="ts">
import InfoPopup from "./components/InfoPopup.vue";
import Layout from "./components/Layout.vue";
import Footer from "./components/Footer.vue";
import Signup from "./components/Signup.vue";
import RecentlySearched from "./components/RecentlySearched.vue";

import Notification from './components/Notification.vue';
import {useNotificationsStore} from "./stores/notificationsStore.ts";
import SearchCosts from "./components/SearchCosts.vue";
import CostsWrapper from "./components/CostsWrapper.vue";

const { notifications } = useNotificationsStore();
</script>

<template>
    <template v-for="(notification, _i) in notifications" :key="_i">
        <Notification
            :message="notification.message"
            :type="notification.type"
            :duration="notification.duration"
        />
    </template>

    <InfoPopup/>
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