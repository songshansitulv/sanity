import React from 'react'
import {DocumentCard} from '../documentCard'

import styles from './Column.module.css'

export default function Column({
  bindDrag,
  dragData,
  isTarget,
  onAssigneeAdd,
  onAssigneeRemove,
  onClearAssignees,
  onDragEnter,
  results,
  state,
  title
}) {
  const handleMouseEnter = () => {
    if (dragData) {
      onDragEnter(state)
    }
  }

  return (
    <div className={isTarget ? styles.isTarget : styles.root} onMouseEnter={handleMouseEnter}>
      <header className={styles.header}>
        <h2 className={styles.title}>{title}</h2>
      </header>
      <div className={styles.content}>
        {results.length > 0 && (
          <div className={styles.cardList}>
            {results
              .filter(result => result.ref)
              .map(result => {
                const {ref: data, ...metadata} = result

                return (
                  <div key={result._id}>
                    <DocumentCard
                      // assignees={result.assignees}
                      bindDrag={bindDrag}
                      data={data}
                      dragData={dragData}
                      metadata={metadata}
                      onAssigneeAdd={userId => onAssigneeAdd(result._id, userId)}
                      onAssigneeRemove={userId => onAssigneeRemove(result._id, userId)}
                      onClearAssignees={() => onClearAssignees(result._id)}
                    />
                  </div>
                )
              })}
          </div>
        )}
      </div>
    </div>
  )
}
