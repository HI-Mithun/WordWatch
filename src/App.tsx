import DocumentSidebar from './components/DocumentSidebar'
import {
  useEffect,
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
} from './engine/analyzer'

import {
  createDocument,
  getAllDocuments,
  getDocument,
  updateDocument,
  deleteDocument,
  type Document,
} from './storage/database'



function getPlainText(
  content: string
): string {
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
      const extractText = (
        node: any
      ): string => {
        if (node.type === 'text') {
          return node.text ?? ''
        }

        if (
          Array.isArray(node.content)
        ) {
          return node.content
            .map(extractText)
            .join(
              node.type === 'paragraph'
                ? '\n'
                : ''
            )
        }

        return ''
      }

      return extractText(parsed)
    }
  } catch {
    // Existing plain-text document.
  }

  return content
}

function App() {
  const [content, setContent] =
    useState('')

  // const [documentId, setDocumentId] =
  // useState<string | null>(null)

  const [selectedWord, setSelectedWord] =
    useState<string | null>(null)

  const [
    currentOccurrence,
    setCurrentOccurrence,
  ] = useState(0)

  const editorRef =
    useRef<EditorHandle>(null)

  const [activeDocumentId, setActiveDocumentId] =
    useState<string | null>(null)

  const [documents, setDocuments] =
    useState<Document[]>([])

  const [sidebarOpen, setSidebarOpen] =
    useState(false)

  const [openDocumentIds, setOpenDocumentIds] =
    useState<string[]>([])

    useEffect(() => {
      async function initializeDocuments() {
        const savedDocuments =
          await getAllDocuments()

        if (savedDocuments.length > 0) {
          setDocuments(savedDocuments)

          const document =
            savedDocuments[0]

          setOpenDocumentIds([document.id])
          setActiveDocumentId(document.id)
          setContent(document.content)
        } else {
          const document =
            await createDocument()

          setDocuments([document])
          setOpenDocumentIds([document.id])
          setActiveDocumentId(document.id)
          setContent(document.content)
        }
      }

      initializeDocuments()
    }, [])

    useEffect(() => {
      if (!activeDocumentId) {
        return
      }

      const timeout = setTimeout(() => {
        updateDocument(
          activeDocumentId,
          {
            content,
          }
        )
      }, 500)

      return () => {
        clearTimeout(timeout)
      }
    }, [
      content,
      activeDocumentId,
    ])

  const wordCount = content.trim()
    ? content.trim().split(/\s+/).length
    : 0
    

  /*
   * Analyze the document first.
   */
  const vocabulary = useMemo(
  () =>
    [...analyzeText(
      getPlainText(content)
    )].sort(
      (a, b) =>
        a.word.localeCompare(
          b.word
        )
    ),
  [content]
)
useEffect(() => {
  if (!selectedWord) return

  const wordData = vocabulary.find(
    ({ word }) => word === selectedWord
  )

  const count =
    wordData?.occurrences.length ?? 0

  if (count === 0) {
    setSelectedWord(null)
    setCurrentOccurrence(0)
    return
  }

  if (currentOccurrence >= count) {
    setCurrentOccurrence(count - 1)
  }
}, [
  vocabulary,
  selectedWord,
  currentOccurrence,
])
  const repeatedWords = useMemo(
  () =>
    [...analyzeText(
      getPlainText(content)
    )]
      .filter(
        ({ count }) => count > 1
      )
      .sort(
        (a, b) => b.count - a.count
      ),
  [content]
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

  const handleCreateDocument = async () => {
    const document =
      await createDocument()

    setDocuments((current) => [
      document,
      ...current,
    ])

    setOpenDocumentIds((current) => [
      ...current,
      document.id,
    ])

    setActiveDocumentId(document.id)
    setContent(document.content)

    setSelectedWord(null)
    setCurrentOccurrence(0)
  }

  const handleSwitchDocument = async (
    id: string
  ) => {
    if (id === activeDocumentId) {
      return
    }

    const document =
      await getDocument(id)

    if (!document) {
      return
    }

    setOpenDocumentIds((current) => {
      if (current.includes(document.id)) {
        return current
      }

      return [
        ...current,
        document.id,
      ]
    })

    setActiveDocumentId(document.id)
    setContent(document.content)

    setSelectedWord(null)
    setCurrentOccurrence(0)
  }

  const handleCloseDocument = (
    id: string
  ) => {
    setOpenDocumentIds((current) => {
      const index =
        current.indexOf(id)

      const next = current.filter(
        (documentId) =>
          documentId !== id
      )

      if (id === activeDocumentId) {
        const nextDocument =
          next[index] ??
          next[index - 1] ??
          null

        if (nextDocument) {
          const document =
            documents.find(
              (item) =>
                item.id === nextDocument
            )

          if (document) {
            setActiveDocumentId(
              document.id
            )
            setContent(
              document.content
            )
          }
        } else {
          setActiveDocumentId(null)
          setContent('')
        }

        setSelectedWord(null)
        setCurrentOccurrence(0)
      }

      return next
    })
  }

  const handleRenameDocument = async (
    id: string,
    title: string,
  ) => {
    const trimmedTitle =
      title.trim()

    if (!trimmedTitle) {
      return
    }

    await updateDocument(id, {
      title: trimmedTitle,
    })

    setDocuments((current) =>
      current.map((document) =>
        document.id === id
          ? {
              ...document,
              title: trimmedTitle,
              updatedAt: Date.now(),
            }
          : document,
      ),
    )
  }

  const handleDeleteDocument = async (
    id: string
  ) => {
    await deleteDocument(id)

    setDocuments((current) =>
      current.filter(
        (document) =>
          document.id !== id
      )
    )

    setOpenDocumentIds((current) =>
      current.filter(
        (documentId) =>
          documentId !== id
      )
    )

    if (id === activeDocumentId) {
      const remainingOpenIds =
        openDocumentIds.filter(
          (documentId) =>
            documentId !== id
        )

      const nextId =
        remainingOpenIds[0] ?? null

      if (nextId) {
        const nextDocument =
          documents.find(
            (document) =>
              document.id === nextId
          )

        if (nextDocument) {
          setActiveDocumentId(
            nextDocument.id
          )
          setContent(
            nextDocument.content
          )
        }
      } else {
        setActiveDocumentId(null)
        setContent('')
      }

      setSelectedWord(null)
      setCurrentOccurrence(0)
    }
  }

  return (
    <div className="flex h-screen flex-col bg-white text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100">
      {sidebarOpen && (
        <DocumentSidebar
          documents={documents}
          openDocumentIds={
            openDocumentIds
          }
          activeDocumentId={
            activeDocumentId
          }
          onOpenDocument={
            handleSwitchDocument
          }
          onCreateDocument={
            handleCreateDocument
          }
          onClose={() =>
            setSidebarOpen(false)
          }
          onDeleteDocument={
            handleDeleteDocument
          }
          onRenameDocument={
            handleRenameDocument
          }
          
        />
      )}
      <Header
        wordCount={wordCount}
        documents={documents}
        activeDocumentId={activeDocumentId}
        openDocumentIds={
          openDocumentIds
        }
        onCreateDocument={
          handleCreateDocument
        }
        onSwitchDocument={
          handleSwitchDocument
        }
        onCloseDocument={
          handleCloseDocument
        }
        onOpenSidebar={() =>
          setSidebarOpen(true)
        }
        onRenameDocument={
          handleRenameDocument
        }
      />

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