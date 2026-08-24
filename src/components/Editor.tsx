import {
  forwardRef,
  useImperativeHandle,
  useRef,
} from 'react'

export interface EditorHandle {
  focusOccurrence: (start: number, end: number) => void
}

interface EditorProps {
  content: string
  onChange: (content: string) => void
}

const Editor = forwardRef<EditorHandle, EditorProps>(
  function Editor({ content, onChange }, ref) {
    const textareaRef =
      useRef<HTMLTextAreaElement>(null)

    useImperativeHandle(ref, () => ({
      focusOccurrence(start, end) {
        const textarea = textareaRef.current

        if (!textarea) return

        textarea.focus()

        textarea.setSelectionRange(start, end)

        /*
         * scrollIntoView() cannot directly be used on
         * a textarea selection, so estimate the line
         * containing the occurrence.
         */
        const textBeforeOccurrence =
          textarea.value.slice(0, start)

        const lineNumber =
          textBeforeOccurrence.split('\n').length

        const lineHeight = 32

        const targetScrollTop =
          (lineNumber - 1) * lineHeight

        textarea.scrollTop = Math.max(
          0,
          targetScrollTop -
            textarea.clientHeight / 2
        )
      },
    }))

    return (
      <textarea
        ref={textareaRef}
        value={content}
        onChange={(event) =>
          onChange(event.target.value)
        }
        placeholder="Start writing..."
        className="h-full w-full resize-none border-0 bg-transparent p-8 text-lg leading-8 outline-none placeholder:text-zinc-400"
        spellCheck="true"
      />
    )
  }
)

export default Editor