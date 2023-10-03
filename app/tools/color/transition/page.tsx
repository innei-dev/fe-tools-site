'use client'

import { useMemo, useState } from 'react'

import { Input } from '~/lib/components/ui/Input'

import { generateTransitionColors } from './utils'

export default function Page() {
  const [startColor, setStartColor] = useState('#39C5BB')
  const [endColor, setEndColor] = useState('#40CC00')
  const [step, setStep] = useState(60)
  const colors = useMemo(
    () => generateTransitionColors(startColor, endColor, step),
    [startColor, endColor, step],
  )

  return (
    <div className="flex flex-col space-y-4">
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
              key={(color, i)}
              className="h-5 w-2 flex-shrink"
              style={{
                backgroundColor: color,
              }}
            />
          )
        })}
      </div>
    </div>
  )
}
