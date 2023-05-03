'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { useDarkMode } from '~/lib/hooks/use-dark-mode'
import { cn } from '~/lib/utils'

import { repository } from '../../package.json'
import { sidebarConfig } from './configs'

export default function ToolLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { value: isDark, toggle } = useDarkMode()
  const pathname = usePathname()

  return (
    <div>
      <aside className="w-[250px] border-r border-gray-300 h-full overflow-auto p-4 flex flex-col fixed left-0 top-0 bg-muted">
        <div className="relative flex justify-between flex-wrap items-center">
          <h1 className="font-light text-lg font-mono">FE Tools</h1>

          <span className="space-x-2">
            <button className="inline-block" onClick={toggle}>
              {isDark ? (
                <i
                  className="icon-[mingcute--moon-line] inline-block"
                  suppressHydrationWarning
                />
              ) : (
                <i
                  className="icon-[mingcute--sun-line] inline-block"
                  suppressHydrationWarning
                />
              )}
            </button>
            <a
              href={repository.url}
              className="inline-flex items-center flex-shrink-0 ml-4 text-black"
              target="_blank"
            >
              <i className="icon-[mingcute--github-line] inline-block" />
            </a>
          </span>
        </div>

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
                      'text-base my-2 transition-colors duration-200 ease-in-out hover:text-accent hover:text-opacity-80',
                      pathname === jointPath ? 'text-accent' : '',
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

      <main className="ml-[250px] min-h-screen p-4">{children}</main>
    </div>
  )
}
