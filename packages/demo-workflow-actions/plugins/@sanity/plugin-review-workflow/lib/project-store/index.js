import client from 'part:@sanity/base/client'
import {defer, from} from 'rxjs'
import {useConfig} from '../config'
import {useObservable} from '../utils/hooks'

// https://api.sanity.io/v1/projects/9memwlsl

export function getProjectObservable(projectId) {
  return defer(() =>
    from(
      client.request({
        uri: `/projects/${projectId}`,
        withCredentials: true
      })
    )
  )
}

export function useProject(projectId) {
  const source = getProjectObservable(projectId)
  const initialValue = null
  const keys = [projectId]

  return useObservable(source, initialValue, keys)
}

export function useCurrentProject() {
  const projectId = useConfig().api.projectId
  const source = getProjectObservable(projectId)
  const initialValue = null
  const keys = [projectId]

  return useObservable(source, initialValue, keys)
}
