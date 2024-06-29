export interface RGBAValue {
  R: number
  G: number
  B: number
  A: number
}

export interface Coordinates {
  x: number
  y: number
}

export interface Pixel {
  coords: Coordinates
  rgba: RGBAValue
}

export type PixelArray = Pixel[]

export interface Size {
  w: number
  h: number
  [key: string]: any
}

export type BrushType = 'add' | 'remove'

export interface CanvasProps {
  data: PixelArray
  size: Size
  addToHistoryEvents: (arg0: PotatoEvent) => void
}

export enum PotatoEventType {
  ADD_PIXEL = 'addPixel',
  REMOVE_PIXEL = 'removePixel',
}

export interface PotatoEvent {
  eventType: PotatoEventType
  pixel: Pixel
}
