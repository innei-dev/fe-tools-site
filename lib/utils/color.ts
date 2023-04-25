export function hexToRgb(hex: string) {
  // /^#?([0-9A-F]{3}|[0-9A-F]{4}|[0-9A-F]{6}|[0-9A-F]{8})$/i;
  hex = hex.replace('#', '')

  let r, g, b, a
  if (hex.length === 3) {
    r = parseInt(hex.charAt(0) + hex.charAt(0), 16)
    g = parseInt(hex.charAt(1) + hex.charAt(1), 16)
    b = parseInt(hex.charAt(2) + hex.charAt(2), 16)
  } else if (hex.length === 4) {
    r = parseInt(hex.charAt(0) + hex.charAt(0), 16)
    g = parseInt(hex.charAt(1) + hex.charAt(1), 16)
    b = parseInt(hex.charAt(2) + hex.charAt(2), 16)
    a = parseInt(hex.charAt(3) + hex.charAt(3), 16)
  } else if (hex.length === 6) {
    r = parseInt(hex.substring(0, 2), 16)
    g = parseInt(hex.substring(2, 4), 16)
    b = parseInt(hex.substring(4, 6), 16)
  } else if (hex.length === 8) {
    r = parseInt(hex.substring(0, 2), 16)
    g = parseInt(hex.substring(2, 4), 16)
    b = parseInt(hex.substring(4, 6), 16)
    a = parseInt(hex.substring(6, 8), 16)
  }

  return `${r}, ${g}, ${b}${typeof a !== 'undefined' ? `, ${a}` : ''}`
}

// hope this rgbColor or rgbaColor
export const rgbToHex = (rgb: string) => {
  // const rgbColor = /^rgb\((([0-9]|[1-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5]),){2}([0-9]|[1-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5])\)$/;
  // const rgbaColor = /^rgba\((([0-9]|[1-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5]),){3}(0?\.\d|1(\.0)?|0(\.0)?)\)$/;
  // const rgbColorPercent = /^rgb\((([0-9]%|[1-9][0-9]%|100%),){2}([0-9]%|[1-9][0-9]%|100%)\)$/;
  // const rgbaColorPercent = /^rgba\((([0-9]%|[1-9][0-9]%|100%),){3}(0?\.\d|1(\.0)?|0(\.0)?)\)$/;
  const rgbArray = rgb.replace('rgb(', '').replace(')', '').split(',')

  const r = parseInt(rgbArray[0], 10).toString(16)
  const g = parseInt(rgbArray[1], 10).toString(16)
  const b = parseInt(rgbArray[2], 10).toString(16)

  return `#${r}${g}${b}`
}

export const hexToHSL = (hex: string) => {
  hex = hex.replace('#', '')
  const r = parseInt(hex.substring(0, 2), 16) / 255
  const g = parseInt(hex.substring(2, 4), 16) / 255
  const b = parseInt(hex.substring(4, 6), 16) / 255

  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  let h = 0
  let s = 0
  const l = (max + min) / 2

  if (max === min) {
    h = s = 0 // achromatic
  } else {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0)
        break
      case g:
        h = (b - r) / d + 2
        break
      case b:
        h = (r - g) / d + 4
        break
    }
    h /= 6
  }

  const hsl = [
    Math.round(h * 360),
    `${Math.round(s * 100)}%`,
    `${Math.round(l * 100)}%`,
  ]
  return hsl.join(', ')
}

const colorPalettes = ['hex', 'rgb'] as const

type ITransforms = {
  [key in (typeof colorPalettes)[number] as `${key}To${Capitalize<
    Exclude<(typeof colorPalettes)[number], key>
  >}`]: (value: string) => string
}

export const transforms: ITransforms = {
  hexToRgb,
  rgbToHex,
}
