<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import FullscreenModal from '@/components/modal/FullscreenModal.vue'
import ButtonBasic from '@/components/common/ButtonBasic.vue'
import TextInput from '@/components/input/TextInput.vue'
import Checkbox from '@/components/input/CheckBox.vue'
import Spinner from '@/components/common/SpinnerCostly.vue'
import { useAuthStore } from '@/stores/authStore.ts'
import { useModalStore } from '@/stores/modalsStore.ts'
import { useNotificationsStore } from '@/stores/notificationsStore.ts'
import { resetPassword } from '@/services/authService.ts'

const auth = useAuthStore()

const email = ref<string>('')
const errorEmail = ref<string>('')
const validateEmail = () => {
  if (!email.value) {
    errorEmail.value = 'Email is required'
  } else if (!/\S+@\S+\.\S+/.test(email.value)) {
    errorEmail.value = 'Email is invalid'
  } else {
    errorEmail.value = ''
  }
}

watch(email, () => {
  validateEmail()
})

const ErrorsPassword = {
  Length: 1,
  LowerCase: 2,
  UpperCase: 3,
  Digit: 4,
} as const

const errorPassword = ref<string>('')

const errorsPassword = ref<{ id: number; label: string; isFulfilled: boolean }[]>([
  { id: ErrorsPassword.Length, label: '8 characters minimum', isFulfilled: false },
  { id: ErrorsPassword.LowerCase, label: 'One lowercase character', isFulfilled: false },
  { id: ErrorsPassword.UpperCase, label: 'One uppercase character', isFulfilled: false },
  { id: ErrorsPassword.Digit, label: 'One number', isFulfilled: false },
])

const validatePassword = (password: string) => {
  if (step.value === AuthStep.SignIn) {
    errorPassword.value = !password ? 'Password is required' : ''
    return
  }

  if (step.value === AuthStep.SignUp) {
    errorsPassword.value.find((e) => e.id === ErrorsPassword.Length)!.isFulfilled =
      password.length >= 8
    errorsPassword.value.find((e) => e.id === ErrorsPassword.LowerCase)!.isFulfilled = /[a-z]/.test(
      password,
    )
    errorsPassword.value.find((e) => e.id === ErrorsPassword.UpperCase)!.isFulfilled = /[A-Z]/.test(
      password,
    )
    errorsPassword.value.find((e) => e.id === ErrorsPassword.Digit)!.isFulfilled = /\d/.test(
      password,
    )
  }
}

const password = ref('')

watch(password, (newPassword) => {
  validatePassword(newPassword)
})

const validateForm = () => {
  validateEmail()
  validatePassword(password.value)

  if (errorEmail.value) {
    return false
  } else if (errorsPassword.value.find((error) => error.isFulfilled === false)) {
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
const rememberMe = ref<boolean>(false)

const handleSubmit = async () => {
  if (step.value === AuthStep.ForgotPassword) {
    validateEmail()

    if (errorEmail.value) {
      return
    }

    try {
      await resetPassword(email.value)
      showNotification({
        message: 'Please, go and check your email',
        duration: 5000,
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
          duration: 5000,
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

const handleOAuthLogin = async (provider: 'google' | 'apple') => {
  try {
    await auth.login(null, null, provider)
  } catch (e) {
    showNotification({
      message: e.message,
      type: 'error',
    })
  }
}

const setStep = (stepValue: AuthStep) => {
  step.value = stepValue
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
            tabindex="0"
            :class="['sign-in', { active: step === AuthStep.SignIn }]"
            @keydown.enter="setStep(AuthStep.SignIn)"
            @click="setStep(AuthStep.SignIn)"
          >
            Sign In
          </div>
          <div
            tabindex="0"
            :class="['sign-up', { active: step === AuthStep.SignUp }]"
            @keydown.enter="setStep(AuthStep.SignUp)"
            @click="setStep(AuthStep.SignUp)"
          >
            Sign Up
          </div>
        </div>

        <form @submit.prevent="handleSubmit">
          <div class="credentials">
            <div class="input-wrapper">
              <TextInput
                name="email"
                label="Email Address"
                class="input-wrapper__input"
                v-model="email"
                placeholder="your@email.com"
                autocomplete="email"
                autofocus
              />
              <span v-if="errorEmail" class="error">{{ errorEmail }}</span>
            </div>

            <div class="input-wrapper" v-if="step !== AuthStep.ForgotPassword">
              <TextInput
                name="password"
                label="Password"
                class="input-wrapper__input"
                v-model="password"
                type="password"
                autocomplete="current-password"
              />
              <template v-if="step === AuthStep.SignIn">
                <span v-if="errorPassword" class="error">{{ errorPassword }}</span>
              </template>
              <div class="input-wrapper__password-errors" v-if="step === AuthStep.SignUp">
                <template v-for="(error, i) in errorsPassword" :key="'signup-form-error' + i">
                  <span :class="['error', { fulfilled: error.isFulfilled }]">
                    <font-awesome-icon
                      :icon="
                        error.isFulfilled ? 'fa-solid fa-square-check' : 'fa-solid fa-square-xmark'
                      "
                    />
                    {{ error.label }}
                  </span>
                </template>
              </div>
            </div>

            <div class="actions" v-if="step === AuthStep.SignIn">
              <div class="actions__checkbox">
                <Checkbox @update:is-checked="rememberMe = $event">Remember me</Checkbox>
              </div>
              <div
                class="actions__forgot-password"
                tabindex="0"
                @keydown.enter="setStep(AuthStep.ForgotPassword)"
                @click="setStep(AuthStep.ForgotPassword)"
              >
                <span>Forgot password?</span>
              </div>
            </div>

            <ButtonBasic type="submit" class="credentials-btn" v-if="!isLoading">
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
  font-size: 0.75rem;
  margin-top: 0.25rem;

  svg {
    height: 1rem;
    width: 1rem;
    color: $border-color;
    position: relative;
    top: 2px;
  }

  &.fulfilled svg {
    color: $primary-color;
  }
}

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

        &__password-errors {
          display: flex;
          flex-wrap: wrap;
          margin-top: 0.5rem;

          .error {
            flex: 50%;
            color: $text-color;
          }
        }
      }

      .actions {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin: 1.5rem 0 0.5rem;

        &__forgot-password {
          color: $primary-color;
          cursor: pointer;
          font-size: 0.9rem;
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
