<template>
  <div>
  <canvas ref="canvas" :width="width" :height="height"></canvas>
  <input type="range" min="1" max="50" class="slider" :value="maxIterations" @input="handleMaxIterationsInput">

  <button @click="() => zoom += 800">Zoom In</button>
  <button @click="() => zoom -= 800">Zoom Out</button>
  <input type="range" v-model="panX" min="-2.0" max="2.5" step="0.01" />
  <input type="range" v-model="panY" min="0.1" max="1.5" step="0.01" />
  <button @click="() => playing = !playing">{{ playingText }}</button>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';

const canvas = ref<HTMLCanvasElement | null>(null);
let ctx: CanvasRenderingContext2D | null = null;

const width = 500//window.innerWidth;
const height = 500//window.innerHeight;


const maxIterations = ref(50)
const zoom = ref(200)
const panX = ref(1.4)
const panY = ref(0)
const playing = ref(false)
let interval: number | undefined = undefined
let reverse = false

watch(playing, () => {
  if (playing.value) {
    interval = window.setInterval(() => {
      if (maxIterations.value === 50) {
        reverse = true
      } else if (maxIterations.value === 0) {
        reverse = false
      }

      if (reverse) {
        maxIterations.value -=1
      } else {
        maxIterations.value +=1
      }
    }, 10)
  } else {
    clearInterval(interval)
  }
})

const playingText = computed(() => {
  if (playing.value) {
    return 'Stop'
  } else {
    return 'Play'
  }
})

onMounted(() => {
  if (canvas.value) {
    ctx = canvas.value.getContext('2d');
    if (!ctx) {
      console.error('Failed to get canvas context');
      return;
    }

    renderMandelbrot();
  }
});

watch([maxIterations, zoom, panX, panY], () => {
  renderMandelbrot()
})


const handleMaxIterationsInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  maxIterations.value = Number(target.value)
}


function mandelbrot(cX: number, cY: number) {
  let x = 0;
  let y = 0;
  let iteration = 0;

  while (x * x + y * y <= 4 && iteration < maxIterations.value) {
    let tempX = x * x - y * y + cX;
    y = 2 * x * y + cY;
    x = tempX;
    iteration++;
  }
  return iteration;
}


function renderMandelbrot() {
  if (!ctx) return;

  const imageData = ctx.createImageData(width, height);
  const data = imageData.data;

  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      const cX = ((x - width / 2) - panX.value) / zoom.value  - panX.value ;
      const cY = ((y - height / 2) - panY.value) / zoom.value  - panY.value;

      const m = mandelbrot(cX, cY);

      const hue = m === maxIterations.value ? 0 : (m / maxIterations.value) * 360;

      const rgb = hsvToRgb(hue, 1, m < maxIterations.value ? 1 : 0);

      const pixelIndex = (y * width + x) * 4;
      data[pixelIndex] = rgb.r; // Red
      data[pixelIndex + 1] = rgb.g; // Green
      data[pixelIndex + 2] = rgb.b; // Blue
      data[pixelIndex + 3] = 255; // Alpha
    }
  }
  ctx.putImageData(imageData, 0, 0);
}


function hsvToRgb(h: number, s: number, v: number) {
  let f = (n: number, k = (n + h / 60) % 6) =>
    v - v * s * Math.max(Math.min(k, 4 - k, 1), 0);
  return {
    r: Math.floor(f(5) * 255),
    g: Math.floor(f(3) * 255),
    b: Math.floor(f(1) * 255),
  };
}
</script>