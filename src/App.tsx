import React, { useCallback, useEffect, useRef, useState } from 'react'
import './App.scss'
import MainMenu from './components/MainMenu'
import Canvas from './components/Canvas'
import { BrushType, Coordinates, PixelArray, PotatoHistoryEvent, RGBAValue, Size, InputEvent } from './mainTypes'
import resolutionTemplates from './resolutionTemplates'
import PaletteTool from './components/PaletteTool'
import { palettes } from './palettes'

const App = (): React.JSX.Element => {
  const data: PixelArray = []

  const [canvasSize] = useState<Size>(resolutionTemplates.DEF)
  const [history, setHistory] = useState<PotatoHistoryEvent[]>([])
  const canvasRef = useRef<any>()
  const context: CanvasRenderingContext2D = canvasRef?.current?.getContext('2d')
  const [pixels, setPixels] = useState<PixelArray>([...(data ?? [])])
  const [brushActive, setBrushActive] = useState<boolean>(false)
  const [activeBrushType, setActiveBrushType] = useState<BrushType>('add')
  const [runningFrameCounter, setRunningFrameCounter] = useState<number>(0)
  const [activeColor, setActiveColor] = useState<RGBAValue>({ R: 255, G: 150, B: 10, A: 100 })
  const [activePixelCoordinates, setActivePixelCoordinates] = useState<Coordinates>()
  const [showActivePixelCoordinates, setShowActivePixelCoordinates] = useState<boolean>(true)
  const [paletteId, setPaletteId] = useState<string>('NES')
  const [keysDown, setKeysDown] = useState<string[]>([])
  const [drawStraightLines, setDrawStraightLines] = useState<boolean>(false)

  const handleKeyDown = useCallback(
    (e: { key: any }) => {
      const key = String(e.key).toLowerCase()
      if (key in keysDown) {
        return
      }
      const updatedKeys = [...keysDown]
      updatedKeys.push(key)
      setKeysDown(updatedKeys)
    },
    [keysDown]
  )

  const handleKeyUp = useCallback(
    (e: { key: any }) => {
      const key = String(e.key).toLowerCase()
      const updatedKeys = keysDown.filter((kd) => kd !== key)
      setKeysDown(updatedKeys)
    },
    [keysDown]
  )

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [handleKeyDown])

  useEffect(() => {
    window.addEventListener('keyup', handleKeyUp)
    return () => {
      window.removeEventListener('keyup', handleKeyUp)
    }
  }, [handleKeyUp])

  useEffect(() => {
    setDrawStraightLines(keysDown.includes('shift'))
  }, [keysDown])

  const addToHistoryEvents = (PotatoHistoryEvent: PotatoHistoryEvent) => {
    const updatedEvents = [...history]
    updatedEvents.push(PotatoHistoryEvent)
    setHistory(updatedEvents)
  }

  const hexToRgba = (hex: string): RGBAValue => {
    return {
      R: parseInt(hex.slice(1, 3), 16),
      G: parseInt(hex.slice(3, 5), 16),
      B: parseInt(hex.slice(5, 7), 16),
      A: 1,
    }
  }

  const rgbaToHex = (rgba: RGBAValue, forceRemoveAlpha = true) => {
    const asString = `rgba(${rgba.R},${rgba.G},${rgba.B},${rgba.A})`
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

  const canvasData: PixelArray = []

  return (
    <div className="App">
      <header className="App-header">
        <MainMenu />
      </header>
      <Canvas
        size={canvasSize}
        data={canvasData}
        stateVars={{
          canvasRef,
          context,
          pixels,
          showActivePixelCoordinates,
          activePixelCoordinates,
          activeBrushType,
          runningFrameCounter,
          activeColor,
          brushActive,
        }}
        appFunctions={{
          setBrushActive,
          setActiveBrushType,
          setPixels,
          addToHistoryEvents,
          setActivePixelCoordinates,
          setRunningFrameCounter,
          setActiveColor,
        }}
      />
      <PaletteTool
        activeHex={rgbaToHex(activeColor)}
        setter={(hex) => {
          setActiveColor(hexToRgba(hex))
        }}
        palettes={palettes}
        paletteId={paletteId}
        setPaletteId={setPaletteId}
      />
    </div>
  )
}

export default App
