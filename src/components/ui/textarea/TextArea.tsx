import { forwardRef, useCallback } from 'react'
import { m, useMotionTemplate, useMotionValue } from 'framer-motion'
import type {
  DetailedHTMLProps,
  PropsWithChildren,
  TextareaHTMLAttributes,
} from 'react'

import { useInputComposition } from '~/hooks/use-input-composition'
import { cn } from '~/utils'

export const TextArea = forwardRef<
  HTMLTextAreaElement,
  DetailedHTMLProps<
    TextareaHTMLAttributes<HTMLTextAreaElement>,
    HTMLTextAreaElement
  > &
    PropsWithChildren<{
      wrapperClassName?: string
    }>
>((props, ref) => {
  const { className, wrapperClassName, children, ...rest } = props
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const handleMouseMove = useCallback(
    ({ clientX, clientY, currentTarget }: React.MouseEvent) => {
      const bounds = currentTarget.getBoundingClientRect()
      mouseX.set(clientX - bounds.left)
      mouseY.set(clientY - bounds.top)
    },
    [mouseX, mouseY],
  )
  const background = useMotionTemplate`radial-gradient(320px circle at ${mouseX}px ${mouseY}px, var(--spotlight-color) 0%, transparent 85%)`

  const inputProps = useInputComposition(props)
  return (
    <div
      className={cn(
        'group relative h-full overflow-hidden [--spotlight-color:#33333333]',
        wrapperClassName,
      )}
      onMouseMove={handleMouseMove}
    >
      <m.div
        className="pointer-events-none absolute bottom-0 left-0 right-0 top-0 z-0 rounded-xl opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{ background }}
        aria-hidden="true"
      />

      <textarea
        ref={ref}
        className={cn(
          'h-full w-full resize-none rounded-lg border border-gray-4 bg-transparent !outline-none',
          'overflow-auto px-3 py-4',
          'text-neutral-900/80 dark:text-slate-100/80',
          className,
        )}
        {...rest}
        {...inputProps}
      />

      {children}
    </div>
  )
})
TextArea.displayName = 'TextArea'
