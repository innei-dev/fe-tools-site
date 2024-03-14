import { lazyRouteComponent } from '@tanstack/react-router'

import { defineSidebarRoute } from '~/lib/route'

export const excalidrawRoute = defineSidebarRoute({
  component: lazyRouteComponent(() => import('./page')),
  group: 'Editor',
  title: 'Excalidraw delta diff',
  path: '/excalidraw',
})
