'use client'

import { useState } from 'react'
import isHexColor from 'validator/es/lib/isHexColor'
import isRgbColor from 'validator/es/lib/isRgbColor'

import * as Label from '@radix-ui/react-label'

import { Input } from '~/lib/components/ui/Input'
import { transforms as colorTransformers, hexToRgb } from '~/lib/utils/color'

const colorPalettes = ['hex', 'rgb'] as const
type ColorPalette = (typeof colorPalettes)[number]

function camelCase(str: string) {
  return str.replace(/-([a-z])/g, (g) => g[1].toUpperCase())
}

const colorTransform = <T extends ColorPalette>(key: T, val: string) => {
  const needTransfrom = colorPalettes.filter((item) => item !== key) as any
  console.log(needTransfrom)
  return needTransfrom.reduce((acc, cur: string) => {
    console.log(camelCase(`${key}-to-${cur}`))

    acc[cur] = colorTransformers[camelCase(`${key}-to-${cur}`)]?.(val)
    return acc
  }, {} as Record<ColorPalette, string>)
}

export default () => {
  const defaultHex = '39C5BB'
  const [hex, setHex] = useState('')
  const [rgb, setRgb] = useState('')

  const [errorMessage, setErrorMessage] = useState('')

  const setValueMap = {
    setHex,
    setRgb,
  }

  const transform = <T extends ColorPalette>(key: T, val: string) => {
    const map = colorTransform(key, val)
    Object.entries(map).forEach(([k, v]) => {
      setValueMap[camelCase(`set-${k}`)](v)
    })
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="grid w-full max-w-sm items-center gap-1.5">
        <Label.Root htmlFor="Hex">Hex Color</Label.Root>
        <Input
          placeholder="#39C5BB"
          className="mt-4 inline-block w-[300px]"
          type="text"
          id="Hex"
          defaultValue="#39C5BB"
          value={hex}
          onChange={(e) => {
            const value = e.target.value
            if (!isHexColor(value)) {
              setErrorMessage('Invalid hex color')
            } else {
              setErrorMessage('')
              transform('hex', e.target.value)
            }
            setHex(e.target.value)
          }}
        />
        {errorMessage && (
          <p className="text-sm text-muted-foreground">{errorMessage}</p>
        )}
      </div>
      <div className="grid w-full max-w-sm items-center gap-1.5">
        <Label.Root htmlFor="Hex">RGB Color</Label.Root>
        <Input
          placeholder={hexToRgb(defaultHex)}
          className="mt-4 inline-block w-[300px]"
          type="text"
          id="Hex"
          defaultValue={hexToRgb(defaultHex)}
          value={rgb}
          onChange={(e) => {
            const value = e.target.value
            if (!isRgbColor(`rgb(${value})`)) {
              setErrorMessage('Invalid rgb color')
            } else {
              setErrorMessage('')
              transform('rgb', e.target.value)
            }
            setRgb(e.target.value)
          }}
        />
        {errorMessage && (
          <p className="text-sm text-muted-foreground">{errorMessage}</p>
        )}
      </div>
    </div>
  )
}
