import { useEffect } from 'react'
import { CanvasProps, Coordinates, Pixel, PotatoEventType } from '../mainTypes'

const Canvas = ({ data, size, stateVars, appFunctions }: CanvasProps): React.JSX.Element => {
  const {
    canvasRef,
    context,
    pixels,
    showActivePixelCoordinates,
    activePixelCoordinates,
    activeBrushType,
    runningFrameCounter,
    activeColor,
    brushActive,
  } = stateVars
  const {
    setBrushActive,
    setActiveBrushType,
    setPixels,
    addToHistoryEvents,
    setActivePixelCoordinates,
    setRunningFrameCounter,
  } = appFunctions
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
    canvasRef,
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
    const matchingPixel = pixels.find((p: Pixel) => p.coords.x === coords.x && p.coords.y === coords.y)
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
