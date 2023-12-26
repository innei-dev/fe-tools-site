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
    title: 'Object',
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
        title: 'Converter',
        path: '/converter',
      },
      {
        title: 'Brightness',
        path: '/brightness',
      },
      {
        title: 'Random',
        path: '/random',
      },

      {
        title: 'Color Gradation',
        path: '/gradation',
      },

      {
        title: 'Color Invert',
        path: '/invert',
      },
    ],
  },
  {
    title: 'Editor',
    path: '/tools/editor',
    children: [
      {
        path: '/tiptap-schema',
        title: 'Tiptap Schema',
      },
    ],
  },
] satisfies SidebarConfig[]
