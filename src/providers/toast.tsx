import { Toaster } from 'sonner'

import { useIsDark } from './dark-mode'

export const ToasterProvider = () => {
  return <Toaster theme={useIsDark() ? 'dark' : 'light'} />
}
