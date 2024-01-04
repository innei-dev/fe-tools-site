import SyntaxHighlighter from 'react-syntax-highlighter'
import { atomOneDark } from 'react-syntax-highlighter/dist/esm/styles/hljs'
import clsx from 'clsx'
import { toast } from 'sonner'
import type { FC } from 'react'

export const CodeBlock: FC<{
  children: string
  language?: string
  className?: string
}> = ({ children, language, className }) => {
  return (
    <div className="group relative">
      <div className={clsx('relative overflow-auto rounded-md', className)}>
        <SyntaxHighlighter language={language} style={atomOneDark}>
          {children}
        </SyntaxHighlighter>
      </div>
      <button
        onClick={() => {
          navigator.clipboard.writeText(children)
          toast.success('Copied')
        }}
        className="absolute right-0 top-0 flex p-2 text-xs text-white opacity-0 duration-200 group-hover:opacity-100"
      >
        Copy
      </button>
    </div>
  )
}
