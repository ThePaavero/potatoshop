import { PixelArray, Size } from '../mainTypes'

export interface CanvasProps {
  data: PixelArray
  size: Size
}

const Canvas = ({ data, size }: CanvasProps): React.JSX.Element => {
  return (
    <canvas width={size.w} height={size.h} style={{ height: `${(size.h / size.w) * 100}vh` }} id="main-canvas">
      Canvas is not supported.
    </canvas>
  )
}
export default Canvas
