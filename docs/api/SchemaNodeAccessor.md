# SchemaNodeAccessor

A schema node accessor represents a given node in the master schema.


#### Helpers

- [`createCollection(path, store[, options])`](#helper-createCollection.md)
- [`createResource(path, store[, options])`](#helper-createResource.md)
- [`createNamespace(path[, options])`](#helper-createNamespace.md)

#### Instance Methods

- [`inspect([result])`](#static-inspect)
- [`addLeaf(identifier, leaf)`](#static-addLeaf)
- [`addDetachedLeaf(identifier, leaf)`](#static-addDetachedLeaf)


## Helper Methods

### <a id='helper-createCollection'></a>[`createCollection(path, store[, options])`](#helper-createCollection)

Create a `SchemaNodeAccessor` describing a collection resource (`/collection/:collectionId`)

---

### <a id='helper-createResource'></a>[`createResource(path, store[, options])`](#helper-createResource)

Create a `SchemaNodeAccessor` describing a single resource (`/resource`)

---

### <a id='helper-createNamespace'></a>[`createNamespace(path[, options])`](#helper-createNamespace)

Create a `SchemaNodeAccessor` describing a namespace (`/namespace`)


## Instance Methods

### <a id='static-inspect'></a>[`inspect([result])`](#static-inspect)

TODO

---

### <a id='static-addLeaf'></a>[`addLeaf([identifier, ]leaf)`](#static-addLeaf)

Add a `leaf` with an optional `identifier` to the `SchemaNode` represented by this `SchemaNodeAccessor`.

---

### <a id='static-addDetachedLeaf'></a>[`addDetachedLeaf(identifier, leaf)`](#static-addDetachedLeaf)

Add a `leaf` with an optional `identifier` to the `SchemaNode` represented by this `SchemaNodeAccessor` that will only leaf on nodes matching the stack depth of this `SchemaNodeAccessor`.
