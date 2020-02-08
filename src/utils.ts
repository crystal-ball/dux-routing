/**
 * @file Routing utilities for parsing and generating routing data.
 */

import { compile, match } from 'path-to-regexp'
import { Params } from './types'

export type MatchDetails = {
  /** Matched route param values by route param id */
  params: Params
  /** Pathname used in match */
  pathname: string
  /** Route used in match */
  route: string
  [key: string]: any // eslint-disable-line
}

export type RouteConfig = {
  /** Route that pathname is tested against */
  route: string
  [key: string]: any // eslint-disable-line
}

// --- Search params --------------------------------------

/**
 * Generates a formatted search string from a set of structured search params.
 */
export function stringifySearchParams(params: Params = {}): string {
  if (typeof URLSearchParams === 'undefined') return ''

  const searchParams = new URLSearchParams()

  Object.keys(params).forEach(key => {
    searchParams.set(key, params[key])
  })
  const stringifiedParams = searchParams.toString()
  return stringifiedParams ? `?${stringifiedParams}` : ''
}

/**
 * Parses a search string into a key, value object set.
 */
export function parseSearchParams(search = ''): Params {
  if (typeof URLSearchParams === 'undefined') return {}

  const parsedSearchParams = {}
  const searchParams = new URLSearchParams(search)

  for (const [key, value] of searchParams.entries()) {
    parsedSearchParams[key] = value
  }
  return parsedSearchParams
}

// --- URIs -----------------------------------------------

/**
 * Caches hold the routes that have been parsed to regex. These are ok to share
 * across component instances because the same route string can always be
 * matched against the same regex.
 */
const compileRegexRoutesCache = {}
const matchRegexRoutesCache = {}

/**
 * Creates a URI for the passed route using the route params and search params
 */
export function createURI(
  route: string,
  routeParams: Params = {},
  searchParams: Params = {},
): string {
  if (!compileRegexRoutesCache[route]) {
    compileRegexRoutesCache[route] = compile(route, { encode: encodeURIComponent })
  }

  const pathname = compileRegexRoutesCache[route](routeParams)
  const search = stringifySearchParams(searchParams)

  return pathname + search
}

// --- Routes ---------------------------------------------

/**
 * Matches the pathname against the route.
 * @param pathname Path that will be matched against, eg `/tools/dux-routing`
 * @param route Path pattern that will be matched with, eg `tools/:library`
 */
export function matchRoute(pathname: string, route: string): MatchDetails {
  if (!matchRegexRoutesCache[route]) {
    matchRegexRoutesCache[route] = match(route, { decode: decodeURIComponent })
  }

  const pathMatch = matchRegexRoutesCache[route](pathname)

  return pathMatch ? { params: pathMatch.params, pathname, route } : null
}

/**
 * Finds and returns the first matched route object with match details
 */
export function routeSwitch(
  pathname: string,
  routes: RouteConfig[],
): MatchDetails | null {
  let matchDetails: MatchDetails

  const matchedRoute = routes.find(({ route }) => {
    const matched = matchRoute(pathname, route)
    if (matched) matchDetails = matched
    return matched
  })

  return matchedRoute
    ? {
        ...matchedRoute,
        ...matchDetails,
      }
    : null
}

/*
 * ℹ️ Misc Notes:
 *
 * - `path-to-regexp` should not be used with search params because they are
 *    not structured data -> pathname matching only
 * - URLSearchParams automatically encodes and decodes all URI components
 */
