<script setup lang="ts">
import Nav from '@/components/layout/NavCostly.vue'
import FooterCostly from '@/components/layout/FooterCostly.vue'
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
  <FooterCostly />
</template>

<style scoped lang="scss">
.layout {
  min-width: 320px;
  min-height: 90vh;
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
