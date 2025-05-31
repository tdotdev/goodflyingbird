import { tlib } from "./util"

/**
 * A very simple sound system using the Web Audio API.
 * On creation, it doesn't automatically start the AudioContext.
 * We wait for a user interaction to call `.init()` or any `playSound()` method,
 * which in turn ensures the AudioContext is resumed or created.
 */
class SoundManager {
  private audioCtx: AudioContext | null = null

  /**
   * Ensure we have a valid AudioContext. Some browsers block autoplay
   * until there's a user gesture. So we often resume() on the first gesture.
   */
  private ensureAudioContext() {
    if (!this.audioCtx) {
      this.audioCtx = new AudioContext()
    }
    // In some browsers (especially mobile Safari), we need to resume the context if it's suspended
    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume()
    }
  }

  /**
   * Create and play a short beep using an OscillatorNode.
   * @param frequency The frequency of the beep in Hz
   * @param duration  Duration in seconds
   * @param type      Oscillator type (sine, square, sawtooth, triangle)
   */
  public playSound(duration = 0.5, type: OscillatorType = 'sine') {
    const frequency = tlib.sample(C_Lydian)
    this.ensureAudioContext()
    if (!this.audioCtx) return

    const oscillator = this.audioCtx.createOscillator()
    const gainNode = this.audioCtx.createGain()

    oscillator.type = type
    oscillator.frequency.value = frequency

    // Connect oscillator -> gain -> audioCtx destination
    oscillator.connect(gainNode)
    gainNode.connect(this.audioCtx.destination)

    // Optional: fade out the gain over the duration
    const currentTime = this.audioCtx.currentTime
    gainNode.gain.setValueAtTime(0.2, currentTime) // start volume
    gainNode.gain.exponentialRampToValueAtTime(0.00001, currentTime + duration)

    // Start and stop
    oscillator.start()
    oscillator.stop(this.audioCtx.currentTime + duration)
  }
}

const C_Lydian = [
  261.63 * 2,
  293.66 / 2,
  329.63 * 2,
  369.99 * 4,
  392.00 * 2,
  440.00 ,
  493.88 * 2,
  523.25
];

export const sfx = new SoundManager()