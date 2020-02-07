import { matchRoute, parseSearchParams, stringifySearchParams } from './utils'

describe('matchRoute()', () => {
  test('when passed a path that matches the route it returns data', () => {
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
})
