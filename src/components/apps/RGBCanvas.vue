<template>
<div class="root">
  <canvas ref="canvas" 
    :width="width" :height="height - 20"
    @click="handleCanvasClicked">
  </canvas>
  <div>
    <p>
      <a>Size</a>
      <input type="range" min="1" max="100" class="slider" :value="slider1" id="slider1" @input="handleInputSlider1">
      <a>Speed</a>
      <input type="range" min="1" max="100" class="slider" :value="slider2" id="slider2" @input="handleInputSlider2">
    </p>
    <p>
      <a>Orbit</a>
      <input type="range" min="0" max="100" class="slider" :value="slider3" id="slider3" @input="handleInputSlider3">
    </p>
  </div>
</div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, computed, watch } from 'vue'
const pStyle = computed(() => {
  return `color: ${getHexFromInteger(animationFrameId.value! / 4)}; `
})

type Props = {
  width: number,
  height: number
}
const props = defineProps<Props>()
const slider1 = ref<number>(50)
const slider2 = ref<number>(10)
const slider3 = ref<number>(20)


const handleInputSlider1 = (event: Event) => {
  const target = event.target as HTMLInputElement
  slider1.value = Number(target.value)
}
const handleInputSlider2 = (event: Event) => {
  const target = event.target as HTMLInputElement
  slider2.value = Number(target.value)
}
const handleInputSlider3 = (event: Event) => {
  const target = event.target as HTMLInputElement
  slider3.value = Number(target.value)
}
const pos = ref<[number, number]>([50, 50])

// Canvas dimensions
const width = 1000;
const height = 1000;

// Cartesian coordinate system range (e.g., -100 to 100 on both axes)
const cartesianRange = {
  xMin: 0,
  xMax: 100,
  yMin: 0,
  yMax: 100
};

const canvas = ref<HTMLCanvasElement | null>(null);
let ctx: CanvasRenderingContext2D | null = null;
let animationFrameId = ref<number | null>(null);

onMounted(() => {
  if (canvas.value) {
    ctx = canvas.value.getContext('2d');
    if (!ctx) {
      console.error('Failed to get canvas context');
      return;
    }
  }
  animationFrameId.value = requestAnimationFrame(draw);
});

onBeforeUnmount(() => {
  if (animationFrameId.value) {
    cancelAnimationFrame(animationFrameId.value);
  }
});


const cartesianToCanvas = (x: number, y: number) => {
  if (!ctx) return { x: 0, y: 0 };

  // Calculate the scaling factor based on canvas and Cartesian range
  const xScale = ctx.canvas.width / (cartesianRange.xMax - cartesianRange.xMin);
  const yScale = ctx.canvas.height / (cartesianRange.yMax - cartesianRange.yMin);

  // Translate and scale the x and y values
  const canvasX = (x - cartesianRange.xMin) * xScale;
  const canvasY = ctx.canvas.height - (y - cartesianRange.yMin) * yScale;

  return { x: canvasX, y: canvasY };
};


const draw = () => {
  if (!ctx) return;

  // Clear the canvas
  //ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  // Example animation: draw a moving circle in Cartesian space
  const time = performance.now() * (0.0008 * slider2.value);
  const cartesianX = pos.value[0]  + (Math.cos(time)) * slider3.value;
  //const cartesianY = Math.cos(time) * 80;
  const cartesianY = pos.value[1] + (Math.sin(time))  * slider3.value;

  const { x, y } = cartesianToCanvas(cartesianX, cartesianY);

  ctx.beginPath();
  ctx.arc(x, y, cartesianToCanvas(slider1.value, slider1.value).x, 0, Math.PI * 2, true);
  ctx.fillStyle = getHexFromInteger(animationFrameId.value!);
  ctx.fill();

  ctx.beginPath();
  ctx.arc(x, y, cartesianToCanvas(slider1.value, slider1.value).x / 2, 0, Math.PI * 2, true);
  ctx.fillStyle = getHexFromInteger(animationFrameId.value! / 2);
  ctx.fill();

  ctx.beginPath();
  ctx.arc(x, y, cartesianToCanvas(slider1.value, slider1.value).x / 4, 0, Math.PI * 2, true);
  ctx.fillStyle = getHexFromInteger(animationFrameId.value! / 4);
  ctx.fill();

  
  ctx.beginPath();
  ctx.arc(x, y, cartesianToCanvas(slider1.value, slider1.value).x / 8, 0, Math.PI * 2, true);
  ctx.fillStyle = getHexFromInteger(animationFrameId.value! / 8);
  ctx.fill();


  // Request the next animation frame
  animationFrameId.value = requestAnimationFrame(draw);
};

