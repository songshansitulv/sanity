import AddIcon from 'react-icons/lib/md/add'
import EditIcon from 'part:@sanity/base/edit-icon'
import {SanityDefaultPreview} from 'part:@sanity/base/preview'
import schema from 'part:@sanity/base/schema'
import PopOverDialog from 'part:@sanity/components/dialogs/popover'
import React from 'react'
import {useSprings, animated} from 'react-spring'
import SubjectIcon from 'react-icons/lib/md/subject'
import {useDocumentPreview} from '../../../lib/document-preview'
import {useRouter} from '../../../lib/router'
import {AvatarStack} from '../../avatar'
import {AssigneeListWizard} from '../../assigneeListWizard'

import styles from './DocumentCard.css'

// eslint-disable-next-line complexity
export default function DocumentCard({
  bindDrag,
  data,
  dragData,
  metadata,
  onAssigneeAdd,
  onAssigneeRemove,
  onClearAssignees
}) {
  const {assignees} = metadata
  const router = useRouter()
  const schemaType = schema.get(data._type)
  const href = router.resolveIntentLink('edit', {
    id: data._id,
    type: data._type
  })
  const icon = schemaType.icon || SubjectIcon
  const preview = useDocumentPreview(data._id, data._type)
  const [showAssigneesForm, setShowAssigneesForm] = React.useState()

  const handleClick = event => {
    event.preventDefault()
    router.navigateUrl(href)
  }

  const handleEditAssigneesClick = () => {
    setShowAssigneesForm(true)
  }

  const handleAssigneesFormCloseClick = () => {
    setShowAssigneesForm(false)
  }

  if (!preview || !preview.snapshot) {
    return <div>Loading preview...</div>
  }

  const style = {}
  if (dragData && dragData.documentId === data._id) {
    style.transform = `translate3d(${dragData.x}px, ${dragData.y}px, 0)`
    style.position = 'relative'
    style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.25)'
    style.zIndex = 1
    style.pointerEvents = 'none'
  }

  const previewValue = {...data, ...preview.snapshot}

  return (
    <animated.div
      className={styles.root}
      // onMouseDown={preventDefault}
      style={style}
    >
      <div className={styles.content}>
        <div {...bindDrag(metadata)} className={styles.preview}>
          <SanityDefaultPreview icon={icon} value={previewValue} />

          {/* <div className={styles.previewIcon}>{icon && React.createElement(icon)}</div>
          <div className={styles.previewText}>
            <h3>{preview.snapshot.title}</h3>
            <div>{preview.snapshot.subtitle}</div>
          </div> */}
        </div>
      </div>

      <div className={styles.footer}>
        <div className={styles.footerLeft}>
          {(!assignees || assignees.length === 0) && (
            <button className={styles.button} onClick={handleEditAssigneesClick} type="button">
              <div tabIndex={-1}>
                <span className={styles.buttonIcon}>
                  <AddIcon />
                </span>
                <span className={styles.buttonLabel}>Add assignees</span>
              </div>
            </button>
          )}

          {assignees && (
            <button
              className={styles.editAssigneesButton}
              onClick={handleEditAssigneesClick}
              type="button"
            >
              <AvatarStack userIds={assignees} />
            </button>
          )}

          {showAssigneesForm && (
            <PopOverDialog
              onClickOutside={handleAssigneesFormCloseClick}
              padding="none"
              placement="bottom"
              useOverlay={false}
              hasAnimation
            >
              <AssigneeListWizard
                assignees={assignees || []}
                onAdd={onAssigneeAdd}
                onClear={onClearAssignees}
                onRemove={onAssigneeRemove}
              />
            </PopOverDialog>
          )}
        </div>

        <div className={styles.footerRight}>
          <a className={styles.button} href={href} onClick={handleClick}>
            <div tabIndex={-1}>
              <span className={styles.buttonIcon}>
                <EditIcon />
              </span>
              <span className={styles.buttonLabel}>Edit document</span>
            </div>
          </a>
        </div>
      </div>
    </animated.div>
  )
}
