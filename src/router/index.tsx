import { Outlet, RootRoute, Router } from '@tanstack/react-router'

import { TanStackRouterDevtools } from '@tanstack/router-devtools'

import { ToolsRoutes } from '~/pages/tools'

import { Sidebar } from '../layouts/root/Sidebar'

export const rootRoute = new RootRoute({
  component: () => (
    <div>
      <Sidebar />

      <main className="relative ml-[250px] flex min-h-screen flex-col p-4">
        <Outlet />
      </main>
      {import.meta.env.DEV && <TanStackRouterDevtools />}
    </div>
  ),
})

const routeTree = rootRoute.addChildren([...ToolsRoutes])

export const router = new Router({ routeTree })

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}
