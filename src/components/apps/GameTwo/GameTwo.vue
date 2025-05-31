<template>
  <div id="bc-container">
    <canvas id="bc" ref="gameCanvas" :width="width" :height="height" 
      @mousedown="handleMouseDown" 
      @mouseup="handleMouseUp" 
      @mousemove="handleMouseMove"
      @contextmenu="(e) => {e.preventDefault()}"
    />
  </div>
</template>
    
<script lang="ts" setup>
import { onMounted, onBeforeUnmount, ref, computed } from 'vue'
import { Game } from './Game.ts';
import { sfx } from './SFX.ts';


const width = ref(1600)
const height = ref(900)

const gameCanvas = ref<HTMLCanvasElement | null>(null)
const game = new Game(width.value, height.value)
let lastTimestamp = 0

function animate(timestamp: number) {
  if (!gameCanvas.value) { 
    return 
  } 
  const ctx = gameCanvas.value.getContext('2d')

  if (!ctx) { 
    return 
  }

  const delta = (timestamp - lastTimestamp) / 1000 // delta in seconds
  lastTimestamp = timestamp

  game.update(delta)
  game.render(ctx)

  requestAnimationFrame(animate)
}


function handleMouseUp(e: MouseEvent) {
  if (e.button === 1) {  }
  if (e.button === 2) {  } 

  game.onMouseUp(e)
  const pos = game.screenToWorld(e.clientX, e.clientY, width.value, height.value)
}

function handleMouseDown(e: MouseEvent) {
  sfx.playSound(3)
  const pos = game.screenToWorld(e.offsetX, e.offsetY, width.value, height.value)
  //game.onMouseDown(pos)
}

function handleMouseMove(e: MouseEvent) {
  game.onMouseMove(e)
  
  const pos = game.screenToWorld(e.clientX, e.clientY, width.value, height.value)
}

const preventMouseDefault = (e: MouseEvent) => e.preventDefault()

onMounted(() => {
  if (!gameCanvas.value) { 
    return 
  } 
  //window.addEventListener(`contextmenu`, preventMouseDefault)
  window.addEventListener('keydown', game.onKeyDown.bind(game))
  window.addEventListener('keyup', game.onKeyUp.bind(game))

  requestAnimationFrame((ts) => {
    lastTimestamp = ts
    animate(ts)
  })
})

onBeforeUnmount(() => {
  
  //window.removeEventListener(`contextmenu`, preventMouseDefault)
  window.removeEventListener('keydown', game.onKeyDown.bind(game))
  window.removeEventListener('keyup', game.onKeyUp.bind(game))
})
</script>
  
<style scoped>

#bc {
  background-color: black;
  box-shadow:
    0 0 200px 30px #fff, 
    inset 0 0 150px #553dc4;
  
}

#bc-container {
  overflow: hidden;
  display: flex;
  justify-content: space-evenly; 
  align-items: center;
}

</style>
  