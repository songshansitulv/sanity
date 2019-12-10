export function inferInitialState(props) {
  if (!props.draft && !props.published) return 'draft'

  if (props.draft) return 'draft'

  return 'published'
}
