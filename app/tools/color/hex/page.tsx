'use client'

import type { FC } from 'react'
import { useEffect, useRef, useState } from 'react'
import isHexColor from 'validator/es/lib/isHexColor'
import { create } from 'zustand'

import * as Label from '@radix-ui/react-label'

import { Input } from '~/lib/components/ui/Input'
import type { ColorPalette } from '~/lib/utils/color'
import { transforms as colorTransformers } from '~/lib/utils/color'

const colorPalettes = ['hex', 'rgb', 'hsl'] as const

const defaultColorVariantMap = {
  hex: '#39C5BB',
  rgb: 'rgb(57, 197, 187)',
  hsl: 'hsl(174, 57%, 51%)',
}

function camelCase(str: string) {
  return str.replace(/-([a-z])/g, (g) => g[1].toUpperCase())
}

const colorTransform = <T extends ColorPalette>(key: T, val: string) => {
  const needTransfrom = colorPalettes.filter((item) => item !== key) as any

  return needTransfrom.reduce((acc: any, cur: string) => {
    let nextValue = val
    if (key !== 'rgb') {
      // @ts-ignore
      nextValue = colorTransformers[camelCase(`${key}-to-rgb`)]?.(val)
    }

    // @ts-ignore
    acc[cur] = colorTransformers[camelCase(`rgb-to-${cur}`)]?.(nextValue)
    return acc
  }, {} as Record<ColorPalette, string>)
}

const useColorsStore = create(() => {
  return { ...defaultColorVariantMap } as Record<ColorPalette, string> & {}
})

export default () => {
  return (
    <div className="flex flex-col gap-4">
      <ColorInput type="hex" validator={isHexColor} />
      <ColorInput type="rgb" validator={(v) => v} />
      <ColorInput type="hsl" validator={(v) => v} />
    </div>
  )
}

const colorsUpdateBatch = (type: ColorPalette, value: string) => {
  const map = colorTransform(type, value)
  Object.entries(map).forEach(([k, v]) => {
    useColorsStore.setState({ [k]: v })
  })
}

const resetColors = () => {
  colorPalettes.forEach((item) => {
    useColorsStore.setState({ [item]: '' })
  })
}

const ColorInput: FC<{
  type: ColorPalette
  validator: (val: string) => boolean
}> = (props) => {
  const { type, validator } = props
  const value = useColorsStore((state) => state[type])
  const [errorMessage, setErrorMessage] = useState('')
  const ref = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!value) {
      resetColors()
    }
  }, [value])

  return (
    <div className="grid w-full max-w-sm items-center gap-1.5">
      <Label.Root htmlFor="Hex">{type.toUpperCase()} Color</Label.Root>
      <Input
        placeholder={defaultColorVariantMap[type]}
        className="inline-block w-[300px]"
        type="text"
        id={type}
        value={value}
        ref={ref}
        onChange={(e) => {
          const value = e.target.value
          if (!validator(value)) {
            setErrorMessage('Invalid hex color')
          } else {
            setErrorMessage('')
          }
          useColorsStore.setState({ [type]: value })
        }}
        onKeyDown={() => {
          if (!errorMessage) {
            colorsUpdateBatch(type, ref.current?.value || '')
          }
        }}
      />
      <p className="text-sm text-muted-foreground h-4">{errorMessage}</p>
    </div>
  )
}
