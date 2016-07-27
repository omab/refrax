# API Reference

This section documents the complete Refrax API.

### Top-Level Exports

* [Config](Config.md)
* [MutableResource](MutableResource.md)
* [Resource](Resource.md)
* [Schema (SchemaNodeAccessor)](SchemaNodeAccessor.md)
* [Store](Store.md)
* [Tools](Tools.md)
* [`createAction(method)`](Action.md#helper-createAction)
* [`createSchemaCollection(path[, store][, options])`](SchemaNodeAccessor.md#helper-createSchemaCollection)
* [`createSchemaResource(path[, store][, options])`](SchemaNodeAccessor.md#helper-createSchemaResource)
* [`createSchemaNamespace(path[, options])`](SchemaNodeAccessor.md#helper-createSchemaNamespace)
* [`processResponse()`](processResponse.md)

### Addons

* [React](React.md)

### SchemaNodeAccessor API

* [SchemaNodeAccessor](SchemaNodeAccessor.md)
  * [`inspect()`](SchemaNodeAccessor.md#inspect)
  * [`addLeaf([identifier, ]leaf)`](SchemaNodeAccessor.md#addLeaf)
  * [`addDetachedLeaf()`](SchemaNodeAccessor.md#addDetachedLeaf)

### Action API

* [Action](Action.md)
  * [`mutable.get(attribute)`](Mutable.md#get)
  * [`mutable.set(attribute, value[, options])`](Mutable.md#set)
  * [`mutable.setter(attribute[, options])`](Mutable.md#setter)
  * [`mutable.setterHandler(attribute[, options])`](Mutable.md#setterHandler)
  * [`mutable.unset([options])`](Mutable.md#unset)
  * [`mutable.getErrors(attribute)`](Mutable.md#getErrors)
  * [`subscribable.subscribe(event, callback[, context])`](Subscribable.md#subscribe)
  * [`subscribable.emit(event[, arg1][, arg2][, ...])`](Subscribable.md#emit)
  * [`isPending()`](Action.md#isPending)
