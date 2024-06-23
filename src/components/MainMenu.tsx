import React from 'react'

const MainMenu = (): React.JSX.Element => {
  const openItem = (slug: string) => {
    console.log(`Opening main menu item with slug "${slug}"...`)
  }

  return (
    <nav id="main-menu">
      <ul>
        <li>
          <button
            onClick={() => {
              openItem('file')
            }}
          >
            File
          </button>
        </li>
      </ul>
    </nav>
  )
}

export default MainMenu
