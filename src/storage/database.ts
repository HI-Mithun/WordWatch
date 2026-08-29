import Dexie, { type Table } from 'dexie'
// import type { JSONContent } from '@tiptap/core'

export interface Document {
  id: string
  title: string
  content: string
  createdAt: number
  updatedAt: number
}

class WordWatchDatabase extends Dexie {
  documents!: Table<Document, string>

  constructor() {
    super('WordWatchDatabase')

    this.version(1).stores({
      documents: 'id, updatedAt',
    })
  }
}

export const db = new WordWatchDatabase()

export async function isDatabaseAvailable(): Promise<boolean> {
  try {
    await db.open()
    return true
  } catch {
    return false
  }
}

export async function createDocument(
  title = 'Untitled Document',
): Promise<Document> {
  const now = Date.now()

  const document: Document = {
    id: crypto.randomUUID(),
    title,
    content: '',
    createdAt: now,
    updatedAt: now,
  }

  await db.documents.add(document)

  return document
}

export async function getDocument(
  id: string,
): Promise<Document | undefined> {
  return db.documents.get(id)
}

export async function getAllDocuments(): Promise<Document[]> {
  return db.documents.orderBy('updatedAt').reverse().toArray()
}

export async function updateDocument(
  id: string,
  changes: Partial<Pick<Document, 'title' | 'content'>>,
): Promise<void> {
  await db.documents.update(id, {
    ...changes,
    updatedAt: Date.now(),
  })
}

export async function deleteDocument(
  id: string,
): Promise<void> {
  await db.documents.delete(id)
}

// 
if (import.meta.env.DEV) {
  ;(window as typeof window & {
    wordWatchDatabaseTest?: () => Promise<void>
  }).wordWatchDatabaseTest = async () => {
    const document = await createDocument('Test Document')

    console.log('Created:', document)

    const retrieved = await getDocument(document.id)

    console.log('Retrieved:', retrieved)

    await updateDocument(document.id, {
      title: 'Updated Test Document',
    })

    const updated = await getDocument(document.id)

    console.log('Updated:', updated)

    console.log(
      'All documents:',
      await getAllDocuments(),
    )

    await deleteDocument(document.id)

    console.log(
      'After deletion:',
      await getDocument(document.id),
    )
  }
}

