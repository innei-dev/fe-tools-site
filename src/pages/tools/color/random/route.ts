import { lazyRouteComponent } from '@tanstack/react-router'

import { defineSidebarRoute } from '~/lib/route'

export const randomRoute = defineSidebarRoute({
  component: lazyRouteComponent(() => import('./page')),
  group: 'Color',
  title: 'Random',
  path: '/random',
})
