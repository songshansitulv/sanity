import {useEffect, useRef} from 'react'

export default function ClickOutside({children, onClickOutside}) {
  const ref = useRef()

  useEffect(() => {
    const handleWindowClick = evt => {
      if (!ref.current) {
        return
      }

      let target = evt.target

      while (target) {
        if (target === ref.current) {
          return
        }

        target = target.parentNode
      }

      onClickOutside(evt)
    }

    window.addEventListener('click', handleWindowClick)

    return () => {
      window.removeEventListener('click', handleWindowClick)
    }
  }, [onClickOutside])

  return children({ref})
}
