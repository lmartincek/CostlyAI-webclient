<script setup lang="ts">
defineProps({
    imgLeft: {
        type: String,
        required: false
    },
    imgRight: {
        type: String,
        required: false,
        default: '/src/assets/icons/arrow-right.svg'
    },
    text: {
        type: String,
        required: false
    },
    isClickable: {
        type: Boolean,
        required: false,
        default: true,
    }
})
</script>

<template>
  <div :class="['card', {clickable: isClickable}]">
      <div class="card__icon card__icon--left" v-if="imgLeft">
          <img :src=imgLeft width="24" height="24" alt="flag"/>
      </div>
      <div class="card__text">
        <div class="headline"><slot name="headline"/></div>
        <div class="text" v-if="text">{{text}}</div>
      </div>
      <div class="card__icon card__icon--right" v-if="imgRight">
          <img :src=imgRight width="24" height="24" alt="icon"/>
      </div>
  </div>
</template>

<style scoped lang="scss">
.card {
  background: $white-color;
  border-radius: .75rem;
  max-width: 350px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: .75rem 1rem;
  border: 1px solid transparent;

  &.clickable {
    cursor: pointer;
    transition: .3s ease-in-out;

    &:hover {
      border-color: $primary-color;
    }
  }

  &__icon--left {
    background: $border-color;
    padding: .25rem .4rem;
    border-radius: .5rem;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .headline {
    font-size: 1.1rem;
    font-weight: 600;
    color: $headline-color;
  }

  .text {
  }
}
</style>