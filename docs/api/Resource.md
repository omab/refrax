# Resource

A resource is a [`Subscribable`](Subscribable.md) that represents a collection or item through a data point on the server.

#### Static Methods

- [`from(accessor[, arg1][, arg2][, ...])`](#resource-from)

#### Instance Methods

- [`subscribable.subscribe(event, callback[, context])`](Subscribable.md#subscribe)
- [`subscribable.emit(event[, arg1][, arg2][, ...])`](Subscribable.md#emit)
- [`invalidate([options])`](#invalidate)
- [`isLoading()`](#isLoading)
- [`isUpdating()`](#isUpdating)
- [`hasData()`](#hasData)
- [`isStale()`](#isStale)

## Static Methods

### <a id='resource-from'></a>[`from(accessor[, arg1][, arg2][, ...])`](#resource-from)

Alias for `new Resource(accessor[, arg1][, arg2][, ...])`.

#### Arguments

1. `accessor` (*SchemaNodeAccessor*): A SchemaNodeAccessor that describes where this data can be accessed from.
2. `[argN]` (*Any*): Additional arguments to pass to the constructor that will be processed into the resources stack.

##### Returns

(*Resource*): A Resource instance.


## Instance Methods

### <a id='invalidate'></a>[`invalidate()`](#invalidate)

Invoke the [`store.invalidate([options])`](Store.md#invalidate) linked to this resource and mark all cache as stale.

---

### <a id='isLoading'></a>[`isLoading()`](#isLoading)

TODO

---

### <a id='isUpdating'></a>[`isUpdating()`](#isUpdating)

TODO

---

### <a id='hasData'></a>[`hasData()`](#hasData)

TODO

---

### <a id='isStale'></a>[`isStale()`](#isStale)

TODO
