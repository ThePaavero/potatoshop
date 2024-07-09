import './App.scss'
import React, { useEffect, useRef, useState } from 'react'
import { BrushType, Coordinates, PixelArray, PotatoHistoryEvent, RGBAValue, Size, Tool } from './mainTypes'
import { palettes } from './palettes'
import resolutionTemplates from './resolutionTemplates'
import MainMenu from './components/MainMenu'
import Canvas from './components/Canvas'
import PaletteTool from './components/PaletteTool'
import ToolTool from './components/ToolTool'

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
  const [activeColor, setActiveColor] = useState<RGBAValue>({ R: 0, G: 0, B: 0, A: 1 })
  const [activePixelCoordinates, setActivePixelCoordinates] = useState<Coordinates>()
  const [showActivePixelCoordinates] = useState<boolean>(true)
  const [paletteId, setPaletteId] = useState<string>('NES')
  const [keysDown, setKeysDown] = useState<any>([])
  const [loaded, setLoaded] = useState<boolean>(false)
  const [activeTool, setActiveTool] = useState<Tool>('brush')

  useEffect(() => {
    if (loaded) {
      return
    }
    const onDown = (e: globalThis.KeyboardEvent) => {
      const key = String(e.key).toLowerCase()
      if (key in keysDown) {
        return
      }
      const updatedKeys = [...keysDown]
      updatedKeys.push(key)
      setKeysDown(updatedKeys)
    }
    const onUp = (e: any) => {
      const key = String(e.key).toLowerCase()
      setKeysDown(keysDown.filter((kd: string) => kd !== key))
    }
    window.addEventListener('keydown', onDown)
    window.addEventListener('keyup', onUp)
    setLoaded(true)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loaded])

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
          activeTool,
        }}
        keysDown={keysDown}
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
      <ToolTool
        currentTool={activeTool}
        setter={(toolString: Tool) => {
          setActiveTool(toolString)
        }}
      />
    </div>
  )
}

export default App
