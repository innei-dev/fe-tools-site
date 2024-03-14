/* eslint-disable react/display-name */
import React from 'react'
import type { ExcalidrawImperativeAPI } from '@excalidraw/excalidraw/types/types'

import { Excalidraw as Board } from '@excalidraw/excalidraw'

import { Button } from '~/components/ui/Button'
import { useIsDark } from '~/providers/dark-mode'

export default () => {
  const excalidrawAPIRef = React.useRef<ExcalidrawImperativeAPI>()
  const onChange = () => {}
  const finalData = {}
  const isDarkMode = useIsDark()
  const refUrl = ''
  const isLoading = false

  const [initialData, setInitialData] = React.useState<any>(null)

  return (
    <div className="relative flex h-full flex-grow flex-col [&_.excalidraw]:flex-grow">
      <div className="fixed right-8 top-20 z-[9999] mb-4 flex items-center justify-end gap-4">
        <Button>Import Initial Data</Button>
      </div>
      <Board
        key={refUrl ? `excalidraw-refData-loading-${isLoading}` : 'excalidraw'}
        theme={isDarkMode ? 'dark' : 'light'}
        initialData={finalData}
        onChange={onChange}
        excalidrawAPI={(api) => {
          excalidrawAPIRef.current = api

          setTimeout(() => {
            api.scrollToContent(undefined, {
              fitToContent: true,
            })
          }, 300)
        }}
      />
    </div>
  )
}
