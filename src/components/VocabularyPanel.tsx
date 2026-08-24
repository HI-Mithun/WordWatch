import type { WordFrequency } from '../engine/analyzer'
import { getWordContext } from '../engine/context'


interface VocabularyPanelProps {
  vocabulary: WordFrequency[]
  repeatedWords: WordFrequency[]
  selectedWord: string | null
  currentOccurrence: number
  content: string
  onWordSelect: (word: string) => void
  onPreviousOccurrence: () => void
  onNextOccurrence: () => void
}

function VocabularyPanel({
  vocabulary,
  repeatedWords,
  selectedWord,
  currentOccurrence,
  content,
  onWordSelect,
  onPreviousOccurrence,
  onNextOccurrence,
}: VocabularyPanelProps) {

  const selectedWordData =
    vocabulary.find(
      ({ word }) => word === selectedWord
    )

  const totalOccurrences =
    selectedWordData?.occurrences.length ?? 0
    const currentOccurrenceData =
  selectedWordData?.occurrences[
    currentOccurrence
  ]

const currentContext =
  currentOccurrenceData
    ? getWordContext(
        content,
        currentOccurrenceData.start,
        currentOccurrenceData.end
      )
    : null

  return (
    <aside className="flex w-80 shrink-0 flex-col border-l border-zinc-200 dark:border-zinc-800">

      {/* Vocabulary */}
      <section className="flex min-h-0 flex-1 flex-col border-b border-zinc-200 dark:border-zinc-800">

        <div className="shrink-0 border-b border-zinc-200 px-5 py-4 dark:border-zinc-800">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-500">
            Vocabulary
          </h2>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto p-4">
          {vocabulary.length === 0 ? (
            <p className="p-1 text-sm text-zinc-400">
              Start writing to see your vocabulary.
            </p>
          ) : (
            <div className="space-y-1">
              {vocabulary.map(
                ({ word, count }) => (
                  <button
                    key={word}
                    type="button"
                    onClick={() =>
                      onWordSelect(word)
                    }
                    className={`flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-sm transition-colors ${
                      selectedWord === word
                        ? 'bg-zinc-200 dark:bg-zinc-800'
                        : 'hover:bg-zinc-100 dark:hover:bg-zinc-900'
                    }`}
                  >
                    <span>{word}</span>

                    <span className="tabular-nums text-zinc-500">
                      {count}
                    </span>
                  </button>
                )
              )}
            </div>
          )}
        </div>

      </section>

      {/* Repetition */}
      <section className="flex min-h-0 flex-1 flex-col">

        <div className="shrink-0 border-b border-zinc-200 px-5 py-4 dark:border-zinc-800">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-500">
            Repetition
          </h2>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto p-4">

          {repeatedWords.length === 0 ? (
            <p className="p-1 text-sm text-zinc-400">
              No frequently repeated words yet.
            </p>
          ) : (
            <div className="space-y-2">

              {repeatedWords.map(
                ({ word, count }) => (
                  <div
                    key={word}
                    className={`rounded-md ${
                      selectedWord === word
                        ? 'bg-zinc-200 font-medium dark:bg-zinc-800'
                        : 'hover:bg-zinc-100 dark:hover:bg-zinc-900'
                    }`}
                  >

                    <button
                      type="button"
                      onClick={() =>
                        onWordSelect(word)
                      }
                      className="flex w-full items-center justify-between px-3 py-2 text-left text-sm"
                    >
                      <span>{word}</span>

                      <span className="font-medium tabular-nums text-zinc-500">
                        {count}
                      </span>
                    </button>

                    {selectedWord === word &&
                      totalOccurrences > 0 && (
                        <div className="flex items-center justify-between border-t border-zinc-300 px-3 py-2 dark:border-zinc-700">

                          <button
                            type="button"
                            onClick={onPreviousOccurrence}
                            className="rounded-md border border-zinc-200 px-2 py-1 text-base leading-none hover:bg-zinc-200 dark:border-zinc-700 dark:hover:bg-zinc-700"
                            aria-label="Previous occurrence"
                            title="Previous occurrence"
                          >
                            ‹
                          </button>

                          <span className="text-xs tabular-nums text-zinc-500">
                            {currentOccurrence + 1} / {totalOccurrences}
                          </span>

                          <button
                            type="button"
                            onClick={onNextOccurrence}
                            className="rounded-md border border-zinc-200 px-2 py-1 text-base leading-none hover:bg-zinc-200 dark:border-zinc-700 dark:hover:bg-zinc-700"
                            aria-label="Next occurrence"
                            title="Next occurrence"
                          >
                            ›
                          </button>
                          {currentContext && (
                            <div className="border-t border-zinc-300 px-3 py-3 text-xs leading-5 text-zinc-500 dark:border-zinc-700">
                              <span>{currentContext.before}</span>

                              <span className="font-semibold text-zinc-900 underline decoration-2 underline-offset-2 dark:text-zinc-100">
                                {currentContext.word}
                              </span>

                              <span>{currentContext.after}</span>
                            </div>
                          )}

                        </div>
                      )}

                  </div>
                )
              )}

            </div>
          )}

        </div>

      </section>

    </aside>
  )
}

export default VocabularyPanel