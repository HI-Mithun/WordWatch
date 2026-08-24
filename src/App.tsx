import {
  useMemo,
  useRef,
  useState,
} from 'react'

import Header from './components/Header'

import Editor, {
  type EditorHandle,
} from './components/Editor'

import VocabularyPanel from './components/VocabularyPanel'

import {
  analyzeText,
  getRepeatedWords,
} from './engine/analyzer'

function App() {
  const [content, setContent] =
    useState('')

  const [selectedWord, setSelectedWord] =
    useState<string | null>(null)

  const [
    currentOccurrence,
    setCurrentOccurrence,
  ] = useState(0)

  const editorRef =
    useRef<EditorHandle>(null)

  const wordCount = content.trim()
    ? content.trim().split(/\s+/).length
    : 0

  /*
   * Analyze the document first.
   */
  const vocabulary = useMemo(
    () => analyzeText(content),
    [content]
  )

  const repeatedWords = useMemo(
    () => getRepeatedWords(vocabulary),
    [vocabulary]
  )

  /*
   * Find the currently selected word.
   */
  const selectedWordData =
    vocabulary.find(
      ({ word }) =>
        word === selectedWord
    )

  const occurrenceCount =
    selectedWordData?.occurrences.length ?? 0

  /*
   * Select a word and jump to its first
   * occurrence.
   */
  const handleWordSelect = (
    word: string
  ) => {
    setSelectedWord(word)
    setCurrentOccurrence(0)

    requestAnimationFrame(() => {
      editorRef.current?.focusOccurrence(0)
    })
  }

  /*
   * Move to the next occurrence.
   */
  const handleNextOccurrence = () => {
    if (
      !selectedWord ||
      occurrenceCount === 0
    ) {
      return
    }

    const next =
      (currentOccurrence + 1) %
      occurrenceCount

    setCurrentOccurrence(next)

    requestAnimationFrame(() => {
      editorRef.current?.focusOccurrence(
        next
      )
    })
  }

  /*
   * Move to the previous occurrence.
   */
  const handlePreviousOccurrence = () => {
    if (
      !selectedWord ||
      occurrenceCount === 0
    ) {
      return
    }

    const previous =
      (currentOccurrence -
        1 +
        occurrenceCount) %
      occurrenceCount

    setCurrentOccurrence(previous)

    requestAnimationFrame(() => {
      editorRef.current?.focusOccurrence(
        previous
      )
    })
  }

  return (
    <div className="flex h-screen flex-col bg-white text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100">

      <Header wordCount={wordCount} />

      <div className="flex min-h-0 flex-1">

        <main className="min-w-0 flex-1">
          <Editor
            ref={editorRef}
            content={content}
            onChange={setContent}
            selectedWord={selectedWord}
            currentOccurrence={
              currentOccurrence
            }
          />
        </main>

        <VocabularyPanel
          vocabulary={vocabulary}
          repeatedWords={repeatedWords}
          selectedWord={selectedWord}
          currentOccurrence={
            currentOccurrence
          }
          content={content}
          onWordSelect={handleWordSelect}
          onPreviousOccurrence={
            handlePreviousOccurrence
          }
          onNextOccurrence={
            handleNextOccurrence
          }
        />

      </div>

    </div>
  )
}

export default App