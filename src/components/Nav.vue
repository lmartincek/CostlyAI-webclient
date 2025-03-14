<script setup lang="ts">
import {useModalStore} from "../stores/modalsStore.ts";
import Icon from "./Icon.vue";
import {useAuthStore} from "../stores/authStore.ts";

const modal = useModalStore()
const auth = useAuthStore()
</script>

<template>
  <nav>
      <div class="wrapper">
        <div class="wrapper__logo"><Icon alt="logo" name="globe" width="26" height="26"/> CostlyAI</div>

        <div class="wrapper__auth">
          <div class="wrapper__auth--login" @click="modal.openModal" v-if="!auth.isAuthenticated">
              <Icon alt="" name="login" width="18" height="18"/> Sign in
          </div>
          <div class="wrapper__auth--profile" v-if="auth.user">
<!--              TODO profile badge with dropdown - logout, delete account -->
              {{ auth.user.email }}
          </div>
        </div>
      </div>
  </nav>
</template>

<style scoped lang="scss">
nav {
  width: 100%;
  height: 4.5rem;
  position: relative;
  background: $white-color;

  .wrapper {
    margin: 0 auto;
    padding: 1rem;
    display: flex;
    justify-content: space-between;
    max-width: $breakpoint-lg;
    height: 100%;

    &__logo, &__auth {
      display: flex;
      justify-content: center;
      align-items: center;
      min-width: 100px;
    }

    &__logo {
      font-weight: bold;
      font-size: 1.2rem;
      color: $primary-color;

      img {
        margin-right: .5rem;
      }
    }

    &__auth--login {
      background: $primary-color;
      color: $white-color;
      border-radius: 2rem;
      font-weight: 500;
      transition: scale 300ms ease-in-out;
      cursor: pointer;
      padding: .5rem 1rem;
      display: flex;
      justify-content: center;
      align-items: center;

      &:hover {
        scale: 105%;
      }

      img {
        margin-right: .5rem;
      }
    }
  }
}
</style>