<template>
    <div class="dropdown">
        <div class="dropdown-trigger" @click="toggleDropdown">
            <slot name="trigger"></slot>
        </div>

        <transition name="slide-down">
            <div v-if="isOpen" class="dropdown-content" @click.self="closeDropdown">
                <slot name="content"></slot>
            </div>
        </transition>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const isOpen = ref(false);

const toggleDropdown = () => {
    isOpen.value = !isOpen.value;
};

const closeDropdown = () => {
    isOpen.value = false;
};
</script>

<style scoped lang="scss">
.dropdown {
    position: relative;
    display: inline-block;
}

.dropdown-trigger {
    cursor: pointer;
}

.dropdown-content {
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-85%);
    margin-top: 10px;
    background-color: $white-color;
    border: 1px solid $border-color;
    border-radius: 4px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    z-index: 1000;
    padding: 10px;
}

.slide-down-enter-active,
.slide-down-leave-active {
    transition: opacity 0.3s, transform 0.3s;
}

.slide-down-enter-from,
.slide-down-leave-to {
    opacity: 0;
    transform: translateY(-20px) translateX(-85%);
}
</style>