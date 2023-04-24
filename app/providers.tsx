'use client'

import { useServerInsertedHTML } from 'next/navigation'
import { CssBaseline, NextUIProvider } from '@nextui-org/react'

export default function Providers({ children }: { children: JSX.Element }) {
  useServerInsertedHTML(() => {
    return <>{CssBaseline.flush()}</>
  })

  return (
    <>
      <NextUIProvider>{children}</NextUIProvider>
    </>
  )
}
