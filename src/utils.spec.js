import {
  createURI,
  matchRoute,
  parseSearchParams,
  routeSwitch,
  stringifySearchParams,
} from './utils'

describe('createURI()', () => {
  test('when passed a simple route, then the correct uri is created', () => {
    expect(createURI('/hecka/rad')).toBe('/hecka/rad')
  })

  test('when route params are passed, then the correct uri is created', () => {
    expect(createURI('/rad/:status', { status: 'hecka' })).toBe('/rad/hecka')
  })

  test('when route params are passed, then they are encoded', () => {
    expect(createURI('/rad/:package', { package: '@crystal-ball/webpack-base' })).toBe(
      '/rad/%40crystal-ball%2Fwebpack-base',
    )
  })

  test('when search params are passed, then the correct uri is created', () => {
    expect(
      createURI('/hecka/rad', null, {
        '@hecka/rad': '@crystal-ball/webpack-base',
      }),
    ).toBe('/hecka/rad?%40hecka%2Frad=%40crystal-ball%2Fwebpack-base')
  })
})

describe('matchRoute()', () => {
  test('when passed a path that matches the route, then match details are returned', () => {
    expect(matchRoute('/rad/hecka', '/rad/:status')).toEqual({
      params: { status: 'hecka' },
      pathname: '/rad/hecka',
      route: '/rad/:status',
    })
  })

  test('when params are returned theyre decoded', () => {
    expect(matchRoute('/rad/%40crystal-ball%2Fwebpack-base', '/rad/:status')).toEqual({
      params: { status: '@crystal-ball/webpack-base' },
      pathname: '/rad/%40crystal-ball%2Fwebpack-base',
      route: '/rad/:status',
    })
  })

  test('when passed a path that doesnt match the route it returns null', () => {
    expect(matchRoute('/totally/rad', '/rad/:status')).toBe(null)
  })
})

describe('parseSearchParams()', () => {
  test('when search params are passed, theyre decoded', () => {
    expect(parseSearchParams('?hecka=rad')).toEqual({
      hecka: 'rad',
    })
  })

  test('when search params are passed, theyre uri decoded', () => {
    expect(parseSearchParams('?%40hecka%2Frad=%40crystal-ball%2Fwebpack-base')).toEqual({
      '@hecka/rad': '@crystal-ball/webpack-base',
    })
  })

  test('when an empty string is passed, an empty object is returned', () => {
    expect(parseSearchParams('')).toEqual({})
  })

  test('when nothing is passed, an empty object is returned', () => {
    expect(parseSearchParams()).toEqual({})
  })

  test('when URLSearchParams is null, an empty object is returned', () => {
    const { URLSearchParams } = global
    delete global.URLSearchParams
    expect(parseSearchParams('?hecka=rad')).toEqual({})
    global.URLSearchParams = URLSearchParams
  })
})

describe('routeSwitch()', () => {
  test('when called, then it returns the first match', () => {
    const testRoutes = [
      { route: '/hecka/rad', correct: false },
      { route: '/package/dux-routing', correct: true },
      { route: '/src/utils', correct: false },
    ]

    expect(routeSwitch('/package/dux-routing', testRoutes)).toEqual({
      correct: true,
      params: {},
      pathname: '/package/dux-routing',
      route: '/package/dux-routing',
    })
  })

  test('when called with a route with params, then the params are parsed', () => {
    expect(
      routeSwitch('/rad/%40crystal-ball%2Fwebpack-base', [
        { route: '/rad/:package', status: 'hecka' },
      ]),
    ).toEqual({
      params: { package: '@crystal-ball/webpack-base' },
      pathname: '/rad/%40crystal-ball%2Fwebpack-base',
      route: '/rad/:package',
      status: 'hecka',
    })
  })

  test('when called with no matches, then it returns null', () => {
    const testRoutes = [
      { route: '/hecka/rad', correct: false },
      { route: '/package/dux-routing', correct: false },
      { route: '/src/utils', correct: false },
    ]

    expect(routeSwitch('/app/screen', testRoutes)).toBe(null)
  })
})

describe('stringifySearchParams()', () => {
  test('when search params are passed, theyre encoded', () => {
    expect(stringifySearchParams({ hecka: 'rad' })).toBe('?hecka=rad')
  })

  test('when params are encoded, then theyre uriEncoded', () => {
    expect(stringifySearchParams({ '@hecka/rad': '@crystal-ball/webpack-base' })).toBe(
      '?%40hecka%2Frad=%40crystal-ball%2Fwebpack-base',
    )
  })

  test('when an empty object is passed, an empty string is returned', () => {
    expect(stringifySearchParams({})).toBe('')
  })

  test('when nothing is passed, an empty string is returned', () => {
    expect(stringifySearchParams()).toBe('')
  })

  test('when URLSearchParams is null, an empty string is returned', () => {
    const { URLSearchParams } = global
    delete global.URLSearchParams
    expect(stringifySearchParams({ hecka: 'rad' })).toEqual('')
    global.URLSearchParams = URLSearchParams
  })
})
