import { Extension } from '@tiptap/core'
import { tokenize } from '../engine/tokenizer'
import {
  Plugin,
  PluginKey,
} from '@tiptap/pm/state'
import {
  Decoration,
  DecorationSet,
} from '@tiptap/pm/view'

interface OccurrenceState {
  word: string | null
  currentOccurrence: number
}

export const occurrenceHighlightKey =
  new PluginKey<OccurrenceState>(
    'occurrenceHighlight'
  )

export const OccurrenceHighlight =
  Extension.create({
    name: 'occurrenceHighlight',

    addProseMirrorPlugins() {
      return [
        new Plugin({
          key: occurrenceHighlightKey,

          state: {
            init(): OccurrenceState {
              return {
                word: null,
                currentOccurrence: 0,
              }
            },

            apply(
              tr,
              value
            ): OccurrenceState {
              const meta =
                tr.getMeta(
                  occurrenceHighlightKey
                )

              if (!meta) {
                return value
              }

              return {
                ...value,
                ...meta,
              }
            },
          },

          props: {
            decorations(state) {
              const pluginState =
                occurrenceHighlightKey.getState(
                  state
                )

              if (
                !pluginState?.word
              ) {
                return DecorationSet.empty
              }

              const decorations: Decoration[] =
                []

              const word =
                pluginState.word

              const current =
                pluginState.currentOccurrence

              let occurrenceIndex = 0

              state.doc.descendants(
                (node, pos) => {
                  if (!node.isText) {
                    return
                  }

                  const text = node.text ?? ''
                    const tokens = tokenize(text)

                    for (const token of tokens) {
                      if (token.word !== word) {
                        continue
                      }

                      const start =
                        pos + token.start

                      const end =
                        pos + token.end

                      const isCurrent =
                        occurrenceIndex === current

                      decorations.push(
                        Decoration.inline(
                          start,
                          end,
                          {
                            class:
                              isCurrent
                                ? 'wordwatch-current-occurrence'
                                : 'wordwatch-occurrence',
                          }
                        )
                      )

                      occurrenceIndex++
                    }
                }
              )

              return DecorationSet.create(
                state.doc,
                decorations
              )
            },
          },
        }),
      ]
    },
  })