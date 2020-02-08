/**
 * @file Redux functions for interacting with routing state
 */

import { parseSearchParams, stringifySearchParams } from './utils'
import { Params } from './types'

// --- Action types ---------------------------------------

export const PATHNAME_UPDATED = 'ROUTING/PATHNAME_UPDATED'

// --- Action creators ------------------------------------

type UpdateMethods = 'pushState' | 'replaceState'
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/**
 * Creates a pathname updated action object
 */
export function updatePathname({
  method = 'pushState',
  pathname,
  resetScroll = true,
  searchParams = {},
}: {
  method?: UpdateMethods
  pathname: string
  resetScroll?: boolean
  searchParams?: Params
}) {
  return {
    type: PATHNAME_UPDATED,
    payload: {
      method,
      pathname,
      resetScroll,
      searchParams,
    },
  } as const
}
/* eslint-enable @typescript-eslint/explicit-function-return-type */

// --- Reducer --------------------------------------------

const initialState = {
  pathname: window?.location?.pathname || '/',
  searchParams: parseSearchParams(window?.location?.search),
}

type State = typeof initialState

/* eslint-disable default-param-last */
export default function reducer(state: State = initialState, action): State {
  if (action.type === PATHNAME_UPDATED) {
    const { pathname, searchParams } = action.payload

    return {
      pathname,
      searchParams,
    }
  }

  if (action.meta?.searchParams) {
    return {
      pathname: state.pathname,
      searchParams: action.meta.searchParams,
    }
  }

  return state
}
/* eslint-enable default-param-last */

// --- Selectors ------------------------------------------

type Store = {
  routing: State
}

export const getPathname = (state: Store): string => state.routing.pathname
export const getSearchParams = (state: Store): Params => state.routing.searchParams
export const getRouting = (state: Store): State => state.routing

// --- Middleware -----------------------------------------

export const routingMiddleware = store => next => (action): void => {
  // Handle updating the url to match pathname changes
  if (action.type === PATHNAME_UPDATED) {
    const { method, pathname, resetScroll, searchParams } = action.payload

    window.history[method](null, '', pathname + stringifySearchParams(searchParams))

    // Match browser default behavior by resetting scroll to top of body
    if (resetScroll) document.body.scrollTop = 0
  }

  // Handle updating the url to match search param changes
  if (action.meta?.searchParams) {
    const { method = 'replaceState', searchParams } = action.meta
    const pathname = getPathname(store.getState())

    window.history[method](null, '', pathname + stringifySearchParams(searchParams))
  }

  next(action)
}

// --- Event listeners ------------------------------------

export const routingListeners = (store): void => {
  window.addEventListener('popstate', () => {
    store.dispatch(
      updatePathname({
        pathname: window.location.pathname,
        searchParams: parseSearchParams(window.location.search),
      }),
    )
  })
}
