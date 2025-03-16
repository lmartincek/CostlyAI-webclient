<script setup lang="ts">
import Nav from './NavCostly.vue'
</script>

<template>
  <header>
    <Nav />
  </header>
  <div class="layout">
    <div class="layout__headline">
      <slot name="headline" />
    </div>
    <div class="layout__content">
      <slot name="content" />
    </div>
  </div>
</template>

<style scoped lang="scss">
.layout {
  min-width: 320px;
  min-height: 100vh;
  max-width: 900px;
  margin: 0 auto;
  text-align: center;
  padding: 0 1rem;

  &__headline {
    max-width: 600px;
    padding: 0 1rem;
    margin: 0 auto;
  }
}
</style>
