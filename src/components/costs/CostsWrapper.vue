<script setup lang="ts">
import { useModalStore } from '@/stores/modalsStore.ts'
import { useAuthStore } from '@/stores/authStore.ts'
import Spinner from '@/components/common/SpinnerCostly.vue'
import Icon from '@/components/common/IconCostly.vue'
import TableDisplay from '@/components/costs/TableDisplay.vue'
import IconCostly from '@/components/common/IconCostly.vue'
import type { ProductGroups } from '@/types/products'
import type { LastDataset } from '@/composables/productsProvider.ts'
import { useTemplateRef } from 'vue'

defineProps<{
  productsLoading: boolean
  productsByCategory: ProductGroups | null
  lastDataset: LastDataset
}>()

const costsWrapperRef = useTemplateRef('costsWrapperRef')
defineExpose({ costsWrapperRef })
</script>

<template>
  <div class="wrapper-data" ref="costsWrapperRef">
    <template v-if="productsLoading">
      <div class="loader">
        <Spinner />
      </div>
      <span>Fetching latest prices... This might take a few moments, <b>please wait...</b></span>
    </template>
    <template v-if="productsByCategory !== null">
      <p v-if="lastDataset.country" class="wrapper-data__last-country">
        Current avg. prices in
        <b>
          {{
            lastDataset.city
              ? `${lastDataset.city.name}, ${lastDataset.country.name}`
              : lastDataset.country.name
          }}
        </b>
        <IconCostly :name="lastDataset.country.code" folder="flags" alt="" />
      </p>
      <div v-if="lastDataset.date && lastDataset.country" class="wrapper-data__info">
        <p>
          Data updated on: <b>{{ lastDataset.date }}</b>
        </p>
        <p
          @click="useModalStore().openModal"
          class="login-text"
          v-if="!useAuthStore().isAuthenticated"
        >
          <Icon alt="" name="star" width="18" height="18" />
          Sign up to create your own costs w/ fresh data
        </p>
      </div>

      <div
        class="wrapper-data__table"
        v-if="productsByCategory"
        aria-live="polite"
        aria-label="Product tables with their prices and names"
      >
        <template v-for="(products, category) in productsByCategory" :key="category">
          <TableDisplay :data="products" :category="category" />
        </template>
      </div>
    </template>
  </div>
</template>

<style scoped lang="scss">
.wrapper-data {
  margin: 4rem 0;
  scroll-margin-top: 7rem;

  &__last-country {
    display: flex;
    align-items: center;
    justify-content: center;

    b {
      margin: 0 0.25rem;
    }

    img {
      margin: 0 0.25rem;
    }
  }

  .error {
    color: $error-color;
  }

  .loader {
    margin: 4rem 0 1rem;
  }

  &__table {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 0.625rem;
  }

  &__info {
    display: flex;
    text-align: left;
    flex-direction: column;

    @include respond-md {
      flex-direction: row;
      justify-content: space-between;
    }

    .login-text {
      color: $primary-color;
      cursor: pointer;
      display: flex;
      align-items: center;

      img {
        margin-right: 0.25rem;
      }

      &:hover {
        text-decoration: underline;
      }
    }
  }
}
</style>
