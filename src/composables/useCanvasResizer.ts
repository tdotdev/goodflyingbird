import { onMounted, onBeforeUnmount, Ref } from 'vue';


export function useCanvasResizer(canvasRef: Ref<HTMLCanvasElement | null>) {
  function resizeCanvas() {
    if (!canvasRef.value) return;

    const parent = canvasRef.value.parentElement;
    if (!parent) return;

    const width = parent.clientWidth;
    const height = parent.clientHeight;

    canvasRef.value.width = width;
    canvasRef.value.height = height;
  }

  onMounted(() => {
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
  });

  onBeforeUnmount(() => {
    window.removeEventListener('resize', resizeCanvas);
  });

  return { resizeCanvas };
}