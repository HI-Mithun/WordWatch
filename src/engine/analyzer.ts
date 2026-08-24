import { tokenize } from './tokenizer'

export interface WordOccurrence {
  start: number
  end: number
}

export interface WordFrequency {
  word: string
  count: number
  occurrences: WordOccurrence[]
}

export function analyzeText(text: string): WordFrequency[] {
  const tokens = tokenize(text)

  const frequency = new Map<string, WordFrequency>()

  for (const token of tokens) {
    const existing = frequency.get(token.word)

    if (existing) {
      existing.count += 1
      existing.occurrences.push({
        start: token.start,
        end: token.end,
      })
    } else {
      frequency.set(token.word, {
        word: token.word,
        count: 1,
        occurrences: [
          {
            start: token.start,
            end: token.end,
          },
        ],
      })
    }
  }

  return Array.from(frequency.values())
    .sort((a, b) => {
      if (b.count !== a.count) {
        return b.count - a.count
      }

      return a.word.localeCompare(b.word)
    })
}

export function getRepeatedWords(
  vocabulary: WordFrequency[],
  threshold = 3
): WordFrequency[] {
  return vocabulary.filter(
    ({ count }) => count >= threshold
  )
}