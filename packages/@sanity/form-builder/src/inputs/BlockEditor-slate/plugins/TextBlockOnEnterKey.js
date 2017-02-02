import {SLATE_TEXT_BLOCKS} from '../constants'


// This plugin inserts an empty default node after enter is pressed
// within a text block which is not a default node type (paragraph)
// Meaning: when enter is pressed within a title start a new empty
// paragraph below
function createOnKeyDown(insertBlockType) {
  return function onKeyDown(event, data, state, editor) {
    if (data.key !== 'enter') {
      return null
    }
    const isTextBlock = state.blocks.some(block => SLATE_TEXT_BLOCKS.includes(block.type))
    const isDefaultNode = state.blocks.some(block => insertBlockType === block.type)
    const {startBlock} = state
    if (!isTextBlock || state.selection.isExpanded || !state.selection.hasEndAtEndOf(startBlock)) {
      return null
    }
    if (!isDefaultNode) {
      const transform = state.transform().insertBlock(insertBlockType)
      const nextState = transform.apply()
      event.preventDefault()
      return nextState
    }
    return null
  }
}

function TextBlockOnEnterKey(...args) {
  return {
    onKeyDown: createOnKeyDown(args[0])
  }
}

export default TextBlockOnEnterKey
