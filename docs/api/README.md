# API Reference

This section documents the complete Refrax API.

### Top-Level Exports

* [Config](Config.md)
* [MutableResource](MutableResource.md)
* [Resource](Resource.md)
* [Schema (SchemaNodeAccessor)](Schema.md)
* [Store](Store.md)
* [Tools](Tools.md)
* [createAction()](createAction.md)
* [createCollection()](createCollection.md)
* [createResource()](createResource.md)
* [createNamespace()](createNamespace.md)
* [processResponse()](processResponse.md)

### SchemaNodeAccessor API

* [Schema](Schema.md)
  * [inspect](Schema.md#inspect)
  * [addLeaf](Schema.md#addLeaf)
  * [addDetachedLeaf](Schema.md#addDetachedLeaf)

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
