'use client'

import snakecaseKeys from 'snakecase-keys'
import { useDeferredValue, useEffect, useState } from 'react'
import { CodeMirrorEditor } from '~/components/codemirror'

export default () => {
  const [value, setValue] = useState('')
  const deferredValue = useDeferredValue(value)
  const [transformedValue, setTransformedValue] = useState('')

  useEffect(() => {
    try {
      if (!deferredValue) return
      const value = JSON.parse(deferredValue)
      if (typeof value !== 'object' && value) return setTransformedValue(value)
      setTransformedValue(JSON.stringify(snakecaseKeys(value, { deep: true })))
    } catch (e) {
      // message.error((e as Error).message)
    }
  }, [deferredValue])
  return (
    <section className="flex flex-col -mt-4 -ml-4">
      <CodeMirrorEditor
        value={value}
        onChange={setValue}
        language="json"
        className="h-[50vh] relative overflow-auto flex-shrink-0 flex-grow"
      />
      <div className="h-[1px] bg-gray-400 w-full" />
      <CodeMirrorEditor
        value={transformedValue}
        language="json"
        className="flex-shrink-0 h-[50vh] relative overflow-auto flex-grow"
      />
    </section>
  )
}
