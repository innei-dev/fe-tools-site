/* eslint-disable no-sparse-arrays */

'use client'

import { ColorInput } from './Input'

export default () => {
  return (
    <div className="flex flex-col gap-4 p-6">
      <ColorInput type="hex" />
      <ColorInput type="rgb" />
      <ColorInput type="hsl" />
      <ColorInput type="oklch" />
    </div>
  )
}
