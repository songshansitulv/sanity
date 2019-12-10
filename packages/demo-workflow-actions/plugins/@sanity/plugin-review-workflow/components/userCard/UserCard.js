import React from 'react'
import {Avatar} from '../avatar'

import styles from './UserCard.module.css'

export default function UserCard(props) {
  const {data} = props

  return (
    <div className={styles.root}>
      <div className={styles.avatar}>
        <Avatar userId={data.id} />
      </div>
      <div className={styles.displayName}>
        {data.displayName}
        {data.isCurrentUser && <> (me)</>}
      </div>
    </div>
  )
}
