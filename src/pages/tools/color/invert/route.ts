import { lazyRouteComponent } from '@tanstack/react-router'

import { defineSidebarRoute } from '~/lib/route'

export const InvertRoute = defineSidebarRoute({
  component: lazyRouteComponent(() => import('./page')),
  group: 'Color',
  title: 'Invert',
  path: '/invert',
})
