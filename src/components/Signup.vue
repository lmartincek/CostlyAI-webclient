<script setup lang="ts">
import {computed, ref, watch} from 'vue';
import FullscreenModal from './FullscreenModal.vue';
import ButtonBasic from './ButtonBasic.vue';
import TextInput from './TextInput.vue';
import Checkbox from './Checkbox.vue';
import Spinner from './Spinner.vue';
import { useAuthStore } from '../stores/authStore.ts';
import {useModalStore} from "../stores/modalsStore.ts";
import {useNotificationsStore} from "../stores/notificationsStore.ts";

const auth = useAuthStore();

const email = ref<string>('');
const password = ref<string>('');
const rememberMe = ref<boolean>(false)
const errors = ref<{ email?: string; password?: string[], form?: string }>({});

const validateRealtime = ref<boolean>(false)

const validateEmail = () => {
    if (!email.value) {
        errors.value.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email.value)) {
        errors.value.email = 'Email is invalid';
    } else {
        errors.value.email = '';
    }
}

watch(email, () => {
    if (validateRealtime.value) {
        validateEmail()
    }
});

const validatePassword = (password: string) => {
    const errors: string[] = [];

    if (password.length < 8) {
        errors.push('Password must be at least 8 characters.');
    }
    if (!/[a-z]/.test(password)) {
        errors.push('Password must contain at least one lowercase letter (a-z).');
    }
    if (!/[A-Z]/.test(password)) {
        errors.push('Password must contain at least one uppercase letter (A-Z).');
    }
    if (!/\d/.test(password)) {
        errors.push('Password must contain at least one digit (0-9).');
    }
    if (!/[~`!@#$%^&*()_\-+={[}\]|\\:;"'<,>.?/]/.test(password)) {
        errors.push('Password must contain at least one symbol: ~`!@#$%^&*()_-+={[}]|\\:;"\'<,>.?/');
    }

    return errors;
};

watch(password, (newPassword) => {
    if (validateRealtime.value) {
        errors.value.password = validatePassword(newPassword);
    }
});

const validateForm = () => {
    validateRealtime.value = true

    validateEmail()
    errors.value.password = password.value ? validatePassword(password.value) : ['Password is required']

    if (errors.value.email) {
        return false
    } else if (errors.value.password && errors.value.password.length) {
        return false
    }

    return true
};

const AuthStep = {
    SignIn: 1,
    SignUp: 2,
} as const;

type AuthStep = (typeof AuthStep)[keyof typeof AuthStep];
const step = ref<AuthStep>(AuthStep.SignIn);
const stepText = computed(() => step.value === AuthStep.SignIn ? 'Sign In' : 'Sign Up')

const isLoading = ref<boolean>(false);

const { showNotification } = useNotificationsStore()
const handleSubmit = async () => {
    if (!validateForm()) return;

    isLoading.value = true;
    try {
        if (step.value === AuthStep.SignIn) {
            try {
                await auth.login(email.value, password.value, null, rememberMe.value);
                showNotification({
                    message: "Successfully logged in",
                })
            } catch (e) {
                showNotification({
                    message: e.message,
                    type: "error"
                })
            }
        } else if (step.value === AuthStep.SignUp) {
            try {
                await auth.register(email.value, password.value, rememberMe.value);
                showNotification({
                    message: "Registered and logged in",
                })
            } catch (e) {
                showNotification({
                    message: e.message,
                    type: "error"
                })
            }
        }
    } catch (error: any) {
        errors.value.form = error;
    } finally {
        isLoading.value = false;
        useModalStore().isOpen = false;
    }
};

const handleOAuthLogin = (provider: 'google' | 'apple') => {
    auth.login(null, null, provider);
};
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
                    <div :class="['sign-in', { active: step === AuthStep.SignIn }]" @click="step = AuthStep.SignIn">
                        Sign In
                    </div>
                    <div :class="['sign-up', { active: step === AuthStep.SignUp }]" @click="step = AuthStep.SignUp">
                        Sign Up
                    </div>
                </div>

<!--             TODO add errors.form -->
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

                        <div class="input-wrapper">
                            <label for="password">Password</label>
                            <TextInput
                                id="password"
                                class="input-wrapper__input"
                                v-model="password"
                                type="password"
                                autocomplete="current-password"
                            />
                            <template v-for="error in errors.password">
                                <span v-if="error" class="error">{{ error }}</span>
                            </template>
                        </div>

                        <div class="actions">
                            <div class="actions__checkbox">
                                <Checkbox @update:is-checked="rememberMe = $event">Remember me</Checkbox>
                            </div>
                            <div class="actions__forgot-password">
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
                            <hr>
                            <span>Or continue with</span>
                        </div>

                        <div class="socials">
                            <ButtonBasic
                                class="socials__btn"
                                button-class="btn-white"
                                @click="handleOAuthLogin('google')"
                            >
                                <font-awesome-icon icon="fa-brands fa-google" style="margin-right: 5px"/>
                                {{ stepText }} with Google
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
            color: $white-color
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
                transition: .15s ease-in-out;

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
                margin: .75rem 0;

                &__input {
                    display: flex;
                    width: 100%;
                }
            }

            .actions {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin: 1.5rem 0;

                &__forgot-password {
                    color: $primary-color;
                    cursor: pointer;
                }
            }

            .credentials-btn {
                width: 100%;
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
                    padding: .5rem;
                    font-size: .8rem;
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