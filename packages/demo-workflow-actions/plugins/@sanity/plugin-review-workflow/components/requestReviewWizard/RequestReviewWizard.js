import React from 'react'
import Button from 'part:@sanity/components/buttons/default'
import PopOverDialog from 'part:@sanity/components/dialogs/popover'
import AssigneeListWizard from '../assigneeListWizard/AssigneeListWizard'

import styles from './RequestReviewWizard.css'

function RequestReviewWizard(props) {
  const onAssigneeAdd = () => {}
  const onAssigneeRemove = () => {}

  return (
    <PopOverDialog
      onClickOutside={props.onClose}
      padding="none"
      placement="top"
      useOverlay={false}
      hasAnimation
    >
      <AssigneeListWizard
        assignees={props.metadata.assignees || []}
        onAdd={onAssigneeAdd}
        onRemove={onAssigneeRemove}
      />

      <div className={styles.buttonContainer}>
        <Button color="primary" onClick={props.onSend}>
          Send request
        </Button>
      </div>
    </PopOverDialog>
  )
}

export default RequestReviewWizard
