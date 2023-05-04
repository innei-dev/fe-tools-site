/* eslint-disable no-sparse-arrays */

'use client'

import type { FC } from 'react'
import { useDeferredValue, useEffect, useMemo } from 'react'
import isHexColor from 'validator/es/lib/isHexColor'

import { Slider } from '~/lib/components/ui/Slider'
import { colorValidator } from '~/lib/utils/color'

import { ColorInput } from './Input'
import { colorsUpdateBatch, useColorStore } from './store'

export default () => {
  return (
    <div className="flex flex-col gap-4 p-6">
      <ColorInput type="hex" validator={isHexColor} />
      <ColorInput type="rgb" validator={colorValidator.isRgb} />
      <ColorInput type="hsl" validator={colorValidator.isHSL} />

      <ColorSliders />
    </div>
  )
}

const useColorValueParser = (
  val: string,
):
  | [number, string, number, number, number, (num: number) => string]
  | undefined => {
  if (val.endsWith('deg')) {
    return [
      +val.slice(0, -3),
      'deg',
      0,
      360,
      0.01,
      (num: number) => `${num}deg`,
    ]
  }

  if (val.endsWith('%')) {
    return [+val.slice(0, -1), '%', 0, 100, 0.01, (num: number) => `${num}%`]
  }
  return [+val, '', 0, 255, 1, (num: number) => `${num}`]
}
const ColorSliders: FC = () => {
  const type = useColorStore((state) => state.adjustType)

  const currentColor = useColorStore((state) => type && state[type])

  const colorSplitArr = useMemo(() => {
    if (!currentColor) return [, , ,]
    const shortColor = (useColorStore.getState() as any)[`${type}Short`]
    if (shortColor) {
      return shortColor.split(',').map(($: string) => $.trim())
    }
    return [, , ,]
  }, [type, currentColor])
  const [x, y, z] = colorSplitArr

  const defereredValue = useDeferredValue(currentColor)
  useEffect(() => {
    if (type && defereredValue) colorsUpdateBatch(type, defereredValue)
  }, [defereredValue, type])

  return (
    <>
      {type && type !== 'hex' && (
        <div className="max-w-3xl flex-col space-y-8">
          <p>
            Adjusting {type.toUpperCase()} color: {currentColor}
          </p>

          <ColorSlider
            value={x}
            onUpdate={(colorWithUnit) => {
              useColorStore.setState({
                [type]: `${type}(${[colorWithUnit, y, z].join(', ')})`,
              })
            }}
          />
          <ColorSlider
            value={y}
            onUpdate={(colorWithUnit) => {
              useColorStore.setState({
                [type]: `${type}(${[x, colorWithUnit, z].join(', ')})`,
              })
            }}
          />
          <ColorSlider
            value={z}
            onUpdate={(colorWithUnit) => {
              useColorStore.setState({
                [type]: `${type}(${[x, y, colorWithUnit].join(', ')})`,
              })
            }}
          />
        </div>
      )}
    </>
  )
}

const ColorSlider: FC<{
  value: string
  onUpdate: (val: string) => void
}> = (props) => {
  const { value } = props
  const [numberValue, , min, max, step, transformer] =
    useColorValueParser(value) || []
  const currentColor = useColorStore((state) => state.hex)
  if (typeof numberValue === 'undefined') return null
  return (
    <Slider
      style={{
        backgroundColor: currentColor,
      }}
      max={max}
      min={min}
      step={step}
      value={[numberValue]}
      onValueChange={(val) => {
        const [value] = val
        if (!transformer) return null
        const nextValue = transformer(value)

        props.onUpdate(nextValue)
      }}
    />
  )
}
