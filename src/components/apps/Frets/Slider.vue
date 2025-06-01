<template>
  <div class="container">
    <input
        v-model="sliderModel"
        type="range"
        :min="min"
        :max="max"
        @pointerdown="handlePointerDown"
        @pointerup="handlePointerUp"
        class="slider"
      /> 
      <p :style="computedStyle">
        {{ label ? `${label}` : '' }}: {{ normalize && model ? normalizeNumber(model, normalize.min, normalize.max) : model }}
      </p>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { normalizeNumber } from './utils';

const props = withDefaults(defineProps<{
  min?: number,
  label?: string
  normalize?: { min: number, max: number }
  max: number
}>(), {
  min: 0,
  label: "",
})
const model = defineModel<number>()
const sliderModel = ref<string>(String(model.value ?? props.min))
const showNumber = ref(false)
const pointerDown = ref(false)
let tid: any = null

watch(sliderModel, () => {
  model.value = parseInt(sliderModel.value, 10)
  showNumber.value = true
  callTimeout()
})

const computedStyle = computed(() => {
  if (showNumber.value) {
    return "color: white;"
  } else {
    return "color: grey;"
  }
})

function handlePointerDown() {
  pointerDown.value = true
}

function handlePointerUp() {
  pointerDown.value = false
  callTimeout()
}

function callTimeout() {
  if (!tid && !pointerDown.value) {
    tid = setTimeout(() => {
      showNumber.value = false
      tid = null
    }, 500)  
  }
}
</script>

<style scoped>
.container {
  flex: 1;
  margin: 5px;
  margin-top: 12px;

  display: flex; 
  flex-direction: row; 
  align-items: center;
}

.slider {
  
  margin-top: 3px;
  flex: 1;
  cursor: pointer;
  outline: none;
  opacity: 0.85;
  transition: opacity .2s
}

.slider:hover {
  opacity: 1; /* Fully shown on mouse-over */
}

p {
  user-select: none;
  position: absolute; 
  align-self: flex-end;
}
</style>