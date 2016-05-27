## [v0.3.5]
> May 27, 2016

- **Bugfix:** Fix null descriptor in Store notify

[v0.3.5]: https://github.com/netarc/refrax/compare/v0.3.4...v0.3.5

## [v0.3.4]
> May 27, 2016

- **Feature:** Store events now emit event data
- **Bugfix:** Invalidate will properly invalidate collections off a resource
- **Minor:** Invalidate noPropagate only affects Resource

[v0.3.4]: https://github.com/netarc/refrax/compare/v0.3.3...v0.3.4

## [v0.3.3]
> May 27, 2016

- **Bugfix:** Descriptor no longer carries over partial resolve

[v0.3.3]: https://github.com/netarc/refrax/compare/v0.3.2...v0.3.3

## [v0.3.2]
> May 26, 2016

- **Bugfix:** ResourceBase now consumes objects as Parameters

[v0.3.2]: https://github.com/netarc/refrax/compare/v0.3.1...v0.3.2

## [v0.3.1]
> May 26, 2016

- **Bugfix:** Action mutable dispatching `change` event unless specified to not do so
- **Bugfix:** Action invocation properly dispatching `change` when complete

[v0.3.1]: https://github.com/netarc/refrax/compare/v0.3.0...v0.3.1

## [v0.3.0]
> May 25, 2016

- **Feature:** Action `data` prototype accessor added
- **Feature:** `Resource.invalidate` is scoped to the invoked Resource now
- **Feature:** MutableResource `getErrors` will now return all errors when no parameter is passed
- **Minor:** General cleanup & refactoring

[v0.3.0]: https://github.com/netarc/refrax/compare/v0.2.0...v0.3.0

## [v0.2.0]
> May 19, 2016

- **Feature:** Both Action & ActionInstance are mutable
- **Feature:** Add Schema `inspect` method
- **Feature:** Add `addDetachedLeaf` to Schema Accessors
- **Feature:** Add `isPending` status query to React mixin
- **Minor:** General cleanup & refactoring

[v0.2.0]: https://github.com/netarc/refrax/compare/v0.1.0...v0.2.0
