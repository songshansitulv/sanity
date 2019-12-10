import {workflowListItems} from 'part:@sanity/plugin-review-workflow/structure'
import S from '@sanity/desk-tool/structure-builder'

const HIDDEN_TYPES = ['workflow.metadata']

const hiddenDocTypes = listItem => !HIDDEN_TYPES.includes(listItem.getId())

const docTypeListItems = S.documentTypeListItems().filter(hiddenDocTypes)

export default () =>
  S.list()
    .title('Content')
    .items([...workflowListItems, ...docTypeListItems])
