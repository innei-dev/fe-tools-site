'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { useDarkMode } from '~/lib/hooks/use-dark-mode'
import { cn } from '~/lib/utils'

import PKG from '../../package.json'
import { sidebarConfig } from './configs'

const { repository } = PKG
export default function ToolLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { value: isDark, toggle } = useDarkMode()
  const pathname = usePathname()

  return (
    <div>
      <aside className="fixed left-0 top-0 flex h-full w-[250px] flex-col overflow-auto border-r border-gray-300 bg-muted p-4">
        <div className="relative flex flex-wrap items-center justify-between">
          <h1 className="font-mono text-lg font-light">FE Tools</h1>

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
              className="ml-4 inline-flex flex-shrink-0 items-center text-black"
              target="_blank"
            >
              <i className="icon-[mingcute--github-line] inline-block" />
            </a>
          </span>
        </div>

        {sidebarConfig.map((config) => (
          <section key={config.title}>
            <p className="my-4 text-sm font-medium text-stone-500">
              {config.title}
            </p>
            {config.children.map((child) => {
              const jointPath = `${config.path}${child.path}`

              return (
                <Link href={jointPath} key={jointPath}>
                  <h2
                    className={cn(
                      'my-2 text-base transition-colors duration-200 ease-in-out hover:text-accent hover:text-opacity-80',
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
