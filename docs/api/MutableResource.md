# MutableResource

A mutable resource is a [`Subscribable`](Subscribable.md) that represents a collection or item through a data point on the server that can be `REST`fully acted upon.

#### Static Methods

- [`from(accessor[, arg1][, arg2][, ...])`](#static-from)

#### Instance Methods

- [`subscribable.subscribe(event, callback[, context])`](Subscribable.md#subscribe)
- [`subscribable.emit(event[, arg1][, arg2][, ...])`](Subscribable.md#emit)
- [`create([params])`](#create)
- [`destroy([params])`](#destroy)
- [`update([params])`](#update)


## Static Methods

### <a id='static-from'></a>[`from(accessor[, arg1][, arg2][, ...])`](#static-from)

Alias for `new MutableResource(accessor[, arg1][, arg2][, ...])`.

#### Arguments

1. `accessor` (*SchemaNodeAccessor*): A SchemaNodeAccessor that describes where this data can be accessed from.
2. `[argN]` (*Any*): Additional arguments to pass to the constructor that will be processed into the resources stack.

##### Returns

(*MutableResource*): A MutableResource instance.


## Instance Methods

### <a id='create'></a>[`create([params])`](#create)

TODO

##### Returns

(*Promise*): A promise object representing the request to mutate the resource.

---

### <a id='destroy'></a>[`destroy([params])`](#destroy)

TODO

##### Returns

(*Promise*): A promise object representing the request to mutate the resource.

---

### <a id='update'></a>[`update([params])`](#update)

TODO

##### Returns

(*Promise*): A promise object representing the request to mutate the resource.
