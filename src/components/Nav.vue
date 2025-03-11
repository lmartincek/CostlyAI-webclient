<script setup lang="ts">
import {useModalStore} from "../stores/modalsStore.ts";

const modal = useModalStore()
</script>

<template>
  <nav>
      <div class="wrapper">
        <div><img alt="icon" src="/src/assets/icons/globe.svg" width="26" height="26"/> CostlyAI</div>
        <div @click="modal.openModal"><img alt="login" src="/src/assets/icons/login.svg" width="18" height="18"/> Sign in</div>
      </div>
  </nav>
</template>

<style scoped lang="scss">
nav {
  width: 100%;
  height: 2.5rem;
  position: relative;
  background: $white-color;
  padding: 1rem 0;

  .wrapper {
    margin: 0 auto;
    padding: 0 1rem;
    display: flex;
    justify-content: space-between;
    max-width: $breakpoint-lg;
    height: 100%;

    div {
      display: flex;
      justify-content: center;
      align-items: center;
      min-width: 100px;

      &:first-of-type {
        font-weight: bold;
        font-size: 1.2rem;
        color: $primary-color;
      }

      &:last-of-type {
        background: $primary-color;
        color: $white-color;
        border-radius: 2rem;
        font-weight: 500;
        padding: .25rem;
        transition: scale 300ms ease-in-out;
        cursor: pointer;

        &:hover {
          scale: 105%;
        }
      }

      img {
        margin-right: .5rem;
      }
    }
  }
}
</style>