import { brightnessRoute } from './color/brightness/route'
import { CoverterRoute } from './color/converter/route'
import { GradationRoute } from './color/gradation/route'
import { InvertRoute } from './color/invert/route'
import { randomRoute } from './color/random/route'
import { excalidrawRoute } from './editor/excalidraw/route'
import { tiptapRoute } from './editor/tiptap-schema/route'
import { camelCaseRoute } from './object/camelcase-keys/route'
import { snakeCaseRoute } from './object/snakecase-keys/route'

export const ToolsRoutes = [
  brightnessRoute,
  CoverterRoute,
  GradationRoute,
  InvertRoute,
  randomRoute,
  tiptapRoute,
  camelCaseRoute,
  excalidrawRoute,
  snakeCaseRoute,
]
