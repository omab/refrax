import Refrax from 'refrax';
// const {MutableResource} = Refrax;


Refrax.Schema.addLeaf(Refrax.createCollection('todos', Refrax.Store('todo')));

export const actionCreateTodo = Refrax.createAction(function(mutator) {
  console.info('actionCreateTodo invoke with mutator: %o', mutator);
  console.info('  * this : %o', this);
  return this.from(Refrax.Schema.todos).create(mutator);
  // return MutableResource.from(Refrax.Schema.todos, this.options).create(mutator);
});

export const actionDeleteTodo = Refrax.createAction(function(args) {
  console.info('actionDeleteTodo: %o', args);
  console.info('  * this : %o', this);
  return this.from(Refrax.Schema.todos.todo).destroy();
  // return MutableResource.from(Refrax.Schema.todos.todo).destroy();
});
