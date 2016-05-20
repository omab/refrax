# Subscribable

A subscribable is similar to an `EventEmitter` pattern except that it offers a subscribe method that provides a `disposer` to self-remove the subscription.

#### Instance Methods

- [`subscribe(event, callback[, context])`](#subscribe)
- [`emit(event[, arg1][, arg2][, ...])`](#emit)


## Instance Methods

### <a id='subscribe'></a>[`subscribe(event, callback, [context])`](#subscribe)

Adds the listener function to the end of the listeners array for the given event name. No checks are made to see if the listener has already been added. Multiple calls passing the same combination of eventName and listener will result in the listener being added, and called, multiple times

#### Arguments

1. `event` (*String*): The name of the event.
2. `callback` (*Function*): The callback function.
3. `[context]` (*Any*): The context (`this`) that will be applied to the callback function.

##### Returns

(*Function*): A disposer method; which when invoked, will remove itself from the subscribable.

---

### <a id='emit'></a>[`emit(event[, arg1][, arg2][, ...])`](#emit)

Synchronously calls each of the listeners registered for the event named eventName, in the order they were registered, passing the supplied arguments to each.

#### Arguments

1. `event` (*String*): The name of the event.
2. `argN` (*Any*): Any arguments to be passed along to the invocation of any listening callbacks.
