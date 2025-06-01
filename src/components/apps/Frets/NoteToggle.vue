<template>
  <div class="note" :style="computedStyle" @click="handleClicked"     
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
  >
    {{ midiToNote(props.note) }}
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { darkenHexColor, midiToNote } from './utils';


const props = defineProps<{
  note: number
  theme: string[]
}>()
const model = defineModel<boolean>({required: true})

const color = computed(() => {
  return props.theme[props.note]
})

const isHovered = ref(false)

const computedStyle = computed(() => {
  if (model.value) {
    return {
      backgroundColor: color.value,
      color: darkenHexColor(color.value, 70),//'black',
      border: `1px solid ${color.value}`,
      filter: isHovered.value ? 'brightness(85%)' : 'none'
      //boxShadow: isHovered.value ? 'inset 0 0 6px rgba(0, 0, 0, 0.5)' : 'none'
    }
  } else {
    const darkerColor = darkenHexColor(color.value, 50)
    const hoverColor = darkenHexColor(color.value, 25)
    return {
      backgroundColor: 'black',
      color: isHovered.value ? hoverColor : darkerColor,
      border: `1px solid ${isHovered.value ? hoverColor : darkerColor}`,
    }
  }
})

function handleMouseEnter() {
  isHovered.value = true
}
function handleMouseLeave() {
  isHovered.value = false
}

function handleClicked() {
  model.value = !model.value
}


</script>

<style scoped>
.note {
  text-align: center;
  font-weight: bold;
  min-width: 25px;
  font-family: sans-serif;
  margin: 2px;
  padding: 5px;
  border-radius: 2px;
  cursor: pointer;
  user-select: none;
}
</style>