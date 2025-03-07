<template>
    <div class="select-input">
        <label :for="id" class="select-label">{{ label }}</label>
        <select
            :id="id"
            v-model="selectedValue"
            @change="handleChange"
            :disabled="disabled"
            class="select-input"
        >
            <option
                :value="null"
                disabled
                selected
            >
                {{ defaultOptionLabel }}
            </option>
<!--            TODO - rewrite to more abstract -->
            <option
                v-for="option in options"
                :key="option.name"
                :value="option.name"
            >
                {{ option.name }}
            </option>
        </select>
    </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import type {ICountry} from "../types/countries";
import type {ICity} from "../types/cities";

defineProps({
    label: {
        type: String,
        default: 'Select an option',
    },
    options: {
        type: Array as () => Array<ICountry | ICity>,
        required: true,
    },
    defaultOptionLabel: {
        type: String,
        default: 'Select an option...',
    },
    id: {
        type: String,
        default: 'select-input',
    },
    disabled: {
        type: Boolean,
        default: false,
    },
});

const selectedValue = ref<any>(null);

const emit = defineEmits(['update:modelValue']);
const handleChange = () => {
    emit('update:modelValue', selectedValue.value);
};

watch(selectedValue, (newValue) => {
    console.log("Selected value changed to: ", newValue);
});
</script>

<style scoped>
select {
    margin: 0 10px;
    padding: 10px;
    font-size: 16px;
    cursor: pointer;
    border-radius: 5px;
}

option:disabled {
    color: #aaa;
}

.select-label {
    font-weight: bold;
}
</style>
