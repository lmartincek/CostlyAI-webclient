<template>
  <LayoutCostly>
    <template v-slot:headline>
      <h1>
        CostlyAI
        <hr />
        Not Found
      </h1>
      <p>
        Seems like you got somewhere where you're not supposed to be. Do you want to go
        <router-link to="/">back</router-link>?
      </p>
    </template>
  </LayoutCostly>
</template>

<script setup lang="ts">
import LayoutCostly from '@/components/layout/LayoutCostly.vue'
</script>

<style></style>
