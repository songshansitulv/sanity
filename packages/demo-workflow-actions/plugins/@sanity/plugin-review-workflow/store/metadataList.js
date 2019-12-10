import client from 'part:@sanity/base/client'
import {merge, Subject} from 'rxjs'
import {map, scan, share, switchMap} from 'rxjs/operators'
import {getQueryResultObservable, getServerEventObservable} from '../lib/document-store'
import {useObservable} from '../lib/utils/hooks'

function stateReducer(state, event) {
  if (event.type === 'snapshot') return {data: event.snapshot}

  if (event.type === 'move') {
    return {
      ...state,
      data: state.data.map(metadata => {
        if (metadata._id === `workflow-metadata.${event.id}`) {
          return {...metadata, state: event.nextState}
        }

        return metadata
      })
    }
  }

  if (event.type === 'removeAssignee') {
    return {
      ...state,
      data: state.data.map(metadata => {
        if (metadata._id === event.id) {
          const assignees = metadata.assignees
          const exists = assignees && assignees.includes(event.userId)

          if (exists) {
            const newAssignees = assignees.slice(0)

            newAssignees.splice(assignees.indexOf(event.userId), 1)

            return {
              ...metadata,
              assignees: newAssignees
            }
          }
        }

        return metadata
      })
    }
  }

  if (event.type === 'addAssignee') {
    return {
      ...state,
      data: state.data.map(metadata => {
        if (metadata._id === event.id) {
          const assignees = metadata.assignees || []
          const exists = assignees.includes(event.userId)

          if (!exists) {
            return {
              ...metadata,
              assignees: assignees.concat([event.userId])
            }
          }
        }

        return metadata
      })
    }
  }

  console.log('unhandled event', event)

  return state
}

function getMetadataListObservable() {
  const filter = '_type == $type'
  const params = {type: 'workflow.metadata'}
  const query = `* [_type == $type] {
    _id,
    "ref": coalesce(
      *[_id == "drafts." + ^.documentId]{_id,_type}[0],
      *[_id == ^.documentId]{_id,_type}[0]
    ),
    state,
    assignees
  }`

  return getServerEventObservable({filter, params}).pipe(
    switchMap(() => getQueryResultObservable({query, params}))
  )
}

function getMetadataListContext() {
  const actionEventSubject = new Subject()
  const actionEvent$ = actionEventSubject.asObservable()
  const snapshotEvent$ = getMetadataListObservable().pipe(
    map(snapshot => ({type: 'snapshot', snapshot}))
  )
  const event$ = merge(snapshotEvent$, actionEvent$)
  const state$ = event$.pipe(
    scan(stateReducer, {data: []}),
    map(state => ({
      ...state,
      addAssignee,
      assignMyself,
      clearAssignees,
      move,
      removeAssignee
    })),
    share()
  )

  return state$

  function move(id, nextState) {
    actionEventSubject.next({type: 'move', id, nextState})

    return client
      .patch(`workflow-metadata.${id}`)
      .set({state: nextState})
      .commit()
  }

  function assignMyself(id) {
    actionEventSubject.next({type: 'assignMyself', id})
  }

  function clearAssignees(id) {
    actionEventSubject.next({type: 'clearAssignees', id})
  }

  function addAssignee(id, userId) {
    actionEventSubject.next({type: 'addAssignee', id, userId})
  }

  function removeAssignee(id, userId) {
    actionEventSubject.next({type: 'removeAssignee', id, userId})
  }
}

export function useMetadataList() {
  const stream = getMetadataListContext()
  const initialValue = []
  const keys = []

  return useObservable(stream, initialValue, keys)
}
