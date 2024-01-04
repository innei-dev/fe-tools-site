import { createContext, useContext, useEffect } from 'react'
import { useAtomValue } from 'jotai'
import { atomWithStorage } from 'jotai/utils'
import type { PropsWithChildren } from 'react'

import { jotaiStore } from '../lib/store'

const darkModeAtom = atomWithStorage('dark-mode', false)

const actions = {
  toggle: () => jotaiStore.set(darkModeAtom, (prev) => !prev),
}

const DarkModeActionContext = createContext<typeof actions>(
  {} as typeof actions,
)
const COLOR_SCHEME_QUERY = '(prefers-color-scheme: dark)'

function getMatches(query: string): boolean {
  return window.matchMedia(query).matches
}

export function DarkModeProvider(props: PropsWithChildren) {
  useEffect(() => {
    const matchMedia = window.matchMedia(COLOR_SCHEME_QUERY)
    // Triggered at the first client-side load and if query changes
    const handleChange = () => {
      jotaiStore.set(darkModeAtom, getMatches(COLOR_SCHEME_QUERY))
    }
    // Listen matchMedia
    matchMedia.addEventListener('change', handleChange)
    return () => {
      matchMedia.removeEventListener('change', handleChange)
    }
  }, [])
  return (
    <DarkModeActionContext.Provider value={actions}>
      {props.children}
      <ThemeObserver />
    </DarkModeActionContext.Provider>
  )
}

function ThemeObserver() {
  const isDarkMode = useAtomValue(darkModeAtom)
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.dataset.theme = 'dark'
      document.documentElement.classList.add('dark')
      document.documentElement.classList.remove('light')
      document.documentElement.classList.toggle('dark', true)
    } else {
      document.documentElement.dataset.theme = 'light'
      document.documentElement.classList.remove('dark')
      document.documentElement.classList.add('light')
      document.documentElement.classList.toggle('dark', false)
    }
  }, [isDarkMode])

  return null
}

export function useThemeActions() {
  return useContext(DarkModeActionContext)
}

export const useIsDark = () => useAtomValue(darkModeAtom)
