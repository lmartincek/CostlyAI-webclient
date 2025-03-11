<template>
    <button
            :class="buttonClass"
            :disabled="disabled"
            @click="handleClick"
    >
        <slot/>
    </button>
</template>

<script setup lang="ts">
import type {PropType} from "vue";

defineProps({
    buttonClass: {
        type: String as PropType<'btn-primary' | 'btn-white'>,
        default: 'btn-primary',
    },
    disabled: {
        type: Boolean,
        default: false,
    },
});

const emit = defineEmits(['click']);
const handleClick = () => {
    emit('click');
};
</script>

<style scoped lang="scss">
button {
    padding: .8rem 1.6rem;
    cursor: pointer;
    border-radius: .5rem;

    &.btn-white {
        background: $white-color;
        color: $text-color;
        border: 1px solid $placeholder-color;
    }

    &.btn-primary {
        background: $primary-gradient;
        color: $white-color;
    }

    &:disabled {
        cursor: not-allowed;
        opacity: 0.6;
    }
}

</style>
