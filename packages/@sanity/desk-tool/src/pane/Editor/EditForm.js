import React from 'react'
import PropTypes from 'prop-types'
import FormBuilder from 'part:@sanity/form-builder'
import styles from '../styles/Editor.css'

const preventDefault = ev => ev.preventDefault()

export default class EditForm extends React.PureComponent {
  static propTypes = {
    filterField: PropTypes.func.isRequired,
    focusPath: PropTypes.array.isRequired,
    markers: PropTypes.arrayOf(
      PropTypes.shape({
        path: PropTypes.array
      })
    ).isRequired,
    onBlur: PropTypes.func.isRequired,
    onChange: PropTypes.func.isRequired,
    onFocus: PropTypes.func.isRequired,
    patchChannel: PropTypes.object.isRequired,
    readOnly: PropTypes.bool.isRequired,
    schema: PropTypes.object.isRequired,
    type: PropTypes.object.isRequired,
    value: PropTypes.object.isRequired
  }
  render() {
    const {
      filterField,
      focusPath,
      markers,
      onBlur,
      onChange,
      onFocus,
      patchChannel,
      readOnly,
      schema,
      type,
      value
    } = this.props
    return (
      <form
        className={styles.editor}
        onSubmit={preventDefault}
        id="Sanity_Default_DeskTool_Editor_ScrollContainer"
      >
        <FormBuilder
          schema={schema}
          patchChannel={patchChannel}
          value={value}
          type={type}
          filterField={filterField}
          readOnly={readOnly}
          onBlur={onBlur}
          onFocus={onFocus}
          focusPath={focusPath}
          onChange={onChange}
          markers={markers}
        />
      </form>
    )
  }
}
