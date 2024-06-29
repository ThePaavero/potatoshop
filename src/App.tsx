import React, { useState } from 'react'
import './App.scss'
import MainMenu from './components/MainMenu'
import Canvas from './components/Canvas'
import { PixelArray, PotatoEvent, Size } from './mainTypes'

const canvasSizeTemplates = {
  DEF: { w: 25, h: 25 },
  NES: { w: 256, h: 240 },
  MEGADRIVE: { w: 320, h: 224 },
}

const App = (): React.JSX.Element => {
  const [canvasSize] = useState<Size>(canvasSizeTemplates.DEF)
  const [history, setHistory] = useState<PotatoEvent[]>([])

  const addToHistoryEvents = (potatoEvent: PotatoEvent) => {
    const updatedEvents = [...history]
    updatedEvents.push(potatoEvent)
    setHistory(updatedEvents)
  }

  const canvasData: PixelArray = [
    {
      coords: { x: 10, y: 10 },
      rgba: { R: 0, G: 0, B: 0, A: 100 },
    },
  ]

  return (
    <div className="App">
      <header className="App-header">
        <MainMenu />
      </header>
      <Canvas size={canvasSize} data={canvasData} addToHistoryEvents={addToHistoryEvents} />
    </div>
  )
}

export default App
