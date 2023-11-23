import tinycolor from 'tinycolor2'

export function generateTransitionColors(
  startColor: string,
  targetColor: string,
  step: number,
): string[] {
  // startColor = Color(startColor).hex()
  // targetColor = Color(targetColor).hex()
  // Convert startColor and targetColor to RGB values
  const startRed = parseInt(startColor.substring(1, 3), 16)
  const startGreen = parseInt(startColor.substring(3, 5), 16)
  const startBlue = parseInt(startColor.substring(5, 7), 16)

  const targetRed = parseInt(targetColor.substring(1, 3), 16)
  const targetGreen = parseInt(targetColor.substring(3, 5), 16)
  const targetBlue = parseInt(targetColor.substring(5, 7), 16)

  // Calculate increments for each color channel
  const redIncrement = (targetRed - startRed) / step
  const greenIncrement = (targetGreen - startGreen) / step
  const blueIncrement = (targetBlue - startBlue) / step

  const transitionColors: string[] = []

  // Generate transition colors
  for (let i = 0; i < step; i++) {
    // Calculate transition color values
    const transitionRed = Math.round(startRed + redIncrement * i)
    const transitionGreen = Math.round(startGreen + greenIncrement * i)
    const transitionBlue = Math.round(startBlue + blueIncrement * i)

    // Convert RGB values to hex format
    const hexColor = `#${(
      (1 << 24) |
      (transitionRed << 16) |
      (transitionGreen << 8) |
      transitionBlue
    )
      .toString(16)
      .slice(1)}`

    // Add transition color to the result array
    transitionColors.push(hexColor)
  }

  return Array.from(new Set(transitionColors))
}

export function generateColorScale(baseColor: string): Record<number, string> {
  const base = tinycolor(baseColor)
  const scale = {} as any

  // 设置色阶及其相应的亮度调整值
  const scaleSteps = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950]
  // 浅色阶亮度增加，深色阶亮度减少
  const lightnessAdjustments = [30, 24, 18, 12, 6, 0, -6, -12, -18, -24, -30]

  scaleSteps.forEach((step, index) => {
    let adjustedColor
    if (lightnessAdjustments[index] > 0) {
      // 浅色阶
      adjustedColor = base.clone().lighten(lightnessAdjustments[index])
    } else {
      // 深色阶
      adjustedColor = base.clone().darken(-lightnessAdjustments[index])
    }
    scale[step] = adjustedColor.toHexString()
  })

  return scale
}
