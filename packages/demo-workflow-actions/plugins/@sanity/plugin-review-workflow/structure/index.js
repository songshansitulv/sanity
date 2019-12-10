import {throwError} from 'rxjs'
import {filter, map, switchMap, switchMapTo} from 'rxjs/operators'
import {getQueryResultObservable, getServerEventObservable} from '../lib/document-store'
import {getCurrentUserObservable} from '../lib/user-store'
import S from '@sanity/desk-tool/structure-builder'

function getDocumentListAssignedToUserObservable(userId) {
  if (!userId) {
    return throwError(new Error('getDocumentListAssignedToUserObservable: missing `userId` option'))
  }

  const _filter = `_type == $type && $userId in assignees`
  const query = `
    *[${_filter}] {
      ...coalesce(
        *[_id == "drafts." + ^.documentId]{_id,_type}[0],
        *[_id == ^.documentId]{_id,_type}[0]
      )
    }
  `

  const params = {userId: userId, type: 'workflow.metadata'}
  const serverEvent$ = getServerEventObservable({filter: _filter, params})
  const query$ = getQueryResultObservable({query, params})

  return serverEvent$.pipe(switchMapTo(query$))
}

function getDocumentListAssignedToMe() {
  const userId$ = getCurrentUserObservable().pipe(
    filter(Boolean),
    map(user => user.id)
  )

  return userId$.pipe(switchMap(getDocumentListAssignedToUserObservable), filter(Boolean))
}

export const workflowListItems = [
  S.listItem()
    .title('Assigned to me')
    .id('me')
    .child(() =>
      getDocumentListAssignedToMe().pipe(
        map(list =>
          S.list()
            .title('Assigned to me')
            .id('me')
            .items(
              list.map(item =>
                S.documentListItem()
                  .id(item._id)
                  .schemaType(item._type)
              )
            )
        )
      )
    )
]
