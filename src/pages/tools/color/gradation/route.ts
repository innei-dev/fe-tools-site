import { lazyRouteComponent } from '@tanstack/react-router'

import { defineSidebarRoute } from '~/lib/route'

export const GradationRoute = defineSidebarRoute({
  component: lazyRouteComponent(() => import('./page')),
  group: 'Color',
  title: 'Gradation',
  path: '/gradation',
})
