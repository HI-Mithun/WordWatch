import type { JSONContent } from '@tiptap/core'

export function getDocumentText(
  content: string
): string {
  if (!content.trim()) {
    return ''
  }

  try {
    const parsed = JSON.parse(content)

    if (
      parsed &&
      typeof parsed === 'object' &&
      parsed.type === 'doc'
    ) {
      return extractText(parsed)
    }
  } catch {
    // Existing plain-text document.
  }

  return content
}

function extractText(
  node: JSONContent
): string {
  if (node.type === 'text') {
    return node.text ?? ''
  }

  if (!Array.isArray(node.content)) {
    return ''
  }

  return node.content
    .map(extractText)
    .join(
      node.type === 'paragraph'
        ? '\n'
        : ''
    )
}