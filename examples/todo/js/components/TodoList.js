import React from 'react';
import Refrax from 'refrax';
import RefraxReact from 'refrax/lib/RefraxReact';
import Todo from './Todo';


class TodoList extends RefraxReact.mixin(React.Component) {
  componentWillMount() {
    console.groupCollapsed('TodoList::componentWillMount::start');
    this.todos = this.attach(Refrax.Schema.todos);
    console.groupEnd('TodoList::componentWillMount::end');
  }

  render() {
    console.info('TodoList::render');

    var numTodos = this.todos.data.length;
    var numCompletedTodos = Refrax.Tools.select(this.todos.data, todo => {
      return todo.complete;
    });

    return (
      <section className="main">
        <input checked={numTodos === numCompletedTodos}
               className="toggle-all"
               onChange={this._onToggleAll}
               type="checkbox" />
        <label htmlFor="toggle-all">
          Mark all as complete
        </label>
        <ul className="todo-list">
          {this.renderTodos()}
        </ul>
      </section>
    );
  }

  renderTodos() {
    var statusFilter = this.props.params.status;
    var visibleTodos = this.todos.data.filter(todo => {
      return !statusFilter ||
             statusFilter === 'active' && !todo.complete ||
             statusFilter === 'completed' && todo.complete;
    });

    return visibleTodos.map(todo =>
      <Todo key={todo.id} todo={todo} todoId={todo.id} />
    );
  }

  _onToggleAll = (e) => {
    var complete = e.target.checked;
    this
      .from(Refrax.Schema.todos)
      .update({
        complete: complete
      });
  }
}

export default TodoList;
