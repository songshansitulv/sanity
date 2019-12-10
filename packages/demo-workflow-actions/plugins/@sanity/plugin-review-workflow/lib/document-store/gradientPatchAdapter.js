import {arrayToJSONMatchPath} from '@sanity/mutator'
import assert from 'assert'
import {flatten} from 'lodash'
import * as convertPath from './convertPath'

export function toGradient(patches) {
  return patches.map(toGradientPatch)
}

export function toFormBuilder(origin, patches) {
  return flatten(patches.map(patch => toFormBuilderPatches(origin, patch)))
}

export function notIn(haystack) {
  return needle => !haystack.includes(needle)
}

const IGNORE_PATCH_TYPES = ['id', 'ifRevisionID', 'query']

function isSupportedPatchType(patchType) {
  return !IGNORE_PATCH_TYPES.includes(patchType)
}

function toFormBuilderPatches(origin, patch) {
  return flatten(
    Object.keys(patch)
      .filter(isSupportedPatchType)
      .map(type => {
        if (type === 'unset') {
          return patch.unset.map(path => {
            return {
              type: 'unset',
              path: convertPath.toFormBuilder(path),
              origin
            }
          })
        }

        if (type === 'insert') {
          const position = 'before' in patch.insert ? 'before' : 'after'
          return {
            type: 'insert',
            position: position,
            path: convertPath.toFormBuilder(patch.insert[position]),
            items: patch.insert.items,
            origin
          }
        }

        return Object.keys(patch[type])
          .map(gradientPath => {
            if (type === 'set') {
              return {
                type: 'set',
                path: convertPath.toFormBuilder(gradientPath),
                value: patch[type][gradientPath],
                origin
              }
            }

            if (type === 'inc' || type === 'dec') {
              return {
                type: type,
                path: convertPath.toFormBuilder(gradientPath),
                value: patch[type][gradientPath],
                origin
              }
            }

            if (type === 'setIfMissing') {
              return {
                type: 'setIfMissing',
                path: convertPath.toFormBuilder(gradientPath),
                value: patch[type][gradientPath],
                origin
              }
            }

            if (type === 'diffMatchPatch') {
              return {
                type: 'diffMatchPatch',
                path: convertPath.toFormBuilder(gradientPath),
                value: patch[type][gradientPath],
                origin
              }
            }

            console.warn(new Error(`Unsupported patch type: ${type}`))

            return null
          })
          .filter(Boolean)
      })
  )
}

function toGradientPatch(patch) {
  const matchPath = arrayToJSONMatchPath(patch.path || [])

  if (patch.type === 'insert') {
    const {position, items} = patch
    return {
      insert: {
        [position]: matchPath,
        items: items
      }
    }
  }

  if (patch.type === 'unset') {
    return {
      unset: [matchPath]
    }
  }

  assert(patch.type, `Missing patch type in patch ${JSON.stringify(patch)}`)

  if (matchPath) {
    return {
      [patch.type]: {
        [matchPath]: patch.value
      }
    }
  }

  return {
    [patch.type]: patch.value
  }
}
