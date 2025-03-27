<script setup lang="ts">
import { useModalStore } from '@/stores/modalsStore.ts'
import Icon from '@/components/common/IconCostly.vue'
import { useAuthStore } from '@/stores/authStore.ts'
import ProfileBadge from '@/components/user/ProfileBadge.vue'
import { useRoute } from 'vue-router'
import { computed } from 'vue'
import type { RoutePaths } from '@/router'

const modal = useModalStore()
const auth = useAuthStore()

const route = useRoute()
const path = computed<RoutePaths>(() => route.path as RoutePaths)
</script>

<template>
  <nav>
    <div class="wrapper">
      <div class="wrapper__logo">
        <router-link to="/"
          ><Icon alt="logo" name="globe" width="26" height="26" /> CostlyAI</router-link
        >
      </div>

      <div class="wrapper__auth">
        <router-link to="/communities" v-show="path !== '/communities'">Communities</router-link>
        <div class="wrapper__auth--login" @click="modal.openModal" v-if="!auth.isAuthenticated">
          <Icon alt="" name="login" width="18" height="18" /> <span>Sign in</span>
        </div>
        <div class="wrapper__auth--profile" v-else>
          <router-link to="/my-recent-searches" v-show="path !== '/my-recent-searches'">
            My recent searches</router-link
          >
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

      a {
        display: flex;
        align-items: center;
      }

      img {
        margin-right: 0.5rem;
      }
    }

    &__auth a {
      margin-right: 1rem;

      @include respond-md {
        margin-right: 2rem;
      }
    }

    &__auth--login {
      background: $primary-color;
      color: $white-color;
      border-radius: 2rem;
      font-weight: 500;
      transition: scale 300ms ease-in-out;
      cursor: pointer;
      padding: 0.5rem;
      display: flex;
      justify-content: center;
      align-items: center;

      &:hover {
        scale: 105%;
      }

      span {
        display: none;
      }

      @include respond-md {
        padding: 0.5rem 1rem;

        span {
          display: flex;
        }

        img {
          margin-right: 0.5rem;
        }
      }
    }

    &__auth--profile {
      display: flex;
      align-items: center;

      a {
        display: none;

        @include respond-md {
          display: flex;
        }
      }
    }
  }
}
</style>
