import {merge, timer, of as observableOf, Observable} from 'rxjs'
import {catchError, map, mapTo, scan, share, switchMap} from 'rxjs/operators'
import {getDocumentStore} from './documentStore'
import * as gradientPatchAdapter from './gradientPatchAdapter'

export function prepareMutationEvent(event) {
  const patches = event.mutations.map(mut => mut.patch).filter(Boolean)
  return {
    ...event,
    patches: gradientPatchAdapter.toFormBuilder(event.origin, patches)
  }
}

export function prepareRebaseEvent(event) {
  const patches = [{id: event.document._id, set: event.document}]

  return {
    type: 'mutation',
    document: event.document,
    mutations: patches.map(patch => ({
      patch
    })),
    patches: gradientPatchAdapter.toFormBuilder('internal', patches)
  }
}

export function wrap(doc) {
  const events = doc.events.pipe(
    map(event => {
      if (event.type === 'mutation') {
        return prepareMutationEvent(event)
      } else if (event.type === 'rebase') {
        return prepareRebaseEvent(event)
      }
      return event
    }),
    scan((prevEvent, currentEvent) => {
      const deletedSnapshot =
        prevEvent &&
        currentEvent.type === 'mutation' &&
        prevEvent.document !== null &&
        currentEvent.document === null
          ? prevEvent.document
          : null

      return {
        ...currentEvent,
        deletedSnapshot
      }
    }, null)
  )

  const patch = patches => {
    const gradientPatches = gradientPatchAdapter.toGradient(patches)
    return doc.patch(gradientPatches)
  }

  return {...doc, events, patch}
}

export function checkoutPair(id) {
  const draftId = `drafts.${id}`
  const publishedId = id
  const {draft, published} = getDocumentStore().checkoutPair({
    draftId,
    publishedId
  })

  return {
    draft: wrap(draft),
    published: wrap(published)
  }
}

// eslint-disable-next-line complexity
export function documentEventToState(event) {
  switch (event.type) {
    case 'rebase':
    case 'create':
    case 'createIfNotExists':
    case 'snapshot': {
      return {
        deleted: null,
        data: event.document
      }
    }
    case 'mutation': {
      return {
        deleted: event.deletedSnapshot,
        data: event.document
          ? {
              ...event.document,
              // todo: The following line is a temporary workaround for a problem with the mutator not
              // setting updatedAt on patches applied optimistic when they are received from server
              // can be removed when this is fixed
              _updatedAt: new Date().toISOString()
            }
          : event.document
      }
    }
    case 'reconnect': {
      return {}
    }
    case 'committed': {
      // note: we *could* use this in conjunction with <document>.commit()
      // by setting this.state.isSaving=true before calling <document>.commit and setting to false
      // again when we get the 'committed' event back.
      // However, calling <document>.commit() doesn't necessarily result in a commit actually being done,
      // and thus we are not guaranteed to get a 'committed' event back after a call to
      // <document>.commit(), which means we could easily get into a situation where the
      // `isSaving` state stays around forever.
      return {}
    }
    case 'error': {
      return {}
    }
    default: {
      // eslint-disable-next-line no-console
      console.log('Unhandled document event type "%s"', event.type, event)
      return {}
    }
  }
}

const INITIAL_DOCUMENT_ENTRY_STATE = {
  reconnecting: false,
  draft: {
    api: null,
    data: null,
    deleted: null,
    loaded: false
  },
  published: {
    api: null,
    data: null,
    deleted: null,
    loaded: false
  },
  error: null
}

export function getUncachedDocumentEntryObservable(id) {
  const pair = checkoutPair(id)

  return merge(
    pair.published.events.pipe(map(event => ({...event, key: 'published'}))),
    pair.draft.events.pipe(map(event => ({...event, key: 'draft'})))
  ).pipe(
    switchMap(event =>
      event.type === 'reconnect' ? timer(500).pipe(mapTo(event)) : observableOf(event)
    ),
    catchError((err, _caught$) => {
      // eslint-disable-next-line no-console
      console.error(err)
      return observableOf({type: 'error', error: err})
    }),
    scan((prevState, event) => {
      const key = event.key // either 'draft' or 'published'
      const prevDocument = prevState[key]
      const prevDocumentData = prevDocument && prevDocument.data
      const prevDocumentDeleted = prevDocument && prevDocument.deleted
      const newDataState = documentEventToState(event)

      return {
        ...prevState,
        error: event.type === 'error' ? event.error : null,
        reconnecting: event.type === 'reconnect',
        [key]: {
          api: pair[key],
          data: newDataState.data || prevDocumentData,
          deleted: newDataState.deleted || prevDocumentDeleted,
          loaded: true
        }
      }
    }, INITIAL_DOCUMENT_ENTRY_STATE)
  )
}

const entryObservableCache = {}
export function getDocumentEntryObservable(id) {
  // console.log('from cache')
  if (entryObservableCache[id]) return entryObservableCache[id]

  const entry$ = getUncachedDocumentEntryObservable(id)

  // console.log('add cache')
  entryObservableCache[id] = entry$

  return Observable.create(observer => {
    const sub = entry$.subscribe(observer)

    return () => {
      // console.log('remove cache')
      entryObservableCache[id] = null
      sub.unsubscribe()
    }
  }).pipe(share())
}
