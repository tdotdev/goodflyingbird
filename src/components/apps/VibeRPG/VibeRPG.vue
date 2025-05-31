<template>
  <canvas
    ref="canvasRef"
    tabindex="0"
    @click="handleClick"
    class="border"
  />
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, reactive } from 'vue'

const canvasRef = ref<HTMLCanvasElement | null>(null)
const keysPressed = new Set<string>()

const canvasSize = { width: 800, height: 600 }
const worldSize = { width: 2000, height: 2000 }

const player = reactive({
  x: 100,
  y: 100,
  width: 32,
  height: 32,
  speed: 4
})

const camera = reactive({
  x: 0,
  y: 0
})

// === New: Entities ===
interface Entity {
  id: string
  x: number
  y: number
  width: number
  height: number
  speed: number
  lastMoveTime: number
}
const entities: Entity[] = Array.from({ length: 10 }, (_, i) => ({
  id: `enemy-${i}`,
  x: Math.random() * worldSize.width,
  y: Math.random() * worldSize.height,
  width: 32,
  height: 32,
  speed: 2,
  lastMoveTime: 0
}))

function handleKeyDown(e: KeyboardEvent) {
  keysPressed.add(e.key)
}
function handleKeyUp(e: KeyboardEvent) {
  keysPressed.delete(e.key)
}

function handleClick(e: MouseEvent) {
  const canvas = canvasRef.value
  if (!canvas) return

  const rect = canvas.getBoundingClientRect()
  const screenX = e.clientX - rect.left
  const screenY = e.clientY - rect.top

  const worldX = screenX + camera.x
  const worldY = screenY + camera.y

  console.log(`Clicked world position: ${worldX}, ${worldY}`)
}

function handlePlayerInput() {
  if (keysPressed.has('w')) player.y -= player.speed
  if (keysPressed.has('s')) player.y += player.speed
  if (keysPressed.has('a')) player.x -= player.speed
  if (keysPressed.has('d')) player.x += player.speed

  player.x = Math.max(0, Math.min(worldSize.width - player.width, player.x))
  player.y = Math.max(0, Math.min(worldSize.height - player.height, player.y))
}

function updateCamera() {
  camera.x = player.x + player.width / 2 - canvasSize.width / 2
  camera.y = player.y + player.height / 2 - canvasSize.height / 2

  camera.x = Math.max(0, Math.min(worldSize.width - canvasSize.width, camera.x))
  camera.y = Math.max(0, Math.min(worldSize.height - canvasSize.height, camera.y))
}

// === New: Random walk AI ===
function updateEntities(now: number) {
  for (const entity of entities) {
    if (now - entity.lastMoveTime > 1000) {
      const dir = Math.floor(Math.random() * 4)
      switch (dir) {
        case 0: entity.y -= entity.speed; break // up
        case 1: entity.y += entity.speed; break // down
        case 2: entity.x -= entity.speed; break // left
        case 3: entity.x += entity.speed; break // right
      }

      // Clamp
      entity.x = Math.max(0, Math.min(worldSize.width - entity.width, entity.x))
      entity.y = Math.max(0, Math.min(worldSize.height - entity.height, entity.y))
      entity.lastMoveTime = now
    }
  }
}

onMounted(() => {
  const canvas = canvasRef.value!
  canvas.width = canvasSize.width
  canvas.height = canvasSize.height
  canvas.focus()

  window.addEventListener('keydown', handleKeyDown)
  window.addEventListener('keyup', handleKeyUp)

  function gameLoop(now: number) {
    handlePlayerInput()
    updateCamera()
    updateEntities(now)

    const ctx = canvas.getContext('2d')!
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Background
    ctx.fillStyle = '#444'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Grid (optional)
    ctx.strokeStyle = '#555'
    for (let x = -camera.x % 64; x < canvas.width; x += 64) {
      ctx.beginPath()
      ctx.moveTo(x, 0)
      ctx.lineTo(x, canvas.height)
      ctx.stroke()
    }
    for (let y = -camera.y % 64; y < canvas.height; y += 64) {
      ctx.beginPath()
      ctx.moveTo(0, y)
      ctx.lineTo(canvas.width, y)
      ctx.stroke()
    }

    // Entities
    for (const entity of entities) {
      ctx.fillStyle = 'red'
      ctx.fillRect(
        entity.x - camera.x,
        entity.y - camera.y,
        entity.width,
        entity.height
      )
    }

    // Player
    ctx.fillStyle = 'lime'
    ctx.fillRect(
      player.x - camera.x,
      player.y - camera.y,
      player.width,
      player.height
    )

    requestAnimationFrame(gameLoop)
  }

  requestAnimationFrame(gameLoop)
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleKeyDown)
  window.removeEventListener('keyup', handleKeyUp)
})
</script>

<style scoped>
canvas {
  width: 800px;
  height: 600px;
  outline: none;
  display: block;
}
</style>
