import {duplicate} from '../mockDocStateDatastore'
import {navigate} from '../test-action-tool/TestActionsTool'
import {omit} from 'lodash'

const useAction = docInfo => {
  return {
    disabled: !docInfo.draft && !docInfo.published,
    label: 'Duplicate',
    handle: () => {
      const dupeId = `duped-${docInfo.id}`
      duplicate(docInfo.id, dupeId, current => omit(current, ['reviewers']))
      navigate(dupeId)
    }
  }
}

export default {
  id: 'duplicate',
  group: 'primary',
  use: useAction
}
