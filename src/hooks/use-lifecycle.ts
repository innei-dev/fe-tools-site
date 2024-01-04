import { useEffect, useRef } from 'react'

export const useIsUnmounted = () => {
  const isUnmounted = useRef(false)
  useEffect(() => {
    isUnmounted.current = false
    return () => {
      isUnmounted.current = true
    }
  }, [])
  return () => isUnmounted.current
}
