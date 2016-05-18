import Refrax from 'refrax';

Refrax.Schema.addLeaf(Refrax.createCollection('todos'));

export const actionCreateTodo = Refrax.createAction(function(mutator) {
  return this
    .mutableFrom(Refrax.Schema.todos)
    .create(mutator);
});

export const actionDeleteTodo = Refrax.createAction(function(args) {
  return this
    .mutableFrom(Refrax.Schema.todos.todo)
    .destroy();
});
