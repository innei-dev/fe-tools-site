'use client'

import { Label } from '@radix-ui/react-label'
import { useMemo, useState } from 'react'
import Color from 'color'

import { CodeBlock } from '~/lib/components/ui/CodeBlock'
import { Input } from '~/lib/components/ui/Input'
import { ColorBall } from '~/lib/components/universal/color-bell'

import { generateColorScale, generateTransitionColors } from './utils'

const ColorTransition = () => {
  const [startColor, setStartColor] = useState('#39C5BB')
  const [endColor, setEndColor] = useState('#40CC00')
  const [step, setStep] = useState(60)
  const colors = useMemo(
    () => generateTransitionColors(startColor, endColor, step),
    [startColor, endColor, step],
  )

  return (
    <div className="flex flex-col space-y-4">
      <Label className="ml-1 text-lg font-medium">
        From <code>{startColor}</code> to <code>{endColor}</code> with{' '}
        <code>{step}</code> steps
      </Label>
      <Input
        placeholder="Start Color"
        className="inline-block w-[300px]"
        type="text"
        value={startColor}
        onChange={(e) => {
          const value = e.target.value
          setStartColor(value)
        }}
      />
      <Input
        placeholder="Target Color"
        className="inline-block w-[300px]"
        type="text"
        value={endColor}
        onChange={(e) => {
          const value = e.target.value
          setEndColor(value)
        }}
      />

      <Input
        placeholder="Step"
        className="inline-block w-[300px]"
        type="number"
        value={step}
        onChange={(e) => {
          const value = e.target.value
          setStep(parseInt(value))
        }}
      />

      <div className="flex w-[700px]">
        {colors.map((color, i) => {
          return (
            <div
              key={color}
              className="h-5 w-2 flex-shrink"
              style={{
                backgroundColor: color,
              }}
            />
          )
        })}
      </div>

      <CodeBlock language="javascript" className="max-h-[12rem]">
        {JSON.stringify(colors, null, 2)}
      </CodeBlock>
    </div>
  )
}

const ColorGradient = () => {
  const [baseColor, setBaseColor] = useState('#39C5BB')

  const colorGradient = useMemo(() => {
    try {
      const hex = Color(baseColor).hex()
      return generateColorScale(hex)
    } catch {
      return []
    }
  }, [baseColor])
  return (
    <div className="flex flex-col gap-2">
      <Label className="ml-1 text-lg font-medium">Color Gradient</Label>

      <Input
        placeholder="Base Color"
        className="inline-block w-[300px]"
        type="text"
        value={baseColor}
        onChange={(e) => {
          const value = e.target.value
          setBaseColor(value)
        }}
      />

      <div className="flex w-[700px] flex-col">
        {Object.entries(colorGradient).map(([level, color]) => {
          return (
            <div className="flex items-center gap-2" key={color}>
              <div>{level}:</div>

              <ColorBall color={color} />
            </div>
          )
        })}
      </div>

      <CodeBlock language="javascript" className="max-h-[12rem]">
        {JSON.stringify(colorGradient, null, 2)}
      </CodeBlock>
    </div>
  )
}

export default function Page() {
  return (
    <>
      <ColorTransition />
      <div className="h-12" />
      <ColorGradient />
    </>
  )
}
