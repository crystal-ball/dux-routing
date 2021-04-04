import {
  PATHNAME_UPDATED,
  getPathname,
  getRouting,
  getSearchParams,
  reducer,
  updatePathname,
} from './redux'

function createMockState() {
  return {
    pathname: '/rad/hecka',
    searchParams: {
      package: '@crystal-ball/webpack-base',
    },
  }
}

describe('getPathname()', () => {
  it('when called, then getPathname returns the state pathname', () => {
    expect(getPathname({ routing: createMockState() })).toBe('/rad/hecka')
  })
})

describe('getSearchParams()', () => {
  it('when called, then getSearchParams returns the state pathname', () => {
    expect(getSearchParams({ routing: createMockState() })).toStrictEqual({
      package: '@crystal-ball/webpack-base',
    })
  })
})

describe('getRouting()', () => {
  it('when called, then getRouting returns the state pathname', () => {
    expect(getRouting({ routing: createMockState() })).toStrictEqual({
      pathname: '/rad/hecka',
      searchParams: {
        package: '@crystal-ball/webpack-base',
      },
    })
  })
})

describe('reducer', () => {
  it('when passed a pathname action, then the reducer updates the pathname', () => {
    expect(
      reducer(createMockState(), {
        type: PATHNAME_UPDATED,
        payload: { pathname: 'new/path', searchParams: { status: 'rad ' } },
      }),
    ).toStrictEqual({
      pathname: 'new/path',
      searchParams: { status: 'rad ' },
    })
  })

  it('when passed an action with meta search params, then the reducer updates the search params', () => {
    expect(
      reducer(createMockState(), {
        type: 'APP/NOT_REDUX',
        meta: { searchParams: { status: 'rad ' } },
      }),
    ).toStrictEqual({
      pathname: '/rad/hecka',
      searchParams: { status: 'rad ' },
    })
  })

  it('when passed a different action, then the state is returned', () => {
    const state = createMockState()

    expect(reducer(state, { type: 'APP/NOT_REDUX' })).toStrictEqual(state)
  })
})

describe('updatePathname()', () => {
  it('when called, then it returns an action', () => {
    expect(
      updatePathname({
        method: 'pushState',
        pathname: '/hecka/rad',
        resetScroll: false,
        searchParams: {},
      }),
    ).toStrictEqual({
      type: PATHNAME_UPDATED,
      payload: {
        method: 'pushState',
        pathname: '/hecka/rad',
        resetScroll: false,
        searchParams: {},
      },
    })
  })

  it('when called with a pathname, then defaults are included in action', () => {
    expect(
      updatePathname({
        pathname: '/hecka/rad',
      }),
    ).toStrictEqual({
      type: PATHNAME_UPDATED,
      payload: {
        method: 'pushState',
        pathname: '/hecka/rad',
        resetScroll: true,
        searchParams: {},
      },
    })
  })
})
