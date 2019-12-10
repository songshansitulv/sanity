import React from 'react'
import {createAction} from 'part:@sanity/base/actions/utils'
import CloseIcon from 'part:@sanity/base/close-icon'
import {useMetadata} from '../store'
import {inferInitialState} from './_helpers'
import {useDocumentOperation} from '@sanity/react-hooks'

export const unpublishAction = createAction(props => {
  const ops = useDocumentOperation(props.id, props.type)
  const metadata = useMetadata(props.id, inferInitialState(props))

  if (metadata && metadata.state !== 'published') {
    return {
      disabled: true,
      icon: CloseIcon,
      label: <span style={{textDecoration: 'line-through'}}>Unpublish</span>
    }
  }

  const onHandle = async () => {
    if (ops.unpublish.disabled) return
    metadata.setState('draft')
    await ops.unpublish.execute()
  }

  return {
    disabled: !metadata,
    icon: CloseIcon,
    label: 'Unpublish',
    onHandle
  }
})
