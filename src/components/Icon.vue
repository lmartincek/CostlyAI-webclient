<template>
    <img :src="iconUrl" :alt="alt" :width="width" :height="height" />
</template>

<script setup lang="ts">
import {computed} from "vue";

const props = defineProps({
    name: {
        type: String,
        required: true,
    },
    alt: {
        type: String,
        required: true,
    },
    width: {
        type: String,
        required: false,
        default: "24",
    },
    height: {
        type: String,
        required: false,
        default: "24",
    },
    folder: {
        type: String,
        required: false,
        default: "icons",
    },
});

const icons = import.meta.glob("/src/assets/icons/**/*.svg", { eager: true });

const iconUrl = computed(() => {
    const iconPath = props.folder === "icons"
        ? `/src/assets/icons/${props.name?.toLowerCase()}.svg`
        : `/src/assets/icons/${props.folder}/${props.name?.toLowerCase()}.svg`;

    const module = icons[iconPath] as { default: string } | undefined;
    return module?.default || "";
});
</script>