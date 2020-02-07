// @ts-check
/**
 * Routing utilities for parsing and generating routing data.
 * @module
 */

import { match } from 'path-to-regexp'

/**
 * Cache holds the paths that have been parsed to regex. This is ok to share
 * across component instances because the same path string can always be
 * matched against the same regex.
 */
const regexRoutesCache = {}

/**
 * Parses a search string into a key, value object set.
 * @param {string} search Search string
 * @returns {Object} Structured search params
 */
export function parseSearchParams(search = '') {
  if (!URLSearchParams) return {}

  const parsedSearchParams = {}
  const searchParams = new URLSearchParams(search)

  for (const [key, value] of searchParams.entries()) {
    parsedSearchParams[key] = value
  }
  return parsedSearchParams
}

/**
 * Generates a formatted search string from a set of structured search params.
 * @param {Object} params Structured search params data
 * @returns {string} Formatted search string
 */
export function stringifySearchParams(params = {}) {
  if (!URLSearchParams) return ''
  const searchParams = new URLSearchParams()

  Object.keys(params).forEach(key => {
    searchParams.set(key, params[key])
  })
  const stringifiedParams = searchParams.toString()
  return stringifiedParams ? `?${stringifiedParams}` : ''
}

/**
 * Matches the pathname against the route.
 * @param {string} pathname Path that will be matched against, eg `/tools/dux-routing`
 * @param {string} route Path pattern that will be matched with, eg `tools/:library`
 * @returns {Object|null} Match details on match or null
 */
export function matchRoute(pathname, route) {
  if (!regexRoutesCache[route]) {
    regexRoutesCache[route] = match(route, { decode: decodeURIComponent })
  }

  const pathMatch = regexRoutesCache[route](pathname)

  return pathMatch ? { params: pathMatch.params, pathname, route } : null
}

/*
 * ℹ️ Misc Notes:
 *
 * - `path-to-regexp` should not be used with search params because they are
 *    not structured data -> pathname matching only
 */
