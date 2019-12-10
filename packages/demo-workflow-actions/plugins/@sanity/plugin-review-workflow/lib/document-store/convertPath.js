import {arrayToJSONMatchPath} from '@sanity/mutator'

const IS_NUMERIC = /^\d+$/

function unquote(str) {
  return str.replace(/^['"]/, '').replace(/['"]$/, '')
}

function splitAttr(segment) {
  const [attr, key] = segment.split('==')
  return {[attr]: unquote(key)}
}

function coerce(segment) {
  return IS_NUMERIC.test(segment) ? Number(segment) : segment
}

function parseGradientPath(focusPathStr) {
  return focusPathStr
    .split(/[[.\]]/g)
    .filter(Boolean)
    .map(seg => (seg.includes('==') ? splitAttr(seg) : coerce(seg)))
}

export function toGradient(formBuilderPath) {
  return arrayToJSONMatchPath(formBuilderPath)
}

export function toFormBuilder(gradientPath) {
  return parseGradientPath(gradientPath)
}
