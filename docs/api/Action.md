# Action

An Action is a [Subscribable](Subscribable.md) mechanism to functionally represent a mutation to be performed on data. Also provides a [Mutable](Mutable.md) mechanic that is appended into the invocation of the Action.

#### Helpers

- [`createAction(method)`](#helper-createAction)

#### Instance Methods

- [`mutable.get(attribute)`](Mutable.md#get)
- [`mutable.set(attribute, value[, options])`](Mutable.md#set)
- [`mutable.setter(attribute[, options])`](Mutable.md#setter)
- [`mutable.setterHandler(attribute[, options])`](Mutable.md#setterHandler)
- [`mutable.unset([options])`](Mutable.md#unset)
- [`mutable.getErrors(attribute)`](Mutable.md#getErrors)
- [`subscribable.subscribe(event, callback[, context])`](Subscribable.md#subscribe)
- [`subscribable.emit(event[, arg1][, arg2][, ...])`](Subscribable.md#emit)
- [`isPending()`](Action.md#isPending)


## Helper Methods

### <a id='helper-createAction'></a>[`createAction(method)`](#helper-createAction)

Create an Action wrapping the given `method`.

#### Arguments

1. `method` (*Function*): A function to perform the duties of the desired Action.

##### Returns

(*Action*): An Action wrapper around a given function.


## Instance Methods

### <a id='isPending'></a>[`isPending()`](#isPending)

TODO
