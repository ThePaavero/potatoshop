import React, { useState } from 'react'
import './App.scss'
import MainMenu from './components/MainMenu'
import Canvas from './components/Canvas'
import { PixelArray, PotatoEvent, Size } from './mainTypes'
import resolutionTemplates from './resolutionTemplates'

const App = (): React.JSX.Element => {
  const [canvasSize] = useState<Size>(resolutionTemplates.DEF)
  const [history, setHistory] = useState<PotatoEvent[]>([])

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
      <Canvas size={canvasSize} data={canvasData} addToHistoryEvents={addToHistoryEvents} />
    </div>
  )
}

export default App
