

// map[midi value % 12]
export const DEFAULT_COLOR_MAP = [
  "#aaaaaa", // C       neutral gray (base/root) 
  "#ffd700", // C#/Db   bright gold
  "#999999", // D       soft gray
  "#ffa500", // D#/Eb   orange
  "#ffff66", // E       soft yellow
  "#ff6666", // F       soft red
  "#ff9966", // F#/Gb   orange-pink
  "#66cc66", // G       light green
  "#33aa77", // G#/Ab   teal-green
  "#6699ff", // A       light blue
  "#3366cc", // A#/Bb   deeper blue
  "#66ff99"  // B       minty green
]

const DEFAULT_NOTE_NAMES = ["C", "C#", "D", "Eb", "E", "F", "F#", "G", "Ab", "A", "Bb", "B"]

function midiToNote(midiNote: number, noteNames?: string[]) {
  const names = noteNames ?? DEFAULT_NOTE_NAMES
  const noteIndex = midiNote % 12;
  return `${names[noteIndex]}`
}

function getOctave(midiNote: number) {
  return Math.floor(midiNote / 12) - 1; // MIDI note 0 is C-1
}

function midiToNoteWithOctave(midiNote: number, noteNames?: string[]): [note: string, octave: number] {
  return [midiToNote(midiNote, noteNames), getOctave(midiNote)]
}

function midiToNoteWithOctaveStr(midiNote: number, noteNames?: string[]) {
  const [note, oct] = midiToNoteWithOctave(midiNote, noteNames)
  return `${note}${oct}`
}


function distanceFretFromNut(scaleLength: number, fretNum: number) {
  // fretNum index starts at 1, nut is i=0
  return scaleLength - (scaleLength / (2 ** (fretNum / 12)))
}

function midPointTwoFrets() {

}