<script setup lang="ts">
import FullscreenModal from "./FullscreenModal.vue";
import ButtonBasic from "./ButtonBasic.vue";
import TextInput from "./TextInput.vue";
</script>

<template>
  <FullscreenModal>
      <div class="signup-wrapper">
          <div class="signup-wrapper__header">
              <h2>Welcome to CostlyAI</h2>
              <p>Access personalized option</p>
          </div>
          <div class="signup-wrapper__body">
              <div class="type">
                  <div class="sign-in">Sign In</div>
                  <div class="sign-up">Sign Up</div>
              </div>
<!--              TODO - add form-->
              <div class="credentials">
                  <div class="input-wrapper">
                    <label for="">Email Address</label>
                    <TextInput class="input-wrapper__input"
                               placeholder="your@email.com"/>
                  </div>
                  <div class="input-wrapper">
                      <label for="">Password</label>
                      <TextInput class="input-wrapper__input"
                                 type="password"/>
                  </div>

                  <div class="actions">
                      <div class="actions__checkbox">
                        <input type="checkbox">Remember me
                      </div>
                      <div class="actions__forgot-password">
                        <span>Forgot password?</span>
                      </div>
                  </div>

                  <ButtonBasic class="credentials-btn">Sign In</ButtonBasic>

                  <div class="breakthrough">
                      <hr>
                      <span>Or continue with</span>
                  </div>

                  <div class="socials">
                      <ButtonBasic class="socials__btn"
                                   button-class="btn-white">Google</ButtonBasic>
                      <ButtonBasic class="socials__btn"
                                   button-class="btn-white">Apple</ButtonBasic>
                  </div>
              </div>
          </div>
      </div>
  </FullscreenModal>
</template>

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
                border-bottom: 1px solid ;
                width: 100%;
                cursor: pointer;
                padding: 1rem;

                &:hover {
                    color: $primary-color;
                    border-bottom: 1px solid $primary-color;
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
                margin: 1.5rem 0;

                &__checkbox {
                //    TODO - checkbox
                }

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

                    &:first-of-type {
                        margin-right: 1rem;
                    }
                }
            }
        }
    }
}
</style>