// Convert canvas coordinates to Cartesian coordinates
const canvasToCartesian = (canvasX: number, canvasY: number) => {
  if (!ctx) return { x: 0, y: 0 };

  // Calculate the scaling factor based on canvas and Cartesian range
  const xScale = ctx.canvas.width / (cartesianRange.xMax - cartesianRange.xMin);
  const yScale = ctx.canvas.height / (cartesianRange.yMax - cartesianRange.yMin);

  // Convert canvas coordinates to Cartesian coordinates
  const cartesianX = canvasX / xScale + cartesianRange.xMin;
  const cartesianY = (ctx.canvas.height - canvasY) / yScale + cartesianRange.yMin;

  return { x: cartesianX, y: cartesianY };
};



// Handle canvas click event
const handleCanvasClicked = (event: MouseEvent) => {
  if (!canvas.value || !ctx) return;

  const rect = canvas.value.getBoundingClientRect();

  // Get the click position relative to the canvas
  const canvasX = event.clientX - rect.left;
  const canvasY = event.clientY - rect.top;

  // Convert canvas coordinates to Cartesian coordinates
  const { x, y } = canvasToCartesian(canvasX, canvasY);

  //console.log(`Clicked at canvas coordinates: (${canvasX}, ${canvasY})`);
  //console.log(`Mapped to Cartesian coordinates: (${x}, ${y})`);

  // Optional: Draw a small circle at the clicked point in Cartesian space
  const canvasPos = cartesianToCanvas(x, y);
  pos.value = [x, y]
};




function hslToRgb(h: number, s: number, l: number): [number, number, number] {
  s /= 100;
  l /= 100;

  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs((h / 60) % 2 - 1));
  const m = l - c / 2;

  let r = 0, g = 0, b = 0;

  if (0 <= h && h < 60) {
      r = c; g = x; b = 0;
  } else if (60 <= h && h < 120) {
      r = x; g = c; b = 0;
  } else if (120 <= h && h < 180) {
      r = 0; g = c; b = x;
  } else if (180 <= h && h < 240) {
      r = 0; g = x; b = c;
  } else if (240 <= h && h < 300) {
      r = x; g = 0; b = c;
  } else if (300 <= h && h < 360) {
      r = c; g = 0; b = x;
  }

  r = Math.round((r + m) * 255);
  g = Math.round((g + m) * 255);
  b = Math.round((b + m) * 255);

  return [r, g, b];
}

function componentToHex(c: number): string {
  const hex = c.toString(16);
  return hex.length === 1 ? "0" + hex : hex;
}

function rgbToHex(r: number, g: number, b: number): string {
  return `#${componentToHex(r)}${componentToHex(g)}${componentToHex(b)}`;
}

function getHexFromInteger(increment: number): string {
  // Normalize the integer to a hue value (0 - 360)
  const hue = increment % 360;

  const [r, g, b] = hslToRgb(hue, 100, 50);

  return rgbToHex(r, g, b);
}

</script>

<style scoped>
.root {
  background-color: black;
}
canvas {

}
p {
  color: white;
}
a {
  color: white;
}
</style>