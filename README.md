<div align="right">
  <h1 align="right">
    <img height=75 src="./docs/assets/readme-header.png" alt="webpack base">
  </h1>

  <!-- prettier-ignore-start -->
  <a href="https://www.npmjs.com/package/dux-routing">
    <img src="https://img.shields.io/npm/v/dux-routing" alt="Package version" valign="text-top"/>
  </a>
  <a href="https://www.npmjs.com/package/dux-routing">
    <img src="https://img.shields.io/npm/dt/dux-routing?color=blue" alt="NPM downloads" valign="text-top" />
  </a>
  <a href="https://github.com/crystal-ball/dux-routing/actions?workflow=CI%2FCD">
    <img src="https://github.com/crystal-ball/dux-routing/workflows/CI%2FCD/badge.svg" alt="Build status" valign="text-top" />
  </a>
  <a href="https://snyk.io/test/github/crystal-ball/dux-routing?targetFile=package.json">
    <img src="https://snyk.io/test/github/crystal-ball/dux-routing/badge.svg?targetFile=package.json" alt="Known vulnerabilities" valign="text-top" />
  </a>
  <a href="https://codeclimate.com/github/crystal-ball/dux-routing/test_coverage">
    <img src="https://api.codeclimate.com/v1/badges/6f40e5241a9d560c57e1/test_coverage" alt="Test coverage" valign="text-top" />
  </a>
  <a href="https://codeclimate.com/github/crystal-ball/dux-routing/maintainability">
    <img src="https://api.codeclimate.com/v1/badges/6f40e5241a9d560c57e1/maintainability" alt="Maintainability" valign="text-top" />
  </a>
  <code>:status&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</code>

  <br />
  <a href="https://renovatebot.com/">
    <img src="https://img.shields.io/badge/Renovate-enabled-32c3c2.svg" alt="Renovate" valign="text-top" />
  </a>
  <a href="https://commitizen.github.io/cz-cli/">
    <img src="https://img.shields.io/badge/Commitizen-%E2%9C%93%20friendly-10e67b" alt="Commitizen friendly" valign="text-top" />
  </a>
  <a href="https://github.com/crystal-ball/dux-routing#workspaces/-projects-5b88b5c9af3c0a2186966767/board?repos=237475703">
    <img src="https://img.shields.io/badge/ZenHub-managed-5e60ba.svg" alt="ZenHub" valign="text-top" />
  </a>
  <a href="https://semantic-release.gitbook.io/semantic-release/">
    <img src="https://img.shields.io/badge/%F0%9F%93%A6%F0%9F%9A%80-semantic_release-e10079.svg" alt="Semantic Release" valign="text-top"/>
  </a>
  <a href="./CODE_OF_CONDUCT.md">
    <img src="https://img.shields.io/badge/Contributor%20Covenant-v2.0-de8cf2.svg" alt="Contributor Covenant" valign="text-top" />
  </a>
  <code>:integrations</code>

  <br />
  <a href="https://github.com/crystal-ball">
    <img src="https://img.shields.io/badge/%F0%9F%94%AE%E2%9C%A8-contains_magic-D831D7.svg" alt="Contains magic" valign="text-top" />
  </a>
  <a href="https://github.com/crystal-ball/crystal-ball.github.io">
    <img src="https://img.shields.io/badge/%F0%9F%92%96%F0%9F%8C%88-full_of_love-F5499E.svg" alt="Full of love" valign="text-top" />
  </a>
  <code>:flair&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</code>
  <!-- prettier-ignore-end -->
</div>

