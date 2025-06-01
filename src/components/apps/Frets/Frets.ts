
export type NoteMarker = {
  note: string
  color?: string
}

export type FretConfig = {
  scale: number[]
  title?: string
  tuning?: number[]
  fretCount?: number
  scaleLength?: number
  scaleWidth?: number
  x?: number
  y?: number
}