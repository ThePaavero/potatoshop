import React, { useState } from 'react'
import './App.scss'
import MainMenu from './components/MainMenu'
import Canvas from './components/Canvas'
import { PixelArray, Size } from './mainTypes'

const canvasSizeTemplates = {
  NES: { w: 256, h: 240 },
  MEGADRIVE: { w: 320, h: 224 },
}

const App = (): React.JSX.Element => {
  const canvasData: PixelArray = [
    {
      coords: { x: 10, y: 10 },
      rgba: { R: 0, G: 0, B: 0, A: 100 },
    },
  ]

  const [canvasSize, setCanvasSize] = useState<Size>(canvasSizeTemplates.NES)

  return (
    <div className="App">
      <header className="App-header">
        <MainMenu />
      </header>
      <Canvas size={canvasSize} data={canvasData} />
    </div>
  )
}

export default App
