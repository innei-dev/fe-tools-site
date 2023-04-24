'use client'
import * as Label from '@radix-ui/react-label'

const hexToRGB = (hex: string) => {
  hex = hex.replace('#', '')

  const r = parseInt(hex.substring(0, 2), 16)
  const g = parseInt(hex.substring(2, 4), 16)
  const b = parseInt(hex.substring(4, 6), 16)

  return `${r}, ${g}, ${b}`
}

export default () => {
  return (
    <div
      style={{
        display: 'flex',
        padding: '0 20px',
        flexWrap: 'wrap',
        gap: 15,
        alignItems: 'center',
      }}
    >
      <Label.Root className="LabelRoot" htmlFor="hexColor">
        Hex Color
      </Label.Root>
      <input className="Input" type="text" id="firstName" defaultValue="" />
    </div>
  )
}
