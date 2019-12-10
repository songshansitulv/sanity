import React from 'react'
import SelectAssignee from './SelectAssignee'
import SelectDocType from './SelectDocType'

export default function Navbar(props) {
  return (
    <div>
      <SelectAssignee onChange={props.onAssigneeFilterChange} />
      <SelectDocType onChange={props.onDocTypeChange} />
    </div>
  )
}
