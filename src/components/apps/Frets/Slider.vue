<template>
  <div class="container" style="display: flex; flex-direction: row; align-items: center;">
    <input
        v-model="sliderModel"
        type="range"
        :min="min"
        :max="max"
        style="flex: 1;"
        @pointerdown="handlePointerDown"
        @pointerup="handlePointerUp"
      /> 
      <p style="position: absolute; align-self: flex-end;" :style="computedStyle">{{ label ? `${label}` : '' }}: {{ normalize && model ? normalizeNumber(model, normalize.min, normalize.max) : model }}</p>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue';
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
}, { immediate: true })

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
  margin: 5px;
  width: 100%;
  max-width: 500px;
}

p {
  user-select: none;
}
</style>