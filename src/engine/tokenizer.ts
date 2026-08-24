import { stopWords } from './stopWords'

export interface Token {
  word: string
  start: number
  end: number
}

export function tokenize(text: string): Token[] {
  const tokens: Token[] = []

  const regex = /[a-z]+(?:'[a-z]+)?/gi

  let match: RegExpExecArray | null

  while ((match = regex.exec(text)) !== null) {
    const originalWord = match[0]
    const word = originalWord.toLowerCase()

    if (!stopWords.has(word)) {
      tokens.push({
        word,
        start: match.index,
        end: match.index + originalWord.length,
      })
    }
  }

  return tokens
}