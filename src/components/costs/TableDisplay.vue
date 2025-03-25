<script setup lang="ts">
defineProps(['data', 'category'])
</script>

<template>
  <table class="table-wrapper">
    <thead class="table-wrapper__header">
      <tr>
        <th aria-label="Product category">
          {{ category }}
        </th>
      </tr>
    </thead>
    <tbody class="table-wrapper__body">
      <tr class="row">
        <td><b>Item</b></td>
        <td><b>Price</b></td>
      </tr>
      <tr v-for="(value, key) in data" :key="key" class="row">
        <td class="name" aria-label="Product name">{{ value.name }}</td>
        <td class="price" aria-label="Product price"
          ><b>${{ value.price.toFixed(2) }} USD</b></td
        >
      </tr>
    </tbody>
  </table>
</template>

<style lang="scss">
.table-wrapper {
  color: #000;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  background-color: #fff;
  margin: 1rem 0 1.5rem;
  border-radius: 1rem;
  flex: 1 1 300px;
  min-width: 200px;

  &__header {
    background: $primary-gradient;
    color: $white-color;
    font-size: 1.15rem;
    font-weight: 500;
    text-align: left;

    th {
      border-radius: 1rem 1rem 0 0;
      padding: 1rem 1.5rem;
      &::first-letter {
        text-transform: capitalize;
      }
    }
  }

  &__body {
    color: $text-color;

    .row {
      margin: 1rem 1.5rem 0;
      padding: 0 0 1rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid $border-color;

      &:first-of-type {
        text-decoration: underline;
      }

      &:last-of-type {
        border-bottom: none;
        margin-bottom: 0.5rem;
      }

      &:first-of-type {
        margin-top: 1.5rem;
      }

      .name {
        text-align: left;
      }

      .price {
        text-align: right;
      }
    }
  }
}
</style>
