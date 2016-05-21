# SchemaNodeAccessor

A schema node accessor represents a given node in the master schema.


#### Helpers

- [`createSchemaCollection(path[, store][, options])`](#helper-createSchemaCollection.md)
- [`createSchemaResource(path[, store][, options])`](#helper-createSchemaResource.md)
- [`createSchemaNamespace(path[, options])`](#helper-createSchemaNamespace.md)

#### Instance Methods

- [`inspect([result])`](#static-inspect)
- [`addLeaf(identifier, leaf)`](#static-addLeaf)
- [`addDetachedLeaf(identifier, leaf)`](#static-addDetachedLeaf)


## Helper Methods

### <a id='helper-createSchemaCollection'></a>[`createSchemaCollection(path[, store][, options])`](#helper-createSchemaCollection)

Create a `SchemaNodeAccessor` describing a collection at a given path. The supplied path is used as an identifier for leaf nesting seen below.

```js
Schema.addLeaf(createSchemaCollection("projects"))
Schema.projects.project
```

That same identifier is also used to the default store name, so in the example above if no store is supplied a default store referencing the type `project` would be used.

#### Arguments

1. `path` (*String*): A uri path for the base of the collection. The last path segment should be in plural form.
2. `[store]` (*Store|String*): The optional Store to represent the backing for the collection. If no Store is given, a default singular representation of the identifier will be used.
2. `[options]` (*Object*): An optional options object.
  - `identifier` (*String*): The identifier to use when creating the member leafs and the default store type reference.

##### Returns

(*SchemaNodeAccessor*): A SchemaNodeAccessor reference for the collection.

---

### <a id='helper-createSchemaResource'></a>[`createSchemaResource(path[, store][, options])`](#helper-createSchemaResource)

Create a `SchemaNodeAccessor` describing a resource at a given path. The supplied path is used as an identifier for leaf nesting seen below.

```js
Schema.addLeaf(createSchemaResource("profile"))
Schema.profile
```

That same identifier is also used to the default store name, so in the example above if no store is supplied a default store referencing the type `profile` would be used.

#### Arguments

1. `path` (*String*): A uri path for the base of the collection. The last path segment should be in plural form.
2. `[store]` (*Store|String*): The optional Store to represent the backing for the collection. If no Store is given, a default singular representation of the identifier will be used.
2. `[options]` (*Object*): An optional options object.
  - `identifier` (*String*): The identifier to use when creating the member leafs and the default store type reference.

##### Returns

(*SchemaNodeAccessor*): A SchemaNodeAccessor reference for the collection.

---

### <a id='helper-createSchemaNamespace'></a>[`createSchemaNamespace(path[, options])`](#helper-createSchemaNamespace)

Create a `SchemaNodeAccessor` describing a namespace or simply a path.

```js
Schema.addLeaf(createSchemaNamespace("api"))
Schema.api
```

#### Arguments

1. `path` (*String*): A uri path for the base of the collection. The last path segment should be in plural form.
2. `[options]` (*Object*): An optional options object.
  - `identifier` (*String*): The identifier to use when creating the member leafs and the default store type reference.

##### Returns

(*SchemaNodeAccessor*): A SchemaNodeAccessor reference for the collection.


## Instance Methods

### <a id='static-inspect'></a>[`inspect([result])`](#static-inspect)

A tool to describe all visible leafs from the invoked SchemaNodeAccessor. In a project consisting simply of:

```js
Schema.addLeaf(createSchemaCollection("projects"))
```

Would yield something like:

```js
Schema.inspect() => {
  "/projects": (ResourceDescriptor) {
    basePath: "/projects",
    coerce: "collection",
    type: "project",
    ...
  },
  "/projects/:projectId": (ResourceDescriptor) {
    basePath: "/projects/:projectId",
    coerce: "item",
    type: "project",
    ...
  }
}
```

---

### <a id='static-addLeaf'></a>[`addLeaf([identifier, ]leaf)`](#static-addLeaf)

Add a `leaf` with an optional `identifier` to the `SchemaNode` represented by this `SchemaNodeAccessor`.

---

### <a id='static-addDetachedLeaf'></a>[`addDetachedLeaf(identifier, leaf)`](#static-addDetachedLeaf)

Add a `leaf` with an optional `identifier` to the `SchemaNode` represented by this `SchemaNodeAccessor` that will only leaf on nodes matching the stack depth of this `SchemaNodeAccessor`.
