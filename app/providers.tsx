'use client'

import { Toaster } from 'sonner'

import { useIsDark } from '~/lib/hooks/use-dark-mode'

export const ToasterProvider = () => {
  return <Toaster theme={useIsDark() ? 'dark' : 'light'} />
}
