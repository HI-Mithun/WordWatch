import {
  forwardRef,
  useEffect,
  useImperativeHandle,
} from 'react'
import {
  EditorContent,
  useEditor,
} from '@tiptap/react'

import {
  type JSONContent,
} from '@tiptap/core'

import StarterKit from '@tiptap/starter-kit'

import {
  occurrenceHighlightKey,
  OccurrenceHighlight,
} from '../editor/occurrenceHighlight'

export interface EditorHandle { 
  focusOccurrence: (
    occurrenceIndex: number
  ) => void
}

interface EditorProps {
  content: string
  onChange: (content: string) => void
  selectedWord: string | null
  currentOccurrence: number
}

const Editor = forwardRef<
  EditorHandle,
  EditorProps
>(function Editor(
  {
    content,
    onChange,
    selectedWord,
    currentOccurrence,
  },
  ref
) {
  function parseEditorContent(
  content: string
): string | JSONContent {
  if (!content.trim()) {
    return ''
  }

  try {
    const parsed =
      JSON.parse(content)

    if (
      parsed &&
      typeof parsed === 'object' &&
      parsed.type === 'doc'
    ) {
      return parsed
    }
  } catch {
    // Existing plain-text document.
  }

  return content
}
  const editor = useEditor({
    extensions: [
      StarterKit,
      OccurrenceHighlight,
    ],

    content:
      parseEditorContent(content),

    editorProps: {
      attributes: {
        class:
          'h-full min-h-full outline-none px-8 py-8 text-lg leading-8',
      },
    },

    onUpdate({ editor }) {
      onChange(
        JSON.stringify(
          editor.getJSON()
        )
      )
},
  })

  useImperativeHandle(
    ref,
    () => ({
      focusOccurrence(
        occurrenceIndex: number
      ) {
        if (!editor || !selectedWord) {
          return
        }

        const occurrences: {
          from: number
          to: number
        }[] = []

        const regex = new RegExp(
          `\\b${escapeRegExp(selectedWord)}\\b`,
          'gi'
        )

        editor.state.doc.descendants(
          (node, pos) => {
            if (!node.isText) {
              return
            }

            const text = node.text ?? ''

            let match: RegExpExecArray | null

            while (
              (match =
                regex.exec(text)) !== null
            ) {
              const from =
                pos + match.index

              const to =
                from + match[0].length

              occurrences.push({
                from,
                to,
              })
            }
          }
        )

        const occurrence =
          occurrences[occurrenceIndex]

        if (!occurrence) {
          return
        }

        editor
          .chain()
          .focus()
          .setTextSelection({
            from: occurrence.from,
            to: occurrence.to,
          })
          .scrollIntoView()
          .run()
      },
    }),
    [editor, selectedWord]
  )

  useEffect(() => {
    if (!editor) return

    editor.view.dispatch(
      editor.state.tr.setMeta(
        occurrenceHighlightKey,
        {
          word: selectedWord,
          currentOccurrence,
        }
      )
    )
  }, [
    editor,
    selectedWord,
    currentOccurrence,
  ])

  useEffect(() => {
    if (!editor) return

    const parsedContent =
      parseEditorContent(content)

    if (
      typeof parsedContent === 'string'
    ) {
      if (
        editor.getText() !==
        parsedContent
      ) {
        editor.commands.setContent(
          parsedContent
        )
      }

      return
    }

    const currentContent =
      JSON.stringify(
        editor.getJSON()
      )

    const nextContent =
      JSON.stringify(
        parsedContent
      )

    if (
      currentContent !== nextContent
    ) {
      editor.commands.setContent(
        parsedContent
      )
    }
  }, [content, editor])

  if (!editor) {
    return null
  }

  return (
    <div className="h-full overflow-y-auto">
      <EditorContent
        editor={editor}
        className="h-full"
      />
    </div>
  )
})

function escapeRegExp(
  value: string
): string {
  return value.replace(
    /[.*+?^${}()|[\]\\]/g,
    '\\$&'
  )
}

export default Editor