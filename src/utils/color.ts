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
  const rgbArray = rgb.replace('rgb(', '').replace(')', '').split(',')

  const r = parseInt(rgbArray[0], 10)
  const g = parseInt(rgbArray[1], 10)
  const b = parseInt(rgbArray[2], 10)

  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`
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

export type ColorPalette = 'hex' | 'rgb' | 'hsl'

// type ITransforms = {
//   [key in ColorPalette as `${Exclude<ColorPalette, 'rgb'>}ToRgb`]: (
//     value: string,
//   ) => string

//   [key in ColorPalette as `rgbTo${Exclude<ColorPalette, 'rgb'>}`]: (
//     value: string,
//   ) => string
// }
function hslToRgb(hsl: string): string {
  hsl = hsl.toLowerCase()
  hsl = hsl.replace('hsl(', '')
  // Parse the HSL value into its components
  const [hue, saturation, lightness] = hsl.split(',').map(parseFloat)

  // Convert hue, saturation, and lightness to values between 0 and 1
  const h = hue / 360
  const s = saturation / 100
  const l = lightness / 100

  // Calculate intermediate values
  const q = l < 0.5 ? l * (1 + s) : l + s - l * s
  const p = 2 * l - q

  // Helper function to calculate RGB components
  const calcRgb = (t: number) => {
    if (t < 0) t += 1
    if (t > 1) t -= 1
    if (t < 1 / 6) return p + (q - p) * 6 * t
    if (t < 1 / 2) return q
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6
    return p
  }

  // Calculate RGB components
  const red = Math.round(calcRgb(h + 1 / 3) * 255)
  const green = Math.round(calcRgb(h) * 255)
  const blue = Math.round(calcRgb(h - 1 / 3) * 255)

  // Return the RGB color value as a string
  return `${red}, ${green}, ${blue}`
}

function rgbToHsl(rgb: string): string {
  // Parse the RGB value into its components
  const [red, green, blue] = rgb
    .replace(/[^\d,]/g, '') // Remove non-digit and non-comma characters
    .split(',') // Split by comma
    .map(parseFloat) // Convert to numbers

  // Convert RGB values to values between 0 and 1
  const r = red / 255
  const g = green / 255
  const b = blue / 255

  // Find the maximum and minimum values among R, G, B
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)

  // Calculate the difference between max and min
  const delta = max - min

  // Calculate the lightness (L)
  const l = (max + min) / 2

  // Calculate the saturation (S)
  const s = delta === 0 ? 0 : delta / (1 - Math.abs(2 * l - 1))

  // Calculate the hue (H)
  let h = 0
  if (delta !== 0) {
    switch (max) {
      case r:
        h = ((g - b) / delta) % 6
        break
      case g:
        h = (b - r) / delta + 2
        break
      case b:
        h = (r - g) / delta + 4
        break
      default:
        break
    }
  }
  h = Math.round(h * 60) // Convert hue to degrees

  // Make sure hue is within the range of 0 to 360
  if (h < 0) {
    h += 360
  }

  // Return the HSL color value as a string
  return `hsl(${h}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`
}

export const rgbToRgb = (rgb: string) => {
  let nextValue = rgb.toLowerCase()
  if (!nextValue.startsWith('rgb')) {
    const bitCount = nextValue.split(',').length
    const prefix = bitCount === 3 ? 'rgb' : 'rgba'
    nextValue = `${prefix}(${nextValue})`
  }
  return nextValue
}
export const transforms = {
  hexToRgb,
  hslToRgb,
  rgbToRgb,
  rgbToHex,
  rgbToHsl,
}

export const colorValidator = {
  isRgb: (value: string) => {
    const colorRegex =
      /^((rgb(a)?)?\(?\d{1,3},\s*\d{1,3},\s*\d{1,3}(,\s*\d{1,3})?\)?)$/
    return colorRegex.test(value)
  },
  isHSL(value: string) {
    const hslRegex =
      /^(hsl)?\(?\s*(\d{1,3}|[0-9]*\.[0-9]+)(deg)?,\s*(\d{1,3}%)\s*,\s*(\d{1,3}%)\s*\)?$/
    return hslRegex.test(value)
  },
}
