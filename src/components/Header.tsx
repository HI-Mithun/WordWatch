interface HeaderDocument {
  id: string
  title: string
}

interface HeaderProps {
  wordCount: number
  documents: HeaderDocument[]
  openDocumentIds: string[]
  activeDocumentId: string | null
  onCreateDocument: () => void
  onSwitchDocument: (id: string) => void
  onCloseDocument: (id: string) => void
  onOpenSidebar: () => void
  onRenameDocument: ( id: string, title: string, ) => void
}

function Header({
  wordCount,
  documents,
  openDocumentIds,
  activeDocumentId,
  onCreateDocument,
  onSwitchDocument,
  onCloseDocument,
  onOpenSidebar,
  onRenameDocument,
}: HeaderProps) {
  return (
    <header className="flex h-14 items-center border-b border-zinc-200 dark:border-zinc-800">
      
      <div className="flex shrink-0 items-center px-6">
        <button
          type="button"
          onClick={onOpenSidebar}
          className="rounded p-2 text-zinc-500 transition hover:bg-zinc-100 hover:text-zinc-900 dark:hover:bg-zinc-900 dark:hover:text-zinc-100"
          aria-label="Open document sidebar"
        >
          ☰
        </button>
        <h1 className="text-lg font-semibold tracking-tight">
          WordScout
        </h1>
      </div>

      <div className="flex min-w-0 flex-1 items-stretch overflow-x-auto">
        {openDocumentIds.map((id) => {
          const document =
            documents.find(
              (document) =>
                document.id === id
            )

          if (!document) {
            return null
          }

          const isActive =
            document.id === activeDocumentId

          return (
            <div
              key={document.id}
              className={`flex shrink-0 items-center border-r border-zinc-200 dark:border-zinc-800 ${
                isActive
                  ? 'bg-zinc-100 dark:bg-zinc-900'
                  : ''
              }`}
            >
              <button
                type="button"
                onClick={() =>
                  onSwitchDocument(document.id)
                }
                onDoubleClick={(event) => {
                  event.stopPropagation()

                  const title =
                    window.prompt(
                      'Rename document',
                      document.title,
                    )

                  if (title !== null) {
                    onRenameDocument(
                      document.id,
                      title,
                    )
                  }
                }}
                className={`px-4 text-sm transition ${
                  isActive
                    ? 'font-medium'
                    : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100'
                }`}
              >
                {document.title}
              </button>

              <button
                type="button"
                onClick={() =>
                  onCloseDocument(document.id)
                }
                className="mr-2 rounded px-1.5 text-zinc-400 transition hover:bg-zinc-200 hover:text-zinc-900 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
                aria-label={`Close ${document.title}`}
              >
                ×
              </button>
            </div>
          )
        })}

        <button
          type="button"
          onClick={onCreateDocument}
          className="shrink-0 px-4 text-lg text-zinc-500 transition hover:bg-zinc-50 hover:text-zinc-900 dark:hover:bg-zinc-900 dark:hover:text-zinc-100"
          aria-label="Create new document"
        >
          +
        </button>
      </div>

      <div className="shrink-0 px-6">
        <span className="text-sm text-zinc-500">
          {wordCount.toLocaleString()} words
        </span>
      </div>

    </header>
  )
}

export default Header