import {concat, of, Subject, throwError} from 'rxjs'
import {catchError, map, mergeMapTo, startWith, switchMapTo, take} from 'rxjs/operators'
import {getQueryResultObservable} from './queryResult'
import {getServerEventObservable} from './serverEvent'

export function getDocumentIdsObservable(opts = {}) {
  const {filter, params} = opts
  if (!filter) return throwError(new Error('getDocumentIdsObservable: missing `filter` option'))
  const serverEvent$ = getServerEventObservable(`*[${filter}]`, params)
  const queryResult$ = getQueryResultObservable(`*[${filter}] {_id, _type}`, params)

  return serverEvent$.pipe(switchMapTo(queryResult$))
}

const DOCUMENT_IDS_INITIAL_STATE = {
  data: null,
  error: null,
  loading: true,
  retry: () => void 0
}

export function getDocumentIdsStateObservable(opts) {
  const retrySubject = new Subject()
  const retry$ = retrySubject.asObservable()
  const retry = val => retrySubject.next(val)

  return getDocumentIdsObservable(opts).pipe(
    map(data => data.map(d => d._id)),
    map(data => ({data, error: null, loading: false})),
    catchError((error, caught$) =>
      concat(of({data: null, error, loading: false}), retry$.pipe(take(1), mergeMapTo(caught$)))
    ),
    map(state => ({...state, retry})),
    startWith(DOCUMENT_IDS_INITIAL_STATE)
  )
}
