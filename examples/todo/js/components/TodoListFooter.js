import React from 'react';
import Refrax from 'refrax';
import RefraxReact from 'refrax/lib/RefraxReact';
import {IndexLink, Link} from 'react-router';


class TodoListFooter extends RefraxReact.extend(React.Component) {
  _handleRemoveCompletedTodosClick = () => {
    this
      .from(Refrax.Schema.todos, '/completed')
      .destroy();
  };

  render() {
    var numCompletedTodos = Refrax.Tools.select(this.props.todos, todo => {
      return todo.complete;
    }).length;
    var numRemainingTodos = this.props.todos.length - numCompletedTodos;

    return (
      <footer className="footer">
        <span className="todo-count">
          <strong>{numRemainingTodos}</strong> item{numRemainingTodos === 1 ? '' : 's'} left
        </span>
        <ul className="filters">
          <li>
            <IndexLink to="/" activeClassName="selected">All</IndexLink>
          </li>
          <li>
            <Link to="/active" activeClassName="selected">Active</Link>
          </li>
          <li>
            <Link to="/completed" activeClassName="selected">Completed</Link>
          </li>
        </ul>
        {numCompletedTodos > 0 &&
          <button
            className="clear-completed"
            onClick={this._handleRemoveCompletedTodosClick}>
            Clear completed
          </button>
        }
      </footer>
    );
  }
}

export default TodoListFooter;
