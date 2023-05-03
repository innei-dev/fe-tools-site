import { useEffect, useRef, useState } from 'react'
import { create } from 'zustand'

import { getCookie, removeCookie, setCookie } from '~/lib/utils/cookie'

import { darkModeKey } from '../constants/ui'
import { useGetState } from './use-get-state'

interface IMediaStore {
  isDark: boolean
  toggle: () => void
}

const useMediaStore = create<IMediaStore>(() => {
  return {
    isDark: false,
    toggle: () => void 0,
  }
})

const isServerSide = () => typeof window === 'undefined'

interface DarkModeConfig {
  classNameDark?: string // A className to set "dark mode". Default = "dark".
  classNameLight?: string // A className to set "light mode". Default = "light".
  element?: HTMLElement | undefined | null // The element to apply the className. Default = `document.body`.
  storageKey?: string // Specify the `localStorage` key. Default = "darkMode". set to `undefined` to disable persistent storage.
}

const useDarkModeInternal = (
  initialState: boolean | undefined,
  options: DarkModeConfig,
) => {
  const {
    classNameDark = 'dark',
    classNameLight = 'light',
    storageKey = darkModeKey,
    element,
  } = options

  const [darkMode, setDarkMode] = useState(initialState)

  useEffect(() => {
    if (isServerSide()) return
    const presentedDarkMode = getCookie(storageKey)

    if (presentedDarkMode !== undefined) {
      if (presentedDarkMode === 'true') {
        setDarkMode(true)
      } else if (presentedDarkMode === 'false') {
        setDarkMode(false)
      }
    } else if (
      typeof initialState === 'undefined' &&
      (!element?.classList.contains(classNameDark) ||
        !element?.classList.contains(classNameLight))
    ) {
      setDarkMode(window.matchMedia('(prefers-color-scheme: dark)').matches)
    }
  }, [storageKey])

  useEffect(() => {
    const handler = (e: MediaQueryListEvent) => {
      const storageValue = getCookie(storageKey)
      const parseStorageValueAsBool = storageValue === 'true'
      setDarkMode(e.matches)

      // reset dark mode, follow system
      if (parseStorageValueAsBool === e.matches) {
        removeCookie(storageKey)
      }
    }

    window
      .matchMedia('(prefers-color-scheme: dark)')
      .addEventListener('change', handler)

    return () => {
      window
        .matchMedia('(prefers-color-scheme: dark)')
        .removeEventListener('change', handler)
    }
  }, [storageKey])

  const getDarkMode = useGetState(darkMode)
  useEffect(() => {
    const handler = () => {
      // if set color mode follow system, del storage
      if (
        window.matchMedia('(prefers-color-scheme: dark)').matches ===
        getDarkMode()
      ) {
        removeCookie(darkModeKey)
      }
    }
    window.addEventListener('beforeunload', handler)

    return () => {
      window.removeEventListener('beforeunload', handler)
    }
  }, [])

  useEffect(() => {
    if (isServerSide() || typeof darkMode === 'undefined') {
      return
    }

    const $el = element || document.documentElement
    if (darkMode) {
      $el.classList.remove(classNameLight)
      $el.classList.add(classNameDark)
    } else {
      $el.classList.remove(classNameDark)
      $el.classList.add(classNameLight)
    }
  }, [classNameDark, classNameLight, darkMode, element])

  if (isServerSide()) {
    return {
      toggle: () => {},
      value: false,
    }
  }

  return {
    value: darkMode,
    toggle: () => {
      setDarkMode((d) => {
        if (storageKey && !isServerSide()) {
          setCookie(storageKey, !d)
        }

        return !d
      })
    },
  }
}

const noop = () => {}

const mockElement = {
  classList: {
    add: noop,
    remove: noop,
  },
}

export const useDarkMode = () => {
  const { toggle, value } = useDarkModeInternal(getCookie(darkModeKey), {
    classNameDark: 'dark',
    classNameLight: 'light',
    storageKey: darkModeKey,
    element: (globalThis.document && document.documentElement) || mockElement,
  })

  useEffect(() => {
    useMediaStore.setState({
      isDark: value,
    })
  }, [value])

  const onceRef = useRef(false)
  if (!onceRef.current) {
    onceRef.current = true
    useMediaStore.setState({ toggle })
  }

  return {
    toggle,
    value,
  }
}

export const useIsDark = () => useMediaStore((state) => state.isDark)

export const useDarkModeSwitch = () => {
  return useMediaStore((state) => state.toggle)
}
