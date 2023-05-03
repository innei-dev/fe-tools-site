import { camelCase } from 'lodash-es'
import { create } from 'zustand'

import { transforms as colorTransformers } from '~/lib/utils/color'
import type { ColorPalette } from '~/lib/utils/color'

export const defaultColorVariantMap = {
  hex: '#39C5BB',
  rgb: 'rgb(57, 197, 187)',
  hsl: 'hsl(174, 57%, 51%)',
}

const defaultColorFullMap = {
  hexFull: '#39C5BB',
  rgbFull: 'rgb(57, 197, 187)',
  hslFull: 'hsl(174, 57%, 51%)',
}

const defaultColorShortMap = {
  hexShort: '39C5BB',
  rgbShort: '57, 197, 187',
  hslShort: '174deg, 57%, 51%',
}

type Colors = typeof defaultColorVariantMap
interface ColorStore extends Colors {
  adjustType: ColorPalette | null

  hexFull: string
  rgbFull: string
  hslFull: string

  hexShort: string
  rgbShort: string
  hslShort: string
}
export const useColorStore = create<ColorStore>(() => {
  return {
    adjustType: null,

    ...defaultColorVariantMap,
    ...defaultColorFullMap,
    ...defaultColorShortMap,
  }
})

const setState = useColorStore.setState
useColorStore.subscribe((state, prevState) => {
  if (state.hex !== prevState.hex) {
    const fullHex = ((val) => (val[0] !== '#' ? `#${val}` : val))(state.hex)
    const shortHex = ((val) => (val[0] === '#' ? val.slice(1) : val))(state.hex)
    setState({
      hexFull: fullHex,
      hexShort: shortHex,
    })
  }

  if (state.rgb !== prevState.rgb) {
    const full = ((val) =>
      !val.toLowerCase().startsWith('rgb') ? `rgb(${val})` : val)(state.rgb)
    const short = ((val) => val.replace(/rgb\((.*)\)/, '$1'))(state.rgb)

    setState({
      rgbFull: full,
      rgbShort: short,
    })
  }

  if (state.hsl !== prevState.hsl) {
    const full = ((val) =>
      !val.toLowerCase().startsWith('hsl') ? `hsl(${val})` : val)(state.hsl)
    const short = ((val) => {
      const [h, s, l] = val.replace(/hsl\((.*)\)/, '$1').split(',')
      return `${h}deg, ${s}, ${l}`
    })(state.hsl)
    setState({
      hslFull: full,
      hslShort: short,
    })
  }
})
const colorPalettes = ['hex', 'rgb', 'hsl'] as const

export const resetColors = () => {
  colorPalettes.forEach((item) => {
    useColorStore.setState({ [item]: '' })
  })
}

const colorTransform = <T extends ColorPalette>(key: T, val: string) => {
  const needTransfrom = colorPalettes.filter((item) => item !== key) as any

  return needTransfrom.reduce((acc: any, cur: string) => {
    let nextValue = val
    if (key !== 'rgb') {
      nextValue = (colorTransformers as any)[camelCase(`${key}-to-rgb`)]?.(val)
    }

    acc[cur] = (colorTransformers as any)[camelCase(`rgb-to-${cur}`)]?.(
      nextValue,
    )
    return acc
  }, {} as Record<ColorPalette, string>)
}

export const colorsUpdateBatch = (type: ColorPalette, value: string) => {
  const map = colorTransform(type, value)

  Object.entries(map).forEach(([k, v]) => {
    useColorStore.setState({ [k]: v })
  })
}
