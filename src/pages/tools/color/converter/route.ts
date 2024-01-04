import { lazyRouteComponent } from '@tanstack/react-router'

import { defineSidebarRoute } from '~/lib/route'

export const CoverterRoute = defineSidebarRoute({
  component: lazyRouteComponent(() => import('./page')),
  group: 'Color',
  title: 'Coverter',
  path: '/coverter',
})
