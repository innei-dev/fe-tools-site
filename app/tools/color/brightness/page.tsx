/* eslint-disable no-sparse-arrays */

'use client'

import * as Label from '@radix-ui/react-label'
import { useEffect, useState } from 'react'
import Color from 'color'
import { atom, useAtom, useAtomValue, useSetAtom } from 'jotai'
import { toast } from 'sonner'
import isHexColor from 'validator/es/lib/isHexColor'

import { Input } from '~/lib/components/ui/Input'
import { Slider } from '~/lib/components/ui/Slider'
import { ColorBall } from '~/lib/components/universal/color-bell'

const inputColorAtom = atom('#39C5BB')
const brightnessColorAtom = atom('#39C5BB')

export default () => {
  return (
    <div className="flex flex-col gap-4 p-6">
      <div className="grid w-full max-w-4xl items-center gap-1.5">
        <InputColor />
        <div className="mt-[30px]" />
        <ColorBrightnessSlider />
        <ColorBrightnessPreview />
      </div>
    </div>
  )
}

const ColorBrightnessPreview = () => {
  const brightnessColor = useAtomValue(brightnessColorAtom)
  return (
    <div
      className="flex cursor-pointer items-center gap-3 py-3"
      role="button"
      tabIndex={0}
      onClick={() => {
        toast.success(`Copied Hex: ${brightnessColor}`)
        navigator.clipboard.writeText(brightnessColor)
      }}
    >
      <p>Brightness Hex: {brightnessColor}</p>
      <ColorBall color={brightnessColor} />
    </div>
  )
}
const ColorBrightnessSlider = () => {
  const [sliderValue, setSliderValue] = useState(50)
  const inputColor = useAtomValue(inputColorAtom)
  const setBrightnessColor = useSetAtom(brightnessColorAtom)

  useEffect(() => {
    setBrightnessColor(inputColor)
  }, [inputColor])

  useEffect(() => {
    setBrightnessColor(Color(inputColor).lightness(sliderValue).hex())
  }, [])

  return (
    <div className="flex items-center gap-3 py-3">
      <p className="flex w-[15rem] items-center gap-3">
        <span>Brightness:</span>

        <Input
          value={sliderValue}
          onChange={(e) => {
            const value = parseFloat(e.target.value)
            setSliderValue(value)
            setBrightnessColor(Color(inputColor).lightness(value).hex())
          }}
          type="number"
        />
      </p>
      <Slider
        value={[sliderValue]}
        step={0.01}
        min={0}
        max={100}
        onValueChange={(va) => {
          setSliderValue(va[0])

          setBrightnessColor(Color(inputColor).lightness(va[0]).hex())
        }}
      />
    </div>
  )
}
const InputColor = () => {
  const [inputColor, setInputColor] = useAtom(inputColorAtom)
  return (
    <>
      <Label.Root htmlFor="Hex">Hex Color</Label.Root>
      <div className="grid grid-cols-[1fr_2fr] gap-4 [&>*]:relative [&>*]:flex">
        <div className="flex flex-col">
          <Input
            className="inline-block w-[300px]"
            type="text"
            value={inputColor}
            onChange={(e) => {
              const value = e.target.value
              isHexColor(value) && setInputColor(value)
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
