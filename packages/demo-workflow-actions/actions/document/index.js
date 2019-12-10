import * as defaultDocumentActionsModule from 'part:@sanity/base/document-actions'

import workflowConfig from 'part:@sanity/plugin-review-workflow/config?'
import workflowDocumentActions from 'part:@sanity/plugin-review-workflow/document-actions'

const workflowTypes = (workflowConfig && workflowConfig.types) || []
const defaultDocumentActions = Object.values(defaultDocumentActionsModule)

export default function resolveActions(docInfo) {
  if (!docInfo.liveEdit && workflowTypes.includes(docInfo.type)) {
    return workflowDocumentActions
  }

  return defaultDocumentActions
}
