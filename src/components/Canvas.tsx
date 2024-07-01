import { useEffect, useState } from 'react'
import { CanvasProps, Coordinates, Pixel, PotatoEventType, InputEvent, Axis } from '../mainTypes'
import { translateCoordinatesFromEvent } from '../commonUtils'

const Canvas = ({ data, size, stateVars, appFunctions, keysDown }: CanvasProps): React.JSX.Element => {
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

  const [cursorCoordinates, setCursorCoordinates] = useState<Coordinates>({ x: 0, y: 0 })
  const [drawStraightLines, setDrawStraightLines] = useState<Axis | undefined>(undefined)
  const [previousCoords, setPreviousCoords] = useState<Coordinates>()

  useEffect(() => {
    // if (drawStraightLines) {
    //   // Ignore any new movement.
    //   return
    // }
    // const keyIsDown = keysDown.length > 0 && keysDown.includes('q')
    // if (!keyIsDown || !previousCoords?.x) {
    //   setDrawStraightLines(undefined)
    //   return
    // }
    // setDrawStraightLines(getMovementAxis(previousCoords, cursorCoordinates))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [keysDown])

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

  const down = (e: InputEvent) => {
    e.preventDefault()
    setBrushActive(true)
    switch (e.button) {
      case 0:
        setActiveBrushType('add')
        addPixel()
        break
      case 1:
        setActiveBrushType('remove')
        removePixel()
        break
    }
  }

  const up = () => {
    setBrushActive(false)
  }

  const addPixel = () => {
    const updatedPixels = [...pixels]
    removePixel()
    const asPixel = {
      coords: { ...cursorCoordinates },
      rgba: activeColor,
    } as Pixel
    updatedPixels.push(asPixel)
    setPixels(updatedPixels)
    addToHistoryEvents({
      eventType: PotatoEventType.ADD_PIXEL,
      pixel: asPixel,
    })
  }

  const removePixel = () => {
    const coords = cursorCoordinates
    const matchingPixel = pixels.find((p: Pixel) => p.coords.x === coords.x && p.coords.y === coords.y)
    if (!matchingPixel) {
      return
    }
    const updatedPixels = [...pixels].filter((p) => p !== matchingPixel)
    setPixels(updatedPixels)
  }

  const indicateHoveringPixel = () => {
    setActivePixelCoordinates(cursorCoordinates)
  }

  const getMovementAxis = (prev: Coordinates, next: Coordinates): Axis | undefined => {
    const deltas: Coordinates = {
      x: Math.abs(prev.x - next.x),
      y: Math.abs(prev.y - next.y),
    }
    return deltas.x > deltas.y ? 'x' : 'y'
  }

  const move = (e: InputEvent) => {
    setRunningFrameCounter(runningFrameCounter + 1)
    const translatedCoordinates: Coordinates = translateCoordinatesFromEvent(e, canvasRef.current, size)
    let translatedCoordinatesToSet = { ...translatedCoordinates }
    // Drawing straight lines. We need to know which axis we need to "lock".
    if (drawStraightLines && previousCoords) {
      const axisToLock = getMovementAxis(previousCoords, translatedCoordinatesToSet)
      if (axisToLock) {
        if (axisToLock === 'x') {
          translatedCoordinatesToSet = { ...translatedCoordinates, x: previousCoords.x }
        } else {
          translatedCoordinatesToSet = { ...translatedCoordinates, y: previousCoords.y }
        }
      }
    }
    setPreviousCoords(translatedCoordinatesToSet)
    setCursorCoordinates(translatedCoordinatesToSet)
    if (brushActive) {
      switch (activeBrushType) {
        case 'add':
          addPixel()
          break
        case 'remove':
          removePixel()
          break
      }
    } else {
      indicateHoveringPixel()
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
        onMouseDownCapture={down as any}
        onMouseUpCapture={up}
        onMouseMoveCapture={move as any}
      >
        Canvas is not supported.
      </canvas>
    </>
  )
}
export default Canvas
