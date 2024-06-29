import { useEffect, useRef, useState } from 'react'
import { BrushType, Coordinates, Pixel, PixelArray, RGBAValue, Size } from '../mainTypes'

export interface CanvasProps {
  data: PixelArray
  size: Size
}

const Canvas = ({ data, size }: CanvasProps): React.JSX.Element => {
  const canvasRef = useRef<any>()
  const context: CanvasRenderingContext2D = canvasRef?.current?.getContext('2d')
  const [pixels, setPixels] = useState<PixelArray>([...(data ?? [])])
  const [brushActive, setBrushActive] = useState<boolean>(false)
  const [activeBrushType, setActiveBrushType] = useState<BrushType>('add')
  const [runningFrameCounter, setRunningFrameCounter] = useState<number>(0)
  const [activeColor, setActiveColor] = useState<RGBAValue>({ R: 255, G: 15, B: 10, A: 100 })

  const drawPixels = () => {
    if (!context) {
      return
    }
    context.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)
    context.imageSmoothingEnabled = false
    if (pixels.length && context) {
      pixels.forEach((pixel: Pixel) => {
        context.fillStyle = `rgba(${pixel.rgba.R} ${pixel.rgba.G} ${pixel.rgba.B}, ${pixel.rgba.A})`
        context.fillRect(pixel.coords.x, pixel.coords.y, 1, 1)
      })
    }
  }

  useEffect(drawPixels, [pixels, context, data, size])

  const down = (e: any) => {
    e.preventDefault()
    setBrushActive(true)
    switch (e.button) {
      case 0:
        setActiveBrushType('add')
        addPixelFromEvent(e)
        break
      case 1:
        setActiveBrushType('remove')
        removePixelFromEvent(e)
        break
    }
  }

  const up = () => {
    setBrushActive(false)
  }

  const addPixel = (coords: Coordinates) => {
    const updatedPixels = [...pixels]
    if (pixels.find((p) => p.coords.x === coords.x && p.coords.y === coords.y)) {
      return
    }
    updatedPixels.push({
      coords: { ...coords },
      rgba: activeColor,
    } as Pixel)
    setPixels(updatedPixels)
  }

  const removePixel = (coords: Coordinates) => {
    const matchingPixel = pixels.find((p) => p.coords.x === coords.x && p.coords.y === coords.y)
    if (!matchingPixel) {
      return
    }
    const updatedPixels = [...pixels].filter((p) => p !== matchingPixel)
    setPixels(updatedPixels)
  }

  const translateCoordinatesFromEvent = (e: any) => {
    const { width, height } = canvasRef.current.getBoundingClientRect()
    const scaleX = size.w / width
    const scaleY = size.h / height
    return {
      x: Math.round((e.clientX - canvasRef.current.offsetLeft) * scaleX),
      y: Math.round((e.clientY - canvasRef.current.offsetTop) * scaleY),
    }
  }

  const addPixelFromEvent = (e: any) => {
    addPixel(translateCoordinatesFromEvent(e))
  }

  const removePixelFromEvent = (e: any) => {
    removePixel(translateCoordinatesFromEvent(e))
  }

  const move = (e: any) => {
    setRunningFrameCounter(runningFrameCounter + 1)
    if (brushActive) {
      switch (activeBrushType) {
        case 'add':
          addPixelFromEvent(e)
          break
        case 'remove':
          removePixelFromEvent(e)
          break
      }
    }
  }

  return (
    <>
      <span style={{ display: 'none' }}>{runningFrameCounter}</span>
      <canvas
        width={size.w}
        height={size.h}
        style={{ height: `${(size.h / size.w) * 100}vh` }}
        id="main-canvas"
        ref={canvasRef}
        onMouseDownCapture={down}
        onMouseUpCapture={up}
        onMouseMoveCapture={move}
      >
        Canvas is not supported.
      </canvas>
    </>
  )
}
export default Canvas
