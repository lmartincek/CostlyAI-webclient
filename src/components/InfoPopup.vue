<script setup lang="ts">
import {nextTick, onMounted, ref, useTemplateRef} from "vue";

const show = ref<boolean>(false)

function close(): void {
    show.value = false
}

async function manageInitialShow(): Promise<void> {
    if (sessionStorage.getItem('info-popup-showed')) {
        return;
    }

    sessionStorage.setItem('info-popup-showed', 'true')
    show.value = true

    await nextTick()
    popup.value.focus()
}

const popup = useTemplateRef('popup')

onMounted( (): void => {
    if (import.meta.env.PROD) {
        manageInitialShow()
    }
})
</script>

<template>
    <div class="overlay" v-show="show"/>
    <div class="info-server"
         tabindex="0"
         ref="popup"
         @keydown.esc="close"
         v-show="show">
        <div class="close"
             @click="close">x</div>
        <p><b>Before using</b></p>
        <ul>
            <li>Since it is a hobby project and backend is running on a free tier plan server, inactivity shuts down the server.</li>
            <li>If you're not getting any data, please wait for a minute until the server starts responding again.</li>
        </ul>
        <p>Thank you.</p>
    </div>
</template>

<style scoped lang="scss">
.overlay {
    position:absolute;
    top:0;
    left:0;
    right:0;
    bottom:0;
    background-color:rgba(0, 0, 0, 0.85);
    background: url(data:;base64,iVBORw0KGgoAAAANSUhEUgAAAAIAAAACCAYAAABytg0kAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAgY0hSTQAAeiYAAICEAAD6AAAAgOgAAHUwAADqYAAAOpgAABdwnLpRPAAAABl0RVh0U29mdHdhcmUAUGFpbnQuTkVUIHYzLjUuNUmK/OAAAAATSURBVBhXY2RgYNgHxGAAYuwDAA78AjwwRoQYAAAAAElFTkSuQmCC) repeat scroll transparent\9; /* ie fallback png background image */
    z-index:5;
    color:white;
}

.info-server {
    position: absolute;
    max-width: 400px;
    width: 100%;
    margin: 2rem auto;
    padding: .5rem 2rem;
    background: #fff;
    border-radius: 1rem;
    border: 2px solid #000;
    color: #000;
    text-align: left;
    z-index: 10;
    left: 50%;
    transform: translateX(-50%);

    .close {
        position: absolute;
        top: 1rem;
        right: 2rem;
        font-weight: bold;
        font-size: 1.25rem;
        cursor: pointer;
    }
}
</style>