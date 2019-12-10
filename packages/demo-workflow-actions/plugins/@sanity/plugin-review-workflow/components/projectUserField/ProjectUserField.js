import FormField from 'part:@sanity/components/formfields/default'
import TextInput from 'part:@sanity/components/textinputs/default'
import {PatchEvent, unset, set} from 'part:@sanity/form-builder/patch-event'
import React from 'react'
import {useProjectUsers} from '../../lib/user-store'
import {ClickOutside} from '../clickOutside'
import {UserCard} from '../userCard'

import styles from './ProjectUserField.module.css'

function searchUsers(users, searchString) {
  return users.filter(user => {
    const givenName = (user.givenName || '').toLowerCase()
    const middleName = (user.middleName || '').toLowerCase()
    const familyName = (user.familyName || '').toLowerCase()

    if (givenName.startsWith(searchString)) return true
    if (middleName.startsWith(searchString)) return true
    if (familyName.startsWith(searchString)) return true

    return false
  })
}

function arrayEnsureIncludes(arr, item) {
  if (arr.indexOf(item) === -1) return arr.concat([item])
  return arr
}

function arrayEnsureExcludes(arr, item) {
  const idx = arr.indexOf(item)

  if (idx === -1) return arr

  const ret = arr.slice(0)

  ret.splice(idx, 1)

  return ret
}

const ProjectUserField = React.forwardRef((props, focusableRef) => {
  const {type: schemaType} = props
  const [focused, setFocused] = React.useState(false)
  const [searchString, setSearchString] = React.useState('')
  const projectUsers = useProjectUsers()
  const searchResults = searchUsers(projectUsers || [], searchString)
  const value = props.value || []
  const selectedUsers = value.map(
    userId => (projectUsers || []).find(user => user.id === userId) || {id: userId, loading: true}
  )

  const handleSearchChange = event => {
    setSearchString(event.target.value)
  }

  const handleSearchFocus = () => {
    setFocused(true)
  }

  const handleCheckboxUpdate = (event, user) => {
    let newValue

    if (event.target.checked) {
      newValue = arrayEnsureIncludes(value, user.id)
    } else {
      newValue = arrayEnsureExcludes(value, user.id)
    }

    if (newValue.length) {
      props.onChange(PatchEvent.from([set(newValue)]))
    } else {
      props.onChange(PatchEvent.from([unset()]))
    }
  }

  const handleMenuClickOutside = () => {
    setFocused(false)
  }

  return (
    <div className={styles.root}>
      <FormField description={schemaType.description} label={schemaType.title}>
        {selectedUsers.length === 0 && <div className={styles.emptyUserList}>Empty</div>}
        {selectedUsers.length > 0 && (
          <div className={styles.selectedUserList}>
            {selectedUsers.map(user => (
              <div key={user.id} style={{display: 'inline-block', padding: '0.5em'}}>
                {user.loading ? <span>Loading...</span> : <UserCard data={user} />}
              </div>
            ))}
          </div>
        )}
        <ClickOutside onClickOutside={handleMenuClickOutside}>
          {({ref: fieldRef}) => (
            <div className={focused ? styles.focusedSearch : styles.search} ref={fieldRef}>
              <TextInput
                onChange={handleSearchChange}
                onFocus={handleSearchFocus}
                placeholder="Type to find users"
                ref={focusableRef}
                value={searchString}
              />
              {searchResults && (
                <div className={styles.menu}>
                  {searchResults.length === 0 && (
                    <div style={{padding: '0.25em 0.5em'}}>No matches</div>
                  )}
                  {searchResults.map(user => (
                    <label className={styles.menuItem} key={user.id}>
                      <div className={styles.userOption} tabIndex={-1}>
                        <div className={styles.userCheckbox}>
                          <input
                            checked={value.indexOf(user.id) > -1}
                            type="checkbox"
                            onChange={event => handleCheckboxUpdate(event, user)}
                          />
                        </div>

                        <div className={styles.userCard}>
                          <UserCard data={user} />
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              )}
            </div>
          )}
        </ClickOutside>
      </FormField>
    </div>
  )
})

export default ProjectUserField
