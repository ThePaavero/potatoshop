import React, { useRef, useState } from 'react'
import './App.scss'
import MainMenu from './components/MainMenu'
import Canvas from './components/Canvas'
import { BrushType, Coordinates, PixelArray, PotatoEvent, RGBAValue, Size } from './mainTypes'
import resolutionTemplates from './resolutionTemplates'

const App = (): React.JSX.Element => {
  const data: PixelArray = []

  const [canvasSize] = useState<Size>(resolutionTemplates.DEF)
  const [history, setHistory] = useState<PotatoEvent[]>([])
  const canvasRef = useRef<any>()
  const context: CanvasRenderingContext2D = canvasRef?.current?.getContext('2d')
  const [pixels, setPixels] = useState<PixelArray>([...(data ?? [])])
  const [brushActive, setBrushActive] = useState<boolean>(false)
  const [activeBrushType, setActiveBrushType] = useState<BrushType>('add')
  const [runningFrameCounter, setRunningFrameCounter] = useState<number>(0)
  const [activeColor, setActiveColor] = useState<RGBAValue>({ R: 255, G: 150, B: 10, A: 100 })
  const [activePixelCoordinates, setActivePixelCoordinates] = useState<Coordinates>()
  const [showActivePixelCoordinates, setShowActivePixelCoordinates] = useState<boolean>(true)

  const addToHistoryEvents = (potatoEvent: PotatoEvent) => {
    const updatedEvents = [...history]
    updatedEvents.push(potatoEvent)
    setHistory(updatedEvents)
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
    </div>
  )
}

export default App
