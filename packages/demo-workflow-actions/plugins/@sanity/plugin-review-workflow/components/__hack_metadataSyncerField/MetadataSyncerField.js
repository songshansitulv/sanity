import React from 'react'
import {inferInitialState} from '../../documentActions/_helpers'
import {useDocumentEntry} from '../../lib/document-store'
import {useMetadata} from '../../store'
import {PaneRouterContext} from '@sanity/desk-tool'

function MetadataLoader(props) {
  const metadata = useMetadata(props.id)
  const entry = useDocumentEntry(props.id)
  const loaded = metadata && entry.draft.loaded && entry.published.loaded
  const documentState = loaded
    ? inferInitialState({
        draft: Boolean(entry.draft.data),
        published: Boolean(entry.published.data)
      })
    : null

  if (!loaded) return null

  return (
    <div>
      <strong>{metadata.state}</strong>{' '}
      {metadata.state !== documentState && (
        <button onClick={() => metadata.setState(documentState)} type="button">
          Correct state to: {documentState}
        </button>
      )}
    </div>
  )
}

const MetadataSyncerField = React.forwardRef((props, ref) => {
  const paneRouter = React.useContext(PaneRouterContext)
  const paneNode = paneRouter.routerPanesState[paneRouter.index - 1][paneRouter.groupIndex - 1]
  const {id} = paneNode

  return (
    <div ref={ref} tabIndex={-1}>
      <MetadataLoader id={id} />
    </div>
  )
})

export default MetadataSyncerField
