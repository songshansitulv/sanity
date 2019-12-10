import client from 'part:@sanity/base/client'
import React from 'react'
import {useDrag} from 'react-use-gesture'
import reviewWorkflowStates from '../../config/states'
import {useMetadataList} from '../../store'
import {Column} from './column'
import {Navbar} from './navbar'

import styles from './Board.css'

const columns = reviewWorkflowStates

function useWorkflowBoard() {
  const [dragData, setDragData] = React.useState(null)
  const [targetState, setTargetState] = React.useState(null)
  const [assigneeId, setAssigneeId] = React.useState(null)
  const [docTypeName, setDocTypeName] = React.useState(null)
  const metadataList = useMetadataList(assigneeId, docTypeName) || []
  const handleAssigneeFilterChange = id => setAssigneeId(id)
  const handleDocTypeChange = name => setDocTypeName(name)

  const bindDrag = useDrag(({args, down, movement}) => {
    const [metadata] = args
    const [x, y] = movement
    const documentId = metadata._id.split('.')[1]

    if (down) {
      setDragData({
        documentId,
        down,
        x,
        y,
        state: metadata.state
      })
    } else {
      if (targetState && metadata.state !== targetState) {
        metadataList.move(documentId, targetState)
      }

      setDragData(null)
      setTargetState(null)
    }
  })

  const handleAssigneeAdd = (metadataId, userId) => {
    const metadata = metadataList.data.find(m => m._id === metadataId)

    if (metadata) {
      metadataList.addAssignee(metadataId, userId)

      const assignees = metadata.assignees ? metadata.assignees.slice(0) : []
      const idx = assignees.indexOf(userId)

      if (idx === -1) {
        assignees.push(userId)

        client
          .patch(metadataId)
          .set({assignees})
          .commit()
      }
    }
  }

  const handleAssigneeRemove = (metadataId, userId) => {
    const workflow = metadataList.data.find(d => d._id === metadataId)

    if (workflow) {
      metadataList.removeAssignee(metadataId, userId)

      const assignees = workflow.assignees ? workflow.assignees.slice(0) : []
      const idx = assignees.indexOf(userId)

      if (idx > -1) {
        assignees.splice(idx, 1)

        client
          .patch(metadataId)
          .set({assignees})
          .commit()
      }
    }
  }

  const handleColumnDragEnter = state => {
    setTargetState(state)
  }

  const handleClearAssignees = metadataId => {
    metadataList.clearAssignees(metadataId)

    client
      .patch(metadataId)
      .unset(['assignees'])
      .commit()
  }

  return {
    bindDrag,
    dragData,
    handleAssigneeAdd,
    handleAssigneeRemove,
    handleAssigneeFilterChange,
    handleClearAssignees,
    handleColumnDragEnter,
    handleDocTypeChange,
    metadataList,
    targetState
  }
}

export default function Board() {
  const {
    bindDrag,
    dragData,
    handleAssigneeAdd,
    handleAssigneeRemove,
    handleAssigneeFilterChange,
    handleClearAssignees,
    handleColumnDragEnter,
    handleDocTypeChange,
    metadataList,
    targetState
  } = useWorkflowBoard()

  if (metadataList.loading || !metadataList.data) return <div>Loading...</div>

  return (
    <div className={dragData ? styles.isDragging : styles.root}>
      <div className={styles.columnsContainer}>
        <div
          className={styles.columns}
          style={{minWidth: `${columns.length * 300 + (columns.length - 1)}px`}}
        >
          {columns.map(column => {
            return (
              <div key={column.state}>
                <Column
                  {...column}
                  bindDrag={bindDrag}
                  dragData={dragData}
                  isTarget={targetState === column.state}
                  onAssigneeAdd={handleAssigneeAdd}
                  onAssigneeRemove={handleAssigneeRemove}
                  onClearAssignees={handleClearAssignees}
                  onDragEnter={handleColumnDragEnter}
                  results={metadataList.data.filter(m => m.state === column.state)}
                />
              </div>
            )
          })}
        </div>
      </div>
      <div className={styles.nav}>
        <Navbar
          onDocTypeChange={handleDocTypeChange}
          onAssigneeFilterChange={handleAssigneeFilterChange}
        />
      </div>
    </div>
  )
}
