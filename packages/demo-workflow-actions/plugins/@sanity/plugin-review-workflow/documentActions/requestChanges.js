import EditIcon from 'part:@sanity/base/edit-icon'
import {createAction} from 'part:@sanity/base/actions/utils'
import {useMetadata} from '../store'
import {inferInitialState} from './_helpers'

export const requestChangesAction = createAction(props => {
  const metadata = useMetadata(props.id, inferInitialState(props))

  if (metadata && metadata.state !== 'inReview') {
    return {
      disabled: true,
      icon: EditIcon,
      label: 'Request changes'
    }
  }

  const onHandle = async () => {
    metadata.setState('changesRequested')
  }

  return {
    disabled: !metadata,
    icon: EditIcon,
    label: 'Request changes',
    onHandle
  }
})
