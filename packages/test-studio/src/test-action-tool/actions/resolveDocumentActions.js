import * as DefaultActions from 'part:@sanity/base/document-actions'
import EditAction from './EditAction'
import DeleteAction from './DeleteAction'
import WriteFieldAction from './WriteFieldAction'
import AsyncAction from './AsyncAction'
import UselessAction from './UselessAction'
import SaveAction from './SaveAction'
import ObservableAction from './ObservableAction'
import WrappedAction from './WrappedAction'

const DISABLE_CREATE = ['author']

export default function resolveDocumentActions(docInfo, type) {
  return [
    // type.__experimental_actions.includes('delete') && DeleteAction,
    DefaultActions.PublishAction,
    EditAction,
    SaveAction,
    DeleteAction,
    UselessAction,
    AsyncAction,
    ObservableAction,
    WriteFieldAction,
    WrappedAction
    // PolicyBasedReview
  ].filter(Boolean)
}
