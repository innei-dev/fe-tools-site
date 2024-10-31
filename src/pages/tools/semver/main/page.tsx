'use client'

import { Label } from '@radix-ui/react-label'
import { useState } from 'react'
import { eq, gt } from 'semver'

import { Input } from '~/components/ui/Input'

export default () => {
  const [left, setLeft] = useState('')
  const [right, setRight] = useState('')

  return (
    <div>
      <h2>Compare</h2>
      <div className="mt-4 flex gap-2">
        <Label>
          Left
          <Input
            className="mt-2"
            value={left}
            onChange={(e) => setLeft(e.target.value)}
          />
        </Label>
        <Label>
          Right
          <Input
            className="mt-2"
            value={right}
            onChange={(e) => setRight(e.target.value)}
          />
        </Label>
      </div>

      {(() => {
        try {
          return (
            <div className="mt-4">
              {left} {gt(left, right) ? '>' : eq(left, right) ? '=' : '<'}{' '}
              {right}
            </div>
          )
        } catch (e) {
          return <div className="mt-4 text-red-500">Invalid semver</div>
        }
      })()}
    </div>
  )
}
