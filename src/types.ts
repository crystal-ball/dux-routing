export type PathNameUpdated = 'ROUTING/PATHNAME_UPDATED'

export type MatchDetails = {
  /** Matched route param values by route param id */
  params: { [key: string]: string }
  /** Pathname used in match */
  pathname: string
  /** Route used in match */
  route: string
}

export type RouteConfig = {
  /** Route that pathname is tested against */
  route: string
  [key: string]: string
}

export type RoutingState = {
  /** Value of current application path */
  pathname: string
  /** Structured key value map of current search params */
  searchParams: { [key: string]: string }
}

export type UpdatePathnameOptions = {
  pathname: string
  method?: 'pushState' | 'replaceState'
  resetScroll?: boolean
  searchParams?: { [key: string]: string }
}

export type updatePathname = (
  options: UpdatePathnameOptions,
) => {
  readonly type: PathNameUpdated
  readonly payload: {
    readonly method: 'pushState' | 'replaceState'
    readonly pathname: string
    readonly resetScroll: boolean
    readonly searchParams: {
      readonly [key: string]: string
    }
  }
}
