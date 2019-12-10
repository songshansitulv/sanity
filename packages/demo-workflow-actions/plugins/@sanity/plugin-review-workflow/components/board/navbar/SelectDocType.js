import React from 'react'
import workflowConfig from 'part:@sanity/plugin-review-workflow/config'

export default function SelectDocType(props) {
  const [value, setValue] = React.useState('')
  const types = workflowConfig.types.map(typeName => ({name: typeName, title: typeName}))

  const handleChange = event => {
    setValue(event.target.value)
    if (props.onChange) props.onChange(event.target.value || null)
  }

  return (
    <select onChange={handleChange} value={value}>
      <option value="">Filter by document type</option>
      {types && (
        <>
          {types.map(type => (
            <option key={type.name} value={type.name}>
              {type.title}
            </option>
          ))}
        </>
      )}
    </select>
  )
}
