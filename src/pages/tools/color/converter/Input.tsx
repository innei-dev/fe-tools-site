'use client'

import * as Label from '@radix-ui/react-label'
import { useEffect, useRef, useState } from 'react'
import clsx from 'clsx'
import Color from 'color'
import ColorIo from 'colorjs.io'
import { useAtom } from 'jotai'
import { toast } from 'sonner'
import type { FC, MouseEventHandler } from 'react'

import { Input } from '~/components/ui/Input'

import { currentColorAtom } from './store'

type SupportedColorType = 'hex' | 'rgb' | 'hsl' | 'lch' | 'oklch'
export const ColorInput: FC<{
  type: SupportedColorType
}> = (props) => {
  const { type } = props

  const [currentGlobalColor, setCurrentGlobalColor] = useAtom(currentColorAtom)
  const [inputColor, setInputColor] = useState(() =>
    colorToColorString(currentGlobalColor, type),
  )

  const ref = useRef<HTMLInputElement>(null)

  const copyValue: MouseEventHandler<HTMLDivElement> = (e) => {
    const $el = e.target as HTMLButtonElement
    const value = $el.innerText

    toast.info(`Copied, ${value}`)
    navigator.clipboard.writeText(value)
  }

  const [isError, setIsError] = useState(false)

  const currentGlobalColorString = colorToColorString(currentGlobalColor, type)

  useEffect(() => {
    if (!ref.current) return
    // is Focus
    if (ref.current === document.activeElement) return

    setInputColor(currentGlobalColorString)
  }, [currentGlobalColorString])

  return (
    <div className="grid w-full max-w-4xl items-center gap-1.5">
      <Label.Root htmlFor="Hex">{type.toUpperCase()} Color</Label.Root>
      <div className="grid grid-cols-[1fr_2fr] gap-4 [&>*]:relative [&>*]:flex">
        <div className="flex flex-col">
          <Input
            disabled={type === 'oklch'}
            placeholder={`Typing ${type} color`}
            className={clsx(
              'inline-block w-[300px]',

              isError && 'border-2 border-red-500',
            )}
            type="text"
            id={type}
            value={inputColor}
            ref={ref}
            onBlur={() => {
              setInputColor(currentGlobalColorString)
            }}
            onChange={(e) => {
              setInputColor(e.target.value)
              setIsError(false)
              try {
                setCurrentGlobalColor(parseColor(e.target.value, type))
              } catch {
                setIsError(true)
              }
            }}
          />
        </div>

        <div className="items-center">
          <div
            style={{
              backgroundColor: currentGlobalColorString,
            }}
            className="h-4 w-4 rounded-full border border-black border-opacity-80 dark:border-white/90"
          />

          <div
            className="ml-4 grid flex-1 grid-cols-2 gap-2 [&>*]:text-left"
            onClick={copyValue}
          >
            <button>{currentGlobalColorString}</button>
            <button>
              {transformShortColor(currentGlobalColorString, type)}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// @ts-expect-error
const parseColor = (colorString: string, type: SupportedColorType) => {
  // switch (type) {
  //   case 'oklch': {
  //     console.log(colorString, 'colorString')
  //     return new ColorIo(colorString)
  //   }
  // }

  return new ColorIo(colorString)
}

const colorToColorString = (color: ColorIo, type: SupportedColorType) => {
  switch (type) {
    case 'lch': {
      return `lch(${color.lch.map((val) => val.toFixed(2)).join(', ')})`
    }
    case 'hsl':
      return Color(color.toString()).hsl().string()
    case 'hex':
      return Color(color.toString()).hex()
    case 'oklch': {
      return `oklch(${color.oklch.map((val) => val.toFixed(2)).join(', ')})`
    }
    case 'rgb': {
      return color.toString()
    }
  }
}

const transformShortColor = (colorString: string, type: SupportedColorType) => {
  const fn = {
    hex: (val: string) => (val[0] === '#' ? val.slice(1) : val),
    rgb: (val: string) => val.replace('rgb(', '').replace(')', ''),
    hsl: (val: string) => val.replace('hsl(', '').replace(')', ''),
    oklch: (val: string) => val.replace('oklch(', '').replace(')', ''),
  }

  return (fn as any)[type as any]?.(colorString) || colorString
}
