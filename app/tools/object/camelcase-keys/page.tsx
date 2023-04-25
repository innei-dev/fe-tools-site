'use client'

import camelcaseKeys from 'camelcase-keys'

import { VerticalCmEditor } from '~/lib/components/widgets/vertical-cm-editor'

export default () => {
  return (
    <VerticalCmEditor transformFn={(v) => camelcaseKeys(v, { deep: true })} />
  )
}
