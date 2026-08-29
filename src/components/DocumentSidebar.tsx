import { useState } from 'react'
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
  onDeleteDocument: (id: string) => void
  onClose: () => void
  onRenameDocument: (
  id: string,
  title: string
) => void
}



function DocumentSidebar({
  documents,
  openDocumentIds,
  activeDocumentId,
  onOpenDocument,
  onCreateDocument,
  onDeleteDocument,
  onRenameDocument,
  onClose,
  
}: DocumentSidebarProps) {
  const [menuDocumentId, setMenuDocumentId] =
  useState<string | null>(null)
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
              <div
                key={document.id}
                className={`relative mb-1 flex items-center rounded transition ${
                  isActive
                    ? 'bg-zinc-100 dark:bg-zinc-900'
                    : 'hover:bg-zinc-50 dark:hover:bg-zinc-900/50'
                }`}
              >
                <button
                  type="button"
                  onClick={() => {
                    onOpenDocument(document.id)
                    onClose()
                  }}
                  className={`min-w-0 flex-1 px-3 py-2 text-left text-sm ${
                    isActive
                      ? 'font-medium'
                      : ''
                  }`}
                >
                  <span className="block truncate">
                    {document.title}
                  </span>
                </button>

                {isOpen && (
                  <span className="mr-1 text-xs text-zinc-400">
                    open
                  </span>
                )}

                <button
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation()

                    setMenuDocumentId(
                      menuDocumentId === document.id
                        ? null
                        : document.id
                    )
                  }}
                  className="mr-1 rounded px-2 py-1 text-zinc-400 transition hover:bg-zinc-200 hover:text-zinc-900 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
                  aria-label={`Actions for ${document.title}`}
                  aria-expanded={
                    menuDocumentId === document.id
                  }
                >
                  ⋮
                </button>

                {menuDocumentId === document.id && (
                  <div className="absolute right-2 top-full z-20 mt-1 w-32 overflow-hidden rounded-md border border-zinc-200 bg-white py-1 shadow-lg dark:border-zinc-700 dark:bg-zinc-900">

                    <button
                      type="button"
                      onClick={() => {
                        onOpenDocument(document.id)
                        setMenuDocumentId(null)
                        onClose()
                      }}
                      className="block w-full px-3 py-2 text-left text-sm hover:bg-zinc-100 dark:hover:bg-zinc-800"
                    >
                      Open
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        const title =
                          window.prompt(
                            'Rename document',
                            document.title
                          )

                        if (title !== null) {
                          onRenameDocument(
                            document.id,
                            title
                          )
                        }

                        setMenuDocumentId(null)
                      }}
                      className="block w-full px-3 py-2 text-left text-sm hover:bg-zinc-100 dark:hover:bg-zinc-800"
                    >
                      Rename
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        const confirmed =
                          window.confirm(
                            `Delete "${document.title}"? This cannot be undone.`
                          )

                        if (confirmed) {
                          onDeleteDocument(
                            document.id
                          )
                        }

                        setMenuDocumentId(null)
                      }}
                      className="block w-full px-3 py-2 text-left text-sm hover:bg-zinc-100 dark:hover:bg-zinc-800"
                    >
                      Delete
                    </button>

                  </div>
                )}
              </div>
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