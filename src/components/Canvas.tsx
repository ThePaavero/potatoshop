import { useEffect, useRef, useState } from 'react'
import { BrushType, Coordinates, Pixel, PixelArray, RGBAValue, Size } from '../mainTypes'
import Palette from './Palette'

export interface CanvasProps {
  data: PixelArray
  size: Size
}

export enum PotatoEventType {
  ADD_PIXEL = 'addPixel',
  REMOVE_PIXEL = 'removePixel',
}

export interface PotatoEvent {
  eventType: PotatoEventType
  pixel: Pixel
}

const Canvas = ({ data, size }: CanvasProps): React.JSX.Element => {
  const canvasRef = useRef<any>()
  const context: CanvasRenderingContext2D = canvasRef?.current?.getContext('2d')
  const [pixels, setPixels] = useState<PixelArray>([...(data ?? [])])
  const [brushActive, setBrushActive] = useState<boolean>(false)
  const [activeBrushType, setActiveBrushType] = useState<BrushType>('add')
  const [runningFrameCounter, setRunningFrameCounter] = useState<number>(0)
  const [activeColor, setActiveColor] = useState<RGBAValue>({ R: 255, G: 150, B: 10, A: 100 })
  const [activePixelCoordinates, setActivePixelCoordinates] = useState<Coordinates>()
  const [showActivePixelCoordinates, setShowActivePixelCoordinates] = useState<boolean>(true)
  const [history, setHistory] = useState<PotatoEvent[]>([])

  const drawPixels = () => {
    if (!context) {
      return
    }
    context.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)
    context.imageSmoothingEnabled = false
    if (pixels.length && context) {
      pixels.forEach((pixel: Pixel) => {
        context.fillStyle = `rgba(${pixel.rgba.R},${pixel.rgba.G},${pixel.rgba.B},${pixel.rgba.A})`
        context.fillRect(pixel.coords.x, pixel.coords.y, 1, 1)
      })
    }
    if (showActivePixelCoordinates && activePixelCoordinates) {
      context.fillStyle = `rgba(${255},${255},${255},${0.5})`
      context.fillRect(activePixelCoordinates.x, activePixelCoordinates.y, 1, 1)
    }
  }

  useEffect(drawPixels, [
    pixels,
    context,
    runningFrameCounter,
    data,
    size,
    showActivePixelCoordinates,
    activePixelCoordinates,
  ])

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

  const addToHistoryEvents = (potatoEvent: PotatoEvent) => {
    const updatedEvents = [...history]
    updatedEvents.push(potatoEvent)
    setHistory(updatedEvents)
  }

  const addPixel = (coords: Coordinates) => {
    const updatedPixels = [...pixels]
    removePixel(coords)
    const asPixel = {
      coords: { ...coords },
      rgba: activeColor,
    } as Pixel
    updatedPixels.push(asPixel)
    setPixels(updatedPixels)
    addToHistoryEvents({
      eventType: PotatoEventType.ADD_PIXEL,
      pixel: asPixel,
    })
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

  const indicateHoveringPixel = (e: any) => {
    setActivePixelCoordinates(translateCoordinatesFromEvent(e))
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
    } else {
      indicateHoveringPixel(e)
    }
  }

  const hexToRgba = (hex: string): RGBAValue => {
    return {
      R: parseInt(hex.slice(1, 3), 16),
      G: parseInt(hex.slice(3, 5), 16),
      B: parseInt(hex.slice(5, 7), 16),
      A: 1,
    }
  }

  const rgbaToHex = (rgba: RGBAValue) => {
    const asString = `rgba(${rgba.R},${rgba.G},${rgba.B},${rgba.A})`
    const forceRemoveAlpha = true
    return (
      '#' +
      asString
        .replace(/^rgba?\(|\s+|\)$/g, '')
        .split(',')
        .filter((_string, index) => !forceRemoveAlpha || index !== 3)
        .map((string) => parseFloat(string))
        .map((number, index) => (index === 3 ? Math.round(number * 255) : number))
        .map((number) => number.toString(16))
        .map((string) => (string.length === 1 ? '0' + string : string))
        .join('')
    )
  }

  return (
    <>
      <span style={{ display: 'none' }}>{runningFrameCounter}</span>
      <Palette
        activeHex={rgbaToHex(activeColor)}
        setter={(hex) => {
          setActiveColor(hexToRgba(hex))
        }}
      />
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
