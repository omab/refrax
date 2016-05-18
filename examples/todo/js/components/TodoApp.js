import React from 'react';
import Refrax from 'refrax';
import RefraxReact from 'refrax/lib/RefraxReact';
import TodoListFooter from './TodoListFooter';
import TodoTextInput from './TodoTextInput';
import {actionCreateTodo} from 'schema/schema.js';


class TodoApp extends RefraxReact.extend(React.Component) {
  componentWillMount() {
    console.groupCollapsed('TodoApp::componentWillMount::start');
    this.todos = this.attach(Refrax.Schema.todos);
    this.createTodo = this.attach(actionCreateTodo);
    console.groupEnd('TodoApp::componentWillMount::end');
  }

  render() {
    var hasTodos = this.todos.data.length > 0;

    return (
      <div>
        <section className="todoapp">
          <header className="header">
            <h1>
              todos
            </h1>
            <input className="new-todo"
                   value={this.createTodo.get('text')}
                   onChange={this.createTodo.setterHandler('text')}
                   onKeyDown={this._onInputKeyDown}
                   placeholder="What needs to be done?" />
            {/*
            <TodoTextInput autoFocus={true}
                           className="new-todo"
                           onSave={this._onTodoSave}
                           placeholder="What needs to be done?" />
            */}
          </header>

          {this.props.children}

          {hasTodos &&
            <TodoListFooter todos={this.todos.data}
                            viewer={this.props.viewer} />
          }
        </section>
        <footer className="info">
          <p>
            Double-click to edit a todo
          </p>
          <p>
            Created by the <a href="https://github.com/netarc/react-refrax/">Refrax team</a>
          </p>
          <p>
            Part of <a href="http://todomvc.com">TodoMVC</a>
          </p>
        </footer>
      </div>
    );
  }

  _onInputKeyDown = (e) => {
    var self = this;

    if (e.keyCode === 13) {
      this.createTodo()
        .then(function() {
          self.createTodo.unset();
        });
    }
    return true;
  };

  _onTodoSave = (text) => {
    // this.createTodo({text});
  }
}

export default TodoApp;
