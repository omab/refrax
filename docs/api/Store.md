# Store

A Store is a [`Subscribable`](Subscribable.md) that holds a cached state of data and all its different representations for a unique `type`.

#### Static Methods

- [`get([type])`](#static-get)
- [`reset()`](#static-reset)

#### Instance Methods

- [`subscribable.subscribe(event, callback[, context])`](Subscribable.md#subscribe)
- [`subscribable.emit(event[, arg1][, arg2][, ...])`](Subscribable.md#emit)
- [`invalidate([options])`](#invalidate)
- [`reset()`](#reset)


## Static Methods

### <a id='static-get'></a>[`get([type])`](#static-get)

Find or create a `Store` instance for a given type and return it.

#### Arguments

1. `[type]` (*String*): An optional name identifying the type name this Store will contain. **NOTE:** type names are unique and two or more Stores cannot share the same type name.

##### Returns

(*Store*): A Store instance.

---

### <a id='static-reset'></a>[`reset()`](#static-reset)

Reset cache for all defined Stores.


## Instance Methods

### <a id='invalidate'></a>[`invalidate([options])`](#invalidate)

Mark all cache as stale for this Store.

#### Arguments

1. `[options]` (*Object*): An optional options object.
  - `noQueries` (*Boolean*): When (`true`) will not mark queries as stale.
  - `noFragments` (*Boolean*): When (`true`) will not mark fragments as stale.
  - `notify` (*Boolean*): When (`true`) will cause the Store to emit a change event.

---

### <a id='reset'></a>[`reset()`](#reset)

Reset cache for this Store.
