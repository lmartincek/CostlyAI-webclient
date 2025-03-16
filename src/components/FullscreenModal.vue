<template>
  <Teleport to="body">
    <div
      v-if="modalsStore.isOpen"
      class="modal-overlay"
      @keydown.esc="modalsStore.closeModal"
      @click.self="modalsStore.closeModal"
    >
      <div class="modal-content">
        <button class="close-button" @click="modalsStore.closeModal">&times;</button>
        <slot></slot>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { useModalStore } from '../stores/modalsStore.ts'

const modalsStore = useModalStore()
</script>

<style scoped lang="scss">
.modal-overlay {
  position: fixed;
  inset: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(0, 0, 0, 0.6);
  z-index: 1000;

  .modal-content {
    position: relative;
    background: white;
    border-radius: 10px;
    width: 95%;
    max-width: 450px;
    max-height: 90vh;
    overflow: auto;
    outline: none;

    .close-button {
      position: absolute;
      top: 0.25rem;
      right: 0.25rem;
      background: none;
      border: none;
      font-size: 1.5rem;
      cursor: pointer;

      &:focus {
        outline: none;
        border: none;
      }
    }
  }
}
</style>
