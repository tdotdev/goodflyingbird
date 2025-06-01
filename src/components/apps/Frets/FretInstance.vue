<template>
  <div class="container">
    <div class="canvasContainer">
      <canvas ref="canvas" :width="dim.width" :height="dim.height">
      </canvas>
    </div>
    <div class="controls" style="max-width: 800px;">
      <div style="display: flex; flex-direction: row; justify-content: flex-start; flex-wrap: wrap; align-items: center;">
        <NoteToggle v-for="(toggle, i) in toggles"
          v-model="toggle.value" :note="i"
          :theme="selectedTheme"
        />
        <Select v-model="selectedTheme" :options="themeOptions" style="margin-left: auto;"/>
        <Tuning v-model="tuningModel"/>
      </div>
      
      <div style="display: flex; flex-direction: row; justify-content: flex-start; flex-wrap: wrap; align-items: center;">
        <Slider v-model="numFrets" label="Frets" :min="0" :max="32"/>
        <Slider v-model="scaleLength" label="Scale Length" :min="1" :max="4000" :normalize="{min: 1, max: 100}"/>
        <Slider v-model="scaleWidth" label="Neck Width" :min="1" :normalize="{min: 1, max: 100}" :max="1000" />
      </div>
      <div v-if="debug">
        <button @click="() => {const c = getContext(); clear(c!)}">clear</button>
        <button @click="() => {const c = getContext(); draw(c!)}">draw</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">

import { computed, nextTick, onBeforeUnmount, onMounted, reactive, ref, useTemplateRef, watch } from 'vue';
import { FretConfig, NoteMarker } from './Frets';
import { CHROMATIC_SCALE, distanceFretFromNut, midiToNote, PALETTES } from './utils';
import NoteToggle from './NoteToggle.vue';
import Slider from './Slider.vue';
import Select from './Select.vue';
import Tuning from './Tuning.vue';


const canvas = useTemplateRef<HTMLCanvasElement>('canvas')
const props = defineProps<{
  config: FretConfig
}>()
const scaleLength = ref(props.config.scaleLength ?? 1500)
const scaleWidth = ref(props.config.scaleWidth ?? 120)
const debug = ref(false)
const toggles = CHROMATIC_SCALE.map((note) => {
  return ref(props.config.scale.includes(note))
})
const themeOptions = Object.keys(PALETTES).map((e, i) => {
  return {
    label: e,
    value: PALETTES[e]
  }
})
const selectedTheme = ref<string[]>(themeOptions[0].value)
const tuningModel = ref("EADGBE")

const numFrets = ref(props.config.fretCount ?? 24)

const scale = computed(() => {
  return toggles.map((e, i) => {
    if (e.value) {
      return i
    }
  }).filter((e) => e !== undefined)
})

watch([scale, numFrets, scaleLength, scaleWidth, selectedTheme], () => {
  pipeline()
})

onMounted(() => {
  window.addEventListener('resize', resizeCanvas)
  pipeline()
})

function resizeCanvas() {
  const canvasEl = canvas.value
  const container = canvasEl?.parentElement
  if (!canvasEl || !container) return

  const rect = container.getBoundingClientRect()
  canvasEl.width = rect.width
  canvasEl.height = rect.height

  dim.width = rect.width
  dim.height = rect.height
  nextTick(() => {
    pipeline()
  })
}

onBeforeUnmount(() => {
  window.removeEventListener('resize', resizeCanvas)
})

const tuning = (() => {
  let tune = props.config.tuning ?? [40, 45, 50, 55, 59, 64] 
  tune = tune.reverse()
  return tune
})()


//const noteMarkerOffset = 10
const fretMarkers = [3, 5, 7, 9, 12, 15, 17, 19, 21, 24, 27]
const x = 50
const y = 20

const dim = reactive({
  width: window.innerWidth,
  height: 250
})

function clampX(x: number, offset=0) {
  if (x < offset) {
    return offset
  }
  /*else if (x > dim.width) {
    return dim.width
  }*/ 
  else {
    return x
  }
}

function clampY(y: number, offset=0) {
  if (y < offset) {
    return 0
  }
  /*
  else if (y > dim.height) {
    return dim.height
  }*/ 
 else {
    return y
  }
}

function clear(ctx: CanvasRenderingContext2D) {
  ctx.clearRect(0,0,ctx.canvas.width, ctx.canvas.height)
}

function pipeline() {
  if (!canvas.value) {
    console.log('no canvas')
    return
  }
  const ctx = canvas.value.getContext('2d')
  if (!ctx) {
    console.log('no context')
    return
  }
  //clear(ctx)
  draw(ctx)
}

function draw(ctx: CanvasRenderingContext2D) {
  drawBackground(ctx)
  drawBoard(ctx)
  drawNut(ctx)
  drawFretMarkers(ctx)
  drawFrets(ctx)
  drawBridge(ctx)
  drawStrings(ctx)
  drawNoteMarkers(ctx, scale.value)
}

