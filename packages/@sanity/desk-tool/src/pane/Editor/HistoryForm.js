import React from 'react'
import PropTypes from 'prop-types'
import FormBuilder from 'part:@sanity/form-builder'
import HistoryStore from 'part:@sanity/base/datastore/history'
import TimeAgo from '../../components/TimeAgo'
import styles from '../styles/Editor.css'

const noop = () => null

export default class HistoryForm extends React.PureComponent {
  static propTypes = {
    schema: PropTypes.object.isRequired,
    type: PropTypes.object.isRequired,
    event: PropTypes.shape({
      displayDocumentId: PropTypes.string,
      rev: PropTypes.string,
      endTime: PropTypes.object
    }),
    isLatest: PropTypes.bool
  }
  state = {
    isLoading: true,
    document: null
  }

  componentDidMount() {
    const {displayDocumentId, rev} = this.props.event
    this.fetch(displayDocumentId, rev)
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.event !== this.props.event) {
      const {displayDocumentId, rev} = nextProps.event
      this.fetch(displayDocumentId, rev)
    }
  }

  fetch(id, rev) {
    this.setState({isLoading: true})
    HistoryStore.getDocumentAtRevision(id, rev).then(res => {
      this.setState({document: res, isLoading: false})
    })
  }

  render() {
    const {schema, type, event, isLatest} = this.props
    const {isLoading, document} = this.state
    return (
      <>
        {isLoading && 'Loading…'}
        <div className={styles.top}>
          {document && (
            <span className={styles.editedTime}>
              {'Changed '}
              <TimeAgo time={event.endTime} />
              {isLatest && <span> - Latest version</span>}
            </span>
          )}
        </div>

        <form className={styles.editor} id="Sanity_Default_DeskTool_Editor_ScrollContainer">
          {!document && <p>There is no data associated with this history event.</p>}
          {document && (
            <FormBuilder
              onBlur={noop}
              onFocus={noop}
              readOnly
              schema={schema}
              type={type}
              value={document}
            />
          )}
        </form>
      </>
    )
  }
}
