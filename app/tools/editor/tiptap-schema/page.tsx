/* eslint-disable react/display-name */
'use client'

import { EditorContent, useEditor } from '@tiptap/react'
import { useLayoutEffect, useState } from 'react'
import { Markdown } from 'tiptap-markdown'

import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import StarterKit from '@tiptap/starter-kit'

import { CodeBlock } from '~/lib/components/ui/CodeBlock'

// define your extension array
const extensions = [
  StarterKit,
  Link.configure({
    autolink: true,
  }),
  Image.configure({}),
  Markdown,
]

const content = `# Hello World! 

[innei](https://innei.in)

![1217142959](https://cdn.jsdelivr.net/gh/Innei/fancy-2023@main/2023/1217142959.png)

`

export default () => {
  const [json, setJson] = useState({} as any)
  const editor = useEditor({
    extensions,
    content,
    onUpdate: ({ editor }) => {
      const json = editor.getJSON()

      setJson(json)
    },
  })

  useLayoutEffect(() => {
    setJson(editor?.getJSON())
  }, [editor])

  return (
    <div className="relative flex h-full flex-1 gap-5 [&_*]:!outline-none">
      <EditorContent
        editor={editor}
        className="h-[calc(100vh-30px)] flex-grow basis-1/2 overflow-auto"
        onClick={() => {
          editor?.chain().focus().run()
        }}
      />

      <div className="h-[calc(100vh-30px)] flex-grow basis-1/2 overflow-auto">
        <CodeBlock language="json">{JSON.stringify(json, null, 2)}</CodeBlock>
      </div>
    </div>
  )
}
