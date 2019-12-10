import client from 'part:@sanity/base/client'
import {merge, Observable, Subject} from 'rxjs'
import {filter, map, scan, share, take, tap} from 'rxjs/operators'
import {getDocumentObservable} from '../lib/document-store'
import {useObservable} from '../lib/utils/hooks'

function stateReducer(state, event) {
  if (event.type === 'snapshot') {
    return event.snapshot
  }

  if (event.type === 'setState') {
    return {...state, state: event.state}
  }

  return state
}

export function getMetadataContext(documentId, defaultState) {
  const id = `workflow-metadata.${documentId}`
  const initialState = {
    _type: 'workflow.metadata',
    _id: `workflow-metadata.${documentId}`,
    state: defaultState || 'draft',
    assignees: [],
    documentId
  }
  const snapshot$ = getDocumentObservable({
    filter: '_id == $id',
    params: {id}
  }).pipe(share())
  const snapshotEvent$ = snapshot$.pipe(
    filter(Boolean),
    map(snapshot => ({type: 'snapshot', snapshot}))
  )
  const createEvent$ = snapshot$.pipe(
    filter(doc => !doc),
    map(() => ({type: 'snapshot', snapshot: initialState})),
    take(1),
    tap(create)
  )
  const actionEventSubject = new Subject()
  const actionEvent$ = actionEventSubject.asObservable()
  const event$ = merge(createEvent$, snapshotEvent$, actionEvent$)
  const state$ = event$.pipe(
    scan(stateReducer, {}),
    map(state => ({...state, delete: del, setState, ok: true})),
    share()
  )

  return {initialState, state$, keys: [id]}

  function del() {
    actionEventSubject.next({type: 'delete'})
    return client.delete(id)
  }

  function setState(state) {
    actionEventSubject.next({type: 'setState', state})
    return client
      .patch(id)
      .set({state})
      .commit()
  }

  function create() {
    return client
      .transaction()
      .createOrReplace(initialState)
      .commit()
  }
}

const SUBJECT_CACHE = {}
export function getCachedMetadataContext(documentId, defaultState) {
  if (!SUBJECT_CACHE[documentId]) {
    // add to cache
    SUBJECT_CACHE[documentId] = {
      ctx: getMetadataContext(documentId, defaultState),
      observers: []
    }
  }

  const {ctx, observers} = SUBJECT_CACHE[documentId]

  const state$ = Observable.create(observer => {
    observers.push(observer)

    const sub = ctx.state$.subscribe(observer)

    return () => {
      sub.unsubscribe()

      const index = observers.indexOf(observer)

      if (index > -1) {
        observers.splice(index, 1)
      }

      if (observers.length === 0) {
        // delete from cache
        delete SUBJECT_CACHE[documentId]
      }
    }
  })

  return {...ctx, state$}
}

export function useMetadata(documentId, defaultState) {
  const {state$: stream, initialState, keys} = getCachedMetadataContext(documentId, defaultState)

  return useObservable(stream, initialState, keys)
}
