import React from 'react'
import {useProjectUsers} from '../../../lib/user-store'

export default function SelectAssignee(props) {
  const [value, setValue] = React.useState('')
  const projectUsers = useProjectUsers()

  const handleChange = event => {
    setValue(event.target.value)
    if (props.onChange) props.onChange(event.target.value || null)
  }

  return (
    <select onChange={handleChange} value={value}>
      <option value="">Filter by assignee</option>
      {projectUsers && (
        <>
          {projectUsers.map(user => (
            <option key={user.id} value={user.id}>
              {user.displayName}
            </option>
          ))}
        </>
      )}
    </select>
  )
}
