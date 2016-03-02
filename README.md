# [Refrax](https://github.com/netarc/react-refrax/) [![npm version](https://badge.fury.io/js/react-refrax.svg)](http://badge.fury.io/js/react-refrax)

Refrax is a JavaScript framework for building api-based data-driven React applications. Inspired by collaboration with [sarahhenkens](https://github.com/sarahhenkens) and [omab](https://github.com/omab) and similar libraries.

* **Unidirectional:** User interaction in views propagates **actions** that will affect **stores** and trigger view updates when needed to components using data from **stores**.
* **Colocation:** Resource Descriptors and actions can live next to the views that rely on them, so you can easily reason about your app.
* **Partials:** Data can be partially represented across various resource descriptors allowing views to efficiently fetch a small subset of data that can be re-used when a more detailed subset of data is needed.
* **Mutations:** Refrax lets you mutate data on the client and server using actions and resource descriptors directly, and offers automatic data consistency, optimistic updates, and error handling.

[Learn how to use Refrax in your own project.](./docs/QuickStart-GettingStarted.md)

## Example

The repository comes with an implementation of [TodoMVC](http://todomvc.com/). To try it out:

```
git clone https://github.com/netarc/react-refrax.git
cd react-refrax/examples/todo && npm install
npm start
```

Then, just point your browser at `http://localhost:3000`.

## Contribute

We actively welcome pull requests, learn how to [contribute](./CONTRIBUTING.md).

## License

Refrax is [BSD licensed](./LICENSE).
