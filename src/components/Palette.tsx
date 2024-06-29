import { palettes } from '../palettes'

export interface PaletteProps {
  activeHex?: string
  setter: (arg0: string) => void
}

const Palette = ({ activeHex, setter }: PaletteProps): React.JSX.Element => {
  return (
    <div className="palette">
      {palettes
        .find((p) => p.name === 'NES')
        ?.colors.map((hex) => {
          return (
            <div
              key={hex.replace('#', '')}
              style={{ backgroundColor: hex }}
              className={hex === activeHex ? 'active' : ''}
              onClick={() => {
                setter(hex)
              }}
            ></div>
          )
        })}
    </div>
  )
}

export default Palette
