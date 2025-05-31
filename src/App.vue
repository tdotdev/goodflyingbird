<template>
  <header>
    <Header></Header>
  </header>
  <main style="display: flex; flex: 1; flex-direction: column;">
    <router-view style="flex: 1;"/>
  </main>
  <footer></footer>
</template>

<script setup lang="ts">
import Header from './components/Header.vue';

</script>

<style scoped>
</style>