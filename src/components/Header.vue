<template>
<div class="container">
  <div class="inner" style="display: flex; flex-direction: row;" v-if="true === false">
    <RouterLink class="link" to="/">Home</RouterLink>
    <span class="break">•</span>
    <RouterLink class="link" to="/fretgod">Fret God</RouterLink>
    <span class="break">•</span>
    <RouterLink class="link" to="/bluecondition">The Blue Condition</RouterLink>
    <span class="break">•</span>
    <RouterLink class="link" to="/supercircle">Super Circle</RouterLink>
    <span class="break">•</span>
    <RouterLink class="link" to="/mbrot">Mandelbrot Viewer</RouterLink>
    <span class="break">•</span>
    <!--<RouterLink class="link" to="/gametwo">Game 2</RouterLink>
    <span class="break">•</span>
    <RouterLink class="link" to="/mattmcdade">Matt McDade</RouterLink>-->
  </div>
</div>
</template>

<script setup lang="ts">

</script>

<style scoped>
.container {
  display: flex;
  background-color: rgb(22, 22, 22);
  flex-direction: column;
  align-items: center;
  z-index: 2;
}

.inner {
  padding: 10px;
}

.break {
  margin-left: 10px;
  margin-right: 10px;
  color: white;
}

.link {
  display: block;
}
</style>
