import { stopWords } from './stopWords'

export interface Token {
  word: string
  start: number
  end: number
}

export function tokenize(text: string): Token[] {
  const tokens: Token[] = []

  const regex =
    /[\p{Script=Bengali}\p{M}]+|[a-z]+(?:'[a-z]+)?/giu

  let match: RegExpExecArray | null

  while (
    (match = regex.exec(text)) !== null
  ) {
    const originalWord = match[0]

    const word =
      originalWord.normalize('NFC')

    const normalizedWord =
      /^[a-z]+(?:'[a-z]+)?$/i.test(word)
        ? word.toLowerCase()
        : word

    if (
      /^[a-z]+(?:'[a-z]+)?$/i.test(
        normalizedWord
      ) &&
      stopWords.has(normalizedWord)
    ) {
      continue
    }

    tokens.push({
      word: normalizedWord,
      start: match.index,
      end:
        match.index +
        originalWord.length,
    })
  }

  return tokens
}