import React from 'react'
import './App.scss'
import MainMenu from './components/MainMenu'

const App = (): React.JSX.Element => {
  return (
    <div className="App">
      <header className="App-header">
        <MainMenu />
      </header>
    </div>
  )
}

export default App
