interface SidebarDocument {
  id: string
  title: string
}

interface DocumentSidebarProps {
  documents: SidebarDocument[]
  openDocumentIds: string[]
  activeDocumentId: string | null
  onOpenDocument: (id: string) => void
  onCreateDocument: () => void
  onClose: () => void
}

function DocumentSidebar({
  documents,
  openDocumentIds,
  activeDocumentId,
  onOpenDocument,
  onCreateDocument,
  onClose,
}: DocumentSidebarProps) {
  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-black/20"
        onClick={onClose}
      />

      <aside className="fixed left-0 top-0 z-50 flex h-screen w-72 flex-col border-r border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">

        <div className="flex h-14 items-center justify-between border-b border-zinc-200 px-5 dark:border-zinc-800">
          <h2 className="text-sm font-semibold">
            Documents
          </h2>

          <button
            type="button"
            onClick={onClose}
            className="rounded px-2 py-1 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-900 dark:hover:bg-zinc-900 dark:hover:text-zinc-100"
            aria-label="Close document sidebar"
          >
            ×
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto p-2">
          {documents.map((document) => {
            const isOpen =
              openDocumentIds.includes(
                document.id
              )

            const isActive =
              document.id === activeDocumentId

            return (
              <button
                key={document.id}
                type="button"
                onClick={() => {
                  onOpenDocument(document.id)
                  onClose()
                }}
                className={`mb-1 flex w-full items-center rounded px-3 py-2 text-left text-sm transition ${
                  isActive
                    ? 'bg-zinc-100 font-medium dark:bg-zinc-900'
                    : 'hover:bg-zinc-50 dark:hover:bg-zinc-900/50'
                }`}
              >
                <span className="min-w-0 flex-1 truncate">
                  {document.title}
                </span>

                {isOpen && (
                  <span className="ml-2 text-xs text-zinc-400">
                    open
                  </span>
                )}
              </button>
            )
          })}
        </div>

        <div className="border-t border-zinc-200 p-3 dark:border-zinc-800">
          <button
            type="button"
            onClick={() => {
              onCreateDocument()
              onClose()
            }}
            className="w-full rounded px-3 py-2 text-left text-sm transition hover:bg-zinc-100 dark:hover:bg-zinc-900"
          >
            + New document
          </button>
        </div>

      </aside>
    </>
  )
}

export default DocumentSidebar