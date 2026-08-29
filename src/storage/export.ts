function parseDocument(
  content: string,
): any | null {
  if (!content.trim()) {
    return null
  }

  try {
    const parsed = JSON.parse(content)

    if (
      parsed &&
      typeof parsed === 'object' &&
      parsed.type === 'doc'
    ) {
      return parsed
    }
  } catch {
    // Existing plain-text document.
  }

  return null
}

export function getPlainText(
  content: string,
): string {
  const document =
    parseDocument(content)

  if (!document) {
    return content
  }

  const extractText = (
    node: any,
  ): string => {
    if (node.type === 'text') {
      return node.text ?? ''
    }

    if (Array.isArray(node.content)) {
      return node.content
        .map(extractText)
        .join(
          node.type === 'paragraph'
            ? '\n'
            : '',
        )
    }

    return ''
  }

  return extractText(document)
}

function escapeMarkdown(
  text: string,
): string {
  return text.replace(
    /([\\`*_[\]{}])/g,
    '\\$1',
  )
}

function nodeToMarkdown(
  node: any,
): string {
  if (node.type === 'text') {
    let text = escapeMarkdown(
      node.text ?? '',
    )

    if (node.marks) {
      for (
        const mark of node.marks
      ) {
        if (mark.type === 'bold') {
          text = `**${text}**`
        }

        if (mark.type === 'italic') {
          text = `*${text}*`
        }

        if (mark.type === 'strike') {
          text = `~~${text}~~`
        }

        if (
          mark.type === 'code'
        ) {
          text = `\`${text}\``
        }
      }
    }

    return text
  }

  if (!Array.isArray(node.content)) {
    return ''
  }

  const content =
    node.content
      .map(nodeToMarkdown)
      .join('')

  switch (node.type) {
    case 'paragraph':
      return `${content}\n\n`

    case 'heading': {
      const level =
        node.attrs?.level ?? 1

      return `${'#'.repeat(level)} ${content.trim()}\n\n`
    }

    case 'bulletList':
      return (
        node.content
          .map(
            (item: any) =>
              `- ${nodeToMarkdown(item).trim()}`,
          )
          .join('\n') + '\n\n'
      )

    case 'orderedList':
      return (
        node.content
          .map(
            (item: any, index: number) =>
              `${index + 1}. ${nodeToMarkdown(item).trim()}`,
          )
          .join('\n') + '\n\n'
      )

    case 'listItem':
      return content

    case 'blockquote':
      return (
        content
          .trim()
          .split('\n')
          .map(
            (line: string) =>
              `> ${line}`,
          )
          .join('\n') + '\n\n'
      )

    case 'hardBreak':
      return '\n'

    default:
      return content
  }
}

export function getMarkdown(
  content: string,
): string {
  const document =
    parseDocument(content)

  if (!document) {
    return content
  }

  return document.content
    ?.map(nodeToMarkdown)
    .join('')
    .trimEnd() ?? ''
}

export function exportAsText(
  title: string,
  content: string,
): void {
  const text = getPlainText(content)

  const blob = new Blob(
    [text],
    {
      type: 'text/plain;charset=utf-8',
    },
  )

  const url =
    URL.createObjectURL(blob)

  const link =
    document.createElement('a')

  link.href = url
  link.download =
    `${title || 'Untitled Document'}.txt`

  document.body.appendChild(link)
  link.click()
  link.remove()

  URL.revokeObjectURL(url)
}

export function exportAsMarkdown(
  title: string,
  content: string,
): void {
  const markdown =
    getMarkdown(content)

  const blob = new Blob(
    [markdown],
    {
      type: 'text/markdown;charset=utf-8',
    },
  )

  const url =
    URL.createObjectURL(blob)

  const link =
    document.createElement('a')

  link.href = url
  link.download =
    `${title || 'Untitled Document'}.md`

  document.body.appendChild(link)
  link.click()
  link.remove()

  URL.revokeObjectURL(url)
}