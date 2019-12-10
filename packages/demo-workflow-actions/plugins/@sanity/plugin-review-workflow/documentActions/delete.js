import React from 'react'
import {createAction} from 'part:@sanity/base/actions/utils'
import TrashIcon from 'part:@sanity/base/trash-icon'
import {useMetadata} from '../store'
import {inferInitialState} from './_helpers'
import {useDocumentOperation} from '@sanity/react-hooks'

export const deleteAction = createAction(props => {
  const [showConfirmDialog, setShowConfirmDialog] = React.useState(false)

  const ops = useDocumentOperation(props.id, props.type)
  const metadata = useMetadata(props.id, inferInitialState(props))

  const onHandle = async () => {
    if (ops.delete.disabled) return
    if (!showConfirmDialog) {
      setShowConfirmDialog(true)
      return
    }
    setShowConfirmDialog(false)
    metadata.delete()
    await ops.delete.execute()
  }

  return {
    dialog: showConfirmDialog && <div>Confirm</div>,
    disabled: ops.delete.disabled || !metadata,
    icon: TrashIcon,
    label: 'Delete',
    onHandle
  }
})
