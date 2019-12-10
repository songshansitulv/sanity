import {concat, of, Subject, throwError} from 'rxjs'
import {catchError, map, mergeMapTo, startWith, switchMapTo, take} from 'rxjs/operators'
import {getQueryResultObservable} from './queryResult'
import {getServerEventObservable} from './serverEvent'

export function getDocumentListObservable(opts = {}) {
  const {filter, params} = opts

  if (!filter) throwError(new Error('getDocumentListObservable: missing `filter` option'))

  const query = `*[${filter}]`
  const serverEvent$ = getServerEventObservable(opts)
  const query$ = getQueryResultObservable({query, params})

  return serverEvent$.pipe(switchMapTo(query$))
}

const DOCUMENT_LIST_INITIAL_STATE = {
  data: null,
  error: null,
  loading: true,
  retry: () => void 0
}

export function getDocumentListStateObservable(opts) {
  const retrySubject = new Subject()
  const retry$ = retrySubject.asObservable()
  const retry = () => retrySubject.next()

  return getDocumentListObservable(opts).pipe(
    map(data => ({data, error: null, loading: false})),
    catchError((error, caught$) =>
      concat(of({data: null, error, loading: false}), retry$.pipe(take(1), mergeMapTo(caught$)))
    ),
    map(state => ({...state, retry})),
    startWith(DOCUMENT_LIST_INITIAL_STATE)
  )
}
