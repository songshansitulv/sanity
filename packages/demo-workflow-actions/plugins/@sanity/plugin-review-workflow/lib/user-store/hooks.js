import {useCurrentProject} from '../project-store'
import {useObservable} from '../utils/hooks'
import {getUserObservable} from './user'
import {getUserListObservable} from './userList'

export function useUser(userId) {
  const source = getUserObservable(userId)
  const initialState = null
  const keys = [userId]

  return useObservable(source, initialState, keys)
}

export function useUserList(userIds) {
  if (!userIds) {
    throw new Error('useUserList: `userIds` must be an array of strings')
  }

  const source = getUserListObservable(userIds)
  const initialState = null
  const keys = [userIds.join(',')]

  return useObservable(source, initialState, keys)
}

export function useProjectUsers() {
  const project = useCurrentProject()
  const allUserIds = project && project.members.map(user => user.id)

  return useUserList(allUserIds || [])
}
