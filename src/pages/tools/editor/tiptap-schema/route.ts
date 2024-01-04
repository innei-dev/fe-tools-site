import { lazyRouteComponent } from '@tanstack/react-router'

import { defineSidebarRoute } from '~/lib/route'

export const tiptapRoute = defineSidebarRoute({
  component: lazyRouteComponent(() => import('./page')),
  group: 'Editor',
  title: 'Tiptap',
  path: '/tiptap',
})
