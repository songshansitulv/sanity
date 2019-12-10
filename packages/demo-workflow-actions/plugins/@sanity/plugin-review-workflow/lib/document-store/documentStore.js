import createDocumentStore from '@sanity/document-store'
import client from 'part:@sanity/base/client'
import {createServerConnection} from './createServerConnection'

let documentStoreInstance = null

export function getDocumentStore() {
  if (!documentStoreInstance) {
    const serverConnection = createServerConnection(client)
    documentStoreInstance = createDocumentStore({serverConnection})
  }

  return documentStoreInstance
}
