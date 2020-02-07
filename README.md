# Dux Routing

- [Setup](#setup)
- [Library conventions](#library-conventions)
- [API](#api)
- [Components](#components)

---

## Setup

**1. Include the routing reducer in your root reducer.**

_(The routing reducer exposes the current routing state of your application)_

```javascript
import { combineReducers } from 'redux'
import { routingReducer as routing } from 'dux-routing'

const rootReducer = combineReducers({
  // ... reducers
  routing,
  // ... more reducers
})
```

**2. Include the routing middleware in your store setup.**

_(The routing middleware watches for actions with routing changes and manages
updating the url to match)_

```javascript
import { routingMiddleware } from 'dux-routing'

const store = configureStore({
  reducer: rootReducer,
  middleware: [routingMiddleware],
})
```

**3. Setup event listeners for browser navigation events.**

_(The routing ßlisteners will dispatch events to the store when users navigate
using browser back and forward buttons)_

```javascript
import { routingListeners } from 'dux-routing'

routingListeners(store)
```

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
