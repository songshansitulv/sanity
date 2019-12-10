import {createAction} from 'part:@sanity/base/actions/utils'
import PublishIcon from 'react-icons/lib/md/publish'
import {useMetadata} from '../store'
import {inferInitialState} from './_helpers'
import {useDocumentOperation} from '@sanity/react-hooks'

export const publishAction = createAction(props => {
  const ops = useDocumentOperation(props.id, props.type)
  const metadata = useMetadata(props.id, inferInitialState(props))

  if (props.liveEdit) {
    return {
      disabled: true,
      icon: PublishIcon,
      label: 'Publish'
    }
  }

  if (metadata.state === 'published') {
    return {
      disabled: true,
      icon: PublishIcon,
      label: 'Publish'
    }
  }

  const onHandle = async () => {
    if (ops.publish.disabled) return
    metadata.setState('published')
    await ops.publish.execute()
  }

  return {
    disabled: !metadata,
    icon: PublishIcon,
    label: 'Publish',
    onHandle
  }
})
