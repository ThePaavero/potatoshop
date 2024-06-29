import { Palette } from '../mainTypes'

export interface PaletteProps {
  activeHex?: string
  setter: (arg0: string) => void
  palettes: Palette[]
  paletteId: string
  setPaletteId: (arg0: string) => void
}

const PaletteTool = ({ activeHex, setter, palettes, paletteId, setPaletteId }: PaletteProps): React.JSX.Element => {
  return (
    <div className="palette-wrapper">
      <nav>
        <select
          onChange={(e: any) => {
            const slug: string = e.target.value
            const matchingPalette = palettes.find((p) => p.name === slug) ?? palettes[0]
            setPaletteId(matchingPalette.name)
          }}
        >
          {palettes.map((p) => {
            return (
              <option key={p.name} value={p.name}>
                {p.name}
              </option>
            )
          })}
        </select>
      </nav>
      <div className="palette">
        {palettes
          .find((p) => p.name === paletteId)
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
    </div>
  )
}

export default PaletteTool
