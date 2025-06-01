

// map[midi value % 12]
export const DEFAULT_COLORS = [
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
]

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
      return 0
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
