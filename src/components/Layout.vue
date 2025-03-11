<script setup lang="ts">

</script>

<template>
<div class="layout">
    <slot/>
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
}
</style>