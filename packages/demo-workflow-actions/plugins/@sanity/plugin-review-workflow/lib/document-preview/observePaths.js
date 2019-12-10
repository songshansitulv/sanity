import {observeFields} from './observeFields'
import {createPathObserver} from './createPathObserver'

export const observePaths = createPathObserver(observeFields)
