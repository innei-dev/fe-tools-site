import { Link } from '@tanstack/react-router'
import type { FC } from 'react'

import { usePathname } from '~//hooks/use-router'
import { getSidebarConfig } from '~//lib/route-side'

import PKG from '../../../package.json'
import { useIsDark, useThemeActions } from '../../providers/dark-mode'
import { cn } from '../../utils'

const { repository } = PKG
export const Sidebar: FC = () => {
  const pathname = usePathname()

  const { toggle } = useThemeActions()
  const isDark = useIsDark()
  return (
    <aside className="fixed left-0 top-0 flex h-full w-[250px] flex-col overflow-auto border-r border-gray-5 bg-muted p-4">
      <div className="relative flex flex-wrap items-center justify-between">
        <h1 className="font-mono text-lg font-light">FE Tools</h1>

        <span className="space-x-2">
          <button className="inline-block" onClick={toggle}>
            {isDark ? (
              <i className="icon-[mingcute--moon-line] inline-block" />
            ) : (
              <i className="icon-[mingcute--sun-line] inline-block" />
            )}
          </button>
          <a
            href={repository.url}
            className="ml-4 inline-flex flex-shrink-0 items-center text-black"
            target="_blank"
            rel="noreferrer"
          >
            <i className="icon-[mingcute--github-line] inline-block" />
          </a>
        </span>
      </div>

      {getSidebarConfig().map((config) => (
        <section key={config.title}>
          <p className="my-4 text-sm font-semibold text-gray-12">
            {config.title}
          </p>
          {config.children.map((child) => {
            const jointPath = `${config.path}${child.path}`

            return (
              <Link to={jointPath} key={jointPath}>
                <h2
                  className={cn(
                    'my-2 text-base text-primary/60 transition-colors duration-200 ease-in-out hover:text-primary hover:text-opacity-80',
                    pathname === jointPath ? 'font-medium text-primary' : '',
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
  )
}
