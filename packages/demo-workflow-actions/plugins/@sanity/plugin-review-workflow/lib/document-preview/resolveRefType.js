import client from 'part:@sanity/base/client'
import {from} from 'rxjs'
import {map} from 'rxjs/operators'

// todo: use a LRU cache instead (e.g. hashlru or quick-lru)
const CACHE = {}

function resolveRefTypeName(reference) {
  if (!(reference._ref in CACHE)) {
    CACHE[reference._ref] = client.fetch('*[_id == $id][0]._type', {id: reference._ref})
  }

  return from(CACHE[reference._ref])
}

export function resolveRefType(value, type) {
  return resolveRefTypeName(value).pipe(
    map(refTypeName => type.to.find(toType => toType.name === refTypeName))
  )
}
