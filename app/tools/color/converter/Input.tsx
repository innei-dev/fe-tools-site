'use client'

import * as Label from '@radix-ui/react-label'
import { useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'
import type { ColorPalette } from '~/lib/utils/color'
import type { FC, MouseEventHandler } from 'react'

import { Input } from '~/lib/components/ui/Input'

import {
  colorsUpdateBatch,
  defaultColorVariantMap,
  resetColors,
  useColorStore,
} from './store'

export const ColorInput: FC<{
  type: ColorPalette
  validator: (val: string) => boolean
}> = (props) => {
  const { type, validator } = props
  const value = useColorStore((state) => state[type])

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

    toast.info(`Copied, ${value}`)
    navigator.clipboard.writeText(value)
  }

  const fullColor = useColorStore((state) => (state as any)[`${type}Full`])
  const shortColor = useColorStore((state) => (state as any)[`${type}Short`])

  const handleFocus = () => {
    useColorStore.setState({
      adjustType: type,
    })
  }

  return (
    <div className="grid w-full max-w-4xl items-center gap-1.5">
      <Label.Root htmlFor="Hex">{type.toUpperCase()} Color</Label.Root>
      <div className="grid grid-cols-[1fr_2fr] gap-4 [&>*]:relative [&>*]:flex">
        <div className="flex flex-col">
          <Input
            placeholder={defaultColorVariantMap[type]}
            className="inline-block w-[300px]"
            type="text"
            id={type}
            value={value}
            ref={ref}
            onFocus={handleFocus}
            onChange={(e) => {
              const value = e.target.value
              if (!validator(value)) {
                setErrorMessage(`Invalid ${type} color`)
              } else {
                setErrorMessage('')
              }
              useColorStore.setState({ [type]: value })
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
              backgroundColor: fullColor,
            }}
            className="h-4 w-4 rounded-full border border-black border-opacity-80"
          />

          {!errorMessage && (
            <div
              className="ml-4 grid flex-1 grid-cols-2 gap-2 [&>*]:text-left"
              onClick={copyValue}
            >
              <button>{fullColor}</button>
              <button>{shortColor}</button>
            </div>
          )}
        </div>
      </div>

      <p className="h-4 text-sm text-muted-foreground">{errorMessage}</p>
    </div>
  )
}
