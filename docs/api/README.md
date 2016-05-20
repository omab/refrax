# API Reference

This section documents the complete Refrax API.

### Top-Level Exports

* [Config](Config.md)
* [MutableResource](MutableResource.md)
* [Resource](Resource.md)
* [Schema (SchemaNodeAccessor)](SchemaNodeAccessor.md)
* [Store](Store.md)
* [Tools](Tools.md)
* [createAction(method)](Action.md#helper-createAction)
* [createCollection(path, store[, options])](SchemaNodeAccessor.md#helper-createCollection)
* [createResource(path, store[, options])](SchemaNodeAccessor.md#helper-createResource)
* [createNamespace(path[, options])](SchemaNodeAccessor.md#helper-createNamespace)
* [processResponse()](processResponse.md)

### Addons

* [React](React.md)

### SchemaNodeAccessor API

* [SchemaNodeAccessor](SchemaNodeAccessor.md)
  * [inspect()](SchemaNodeAccessor.md#inspect)
  * [addLeaf([identifier, ]leaf)](SchemaNodeAccessor.md#addLeaf)
  * [addDetachedLeaf()](SchemaNodeAccessor.md#addDetachedLeaf)

### Action API

* [Action](Action.md)
  * [mutable.get(attribute)](Mutable.md#get)
  * [mutable.set(attribute, value)](Mutable.md#set)
  * [mutable.setter(attribute)](Mutable.md#setter)
  * [mutable.setterHandler(attribute)](Mutable.md#setterHandler)
  * [mutable.unset()](Mutable.md#unset)
  * [mutable.getErrors(attribute)](Mutable.md#getErrors)
  * [subscribable.subscribe(event, callback[, context])](Subscribable.md#subscribe)
  * [subscribable.emit(event[, arg1][, arg2][, ...])](Subscribable.md#emit)
  * [isPending()](Action.md#isPending)
