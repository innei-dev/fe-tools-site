import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react'

import { HighlightStyle } from '@codemirror/language'
import type { EditorState } from '@codemirror/state'
import { Annotation } from '@codemirror/state'
import type { EditorView, KeyBinding, ViewUpdate } from '@codemirror/view'
import { tags } from '@lezer/highlight'

import {
  monospaceFonts,
  useCodeMirrorAutoToggleTheme,
  useCodeMirrorStyle,
} from '~/lib/components/universal/codemirror/use-codemirror-theme'
import { useIsDark } from '~/lib/hooks/use-dark-mode'
import { useGetState } from '~/lib/hooks/use-get-state'
import { useIsClient } from '~/lib/hooks/use-is-client'
import { useIsUnmounted } from '~/lib/hooks/use-lifecycle'
import { cn } from '~/lib/utils'

import type { Language } from './use-codemirror-language'
import { useCodeMirrorLanguage } from './use-codemirror-language'

const LoadingHolder = () => {
  return (
    <div className="flex-1 h-12 flex items-center justify-center">
      Loading...
    </div>
  )
}

interface CodeMirrorEditorProps {
  value: string
  onChange?: (value: string, viewUpdate: ViewUpdate) => void
  handleDropFile?: (file: File) => void
  onUpdate?: (update: ViewUpdate) => void
  onCreateEditor?: (view: EditorView, state: EditorState) => void
  onMouseEnter?: () => void
  language?: Language
  className?: string
}

export const CodeMirrorEditor = forwardRef<
  EditorView | null,
  CodeMirrorEditorProps
>((props, ref) => {
  const isClient = useIsClient()
  if (!isClient) return null
  return <LazyCodeMirrorEditor {...props} ref={ref} />
})
CodeMirrorEditor.displayName = 'CodeMirrorEditor'

const LazyCodeMirrorEditor = forwardRef<
  EditorView | null,
  CodeMirrorEditorProps
>((props, ref) => {
  const External = useRef(Annotation.define<boolean>()).current
  const [loading, setLoading] = useState(true)
  const editorElementRef = useRef<HTMLDivElement>(null)
  const isUnmounted = useIsUnmounted()

  const [cmEditor, setCmEditor] = useState<EditorView | null>(null)
  const isDark = useIsDark()

  const { value, handleDropFile, onMouseEnter, className, language } = props

  useCodeMirrorStyle(cmEditor)
  useCodeMirrorAutoToggleTheme(cmEditor, isDark)
  useCodeMirrorLanguage(cmEditor, language)

  useImperativeHandle(ref, () => cmEditor!)

  const getHandleDropFile = useGetState(handleDropFile)
  const getValue = useGetState(value)
  const getProps = useGetState(props)

  useEffect(() => {
    if (!cmEditor) return
    if (value === undefined) {
      return
    }
    const currentValue = cmEditor ? cmEditor.state.doc.toString() : ''
    if (cmEditor && value !== currentValue) {
      cmEditor.dispatch({
        changes: { from: 0, to: currentValue.length, insert: value || '' },
        annotations: [External.of(true)],
      })
    }
  }, [value, cmEditor])

  useEffect(() => {
    Promise.all([
      import('@codemirror/state'),
      import('@codemirror/view'),

      import('./constants'),
      import('@codemirror/language'),
      import('@codemirror/commands'),
    ]).then((modules) => {
      if (isUnmounted()) return
      if (!editorElementRef.current) return
      const [
        // @codemirror/state
        { EditorState },
        // @codemirror/view
        {
          EditorView,
          dropCursor,
          drawSelection,
          crosshairCursor,
          keymap,
          lineNumbers,
        },

        { codemirrorReconfigureExtension },
        // @codemirror/language
        { syntaxHighlighting, indentOnInput },
        // @codemirror/commands
        { defaultKeymap, history, historyKeymap, indentWithTab },
      ] = modules

      const editorState = EditorState.create({
        doc: getValue(),

        extensions: [
          // placeholder(''),
          EditorView.updateListener.of((vu) => {
            const props = getProps()
            const { onUpdate, onChange } = props
            onUpdate?.(vu)

            if (
              vu.docChanged &&
              typeof onChange === 'function' &&
              // Fix echoing of the remote changes:
              // If transaction is market as remote we don't have to call `onChange` handler again
              !vu.transactions.some((tr) => tr.annotation(External))
            ) {
              const doc = vu.state.doc
              const value = doc.toString()
              onChange(value, vu)
            }
          }),

          lineNumbers(),
          indentOnInput(),
          drawSelection(),
          dropCursor(),
          crosshairCursor(),
          history(),

          EditorState.allowMultipleSelections.of(true),

          [EditorView.theme({}), syntaxHighlighting(codeMirrorMarkdownSyntax)],
          ...codemirrorReconfigureExtension,

          keymap.of([
            ...defaultKeymap,
            ...historyKeymap,
            indentWithTab,
          ] as KeyBinding[]),

          EditorView.domEventHandlers({
            drop(e) {
              const items = Array.from(e.dataTransfer?.items || [])
              {
                ;(async () => {
                  for (let i = 0; i < items.length; i++) {
                    const file = items[i]?.getAsFile()
                    if (file) {
                      getHandleDropFile()?.(file)
                    }
                  }
                })()
              }
            },
            paste(e) {
              const files = e.clipboardData?.files
              if (files) {
                const items = Array.from(files)
                {
                  ;(async () => {
                    for (let i = 0; i < items.length; i++) {
                      getHandleDropFile()?.(items[i])
                    }
                  })()
                }
              }
            },
          }),

          EditorView.lineWrapping,
        ],
      })

      const view = new EditorView({
        state: editorState,
        parent: editorElementRef.current,
      })

      getProps().onCreateEditor?.(view, editorState)
      setCmEditor(view)
      setLoading(false)
    })
  }, [])

  useEffect(() => () => cmEditor?.destroy(), [cmEditor])

  return (
    <>
      <div
        ref={editorElementRef}
        onMouseEnter={onMouseEnter}
        className={cn(loading ? '' : `h-full`, className)}
      />
      {loading && <LoadingHolder />}
    </>
  )
})

LazyCodeMirrorEditor.displayName = 'LazyCodeMirrorEditor'

const markdownTags = [
  tags.heading1,
  tags.heading2,
  tags.heading3,
  tags.heading4,
  tags.heading5,
  tags.heading6,
  tags.strong,
  tags.emphasis,
  tags.deleted,
  tags.content,
  tags.url,
  tags.link,
]

const codeMirrorMarkdownSyntax = HighlightStyle.define([
  {
    tag: tags.heading1,
    fontSize: '1.4em',
    fontWeight: 'bold',
  },
  {
    tag: tags.heading2,
    fontSize: '1.3em',
    fontWeight: 'bold',
  },
  {
    tag: tags.heading3,
    fontSize: '1.2em',
    fontWeight: 'bold',
  },
  {
    tag: tags.heading4,
    fontSize: '1.1em',
    fontWeight: 'bold',
  },
  {
    tag: tags.heading5,
    fontSize: '1.1em',
    fontWeight: 'bold',
  },
  {
    tag: tags.heading6,
    fontSize: '1.1em',
    fontWeight: 'bold',
  },
  { tag: tags.strong, fontWeight: 'bold' },
  { tag: tags.emphasis, fontStyle: 'italic' },
  { tag: tags.deleted, textDecoration: 'line-through' },
  { tag: tags.monospace, fontFamily: monospaceFonts },
  {
    tag: markdownTags,
    fontFamily: 'var(--font-fans)',
  },
])
