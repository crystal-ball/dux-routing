import {
  createURI,
  matchRoute,
  parseSearchParams,
  routeSwitch,
  stringifySearchParams,
} from './utils'

// --- createURI ------------------------------------------

describe('createURI()', () => {
  it('when passed a simple route, then the correct uri is created', () => {
    expect(createURI('/hecka/rad')).toBe('/hecka/rad')
  })

  it('when route params are passed, then the correct uri is created', () => {
    expect(createURI('/rad/:status', { status: 'hecka' })).toBe('/rad/hecka')
  })

  it('when route params are passed, then they are encoded', () => {
    expect(createURI('/rad/:package', { package: '@crystal-ball/webpack-base' })).toBe(
      '/rad/%40crystal-ball%2Fwebpack-base',
    )
  })

  it('when search params are passed, then the correct uri is created', () => {
    expect(
      createURI('/hecka/rad', undefined, {
        '@hecka/rad': '@crystal-ball/webpack-base',
      }),
    ).toBe('/hecka/rad?%40hecka%2Frad=%40crystal-ball%2Fwebpack-base')
  })
})

// --- matchRoute -----------------------------------------

describe('matchRoute()', () => {
  it('when passed a path that matches the route, then match details are returned', () => {
    const params = Object.create(null)
    params.status = 'hecka'

    expect(matchRoute('/rad/hecka', '/rad/:status')).toStrictEqual({
      params,
      pathname: '/rad/hecka',
      route: '/rad/:status',
    })
  })

  it('when params are returned theyre decoded', () => {
    const params = Object.create(null)
    params.status = '@crystal-ball/webpack-base'

    expect(
      matchRoute('/rad/%40crystal-ball%2Fwebpack-base', '/rad/:status'),
    ).toStrictEqual({
      params,
      pathname: '/rad/%40crystal-ball%2Fwebpack-base',
      route: '/rad/:status',
    })
  })

  it('when passed a path that doesnt match the route it returns null', () => {
    expect(matchRoute('/totally/rad', '/rad/:status')).toBeNull()
  })
})

// --- parseSearchParams ----------------------------------

describe('parseSearchParams()', () => {
  it('when search params are passed, theyre decoded', () => {
    expect(parseSearchParams('?hecka=rad')).toStrictEqual({
      hecka: 'rad',
    })
  })

  it('when search params are passed, theyre uri decoded', () => {
    expect(
      parseSearchParams('?%40hecka%2Frad=%40crystal-ball%2Fwebpack-base'),
    ).toStrictEqual({
      '@hecka/rad': '@crystal-ball/webpack-base',
    })
  })

  it('when an empty string is passed, an empty object is returned', () => {
    expect(parseSearchParams('')).toStrictEqual({})
  })

  it('when nothing is passed, an empty object is returned', () => {
    expect(parseSearchParams()).toStrictEqual({})
  })

  it('when URLSearchParams is null, an empty object is returned', () => {
    const { URLSearchParams } = global
    delete global.URLSearchParams

    expect(parseSearchParams('?hecka=rad')).toStrictEqual({})

    global.URLSearchParams = URLSearchParams
  })
})

// --- routeSwitch ----------------------------------------

describe('routeSwitch()', () => {
  it('when called, then it returns the first match', () => {
    const testRoutes = [
      { route: '/hecka/rad', correct: false },
      { route: '/package/dux-routing', correct: true },
      { route: '/src/utils', correct: false },
    ]

    expect(routeSwitch('/package/dux-routing', testRoutes)).toStrictEqual({
      correct: true,
      params: Object.create(null),
      pathname: '/package/dux-routing',
      route: '/package/dux-routing',
    })
  })

  it('when called with a route with params, then the params are parsed', () => {
    const params = Object.create(null)
    params.package = '@crystal-ball/webpack-base'

    expect(
      routeSwitch('/rad/%40crystal-ball%2Fwebpack-base', [
        { route: '/rad/:package', status: 'hecka' },
      ]),
    ).toStrictEqual({
      params,
      pathname: '/rad/%40crystal-ball%2Fwebpack-base',
      route: '/rad/:package',
      status: 'hecka',
    })
  })

  it('when called with no matches, then it returns null', () => {
    const testRoutes = [
      { route: '/hecka/rad', correct: false },
      { route: '/package/dux-routing', correct: false },
      { route: '/src/utils', correct: false },
    ]

    expect(routeSwitch('/app/screen', testRoutes)).toBeNull()
  })
})

// --- stringifySearchParams ------------------------------

describe('stringifySearchParams()', () => {
  it('when search params are passed, theyre encoded', () => {
    expect(stringifySearchParams({ hecka: 'rad' })).toBe('?hecka=rad')
  })

  it('when params are encoded, then theyre uriEncoded', () => {
    expect(stringifySearchParams({ '@hecka/rad': '@crystal-ball/webpack-base' })).toBe(
      '?%40hecka%2Frad=%40crystal-ball%2Fwebpack-base',
    )
  })

  it('when an empty object is passed, an empty string is returned', () => {
    expect(stringifySearchParams({})).toBe('')
  })

  it('when nothing is passed, an empty string is returned', () => {
    expect(stringifySearchParams()).toBe('')
  })

  it('when URLSearchParams is null, an empty string is returned', () => {
    const { URLSearchParams } = global
    delete global.URLSearchParams

    expect(stringifySearchParams({ hecka: 'rad' })).toStrictEqual('')

    global.URLSearchParams = URLSearchParams
  })
})
