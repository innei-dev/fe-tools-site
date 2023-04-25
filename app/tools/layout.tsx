'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { useDarkMode } from '~/lib/hooks/use-dark-mode'
import { cn } from '~/lib/utils'

import { sidebarConfig } from './routes'

export default function ToolLayout({
  children,
}: {
  children: React.ReactNode
}) {
  useDarkMode()
  const pathname = usePathname()

  return (
    <div>
      <aside className="w-[250px] border-r border-gray-300 h-full overflow-auto p-4 flex flex-col fixed left-0 top-0">
        <h1 className="font-light text-lg font-mono">FeTools</h1>

        {sidebarConfig.map((config) => (
          <section key={config.title}>
            <p className="font-medium my-4 text-sm text-stone-500">
              {config.title}
            </p>
            {config.children.map((child) => {
              const jointPath = `${config.path}${child.path}`

              return (
                <Link href={jointPath} key={jointPath}>
                  <h2
                    className={cn(
                      'text-base my-2 transition-colors duration-200 ease-in-out hover:text-primary hover:text-opacity-80',
                      pathname === jointPath ? 'text-primary' : '',
                    )}
                  >
                    {child.title}
                  </h2>
                </Link>
              )
            })}
          </section>
        ))}
      </aside>

      <main className="ml-[250px] min-h-screen bg-gray-50 p-4">{children}</main>
    </div>
  )
}
