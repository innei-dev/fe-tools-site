'use client'

import { useState } from 'react'
import { createPortal } from 'react-dom'
import { toast } from 'sonner'

let stacked = 0
export const ColorBall = ({ color }: { color: string }) => {
  const [preview, setPreview] = useState(false)
  const zIndex = ++stacked
  return (
    <>
      <div
        style={{
          backgroundColor: color,
        }}
        className="h-4 w-4 rounded-full border border-black border-opacity-80"
        role="button"
        aria-label="Preview Color"
        tabIndex={1}
        onClick={() => {
          setPreview(!preview)

          navigator.clipboard.writeText(color)
          toast.success(`Copied Hex: ${color}`)
        }}
      />

      {preview &&
        createPortal(
          <div className="fixed bottom-0 right-0 h-[500px] w-[500px] bg-always-white">
            <div
              className="absolute bottom-0 right-0 h-[1000px] w-[1000px] translate-x-1/2 translate-y-1/2 rounded-full"
              style={{
                backgroundColor: color,
                zIndex,
              }}
            />
          </div>,
          document.body,
        )}
    </>
  )
}
