'use client'

import snakecaseKeys from 'snakecase-keys'

import { VerticalCmEditor } from '~/lib/components/widgets/vertical-cm-editor'

export default () => {
  return (
    <VerticalCmEditor transformFn={(v) => snakecaseKeys(v, { deep: true })} />
  )
}
