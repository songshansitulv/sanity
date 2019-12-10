import {switchMap} from 'rxjs/operators'
import {getQueryResultObservable} from './queryResult'
import {getServerEventObservable} from './serverEvent'

export function getDocumentObservable(opts) {
  // console.log('getDocumentObservable', opts)
  return getServerEventObservable(opts).pipe(
    switchMap(() =>
      getQueryResultObservable({
        query: `*[${opts.filter}][0]`,
        params: opts.params
      })
    )
  )
}
