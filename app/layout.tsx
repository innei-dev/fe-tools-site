import '../assets/css/globals.css'
import '../assets/css/tw-vars.css'

import { cookies } from 'next/headers'

import { Analytics } from '@vercel/analytics/react'

import { darkModeKey } from '~/lib/constants/ui'

const safeParse = (v?: string) => {
  try {
    return JSON.parse(v!)
  } catch {
    return null
  }
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

      <Analytics />
    </html>
  )
}
