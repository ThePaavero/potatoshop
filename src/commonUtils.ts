import { Coordinates } from './mainTypes'

export const translateCoordinatesFromEvent = (
  e: any,
  canvas: { getBoundingClientRect: () => { width: any; height: any }; offsetLeft: number; offsetTop: number },
  size: { w: number; h: number }
): Coordinates => {
  const { width, height } = canvas.getBoundingClientRect()
  const scaleX = size.w / width
  const scaleY = size.h / height
  return {
    x: Math.round((e.clientX - canvas.offsetLeft) * scaleX),
    y: Math.round((e.clientY - canvas.offsetTop) * scaleY),
  }
}
