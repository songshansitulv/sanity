import client from 'part:@sanity/base/client'
import {defer} from 'rxjs'

export function getQueryResultObservable({query, params}) {
  return defer(() => client.observable.fetch(query, params))
}
