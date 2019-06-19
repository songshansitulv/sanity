import React from 'react'
import PropTypes from 'prop-types'
import FormBuilder from 'part:@sanity/form-builder'
import styles from '../styles/Editor.css'

const noop = () => null

export default class HistoryForm extends React.PureComponent {
  static propTypes = {
    schema: PropTypes.object.isRequired,
    type: PropTypes.object.isRequired,
    value: PropTypes.object
  }
  render() {
    const {schema, type, value} = this.props
    return (
      <form className={styles.editor} id="Sanity_Default_DeskTool_Editor_ScrollContainer">
        <FormBuilder
          onBlur={noop}
          onFocus={noop}
          readOnly
          schema={schema}
          type={type}
          value={value || {_type: type.name}}
        />
      </form>
    )
  }
}
