import type { Extension } from '@codemirror/state'
import { Compartment } from '@codemirror/state'

export const extensionMap = {
  theme: new Compartment(),
  style: new Compartment(),
  language: new Compartment(),
}

export const codemirrorReconfigureExtension: Extension[] = [
  extensionMap.theme.of([]),
  extensionMap.style.of([]),
  extensionMap.language.of([]),
]
