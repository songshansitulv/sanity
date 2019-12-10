import React from 'react'
import Avatar from './Avatar'

import styles from './AvatarStack.css'

export default function AvatarStack(props) {
  return (
    <div className={styles.root}>
      {props.userIds.map(userId => (
        <div key={userId}>
          <Avatar userId={userId} />
        </div>
      ))}
    </div>
  )
}
