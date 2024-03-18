/* eslint-disable react/display-name */
import React, { useState } from 'react'
import { useAtom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'
import { diff, patch } from 'jsondiffpatch'
import { cloneDeep } from 'lodash-es'
import { useCurrentModal, useModalStack } from 'rc-modal-sheet'
import { toast } from 'sonner'
import type { ExcalidrawElement } from '@excalidraw/excalidraw/types/element/types'
import type { ExcalidrawImperativeAPI } from '@excalidraw/excalidraw/types/types'
import type { Delta } from 'jsondiffpatch'

import { Excalidraw as Board, serializeAsJSON } from '@excalidraw/excalidraw'

import { Button } from '~/components/ui/Button'
import { Input } from '~/components/ui/Input'
import { TextArea } from '~/components/ui/textarea/TextArea'
import { useIsDark } from '~/providers/dark-mode'
import { cn } from '~/utils'

const boardDataAtom = atomWithStorage('excalidraw-boardData', {})
export default () => {
  const excalidrawAPIRef = React.useRef<ExcalidrawImperativeAPI>()
  const onChange = () => {}
  const [finalData, setFinalData] = useAtom(boardDataAtom)
  const isDarkMode = useIsDark()
  const [updatedKey, setUpdatedKey] = useState(0)

  const [initialData, setInitialData] = useState<ExcalidrawElement | null>(null)

  const { present } = useModalStack()
  return (
    <div className="relative flex h-full flex-grow flex-col [&_.excalidraw]:flex-grow">
      <div className="fixed right-8 top-20 z-[9999] mb-4 flex items-center justify-end gap-4">
        <Button
          onClick={() => {
            present({
              title: 'Import Initial Data',
              content: () => (
                <InitialDataInput
                  setInitialData={setInitialData}
                  setData={(data) => {
                    setFinalData(data)
                    setUpdatedKey((prev) => prev + 1)
                  }}
                />
              ),
            })
          }}
        >
          Import Initial Data
        </Button>

        <Button
          onClick={() => {
            const ex = excalidrawAPIRef.current
            if (!ex || !initialData) return
            const sceneElements = ex.getSceneElements()
            const appState = ex.getAppState()
            const files = ex.getFiles()
            const currentJson = serializeAsJSON(
              sceneElements,
              appState,
              files,
              'database',
            )

            const hasDiff = diff(initialData, safeJsonParse(currentJson))

            if (!hasDiff) {
              toast.info('No diff')
              return
            }
            navigator.clipboard.writeText(JSON.stringify(hasDiff, null, 0))
          }}
        >
          Copy Delta Diff
        </Button>
      </div>
      <Board
        key={updatedKey}
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
const refUrlAtom = atomWithStorage('excalidraw-refUrl', '')

const InitialDataInput = ({
  setData,
  setInitialData,
}: {
  setData: (data: ExcalidrawElement) => void
  setInitialData: (data: ExcalidrawElement) => void
}) => {
  const [inputString, setInputString] = React.useState('')
  const [refUrl, setRefUrl] = useAtom(refUrlAtom)

  const parseData = (): {
    data?: ExcalidrawElement
    refUrl?: string
    patchDiffDelta?: Delta
  } => {
    if (!inputString) return {}
    const tryParseJson = safeJsonParse(inputString)
    if (!tryParseJson) {
      // 1. data 是 string，取第一行判断
      const splittedLines = inputString.split('\n')
      const firstLine = splittedLines[0]
      const otherLines = splittedLines.slice(1).join('\n')

      const props = {} as any
      // 第一行是地址
      if (firstLine.startsWith('http')) {
        props.refUrl = firstLine
      }
      // 第一行是 ref:file/:filename
      // 命中后端文件
      else if (firstLine.startsWith('ref:')) {
        if (!refUrl) {
          toast.error('请先输入 refUrl')
        }
        props.refUrl = `${refUrl}/objects/${firstLine.slice(4)}`
      }

      if (otherLines.trim().length > 0) {
        // 识别为其他行是 delta diff

        props.patchDiffDelta = safeJsonParse(otherLines)
      }

      return props
    } else {
      return {
        data: tryParseJson as ExcalidrawElement,
      }
    }
  }
  const { dismiss } = useCurrentModal()

  const [isLoading, setIsLoading] = React.useState(false)

  const handleParse = async () => {
    if (!inputString) return
    if (isLoading) return
    setIsLoading(true)
    try {
      const { data, patchDiffDelta, refUrl } = parseData()

      let jsonData: any = data
      if (refUrl) {
        jsonData = await fetch(refUrl)
          .then((res) => res.text())
          .then((text) => safeJsonParse(text))
      }

      setInitialData(cloneDeep(jsonData))
      if (patchDiffDelta) {
        patch(jsonData, patchDiffDelta)
      }

      if (jsonData) setData(jsonData as ExcalidrawElement)

      dismiss()
    } catch (e: any) {
      toast.error(e.message)

      setIsLoading(false)
    }
  }
  return (
    <div className="flex flex-col gap-2">
      <TextArea
        className="h-[400px] w-[600px] font-mono"
        onChange={(e) => {
          setInputString(e.target.value)
        }}
      />

      <div className="flex flex-grow justify-end gap-4">
        <Input
          onChange={(e) => {
            setRefUrl(e.target.value)
          }}
          value={refUrl}
          placeholder="Ref Url (Optional)"
          className="flex-grow"
        />
        <Button
          onClick={handleParse}
          disabled={isLoading && !inputString}
          className={cn(
            (isLoading || !inputString) && 'cursor-not-allowed opacity-50',
          )}
        >
          {isLoading && (
            <i className="icon-[mingcute--loading-line] mr-2 size-4 animate-spin" />
          )}
          Parse
        </Button>
      </div>
    </div>
  )
}

const safeJsonParse = (str: string) => {
  try {
    return JSON.parse(str)
  } catch (e) {
    return null
  }
}
