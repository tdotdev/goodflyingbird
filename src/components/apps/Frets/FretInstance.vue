<template>
  <div>
  <p class="title">{{  props.scaleTitle }}</p>
  <canvas ref="canvas" :width="dim.width" :height="dim.height">
  </canvas>
  </div>
</template>

<script setup lang="ts">

import { computed, onMounted, reactive, ref, useTemplateRef } from 'vue';
import { NoteMarker } from './Frets';

const canvas = useTemplateRef('canvas')

const props = defineProps<{
  scale: NoteMarker[]
  scaleTitle: string
  frets?: number,
  strings?: number[]
  neckLength?: number
  neckWidth?: number
}>()

function clear(ctx: CanvasRenderingContext2D) {
  ctx.clearRect(0,0,ctx.canvas.width, ctx.canvas.height)
}

const numFrets = props.frets ?? 22
console.log(numFrets)
let strings = props.strings ?? [40, 45, 50, 55, 59, 64]
strings = strings.reverse()

const x = 50
const y = 50

const dim = reactive({
  width: 1500,
  height: 225
})
const neckLength = props.neckLength ?? 1100
const neckWidth = props.neckWidth ?? 120

function midiToNoteString(midiNote: number): string {
  const noteNames = ["C", "C#", "D", "Eb", "E", "F", "F#", "G", "Ab", "A", "Bb", "B"]
  const noteIndex = midiNote % 12;
  const octave = Math.floor(midiNote / 12) - 1; // MIDI note 0 is C-1
  return `${noteNames[noteIndex]}`//${octave}`
}

const noteToDefaultColorMap = {
  "C":  "#AAAAAA", // neutral gray (base/root)
  "C#": "#FFD700", // bright gold
  "D":  "#999999", // soft gray
  "Eb": "#FFA500", // orange
  "E":  "#FFFF66", // soft yellow
  "F":  "#FF6666", // soft red
  "F#": "#FF9966", // orange-pink
  "G":  "#66CC66", // light green
  "Ab": "#33AA77", // teal-green
  "A":  "#6699FF", // light blue
  "Bb": "#3366CC", // deeper blue
  "B":  "#66FF99"  // minty green
} as any;
function noteToDefaultColor(note: string) {
  return noteToDefaultColorMap[note] as string
}


onMounted(() => {
  if (!canvas.value) {
      console.log('no canvas')
      return
  }

  const ctx = canvas.value.getContext('2d')

  if (!ctx) {
      console.log('no context')
      return
  }
  draw(ctx)
})


function draw(ctx: CanvasRenderingContext2D) {
  drawBackground(ctx)
  drawBoard(ctx)
  drawNut(ctx)
  drawMarkers(ctx)
  drawFrets(ctx)
  drawBridge(ctx)
  drawStrings(ctx)
  drawNoteOccurences(ctx, props.scale)
}

function drawNoteOccurences(ctx: CanvasRenderingContext2D, scale: NoteMarker[]) {
  const offset = neckWidth / strings.length
  for (let i=0; i < strings.length; i++) {
      const py = (y + i * offset) + offset / 2
      for (let j=0; j < numFrets+1; j++) {
        const midi = strings[i] + j
        const note = midiToNoteString(midi)
        const matched = scale.find((e) => e.note === note)
        if (matched) {
          const d1 = distanceFretFromNut(j)
          const d2 = distanceFretFromNut(j - 1)
          const px = 1 + x + (d1 + d2) / 2
          ctx.beginPath();
          ctx.arc(px, py, 8, 1, 360);
          if (matched.color) {
            ctx.fillStyle = matched.color
          } else {
            ctx.fillStyle = noteToDefaultColor(matched.note)
          }
          ctx.fill();
          ctx.stroke();
          ctx.fillStyle = "#000000"
          ctx.fillText(matched.note, px - (() => { return matched.note.length === 1 ? 4 : 6})(), py + 3)
        }
      }
  }
}

function drawBridge(ctx: CanvasRenderingContext2D) {
  ctx.fillStyle = "#dddddd"
  const w = 10
  ctx.fillRect(x + neckLength - w/2, y, 10, neckWidth)
  }


function drawBackground(ctx: CanvasRenderingContext2D) {
  ctx.fillStyle = "#C9A383"//"#DBEAFE"
  ctx.fillRect(0, 0, dim.width, dim.height)
}

function drawBoard(ctx: CanvasRenderingContext2D) {
  ctx.fillStyle = "#5D2608"
  ctx.fillRect(x, y, distanceFretFromNut(numFrets + 1), neckWidth)
}

function drawStrings(ctx: CanvasRenderingContext2D) {
  const offset = neckWidth / strings.length
  for (let i=0; i < strings.length; i++) {
      const py = (y + i * offset) + offset / 2
      ctx.fillStyle = "#27171A"
      ctx.fillRect(x, py, neckLength, 2)
      //ctx.moveTo(x, py)
      //ctx.lineTo(x + neckLength, py)
      //ctx.stroke()
  }
}

function drawNut(ctx: CanvasRenderingContext2D) {
  ctx.fillStyle = "#dddddd"
  ctx.fillRect(x, y, 10, neckWidth)
  ctx.fillStyle = "#cfcaba"
  ctx.fillRect(x, y, 3, neckWidth)
  ctx.fillRect(x + 8, y, 2, neckWidth)
}

const markers = [
  3, 5, 7, 9, 12, 15, 17, 19, 21, 24, 27
]

function drawMarkers(ctx: CanvasRenderingContext2D) {
  for (let i=0; i < markers.length; i++) {
    const m = markers[i]
    if (m > numFrets) {
      break
    }
    let [px, py] = getMarkerPosition(m)
    ctx.fillStyle = "#ffffff"
    if (m % 12 === 0) {
      ctx.beginPath();
      ctx.arc(px, py - neckWidth/6, 6, 1, 360);
      ctx.fill();
      ctx.stroke();
      
      ctx.beginPath();
      ctx.arc(px, py+neckWidth/6, 6, 1, 360);
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
  const d1 = distanceFretFromNut(fret)
  const d2 = distanceFretFromNut(fret - 1)
  return [1 + x + (d1 + d2) / 2,  y + neckWidth / 2]
}

function drawFrets(ctx: CanvasRenderingContext2D) {
  for (let i=1; i <= numFrets; i++) {
    const d = distanceFretFromNut(i)
    ctx.fillStyle = "#cfcaba"
    ctx.fillRect(x + d, y, 3, neckWidth)
  }
}

function distanceFretFromNut(fretNum: number) {
  // fretNum start at 1
  return neckLength - (neckLength / (2 ** (fretNum / 12)))
}
  
</script>
  
<style scoped>
.main {
  background-color: red;
}
.title {
  font-family: sans-serif;
  position: absolute;
  margin-left: 10px;
  font-size: large;
}
</style>