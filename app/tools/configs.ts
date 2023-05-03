export interface SidebarConfig {
  title: string
  path: string
  children: {
    title: string
    path: string
  }[]
}
;[]
export const sidebarConfig = [
  {
    title: 'Modify Object',
    path: '/tools/object',
    children: [
      {
        title: 'Camelcase Keys',
        path: '/camelcase-keys',
      },
      {
        title: 'Snakecase Keys',
        path: '/snakecase-keys',
      },
    ],
  },

  {
    title: 'Color',
    path: '/tools/color',
    children: [
      {
        title: 'Transform',
        path: '/transform',
      },
    ],
  },
] satisfies SidebarConfig[]
