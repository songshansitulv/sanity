import React from 'react'
import {useUser} from '../../lib/user-store'

import styles from './Avatar.css'

export default function Avatar(props) {
  const user = useUser(props.userId)

  if (!user) return <div className={styles.root} />

  return (
    <div className={styles.root}>
      <img src={user.imageUrl} />
    </div>
  )
}
