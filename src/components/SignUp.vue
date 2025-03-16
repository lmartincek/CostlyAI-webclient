<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import FullscreenModal from '@/components/FullscreenModal.vue'
import ButtonBasic from '@/components/ButtonBasic.vue'
import TextInput from '@/components/TextInput.vue'
import Checkbox from '@/components/CheckBox.vue'
import Spinner from '@/components/SpinnerCostly.vue'
import { useAuthStore } from '@/stores/authStore.ts'
import { useModalStore } from '@/stores/modalsStore.ts'
import { useNotificationsStore } from '@/stores/notificationsStore.ts'
import {resetPassword} from "@/services/authService.ts";

const auth = useAuthStore()

const email = ref<string>('')
const password = ref<string>('')
const rememberMe = ref<boolean>(false)
const errors = ref<{ email?: string; password?: string[] }>({})

const validateRealtime = ref<boolean>(false)

const validateEmail = () => {
  if (!email.value) {
    errors.value.email = 'Email is required'
  } else if (!/\S+@\S+\.\S+/.test(email.value)) {
    errors.value.email = 'Email is invalid'
  } else {
    errors.value.email = ''
  }
}

watch(email, () => {
  if (validateRealtime.value) {
    validateEmail()
  }
})

const validatePassword = (password: string) => {
  const errors: string[] = []

  if (password.length < 8) {
    errors.push('Password must be at least 8 characters.')
  }
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter (a-z).')
  }
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter (A-Z).')
  }
  if (!/\d/.test(password)) {
    errors.push('Password must contain at least one digit (0-9).')
  }
  if (!/[~`!@#$%^&*()_\-+={[}\]|\\:;"'<,>.?/]/.test(password)) {
    errors.push('Password must contain at least one symbol: ~`!@#$%^&*()_-+={[}]|\\:;"\'<,>.?/')
  }

  return errors
}

watch(password, (newPassword) => {
  if (validateRealtime.value) {
    errors.value.password = validatePassword(newPassword)
  }
})

const validateForm = () => {
  validateRealtime.value = true

  validateEmail()
  errors.value.password = password.value
    ? validatePassword(password.value)
    : ['Password is required']

  if (errors.value.email) {
    return false
  } else if (errors.value.password && errors.value.password.length) {
    return false
  }

  return true
}

const AuthStep = {
  SignIn: 1,
  SignUp: 2,
  ForgotPassword: 3,
} as const

type AuthStep = (typeof AuthStep)[keyof typeof AuthStep]
const step = ref<AuthStep>(AuthStep.SignIn)
const stepText = computed(() => {
  if (step.value === AuthStep.SignIn) return 'Sign In'
  else if (step.value === AuthStep.SignUp) return 'Sign Up'
  else return 'Set new password'
})

const isLoading = ref<boolean>(false)

const { showNotification } = useNotificationsStore()
const modal = useModalStore()
const handleSubmit = async () => {
  if (step.value === AuthStep.ForgotPassword) {
    validateEmail()

    if (errors.value.email) {
      return
    }

    try {
      await resetPassword(email.value)
      showNotification({
        message: 'Please, go and check your email',
      })
    } catch (e) {
      showNotification({
        message: e.message,
        type: 'error',
      })
    } finally {
      modal.isOpen = false
    }

    return
  }

  if (!validateForm()) return

  isLoading.value = true
  try {
    if (step.value === AuthStep.SignIn) {
      try {
        await auth.login(email.value, password.value, null, rememberMe.value)
        showNotification({
          message: 'Successfully logged in',
        })
      } catch (e) {
        showNotification({
          message: e.message,
          type: 'error',
        })
      }
    } else if (step.value === AuthStep.SignUp) {
      try {
        await auth.register(email.value, password.value)
        showNotification({
          message: 'Please, go check and confirm your email',
          duration: 5000
        })
      } catch (e) {
        showNotification({
          message: e.message,
          type: 'error',
        })
      }
    }
  } catch (error) {
    console.error(error.message)
  } finally {
    isLoading.value = false
    modal.isOpen = false
  }
}

const handleOAuthLogin = (provider: 'google' | 'apple') => {
  auth.login(null, null, provider)
}
</script>

