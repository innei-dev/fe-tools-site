import { useEffect } from 'react'
import type { EditorView } from '@codemirror/view'

import { json } from '@codemirror/lang-json'
import { markdown, markdownLanguage } from '@codemirror/lang-markdown'
import { languages } from '@codemirror/language-data'

import { extensionMap } from './constants'

export type Language = 'json' | 'markdown'
export const useCodeMirrorLanguage = (
  cm: EditorView | null,
  language: Language | null | undefined,
) => {
  useEffect(() => {
    if (!cm) return

    const effect = (() => {
      switch (language) {
        case 'json': {
          return extensionMap.language.reconfigure(json())
        }
        case 'markdown': {
          return extensionMap.language.reconfigure(
            markdown({
              base: markdownLanguage,
              codeLanguages: languages,
              addKeymap: true,
            }),
          )
        }
      }
    })()
    if (effect)
      cm.dispatch({
        effects: [effect],
      })
  }, [cm, language])
}
