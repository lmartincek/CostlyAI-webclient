<script setup lang="ts">
import { useModalStore } from '@/stores/modalsStore.ts'
import Icon from '@/components/IconCostly.vue'
import { useAuthStore } from '@/stores/authStore.ts'
import ProfileBadge from '@/components/ProfileBadge.vue'

const modal = useModalStore()
const auth = useAuthStore()
</script>

<template>
  <nav>
    <div class="wrapper">
      <div class="wrapper__logo">
        <Icon alt="logo" name="globe" width="26" height="26" /> CostlyAI
      </div>

      <div class="wrapper__auth">
        <div class="wrapper__auth--login" @click="modal.openModal" v-if="!auth.isAuthenticated">
          <Icon alt="" name="login" width="18" height="18" /> Sign in
        </div>
        <div class="wrapper__auth--profile" v-else>
          <ProfileBadge v-if="auth.user" />
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
    max-width: 900px;
    height: 100%;

    &__logo,
    &__auth {
      display: flex;
      justify-content: center;
      align-items: center;
    }

    &__logo {
      font-weight: bold;
      font-size: 1.2rem;
      color: $primary-color;

      img {
        margin-right: 0.5rem;
      }
    }

    &__auth--login {
      background: $primary-color;
      color: $white-color;
      border-radius: 2rem;
      font-weight: 500;
      transition: scale 300ms ease-in-out;
      cursor: pointer;
      padding: 0.5rem 1rem;
      display: flex;
      justify-content: center;
      align-items: center;

      &:hover {
        scale: 105%;
      }

      img {
        margin-right: 0.5rem;
      }
    }

    &__auth--profile {
    }
  }
}
</style>
