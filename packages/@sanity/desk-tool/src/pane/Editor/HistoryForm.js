import React from 'react'
import PropTypes from 'prop-types'
import FormBuilder from 'part:@sanity/form-builder'
import {format, isYesterday, isToday} from 'date-fns'
import TimeAgo from '../../components/TimeAgo'
import styles from '../styles/Editor.css'

const dateFormat = 'MMM D, YYYY, hh:mm A'

const noop = () => null

function getDateString(date) {
  if (isToday(date)) {
    return `today, ${format(date, 'hh:mm A')}`
  }
  if (isYesterday(date)) {
    return `yesterday, ${format(date, 'hh:mm A')}`
  }
  return format(date, dateFormat)
}

export default class HistoryForm extends React.PureComponent {
  static propTypes = {
    schema: PropTypes.object.isRequired,
    type: PropTypes.object.isRequired,
    value: PropTypes.object,
    timestamp: PropTypes.object.isRequired,
    isLatest: PropTypes.bool.isRequired
  }
  render() {
    const {schema, type, value, timestamp, isLatest} = this.props
    return (
      <>
        <div className={styles.top}>
          {value && (
            <span className={styles.editedTime}>
              {'Changed '}
              <TimeAgo time={timestamp.toISOString()} />
              {isLatest && <span> - Latest version</span>}
            </span>
          )}
        </div>

        <form className={styles.editor} id="Sanity_Default_DeskTool_Editor_ScrollContainer">
          {!value && <p>There is no data associated with this history event.</p>}
          {value && (
            <FormBuilder
              onBlur={noop}
              onFocus={noop}
              readOnly
              schema={schema}
              type={type}
              value={value}
            />
          )}
        </form>
      </>
    )
  }
}
