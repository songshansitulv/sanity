// import {DeleteAction as builtinDelete} from 'part:@sanity/base/document-actions'

import {approveAction} from './approve'
import {deleteAction} from './delete'
import {publishAction} from './publish'
import {requestChangesAction} from './requestChanges'
import {requestReviewAction} from './requestReview'
import {unpublishAction} from './unpublish'

export default [
  requestReviewAction,
  approveAction,
  requestChangesAction,
  publishAction,
  unpublishAction,
  deleteAction
]
