import { useRouterState } from '@tanstack/react-router'

export const usePathname = () => {
  return useRouterState({
    select(state) {
      return state.location.pathname
    },
  })
}
