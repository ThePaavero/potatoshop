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

export type AppFunctions = {
  addToHistoryEvents: (arg0: PotatoEvent) => void
  setBrushActive: (arg0: boolean) => void
  setActiveBrushType: (arg0: BrushType) => void
  setPixels: (arg0: PixelArray) => void
  setActivePixelCoordinates: (arg0: Coordinates) => void
  setRunningFrameCounter: (arg0: number) => void
  setActiveColor: (arg0: RGBAValue) => void
}

export interface CanvasProps {
  data: PixelArray
  size: Size
  stateVars: any
  appFunctions: AppFunctions
}

export enum PotatoEventType {
  ADD_PIXEL = 'addPixel',
  REMOVE_PIXEL = 'removePixel',
}

export interface PotatoEvent {
  eventType: PotatoEventType
  pixel: Pixel
}

export interface Palette {
  name: string
  colors: string[]
}
