'use client'

import { camelCase } from 'lodash-es'
import type { FC, MouseEventHandler } from 'react'
import { useEffect, useRef, useState } from 'react'
import { message } from 'react-message-popup'
import { create } from 'zustand'

import * as Label from '@radix-ui/react-label'

import { Input } from '~/lib/components/ui/Input'
import type { ColorPalette } from '~/lib/utils/color'

const colorPalettes = ['hex', 'rgb', 'hsl'] as const

const defaultColorVariantMap = {
  hex: '#39C5BB',
  rgb: 'rgb(57, 197, 187)',
  hsl: 'hsl(174, 57%, 51%)',
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

export const ColorInput: FC<{
  type: ColorPalette
  validator: (val: string) => boolean

  color1Transform?: (val: string) => string
  color2Transform?: (val: string) => string
}> = (props) => {
  const { type, validator, color1Transform, color2Transform } = props
  const value = useColorsStore((state) => state[type])

  const [errorMessage, setErrorMessage] = useState('')
  const ref = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!value) {
      resetColors()
    }
  }, [value])

  const copyValue: MouseEventHandler<HTMLDivElement> = (e) => {
    const $el = e.target as HTMLButtonElement
    const value = $el.innerText

    message.info(`Copied, ${value}`)
    navigator.clipboard.writeText(value)
  }

  return (
    <div className="grid w-full max-w-3xl items-center gap-1.5">
      <Label.Root htmlFor="Hex">{type.toUpperCase()} Color</Label.Root>
      <div className="grid gap-4 grid-cols-2 [&>*]:flex [&>*]:items-center [&>*]:relative">
        <div className="flex flex-col">
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
                setErrorMessage(`Invalid ${type} color`)
              } else {
                setErrorMessage('')
              }
              useColorsStore.setState({ [type]: value })
            }}
            onKeyUp={() => {
              if (!errorMessage) {
                colorsUpdateBatch(type, value)
              }
            }}
          />
        </div>

        <div className="items-center">
          <div
            style={{
              backgroundColor: color1Transform ? color1Transform(value) : value,
            }}
            className="rounded-full h-4 w-4 border border-black border-opacity-80"
          />

          {!errorMessage && (
            <div
              className="ml-4 grid grid-cols-2 gap-2 flex-1 [&>*]:text-left"
              onClick={copyValue}
            >
              <button>{color1Transform && color1Transform(value)}</button>
              <button>{color2Transform && color2Transform(value)}</button>
            </div>
          )}
        </div>
      </div>

      <p className="text-sm text-muted-foreground h-4">{errorMessage}</p>
    </div>
  )
}