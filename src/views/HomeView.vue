<template>
  <LayoutCostly>
    <template v-slot:headline>
      <h1>CostlyAI</h1>
      <p>
        Discover living costs worldwide, compare prices and plan your travel budget with real-time
        data from cities around the globe
      </p>
    </template>

    <template v-slot:content>
      <SearchCosts />
      <CostsWrapper />
      <RecentlySearched />
    </template>
  </LayoutCostly>
</template>

<script setup lang="ts">
import CostsWrapper from '@/components/costs/CostsWrapper.vue'
import LayoutCostly from '@/components/layout/LayoutCostly.vue'
import RecentlySearched from '@/components/costs/RecentlySearched.vue'
import SearchCosts from '@/components/costs/SearchCosts.vue'
</script>

<style lang="scss" scoped></style>
