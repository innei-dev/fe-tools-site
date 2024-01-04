import { lazyRouteComponent } from '@tanstack/react-router'

import { defineSidebarRoute } from '~/lib/route'

export const snakeCaseRoute = defineSidebarRoute({
  component: lazyRouteComponent(() => import('./page')),
  group: 'Object',
  title: 'Snakecase',
  path: '/snakecase-keys',
})
