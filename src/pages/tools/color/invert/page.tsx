/* eslint-disable no-sparse-arrays */

'use client'

import * as Label from '@radix-ui/react-label'
import { useMemo } from 'react'
import Color from 'color'
import { atom, useAtom, useAtomValue } from 'jotai'
import { toast } from 'sonner'

import { Input } from '~/components/ui/Input'
import { ColorBall } from '~/components/universal/color-bell'

const inputColorAtom = atom('#39C5BB')

export default function Page() {
  return (
    <div className="flex flex-col gap-4 p-6">
      <div className="grid w-full max-w-4xl items-center gap-1.5">
        <InputColor />
        <div className="mt-[30px]" />

        <ColorBrightnessPreview />
      </div>
    </div>
  )
}

const ColorBrightnessPreview = () => {
  const originColor = useAtomValue(inputColorAtom)
  const invertColor = useMemo(() => {
    try {
      return Color(originColor).negate().hex()
    } catch {}
  }, [originColor])
  if (!invertColor) return null
  return (
    <div
      className="flex cursor-pointer items-center gap-3 py-3"
      role="button"
      tabIndex={0}
      onClick={() => {
        toast.success(`Copied Hex: ${invertColor}`)
        navigator.clipboard.writeText(invertColor)
      }}
    >
      <p>Invert Color: {invertColor}</p>
      <ColorBall color={invertColor} />
    </div>
  )
}

const InputColor = () => {
  const [inputColor, setInputColor] = useAtom(inputColorAtom)
  return (
    <>
      <Label.Root htmlFor="color">Source Color</Label.Root>
      <div className="grid grid-cols-[1fr_2fr] gap-4 [&>*]:relative [&>*]:flex">
        <div className="flex flex-col">
          <Input
            className="inline-block w-[300px]"
            type="text"
            id="color"
            value={inputColor}
            onChange={(e) => {
              const value = e.target.value

              try {
                const hex = Color(value).hex()
                setInputColor(hex)
              } catch {}
            }}
          />
        </div>

        <div className="items-center">
          <ColorBall color={inputColor} />
        </div>
      </div>
    </>
  )
}
