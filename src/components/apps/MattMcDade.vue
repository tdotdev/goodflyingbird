<template>
  <div class="container">
    <div style="flex: 1;">asdasd</div>
    <iframe src="https://mattmcdade.com/" id="matt" ref="iframe" frameBorder="0">
    </iframe>
    <div>asdasd</div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const iframe = ref<HTMLIFrameElement | null>(null)

</script>


<style scoped>

.container {
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly; 
  align-items: center;
  flex: 1;
  background-color: red;
}

#matt {
  width: 100%;
  height: 100%;
  flex: 1;
}
</style>