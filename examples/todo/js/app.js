import 'babel-polyfill';
import 'todomvc-common';
import {createHashHistory} from 'history';
import {IndexRoute, Route, Router} from 'react-router';
import React from 'react';
import ReactDOM from 'react-dom';
import TodoApp from './components/TodoApp';
import TodoList from './components/TodoList';
import './schema/schema';


ReactDOM.render(
  <Router history={createHashHistory({queryKey: false})}>
    <Route path="/" component={TodoApp}>
      <IndexRoute component={TodoList} />

      <Route path=":status" component={TodoList} />
    </Route>
  </Router>,
  document.getElementById('root')
);
