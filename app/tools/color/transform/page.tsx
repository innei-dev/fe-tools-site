'use client'

import isHexColor from 'validator/es/lib/isHexColor'

import { colorValidator } from '~/lib/utils/color'

import { ColorInput } from './Input'

export default () => {
  return (
    <div className="flex flex-col gap-4 p-6">
      <ColorInput
        type="hex"
        validator={isHexColor}
        color1Transform={(val) => (val[0] !== '#' ? `#${val}` : val)}
        color2Transform={(val) => (val[0] === '#' ? val.slice(1) : val)}
      />
      <ColorInput
        type="rgb"
        validator={colorValidator.isRgb}
        color1Transform={(val) =>
          !val.toLowerCase().startsWith('rgb') ? `rgb(${val})` : val
        }
        color2Transform={(val) => val.replace(/rgb\((.*)\)/, '$1')}
      />
      <ColorInput
        type="hsl"
        validator={colorValidator.isHSL}
        color1Transform={(val) =>
          !val.toLowerCase().startsWith('hsl') ? `hsl(${val})` : val
        }
        color2Transform={(val) => {
          const [h, s, l] = val.replace(/hsl\((.*)\)/, '$1').split(',')
          return `${h}, ${s}, ${l}`
        }}
      />
    </div>
  )
}
