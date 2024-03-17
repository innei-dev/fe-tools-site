import './index.css'

import { domMax, LazyMotion, m } from 'framer-motion'
import { ModalStackContainer } from 'rc-modal-sheet'

import { DarkModeProvider } from './providers/dark-mode'
import { AppRouterProvider } from './providers/router'
import { ToasterProvider } from './providers/toast'

function App() {
  return (
    <DarkModeProvider>
      <LazyMotion features={domMax} strict>
        <ModalStackContainer m={m}>
          <AppRouterProvider />
        </ModalStackContainer>
      </LazyMotion>

      <ToasterProvider />
    </DarkModeProvider>
  )
}

export default App
