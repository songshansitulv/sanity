import {defer, of as observableOf} from 'rxjs'
import {concatMap, map} from 'rxjs/operators'
import {getPairListener} from './getPairListener'

function fetchDocument(client, id) {
  return client.observable.getDocument(id).pipe(
    map(document => ({
      type: 'snapshot',
      document: document
    }))
  )
}

function fetchQuery(client, query, params) {
  return client.observable.fetch(query, params).pipe(
    map(documents => ({
      type: 'snapshot',
      documents: documents
    }))
  )
}

export function createServerConnection(client) {
  return {
    byIdPair(idPair) {
      // console.log('ServerConnection.byIdPair', idPair)
      return getPairListener(idPair)
    },
    byId(id) {
      // console.log('ServerConnection.byId', id)
      return client
        .listen(
          '*[_id == $id]',
          {id: id},
          {includeResult: false, events: ['welcome', 'mutation', 'reconnect']}
        )
        .pipe(
          concatMap(event => {
            return event.type === 'welcome' ? fetchDocument(client, id) : observableOf(event)
          })
        )
    },
    query(query, params) {
      // console.log('ServerConnection.query', query, params)
      return defer(() =>
        client.observable.listen(query, params || {}, {
          includeResult: false,
          events: ['welcome', 'mutation', 'reconnect']
        })
      ).pipe(
        concatMap(event => {
          return event.type === 'welcome' ? fetchQuery(client, query, params) : observableOf(event)
        })
      )
    },
    mutate(mutations) {
      // console.log('ServerConnection.mutate', mutations)
      return client.observable.dataRequest('mutate', mutations, {
        visibility: 'async',
        returnDocuments: false
      })
    },
    delete(id) {
      // console.log('ServerConnection.delete', id)
      return client.observable.delete(id, {
        visibility: 'async',
        returnDocuments: false
      })
    },
    create(doc) {
      // console.log('ServerConnection.create', doc)
      return client.observable.create(doc)
    },
    createIfNotExists(doc) {
      // console.log('ServerConnection.createIfNotExists', doc)
      return client.observable.createIfNotExists(doc)
    },
    createOrReplace(doc) {
      // console.log('ServerConnection.createOrReplace', doc)
      return client.observable.createOrReplace(doc)
    }
  }
}