function getContext() {
  if (!canvas.value) {
    console.log('no canvas')
    return null
  }
  const ctx = canvas.value.getContext('2d')
  if (!ctx) {
    console.log('no context')
    return null
  }
  return ctx
}

function drawNoteMarkers(ctx: CanvasRenderingContext2D, scale: number[]) {
  const offset = scaleWidth.value / tuning.length
  for (let i=0; i < tuning.length; i++) {
      const py = (y + i * offset) + offset / 2
      for (let j=0; j < numFrets.value+1; j++) {
        const currentMidiNote = tuning[i] + j
        const currentMidiNoteBase = currentMidiNote % 12
        //const note = midiToNoteString(midi)
        //const matched = scale.find((e) => e.note === note)
        const matched = scale.find((e) => e % 12 === currentMidiNoteBase )
        if (matched !== undefined) {
          const d1 = distanceFretFromNut(j, scaleLength.value)
          const d2 = distanceFretFromNut(j - 1, scaleLength.value)
          const px = 1 + x + (d1 + d2) / 2
          const r = 8
          ctx.beginPath();
          ctx.arc(clampX(px, r), clampY(py, r), r, 1, 360);
          ctx.fillStyle = selectedTheme.value[currentMidiNoteBase]
          ctx.fill();
          ctx.stroke();
          ctx.fillStyle = "#000000"
          const midiString = midiToNote(currentMidiNote)
          ctx.fillText(midiString, 
            clampX(px - (() => { return midiString.length === 1 ? 4 : 6})(), 4), 
            clampY(py + 3, 8)
          )
        }
      }
  }
}

function drawBridge(ctx: CanvasRenderingContext2D) {
  ctx.fillStyle = "#dddddd"
  const w = 10
  ctx.fillRect(x + scaleLength.value - w/2, y, w, scaleWidth.value)
  }


function drawBackground(ctx: CanvasRenderingContext2D) {
  ctx.fillStyle = "#C9A383"//"#DBEAFE"
  ctx.fillRect(0, 0, dim.width, dim.height)
}

function drawBoard(ctx: CanvasRenderingContext2D) {
  ctx.fillStyle = "#5D2608"
  ctx.fillRect(x, y, distanceFretFromNut(numFrets.value + 1, scaleLength.value), scaleWidth.value)
}

function drawStrings(ctx: CanvasRenderingContext2D) {
  const offset = scaleWidth.value / tuning.length
  for (let i=0; i < tuning.length; i++) {
      const py = (y + i * offset) + offset / 2
      ctx.fillStyle = "#27171A"
      ctx.fillRect(x, py, scaleLength.value, 2)
      //ctx.moveTo(x, py)
      //ctx.lineTo(x + scaleLength.value, py)
      //ctx.stroke()
  }
}

function drawNut(ctx: CanvasRenderingContext2D) {
  ctx.fillStyle = "#dddddd"
  ctx.fillRect(x, y, 10, scaleWidth.value)
  ctx.fillStyle = "#cfcaba"
  ctx.fillRect(x, y, 3, scaleWidth.value)
  ctx.fillRect(x + 8, y, 2, scaleWidth.value)
}

function drawFretMarkers(ctx: CanvasRenderingContext2D) {
  for (let i=0; i < fretMarkers.length; i++) {
    const m = fretMarkers[i]
    if (m > numFrets.value) {
      break
    }
    let [px, py] = getMarkerPosition(m)
    ctx.fillStyle = "#ffffff"
    if (m % 12 === 0) {
      ctx.beginPath();
      ctx.arc(px, py - scaleWidth.value/6, 6, 1, 360);
      ctx.fill();
      ctx.stroke();
      
      ctx.beginPath();
      ctx.arc(px, py+scaleWidth.value/6, 6, 1, 360);
      ctx.fill();
      ctx.stroke();
    } else {
      ctx.beginPath();
      ctx.arc(px, py, 6, 1, 360);
      ctx.fill();
      ctx.stroke();
    }
  }
}

function getMarkerPosition(fret: number): [number, number] {
  const d1 = distanceFretFromNut(fret, scaleLength.value)
  const d2 = distanceFretFromNut(fret - 1, scaleLength.value)
  return [1 + x + (d1 + d2) / 2,  y + scaleWidth.value / 2]
}

function drawFrets(ctx: CanvasRenderingContext2D) {
  for (let i=1; i <= numFrets.value; i++) {
    const d = distanceFretFromNut(i, scaleLength.value)
    ctx.fillStyle = "#cfcaba"
    ctx.fillRect(x + d, y, 3, scaleWidth.value)
  }
}

</script>
  
<style scoped>
.main {
  background-color: red;
  touch-action: manipulation;
}
.title {
  font-family: sans-serif;
  position: absolute;
  margin-left: 10px;
  font-size: large;
}
.noteToggle {
  background-color: blue;
  margin: 2px;
  padding: 5px;
}
.controls {
  margin: 10px;
}

.canvasContainer {
  width: 100%;
  position: relative;
  height: 50%;
  max-width: 1920px;
}

canvas {
  width: 100%;
  height: 100%;
  display: block; /* prevent scrollbars */
}
</style>