import React from 'react'
import PluginIcon from 'part:@sanity/base/plugin-icon'
import {Board} from '../components/board'
import {RouterProvider} from '../lib/router'

function Root(props) {
  return (
    <RouterProvider>
      <Board {...props} />
    </RouterProvider>
  )
}

export default {
  icon: PluginIcon,
  name: 'workflow',
  title: 'Workflow',
  component: Root
}
