import './index.css'

import { DarkModeProvider } from './providers/dark-mode'
import { AppRouterProvider } from './providers/router'
import { ToasterProvider } from './providers/toast'

function App() {
  return (
    <DarkModeProvider>
      <AppRouterProvider />
      <ToasterProvider />
    </DarkModeProvider>
  )
}

export default App
