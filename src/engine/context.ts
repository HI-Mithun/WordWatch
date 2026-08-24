export interface WordContext {
  before: string
  word: string
  after: string
}

export function getWordContext(
  text: string,
  start: number,
  end: number
): WordContext {
  const sentenceStart = findSentenceStart(
    text,
    start
  )

  const sentenceEnd = findSentenceEnd(
    text,
    end
  )

  let before = text.slice(
    sentenceStart,
    start
  )

  const word = text.slice(start, end)

  let after = text.slice(
    end,
    sentenceEnd
  )

  return {
    before,
    word,
    after,
  }
}

function findSentenceStart(
  text: string,
  position: number
): number {
  for (
    let index = position - 1;
    index >= 0;
    index--
  ) {
    const character = text[index]

    if (
      character === '.' ||
      character === '!' ||
      character === '?' ||
      character === '\n'
    ) {
      return index + 1
    }
  }

  return 0
}

function findSentenceEnd(
  text: string,
  position: number
): number {
  for (
    let index = position;
    index < text.length;
    index++
  ) {
    const character = text[index]

    if (
      character === '.' ||
      character === '!' ||
      character === '?' ||
      character === '\n'
    ) {
      return index + 1
    }
  }

  return text.length
}