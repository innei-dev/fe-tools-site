import { lazyRouteComponent } from '@tanstack/react-router'

import { defineSidebarRoute } from '~/lib/route'

export const camelCaseRoute = defineSidebarRoute({
  component: lazyRouteComponent(() => import('./page')),
  group: 'Object',
  title: 'CamelCase',
  path: '/camelcase-keys',
})
