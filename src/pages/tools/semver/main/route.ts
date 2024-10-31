import { lazyRouteComponent } from '@tanstack/react-router'

import { defineSidebarRoute } from '~/lib/route'

export const semverRoute = defineSidebarRoute({
  component: lazyRouteComponent(() => import('./page')),
  group: 'Tools',
  title: 'Semver',
  path: '/semver',
})
