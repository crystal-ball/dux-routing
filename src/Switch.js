// @ts-check
import React from 'react'
import { arrayOf, func, object, oneOfType, shape, string } from 'prop-types'
import { useSelector } from 'react-redux'

import { getPathname } from './redux'
import { matchRoute } from './utils'

export default function Switch({ pathname, routes, ...rest }) {
  const storePathname = useSelector(getPathname)
  const path = pathname || storePathname

  const matched = routes.find(({ route }) => matchRoute(path, route))

  if (!matched) return null

  const { component: Component, route } = matched
  const matchDetails = matchRoute(path, route)

  return <Component {...matchDetails} {...rest} />
}

Switch.defaultProps = {
  pathname: null,
}

Switch.propTypes = {
  pathname: string,
  routes: arrayOf(
    shape({
      route: string.isRequired,
      component: oneOfType([func, object]).isRequired,
    }),
  ).isRequired,
}
