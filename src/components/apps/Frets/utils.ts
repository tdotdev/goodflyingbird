

// map[midi value % 12]
const RAINBOW_PALETTE = [
  "#ff4b4b", // red
  "#ff914b", // orange
  "#ffc94b", // yellow
  "#d4ff4b", // yellow-green
  "#7dff4b", // green
  "#4bff91", // teal-green
  "#4bffd4", // aqua
  "#4bc9ff", // sky blue
  "#4b91ff", // blue
  "#7d4bff", // indigo
  "#c94bff", // violet
  "#ff4bd4"  // magenta-pink
];

const BLUE_PALETTE = [
  "#d0e7ff",
  "#a8cfff",
  "#80b7ff",
  "#589fff",
  "#3187ff",
  "#096fff",
  "#0060e6",
  "#0052cc",
  "#0044b3",
  "#003699",
  "#002880",
  "#001a66"
];

const RED_PALETTE = [
  "#ffd6d6",
  "#ffb3b3",
  "#ff8f8f",
  "#ff6b6b",
  "#ff4747",
  "#ff2323",
  "#e60000",
  "#cc0000",
  "#b30000",
  "#990000",
  "#800000",
  "#660000"
];

const BOY_PALETTE = [
  "#4b9bff",
  "#337fff",
  "#1a62ff",
  "#0055cc",
  "#ffaa33",
  "#ff991a",
  "#ff8000",
  "#e67300",
  "#ffe766",
  "#ffdd33",
  "#ffd700",
  "#e6c200"
];

const CANDY_PALETTE = [
  "#ff99cc",
  "#ff66b3",
  "#ff33aa",
  "#cc33ff",
  "#9966ff",
  "#6699ff",
  "#66ccff",
  "#66ffff",
  "#66ffcc",
  "#99ffcc",
  "#ccffe6",
  "#ffffff"
];

const EARTH_PALETTE = [
  "#7a5230",
  "#a3753b",
  "#cfa44e",
  "#e2c290",
  "#668c3e",
  "#7abf5c",
  "#a9e085",
  "#d4f2b0",
  "#7db9d7",
  "#4a90a4",
  "#2f6f87",
  "#1f4d61"
];

export const PALETTES: Record<string, string[]> = {
  'Rainbow': RAINBOW_PALETTE,
  'Blue': BLUE_PALETTE,
  'Red': RED_PALETTE,
  'Cinematic': BOY_PALETTE,
  'Candy': CANDY_PALETTE,
  'Earth': EARTH_PALETTE,
}

/*[
  "#aaaaaa", // C       neutral gray (base/root) 
  "#f794e4", // C#/Db   bright gold
  "#94dee3", // D       soft gray
  "#ffa500", // D#/Eb   orange
  "#ffff66", // E       soft yellow
  "#ff6666", // F       soft red
  "#ff9966", // F#/Gb   orange-pink
  "#66cc66", // G       light green
  "#a666ff", // G#/Ab   teal-green
  "#6699ff", // A       light blue
  "#3366cc", // A#/Bb   deeper blue
  "#66ffeb"  // B       minty green
]*/

export const CHROMATIC_SCALE = [0,1,2,3,4,5,6,7,8,9,10,11]

export function noteToMidiBase(note: string) {
  switch (note) {
    case "C":
      return 0
    case "C#":
    case "Db":
      return 1
    case 'D':
      return 2
    case 'D#':
    case 'Eb':
      return 3
    case 'E':
      return 4
    case 'F':
      return 5
    case 'F#':
    case 'Gb':
      return 6
    case 'G':
      return 7
    case 'G#':
    case 'Ab':
      return 8
    case 'A':
      return 9
    case 'A#':
    case 'Bb':
      return 10
    case 'B':
      return 11
    default:
      return -1
  }
}

const DEFAULT_NOTE_NAMES = ["C", "C#", "D", "Eb", "E", "F", "F#", "G", "Ab", "A", "Bb", "B"]

export function midiToNote(midiNote: number, noteNames?: string[]) {
  const names = noteNames ?? DEFAULT_NOTE_NAMES
  const noteIndex = midiNote % 12;
  return `${names[noteIndex]}`
}

export function getOctave(midiNote: number) {
  return Math.floor(midiNote / 12) - 1; // MIDI note 0 is C-1
}

export function midiToNoteWithOctave(midiNote: number, noteNames?: string[]): [note: string, octave: number] {
  return [midiToNote(midiNote, noteNames), getOctave(midiNote)]
}

export function midiToNoteWithOctaveStr(midiNote: number, noteNames?: string[]) {
  const [note, oct] = midiToNoteWithOctave(midiNote, noteNames)
  return `${note}${oct}`
}


export function distanceFretFromNut(fretNum: number, scaleLength: number) {
  // fretNum index starts at 1, nut is i=0
  return scaleLength - (scaleLength / (2 ** (fretNum / 12)))
}

function midPointTwoFrets() {

}

export function darkenHexColor(hex: string, percent: number): string {
  // clamped
  percent = Math.max(0, Math.min(100, percent));

  hex = hex.replace(/^#/, '');

  if (hex.length !== 6) {
    throw new Error("hex not 6 digits")
  }

  const r = parseInt(hex.slice(0, 2), 16)
  const g = parseInt(hex.slice(2, 4), 16)
  const b = parseInt(hex.slice(4, 6), 16)

  const factor = (100 - percent) / 100

  const newR = Math.round(r * factor)
  const newG = Math.round(g * factor)
  const newB = Math.round(b * factor)

  return (
    '#' +
    newR.toString(16).padStart(2, '0') +
    newG.toString(16).padStart(2, '0') +
    newB.toString(16).padStart(2, '0')
  );
}

export function normalizeNumber(value: number, min: number, max: number) {
  // string format purpose only ... TODO: rename
  return (value / 10).toFixed(0).split(".")[0];
}
