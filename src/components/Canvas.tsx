import { useEffect, useRef, useState } from 'react'
import { Pixel, PixelArray, RGBAValue, Size } from '../mainTypes'

export interface CanvasProps {
  data: PixelArray
  size: Size
}

const Canvas = ({ data, size }: CanvasProps): React.JSX.Element => {
  const canvasRef = useRef<any>()
  const context: CanvasRenderingContext2D = canvasRef?.current?.getContext('2d')
  const [pixels, setPixels] = useState<PixelArray>([...(data ?? [])])
  const [brushActive, setBrushActive] = useState<boolean>(false)
  const [runningFrameCounter, setRunningFrameCounter] = useState<number>(0)
  const [activeColor, setActiveColor] = useState<RGBAValue>({ R: 255, G: 15, B: 10, A: 100 })

  const drawPixels = () => {
    if (pixels.length && context) {
      console.log(pixels.length)
      pixels.forEach((pixel: Pixel) => {
        context.fillStyle = `rgba(${pixel.rgba.R} ${pixel.rgba.G} ${pixel.rgba.B}, ${pixel.rgba.A})`
        context.fillRect(pixel.coords.x, pixel.coords.y, 1, 1)
      })
    }
  }

  useEffect(drawPixels, [pixels, context, data])

  const down = () => {
    setBrushActive(true)
  }

  const up = () => {
    setBrushActive(false)
  }

  const move = (e: any) => {
    setRunningFrameCounter(runningFrameCounter + 1)
    if (brushActive) {
      if (!canvasRef.current) {
        return
      }
      const mappedCoords = {
        x: e.clientX,
        y: e.clientY,
      }
      const updatedPixels = [...pixels]
      if (pixels.find((p) => p.coords.x === mappedCoords.x && p.coords.y === mappedCoords.y)) {
        return
      }
      updatedPixels.push({
        coords: { ...mappedCoords },
        rgba: activeColor,
      } as Pixel)
      setPixels(updatedPixels)
    }
  }

  return (
    <>
      {runningFrameCounter}
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
