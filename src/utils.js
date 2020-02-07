// @ts-check
/**
 * Routing utilities for parsing and generating routing data.
 * @module
 */

import { compile, match } from 'path-to-regexp'

/**
 * Caches hold the routes that have been parsed to regex. These are ok to share
 * across component instances because the same route string can always be
 * matched against the same regex.
 */
const compileRegexRoutesCache = {}
const matchRegexRoutesCache = {}

/**
 * Creates a URI for the passed route using the route params and search params
 * @param {string} route Path pattern that will used as the pathname template, eg `tools/:library`
 * @param {Object} routeParams Route parameter values that will be used for generated pathname
 * @param {Object} searchParams Structured search param values
 * @returns {string}
 */
export function createURI(route, routeParams = {}, searchParams = {}) {
  if (!compileRegexRoutesCache[route]) {
    compileRegexRoutesCache[route] = compile(route, { encode: encodeURIComponent })
  }

  const pathname = compileRegexRoutesCache[route](routeParams)
  const search = stringifySearchParams(searchParams)

  return pathname + search
}

/**
 * Matches the pathname against the route.
 * @param {string} pathname Path that will be matched against, eg `/tools/dux-routing`
 * @param {string} route Path pattern that will be matched with, eg `tools/:library`
 * @returns {?import('./types').MatchDetails} Match details on match or null
 */
export function matchRoute(pathname, route) {
  if (!matchRegexRoutesCache[route]) {
    matchRegexRoutesCache[route] = match(route, { decode: decodeURIComponent })
  }

  const pathMatch = matchRegexRoutesCache[route](pathname)

  return pathMatch ? { params: pathMatch.params, pathname, route } : null
}

/**
 * Parses a search string into a key, value object set.
 * @param {string} search Search string
 * @returns {Object} Structured search params
 */
export function parseSearchParams(search = '') {
  if (typeof URLSearchParams === 'undefined') return {}

  const parsedSearchParams = {}
  const searchParams = new URLSearchParams(search)

  for (const [key, value] of searchParams.entries()) {
    parsedSearchParams[key] = value
  }
  return parsedSearchParams
}

/**
 * Finds and returns the first matched route object with match details
 * @param {string} pathname
 * @param {Array<import('./types').RouteConfig>} routes
 */
export function routeSwitch(pathname, routes) {
  /** @type {import('./types').MatchDetails} */
  let matchDetails

  const matched = routes.find(({ route }) => {
    const match = matchRoute(pathname, route)
    matchDetails = match
    return match
  })

  return matched
    ? {
        ...matched,
        ...matchDetails,
      }
    : null
}

/**
 * Generates a formatted search string from a set of structured search params.
 * @param {Object} params Structured search params data
 * @returns {string} Formatted search string
 */
export function stringifySearchParams(params = {}) {
  if (typeof URLSearchParams === 'undefined') return ''

  const searchParams = new URLSearchParams()

  Object.keys(params).forEach(key => {
    searchParams.set(key, params[key])
  })
  const stringifiedParams = searchParams.toString()
  return stringifiedParams ? `?${stringifiedParams}` : ''
}

/*
 * ℹ️ Misc Notes:
 *
 * - `path-to-regexp` should not be used with search params because they are
 *    not structured data -> pathname matching only
 * - URLSearchParams automatically encodes and decodes all URI components
 */
