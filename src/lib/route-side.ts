import { router } from '../router'

export interface SidebarConfig {
  title: string
  path: string
  children: {
    title: string
    path: string
  }[]
}

export const getSidebarConfig = () => {
  const sidebarConfigs = [] as SidebarConfig[]

  const groupsRouteMap = new Map<string, SidebarConfig[]>()
  const children = router.routeTree.children

  children?.map((child) => {
    const group = child.options.meta?.group || 'Uncategorized'
    const existingGroup = groupsRouteMap.get(group) || []
    groupsRouteMap.set(
      group,
      existingGroup.concat({
        children: [],
        path: router.routeTree.path + (child.path === '/' ? '' : child.path),
        title: child.options.meta?.title || 'Untitled',
      } as SidebarConfig),
    )
  })

  for (const [group, routes] of groupsRouteMap.entries()) {
    sidebarConfigs.push({
      title: group,
      path: '',
      children: routes,
    })
  }

  return sidebarConfigs
}
