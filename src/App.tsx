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
  const [content, setContent] = useState('')

  const [selectedWord, setSelectedWord] =
    useState<string | null>(null)

  const [currentOccurrence, setCurrentOccurrence] =
    useState(0)

  const editorRef =
    useRef<EditorHandle>(null)

  const wordCount = content.trim()
    ? content.trim().split(/\s+/).length
    : 0

  const vocabulary = useMemo(
    () => analyzeText(content),
    [content]
  )

  const repeatedWords = useMemo(
    () => getRepeatedWords(vocabulary),
    [vocabulary]
  )

  const handleWordSelect = (word: string) => {
    const wordData = vocabulary.find(
      (item) => item.word === word
    )

    if (!wordData || wordData.occurrences.length === 0) {
      return
    }

    setSelectedWord(word)

    setCurrentOccurrence(0)

    const occurrence =
      wordData.occurrences[0]

    editorRef.current?.focusOccurrence(
      occurrence.start,
      occurrence.end
    )
  }

  const handleNextOccurrence = () => {
    if (!selectedWord) return

    const wordData = vocabulary.find(
      (item) => item.word === selectedWord
    )

    if (!wordData) return

    const total =
      wordData.occurrences.length

    if (total === 0) return

    const nextIndex =
      (currentOccurrence + 1) % total

    setCurrentOccurrence(nextIndex)

    const occurrence =
      wordData.occurrences[nextIndex]

    editorRef.current?.focusOccurrence(
      occurrence.start,
      occurrence.end
    )
  }

  const handlePreviousOccurrence = () => {
    if (!selectedWord) return

    const wordData = vocabulary.find(
      (item) => item.word === selectedWord
    )

    if (!wordData) return

    const total =
      wordData.occurrences.length

    if (total === 0) return

    const previousIndex =
      (currentOccurrence - 1 + total) % total

    setCurrentOccurrence(previousIndex)

    const occurrence =
      wordData.occurrences[previousIndex]

    editorRef.current?.focusOccurrence(
      occurrence.start,
      occurrence.end
    )
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
          />
        </main>

        <VocabularyPanel
          vocabulary={vocabulary}
          repeatedWords={repeatedWords}
          selectedWord={selectedWord}
          currentOccurrence={currentOccurrence}
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