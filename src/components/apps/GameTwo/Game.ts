import { sfx } from "./SFX.ts"
import { tlib } from "./util.ts"


type Entity = {
  x: number
  y: number
  width: number
  height: number
  color: string
  speedX: number
  speedY: number
}



export class Game {
  private worldWidth = 10000
  private worldHeight = 10000

  private viewportWidth;
  private viewportHeight;

  // Camera top-left corner in world coordinates
  public cameraX = 0
  public cameraY = 0

  public player: Entity
  public enemies: Entity[] = []

  private keys: Record<string, boolean> = {
    w: false,
    a: false,
    s: false,
    d: false,
  }

  private mouse = {
    down: false,
    left: false,
    right: false,
  }

  private enemyCount = 5000

  constructor(vpWidth: number, vpHeight: number) {
    this.viewportWidth = vpWidth
    this.viewportHeight = vpHeight
    this.player = {
      x: this.worldWidth/2,
      y: this.worldHeight/2,
      width: 30,
      height: 30,
      color: 'blue',
      speedX: 0,
      speedY: 0
    }

  }


  public onKeyDown(event: KeyboardEvent): void {
    if (event.key === 'w') this.keys.w = true
    if (event.key === 'a') this.keys.a = true
    if (event.key === 's') this.keys.s = true
    if (event.key === 'd') this.keys.d = true
  }

  public onMouseDown(e: MouseEvent) {
    this.mouse.down = true
  }

  public onMouseUp(e: MouseEvent) {
    this.mouse.down = false
  }

  public onMouseMove(e: MouseEvent) {
    if (this.mouse.down) {
      console.log('draggg')
    }
  }

  public onKeyUp(e: KeyboardEvent): void {
    if (e.key === 'w') this.keys.w = false
    if (e.key === 'a') this.keys.a = false
    if (e.key === 's') this.keys.s = false
    if (e.key === 'd') this.keys.d = false
  }

  public update(deltaTime: number): void {
    const speed = 1500 // world units per second

    let moveX = 0
    let moveY = 0

    if (this.keys.w) moveY -= speed
    if (this.keys.s) moveY += speed
    if (this.keys.a) moveX -= speed
    if (this.keys.d) moveX += speed

    // Update player position
    this.player.x += moveX * deltaTime
    this.player.y += moveY * deltaTime

    // Clamp player in world
    this.player.x = Math.max(0, Math.min(this.player.x, this.worldWidth - this.player.width))
    this.player.y = Math.max(0, Math.min(this.player.y, this.worldHeight - this.player.height))


    for (const enemy of this.enemies) {
      enemy.x += enemy.speedX * 1000 * deltaTime
      enemy.y += enemy.speedY * 1000 * deltaTime

      // bounce if needed
      if (enemy.x < 0 || enemy.x + enemy.width > this.worldWidth) {
        enemy.speedX = -enemy.speedX
      }
      if (enemy.y < 0 || enemy.y + enemy.height > this.worldHeight) {
        enemy.speedY = -enemy.speedY
      }
      enemy.x = Math.max(0, Math.min(enemy.x, this.worldWidth - enemy.width))
      enemy.y = Math.max(0, Math.min(enemy.y, this.worldHeight - enemy.height))
    }
 
    // Center
    // Clamp between 0 and max
    this.cameraX = this.player.x + this.player.width / 2 - this.viewportWidth / 2
    this.cameraY = this.player.y + this.player.height / 2 - this.viewportHeight / 2
    this.cameraX = Math.max(0, Math.min(this.cameraX, this.worldWidth - this.viewportWidth))
    this.cameraY = Math.max(0, Math.min(this.cameraY, this.worldHeight - this.viewportHeight))
  }

  public render(ctx: CanvasRenderingContext2D): void {
    ctx.clearRect(0,0,ctx.canvas.width, ctx.canvas.height)
    const scaleX = ctx.canvas.width / this.viewportWidth
    const scaleY = ctx.canvas.height / this.viewportHeight

    this.drawEntity(ctx, this.player, scaleX, scaleY)
    for (const enemy of this.enemies) {
      this.drawEntity(ctx, enemy, scaleX, scaleY)
    }
  }

  public screenToWorld(mouseX: number, mouseY: number, canvasWidth: number, canvasHeight: number): { x: number, y: number } {
    const scaleX = canvasWidth / this.viewportWidth
    const scaleY = canvasHeight / this.viewportHeight

    // Invert render transform
    const worldX = mouseX / scaleX + this.cameraX
    const worldY = mouseY / scaleY + this.cameraY

    return { x: worldX, y: worldY }
  }

  private drawEntity(ctx: CanvasRenderingContext2D, entity: Entity, scaleX: number, scaleY: number): void {
    // Position relative to camera
    const screenX = (entity.x - this.cameraX) * scaleX
    const screenY = (entity.y - this.cameraY) * scaleY

    ctx.fillStyle = entity.color
    ctx.fillRect(screenX, screenY, entity.width * scaleX, entity.height * scaleY)
  }
}