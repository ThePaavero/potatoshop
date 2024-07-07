import { Tool } from '../mainTypes'
import { MdBrush } from '@react-icons/all-files/md/MdBrush'
import { MdFormatPaint } from '@react-icons/all-files/md/MdFormatPaint'

export interface ToolProps {
  currentTool: Tool
  setter: (arg0: Tool) => void
}

const toolStringsToIcons: any = {
  brush: <MdBrush title="Brush" />,
  fill: <MdFormatPaint title="Fill" />,
}

const ToolTool = ({ currentTool, setter }: ToolProps): React.JSX.Element => {
  return (
    <div className="tool-tool-wrapper">
      {['brush', 'fill'].map((toolString) => {
        return (
          <div
            key={toolString}
            className={`tool ${currentTool === toolString ? ' active' : ''}`}
            onClick={() => {
              setter(toolString as Tool)
            }}
          >
            {toolStringsToIcons[toolString]}
            <span>{toolString}</span>
          </div>
        )
      })}
    </div>
  )
}

export default ToolTool
