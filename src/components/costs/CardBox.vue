<script setup lang="ts">
import Icon from '@/components/common/IconCostly.vue'
import {getIconContext} from "@/utils/iconFolderHelper.ts";

defineProps({
  imgLeft: {
    type: String,
    required: false,
  },
  imgRight: {
    type: String,
    required: false,
    default: 'arrow-right',
  },
  text: {
    type: String,
    required: false,
  },
  isClickable: {
    type: Boolean,
    required: false,
    default: true,
  },
})
</script>

<template>
  <div :class="['card', { clickable: isClickable }]">
    <div v-if="$slots['floating-label']"
         class="floating-label"><slot name="floating-label"/></div>
    <div class="card__icon card__icon--left" v-if="imgLeft">
      <Icon :name="imgLeft" :folder="getIconContext(imgLeft)" alt="" />
    </div>
    <div class="card__text">
      <div class="headline"><slot name="headline" /></div>
      <div class="text" v-if="text">{{ text }}</div>
    </div>
    <div class="card__icon card__icon--right" v-if="imgRight">
      <Icon :name="imgRight" alt="" />
    </div>
  </div>
</template>

<style scoped lang="scss">
.card {
  background: $white-color;
  border-radius: 0.75rem;
  max-width: 350px;
  min-height: 75px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  text-align: center;
  padding: 0.75rem 1.25rem;
  border: 1px solid transparent;
  position: relative;

  &.clickable {
    cursor: pointer;
    transition: 0.3s ease-in-out;

    &:hover {
      border-color: $primary-color;
    }
  }

  .floating-label {
    position: absolute;
    top: 2.5px;
    left: 10px;
    font-size: .75rem;
  }

  &__icon--left {
    background: $border-color;
    padding: 0.25rem 0.4rem;
    border-radius: 0.5rem;
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
