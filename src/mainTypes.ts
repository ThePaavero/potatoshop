export interface RGBAValue {
  R: number
  G: number
  B: number
  A: number
}

export interface Coordinates {
  x: number
  y: number
  rgba: RGBAValue
}

export interface Pixel {
  coords: Coordinates
}

export type PixelArray = Pixel[]

export interface Size {
  w: number
  h: number
  [key: string]: any
}
