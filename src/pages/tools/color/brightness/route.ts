import { lazyRouteComponent } from '@tanstack/react-router'

import { defineSidebarRoute } from '~/lib/route'

export const brightnessRoute = defineSidebarRoute({
  component: lazyRouteComponent(() => import('./page')),
  group: 'Color',
  title: 'Brightness',
  path: '/brightness',
})