- [Setup](#setup)
- [Library conventions](#library-conventions)
- [API](#api)
- [Components](#components)

---

## Setup

Setup requires adding 3 handlers to your store setup: a reducer, a middleware,
and a set of event listeners.

```javascript
import { combineReducers } from 'redux'
import {
  reducer as routing,
  routingMiddleware,
  setupRoutingListeners,
} from 'dux-routing'

const rootReducer = combineReducers({
  // 1. Add routing reducer
  routing,
})

const store = configureStore({
  reducer: rootReducer,
  // 2. Add routing middleware
  middleware: [routingMiddleware],
})

// 3. Setup routing listeners
setupRoutingListeners(store)
```

1. The routing reducer exposes the current routing state of your application
2. The routing middleware watches for actions with routing changes and manages
   updating the url to match.
3. The routing listeners will dispatch events to the store when users navigate
   using browser back and forward buttons

## Library conventions

_Dux Routing follows these conventions to try and simplify your routing
management 😃_

### Pathname changes and Search changes

Dux Routing distinguishes between two types of routing events: _pathname_
changes and _search_ changes.

#### Pathname changes

Pathname changes (usually) represent a route change in an application, and often
cause screen changes or data fetching. Typically other slices in your store need
to know about these route updates, so pathname changes are handled as primary
changes that should have high visibility.

By dispatching a `ROUTING/PATHNAME_CHANGED` action, Dux Routing makes it easy
for other reducers in your application respond to pathname changes, eg by
setting selected ids, clearing data caches, etc.

#### Search changes

Search changes (usually) represent a change in the state of a screen that needs
to be persisted across reloads or url sharing. These updates are often side
effects of some primary application action, so search changes are handled as
secondary meta details that can be included by any action in your application.

By watching for a `meta.searchParams` field in any application action, Dux
Routing makes it easy for you to include search param changes as a secondary
effect of an application action. For example, if an application had a search
feature with filters that were set in the store, and reflected in the URL, the
application could dispatch an action like this:

```javascript
selectSearchFilter({
  type: 'APPLICATION/SEARCH_FILTER_SELECTED',
  payload: {
    filter: 'rad',
  },
  meta: { searchParams: { filter: 'rad' } },
})
// => This would update the current location.search string to `?filter=rad`,
//    as well as the routing reducer state.
```

This makes it easy to application state synced to the URL, without having to
dispatch additional actions just for search param changes.

### Naming conventions

- _Route_ - A regex path representation for an application route, eg
  `'/rad/:userId'`
- _Path_ - A value of the `location.pathname`, eg `/rad/dhedgecock'`
- _Path params_ - Params matched from the `pathname` string, eg
  `{ userId: 'dhedgecock' }`
- _Search_ - The value of the `location.search`, eg `'?radness=hecka`
- _Search params_ - Params parsed from the `search` string, eg
  `{ radness: 'hecka' }`

## API

_Use the provided action creators and selectors to interact with your
application routing state._

### Selectors

#### `getRouting`

```javascript
useSelector(getRouting) // => { pathname: String, searchParams: Object }
```

Returns the entire routing reducer

#### `getPathname`

```javascript
useSelector(getPathname) // => String
```

Returns the `pathname`

#### `getSearchParams`

```javascript
useSelector(getSearchParams) // => { [key]: value }
```

Returns the `searchParams` object

### Actions

#### `changePathname`

Action creator for dispatching actions that will replace the current pathname
and search params with a `ROUTING/PATHNAME_CHANGED` action type.

```javascript
changePathname({ pathname, params, method })
// => This will update the current location.pathname
```

| Option     | Description                                                                  |
| ---------- | ---------------------------------------------------------------------------- |
| `method`   | Default of `pushState`, pass `replaceState` to skip creating a history entry |
| `params`   | Key value object mapping of the new search params                            |
| `pathname` | String value of the new pathname                                             |

#### `meta.searchParams`

Include a `meta` object with a `searchParams` field in any action to replace the
current `location.search` string with a new set of search params.

```javascript
selectSearchFilter({
  filter: 'rad',
  meta: { searchParams: { search: 'rad' } },
})
// => This will update the current location.search to ?search=rad
```

## Components

#### `<Switch />

The Switch component will render the first route it matches against the

| Prop       | Description     |
| ---------- | --------------- |
| `pathname` | Optional string |
| `routes`   | Array           |

## Roadmap

- Link href creation and SEO recommendations
- API for adding/removing params (vs default of replacing params with new
  params)
