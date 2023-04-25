'use client'

import { useState } from 'react'
import isHexColor from 'validator/es/lib/isHexColor'

import * as Label from '@radix-ui/react-label'

import { Input } from '~/lib/components/ui/Input'

const hexToRGB = (hex: string) => {
  hex = hex.replace('#', '')

  const r = parseInt(hex.substring(0, 2), 16)
  const g = parseInt(hex.substring(2, 4), 16)
  const b = parseInt(hex.substring(4, 6), 16)

  return `${r}, ${g}, ${b}`
}

export default () => {
  const [hex, setHex] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  return (
    <div className="flex flex-col">
      <div className="grid w-full max-w-sm items-center gap-1.5">
        <Label.Root htmlFor="Hex">Hex Color</Label.Root>
        <Input
          placeholder="#39C5BB"
          className="mt-4 inline-block w-[300px]"
          type="text"
          id="Hex"
          defaultValue="#39C5BB"
          value={hex}
          onChange={(e) => {
            const value = e.target.value
            if (!isHexColor(value)) {
              setErrorMessage('Invalid hex color')
            } else {
              setErrorMessage('')
            }
            setHex(e.target.value)
          }}
        />
        {errorMessage && (
          <p className="text-sm text-muted-foreground">{errorMessage}</p>
        )}
      </div>
    </div>
  )
}
