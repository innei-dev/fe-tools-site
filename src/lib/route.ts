import { Route } from '@tanstack/react-router'
import type { RouteComponent } from '@tanstack/react-router'

import { rootRoute } from '../router'

export const defineSidebarRoute = <TPath extends string>({
  path,
  title,
  group,
  component,
}: {
  path: TPath
  title: string
  group: string
  component: RouteComponent
}) =>
  new Route({
    getParentRoute: () => rootRoute,
    path: `${group.toLowerCase()}${path}`,
    component,
    meta: {
      title,
      group,
    },
  })
