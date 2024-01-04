'use client'

import { useDeferredValue, useEffect, useRef, useState } from 'react'
import detectIndent from 'detect-indent'
import type { EditorView } from '@codemirror/view'
import type { PropsWithChildren } from 'react'

import { CodeMirrorEditor } from '~/components/universal/codemirror'
import { useGetState } from '~/hooks/use-get-state'

export const VerticalCmEditor = (
  props: PropsWithChildren<{
    transformFn: (value: any) => any
  }>,
) => {
  const [value, setValue] = useState('')
  const deferredValue = useDeferredValue(value)
  const [transformedValue, setTransformedValue] = useState('')

  const cmRef = useRef<EditorView>(null)
  const getProps = useGetState(props)
  useEffect(() => {
    try {
      if (!deferredValue) return

      const value = JSON.parse(deferredValue)
      if (typeof value !== 'object' && value) return setTransformedValue(value)
      setTransformedValue(
        JSON.stringify(
          getProps().transformFn(value),
          null,
          detectIndent(deferredValue).amount,
        ),
      )
    } catch (e) {
      // message.error((e as Error).message)
    }
  }, [deferredValue])

  useEffect(() => {
    setTimeout(() => {
      cmRef.current?.focus()
    }, 100)
  }, [])

  return (
    <section className="-ml-4 -mt-4 flex flex-col">
      <CodeMirrorEditor
        ref={cmRef}
        value={value}
        onChange={setValue}
        language="json"
        className="relative !h-[50vh] flex-shrink-0 flex-grow overflow-auto"
      />
      <div className="h-[1px] w-full bg-gray-6" />
      <div>
        <CodeMirrorEditor
          value={transformedValue}
          language="json"
          className="relative !h-[50vh] flex-shrink-0 flex-grow overflow-auto"
        />
      </div>
    </section>
  )
}
