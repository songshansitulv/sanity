import schema from 'part:@sanity/base/schema'
import {useObservable} from '../utils/hooks'
import {getPreviewObservable} from './preview'

export function useDocumentPreview(id, type) {
  const documentType = schema.get(type)
  const source = getPreviewObservable({_id: id}, documentType)
  const initialState = null
  const keys = []

  return useObservable(source, initialState, keys)
}
