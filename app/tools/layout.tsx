'use client'
import Link from 'next/link'
import { useDarkMode } from '~/hooks/use-dark-mode'

export interface SidebarConfig {
  title: string
  children: {
    title: string
    path: string
  }[]
}
;[]
const sidebarConfig = [
  {
    title: 'Object Change Case',
    children: [
      {
        title: 'Camelcase Keys',
        path: '/tools/camelcase-keys',
      },
      {
        title: 'Snakecase Keys',
        path: '/tools/snakecase-keys',
      },
    ],
  },
] satisfies SidebarConfig[]

export default function ToolLayout({
  children,
}: {
  children: React.ReactNode
}) {
  useDarkMode()
  return (
    <div>
      <aside className="w-[250px] border-r border-gray-300 h-full overflow-auto p-4 flex flex-col fixed left-0 top-0">
        <h1 className="font-light text-lg font-mono">FeTools</h1>

        {sidebarConfig.map((config) => (
          <section key={config.title}>
            <p className="font-medium my-4 text-stone-500">{config.title}</p>
            {config.children.map((child) => (
              <Link href={child.path} key={child.path}>
                <h2 className="text-sm my-2">{child.title}</h2>
              </Link>
            ))}
          </section>
        ))}
      </aside>

      <main className="ml-[250px] min-h-screen bg-gray-50 p-4">{children}</main>
    </div>
  )
}