<template>
  <FullscreenModal>
    <div class="signup-wrapper">
      <div class="signup-wrapper__header">
        <h2>Welcome to CostlyAI</h2>
        <p>Access personalized options</p>
      </div>
      <div class="signup-wrapper__body">
        <div class="type">
          <div
            :class="['sign-in', { active: step === AuthStep.SignIn }]"
            @click="step = AuthStep.SignIn"
          >
            Sign In
          </div>
          <div
            :class="['sign-up', { active: step === AuthStep.SignUp }]"
            @click="step = AuthStep.SignUp"
          >
            Sign Up
          </div>
        </div>

        <form @submit.prevent="handleSubmit">
          <div class="credentials">
            <div class="input-wrapper">
              <label for="email">Email Address</label>
              <TextInput
                id="email"
                class="input-wrapper__input"
                v-model="email"
                placeholder="your@email.com"
                autocomplete="email"
              />
              <span v-if="errors.email" class="error">{{ errors.email }}</span>
            </div>

            <div class="input-wrapper" v-if="step !== AuthStep.ForgotPassword">
              <label for="password">Password</label>
              <TextInput
                id="password"
                class="input-wrapper__input"
                v-model="password"
                type="password"
                autocomplete="current-password"
              />
              <template v-for="(error, i) in errors.password" :key="'signup-form-error' + i">
                <span v-if="error" class="error">{{ error }}</span>
              </template>
            </div>

            <div class="actions" v-if="step === AuthStep.SignIn">
              <div class="actions__checkbox">
                <Checkbox @update:is-checked="rememberMe = $event">Remember me</Checkbox>
              </div>
              <div class="actions__forgot-password" @click="step = AuthStep.ForgotPassword">
                <span>Forgot password?</span>
              </div>
            </div>

            <ButtonBasic type="submit"
                         class="credentials-btn"
                         v-if="!isLoading">
              {{ stepText }}
            </ButtonBasic>
            <Spinner v-else />

            <div class="breakthrough">
              <hr />
              <span>Or continue with</span>
            </div>

            <div class="socials">
              <ButtonBasic
                class="socials__btn"
                button-class="btn-white"
                @click="handleOAuthLogin('google')"
              >
                <font-awesome-icon icon="fa-brands fa-google" style="margin-right: 5px" />
                Google
              </ButtonBasic>
            </div>
          </div>
        </form>
      </div>
    </div>
  </FullscreenModal>
</template>
<style scoped lang="scss">
.error {
  color: $error-color;
  font-size: 0.875rem;
  margin-top: 0.25rem;
}
</style>

<style scoped lang="scss">
.signup-wrapper {
  &__header {
    background: $primary-gradient;
    display: flex;
    flex-direction: column;
    padding: 1.25rem 2rem;

    h2 {
      margin: 0;
      color: $white-color;
    }

    p {
      margin: 0;
      color: $white-color;
    }
  }

  &__body {
    .type {
      display: flex;
      justify-content: space-around;
      align-items: center;
      height: 3rem;
      text-align: center;

      div {
        border-bottom: 1px solid $border-color;
        width: 100%;
        cursor: pointer;
        padding: 1rem;
        transition: 0.15s ease-in-out;

        &:hover {
          color: $primary-color;
          border-bottom: 1px solid $primary-color;
        }

        &.active {
          color: $primary-color;
          font-weight: bold;
          border-bottom: 2px solid $primary-color;
        }
      }
    }

    .credentials {
      padding: 2rem;

      .input-wrapper {
        display: flex;
        flex-direction: column;
        margin: 0.75rem 0;

        &__input {
          display: flex;
          width: 100%;
        }
      }

      .actions {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin: 1.5rem 0 .5rem;

        &__forgot-password {
          color: $primary-color;
          cursor: pointer;
          font-size: .9rem;
        }
      }

      .credentials-btn {
        width: 100%;
        margin-top: 1rem;
      }

      .breakthrough {
        position: relative;
        margin: 2rem 0;

        span {
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
          z-index: 10;
          background: $white-color;
          padding: 0.5rem;
          font-size: 0.8rem;
        }
      }

      .socials {
        display: flex;
        justify-content: space-between;

        &__btn {
          width: 100%;
        }
      }
    }
  }
}
</style>
