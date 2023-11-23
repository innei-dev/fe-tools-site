import '../assets/css/globals.css'
import '../assets/css/tw-vars.css'

import { Analytics } from '@vercel/analytics/react'
import { cookies } from 'next/headers'
import type { Metadata } from 'next'

import { darkModeKey } from '~/lib/constants/ui'

import { ToasterProvider } from './providers'

const safeParse = (v?: string) => {
  try {
    return JSON.parse(v!)
  } catch {
    return null
  }
}

export const metadata: Metadata = {
  title: 'Fe Tools',
}
export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const dark = cookies().get(darkModeKey)
  const { value: isDarkBoolString } = dark || {}
  const isDark = isDarkBoolString ? safeParse(isDarkBoolString as any) : null

  return (
    <html
      lang="zh-Hans"
      data-dark-cookie={isDarkBoolString}
      className={isDark === true ? 'dark' : isDark === false ? 'light' : ''}
    >
      <body>{children}</body>

      <ToasterProvider />
      <Analytics />
    </html>
  )
}
