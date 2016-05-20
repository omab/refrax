# React

This module is available via `require("refrax/lib/RefraxReact")` and provides tools to use Refrax with React.

#### Static Methods

- [`Mixin`](#static-mixin)
- [`Shims`](#static-shims)
- [`attach(component, target[, options])`](#static-attach)
- [`extend(component)`](#static-extend)

### MixinBase Methods

- [`attach(target[, options])`](#attach)
- [`mutableFrom(accessor[, options])`](#mutableFrom)


## Static Methods

### <a id='static-mixin'></a>[`Mixin`](#static-mixin)

A mixin object that can be used with React's `mixins` keyword on component definitions that will provide the component with `MixinBase` methods.

---

### <a id='static-shims'></a>[`Shims`](#static-shims)

An object containing default methods of behavior for interfacing with React components that can be overridden to customize behavior.

- <a id='static-shims-getComponentParams'></a>[`getComponentParams`](#static-shims-getComponentParams) (*Object*): Returns all params to be considered for use in Schema URI composition.

---

### <a id='static-attach'></a>[`attach(component, target[, options])`](#static-attach)

Attach `target` to `component` so that `component` will re-render when updates are received by the target. Additional params provided by the [`getComponentParams`](#static-shims-getComponentParams) Shim method will also be provided to the attached target.

#### Arguments

1. `component` (*ReactComponent*): The React component receiving the target.
2. `target` (*SchemaNodeAccessor|Action*): The object that is being attached.
3. `[options]` (*Object): Optional configurations to pass to the target.

---

### <a id='static-extend'></a>[`extend(component)`](#static-extend)

Extend is designed to provide `MixinBase` functionality into a React Component in two use cases.

First is a more explicit invocation:

```js
componentWillMount: function() {
  RefraxReact.extend(this);
}
```

Second is a more implicit wrapper that creates an intermediate subclass.

```js
class MyView extends RefraxReact.extend(React.Component) {
  ...
}
```

#### Arguments

1. `component` (*ReactComponent*): The React component receiving the target.


## MixinBase Methods

### <a id='attach'></a>[`attach(target[, options])`](#attach)

Alias for [`attach(this, target[, options])`](#static-attach).

### <a id='mutableFrom'></a>[`mutableFrom(accessor[, options])`](#mutableFrom)

This will return a [`MutableResource`](MutableResource.md) that will implicitly receive params from the components [`getComponentParams`](#static-shims-getComponentParams) Shim method.
