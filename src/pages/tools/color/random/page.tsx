'use client'

import { useState } from 'react'

import { ColorBall } from '~/components/universal/color-bell'

import { getColorScheme } from './utils'

export default function Page() {
  const { light, dark } = getColorScheme()
  const [, update] = useState({})

  return (
    <div className="flex flex-col space-y-4">
      <div className="flex items-center space-x-4">
        <span>Light Accent:</span> <ColorBall color={light.accent} />{' '}
        <span>{light.accent}</span>
      </div>

      <div className="flex items-center space-x-4">
        <span>Light Background:</span> <ColorBall color={light.background} />{' '}
        <span>{light.background}</span>
      </div>

      <div className="flex items-center space-x-4">
        <span>Dark Accent:</span> <ColorBall color={dark.accent} />{' '}
        <span>{dark.accent}</span>
      </div>

      <div className="flex items-center space-x-4">
        <span>Dark Background:</span> <ColorBall color={dark.background} />{' '}
        <span>{dark.background}</span>
      </div>

      <div>
        <button className="inline-block" onClick={() => update({})}>
          <span>Update</span>
        </button>
      </div>
    </div>
  )
}
