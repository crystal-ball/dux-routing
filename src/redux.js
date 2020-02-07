// @ts-check
import { parseSearchParams, stringifySearchParams } from './utils'

// --- Action types ---------------------------------------

export const PATHNAME_UPDATED = 'ROUTING/PATHNAME_UPDATED'

// --- Action creators ------------------------------------

export function updatePathname({
  method = 'pushState',
  pathname,
  resetScroll = true,
  searchParams = {},
}) {
  return {
    type: PATHNAME_UPDATED,
    payload: {
      method,
      pathname,
      resetScroll,
      searchParams,
    },
  }
}

// --- Reducer --------------------------------------------

const initialState = {
  /** The value of the application location.pathname */
  pathname: window?.location?.pathname || '/',
  /** Structured key value map of current search params */
  searchParams: parseSearchParams(window?.location?.search),
}

/* eslint-disable default-param-last */
export default function reducer(state = initialState, action) {
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
/* eslint-disable default-param-last */

// --- Selectors ------------------------------------------

export const getPathname = state => state.routing.pathname
export const getSearchParams = state => state.routing.searchParams
export const getRouting = state => state.routing

// --- Middleware -----------------------------------------

export const routingMiddleware = store => next => action => {
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

export const routingListeners = store => {
  window.addEventListener('popstate', () => {
    store.dispatch(
      updatePathname({
        pathname: window.location.pathname,
        searchParams: parseSearchParams(window.location.search),
      }),
    )
  })
}
