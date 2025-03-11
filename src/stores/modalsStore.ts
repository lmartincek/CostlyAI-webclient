import { defineStore } from 'pinia';
import {ref} from "vue";

export const useModalStore = defineStore('modalsStore', () =>{
    const isOpen = ref<boolean>(false)
    function openModal() {
        isOpen.value = true;
    }

    function closeModal() {
        isOpen.value = false;
    }

    return {isOpen, openModal, closeModal}
})
