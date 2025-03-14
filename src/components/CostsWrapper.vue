<script setup lang="ts">
import {useModalStore} from "../stores/modalsStore.ts";
import {useAuthStore} from "../stores/authStore.ts";
import Spinner from "./Spinner.vue";
import Icon from "./Icon.vue";
import TableDisplay from "./TableDisplay.vue";
import {useProductsStore} from "../stores/productsStore.ts";
import type {LastDataset} from "../stores/productsStore.ts";
import {computed} from "vue";
import {groupProductsByCategory} from "../utils/objectHelpers.ts";

const productsStore = useProductsStore();
const productsByCategory = computed(() => {
    if (productsStore.products) return groupProductsByCategory(productsStore.products)
    return []
})

const lastDataset = computed<LastDataset>(() => {
    return productsStore.lastDataset
})
</script>

<template>
    <div class="wrapper-data" v-show="productsStore.loading || productsStore.products">
        <template v-if="productsStore.loading">
            <div class="loader">
                <Spinner/>
            </div>
            <span>Fetching latest prices... This might take a few moments, <b>please wait...</b></span>
        </template>
        <div v-if="productsStore.error" class="error">{{ productsStore.error }}</div>
        <template v-if="productsStore.products">
            <p v-if="lastDataset.country">
                Current avg. prices in
                <b>{{lastDataset.city
                    ? `${lastDataset.city.name}, ${lastDataset.country.name}`
                    : lastDataset.country.name}}
                </b>.
            </p>
            <div v-if="lastDataset.date && lastDataset.country" class="wrapper-data__info">
                <p>Data updated on: <b>{{lastDataset.date}}</b></p>
                <p @click="useModalStore().openModal"
                   class="login-text"
                   v-if="!useAuthStore().isAuthenticated"
                ><Icon alt="" name="star" width="18" height="18" />
                    Sign up to create your own costs w/ fresh data
                </p>
            </div>

            <div class="wrapper-data__table">
                <template v-for="(products, category) in productsByCategory">
                    <TableDisplay :data="products" :category="category"/>
                </template>
            </div>
        </template>
    </div>
</template>

<style scoped lang="scss">
.wrapper-data {
  margin: 4rem 0;

  .error {
    color: $error-color;
  }

  .loader {
    margin: 4rem 0 1rem;
  }

  &__table {
    display: flex;
    justify-content: space-between;
    flex-direction: column;
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
        margin-right: .25rem;
      }

      &:hover{
        text-decoration: underline;
      }
    }
  }
}
</style>