import {
  createDocument,
  getAllDocuments,
  getDocument,
  updateDocument,
  deleteDocument,
} from './database'

async function testDatabase() {
  console.log('Creating document...')

  const document = await createDocument('Test Document')

  console.log('Created:', document)

  const retrieved = await getDocument(document.id)

  console.log('Retrieved:', retrieved)

  await updateDocument(document.id, {
    title: 'Updated Test Document',
  })

  const updated = await getDocument(document.id)

  console.log('Updated:', updated)

  const allDocuments = await getAllDocuments()

  console.log('All documents:', allDocuments)

  await deleteDocument(document.id)

  const deleted = await getDocument(document.id)

  console.log('After deletion:', deleted)
}

testDatabase().catch(console.error)