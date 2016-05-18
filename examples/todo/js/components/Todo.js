import TodoTextInput from './TodoTextInput';
import React from 'react';
import Refrax from 'refrax';
import RefraxReact from 'refrax/lib/RefraxReact';
import classnames from 'classnames';
import {actionDeleteTodo} from 'schema/schema.js';


class Todo extends RefraxReact.extend(React.Component) {
  state = {
    isEditing: false
  }

  componentWillMount() {
    this.deleteTodo = this.attach(actionDeleteTodo);
  }

  render() {
    return (
      <li className={classnames({
        completed: this.props.todo.complete,
        editing: this.state.isEditing
      })}>
        <div className="view">
          <input className="toggle"
                 checked={this.props.todo.complete}
                 onChange={this._handleCompleteChange}
                 type="checkbox"
          />
          <label onDoubleClick={this._handleLabelDoubleClick}>
            {this.props.todo.text}
          </label>
          <button className="destroy"
                  onClick={this._handleDestroyClick}
          />
        </div>
        {this.state.isEditing && this.renderTextInput()}
      </li>
    );
  }

  renderTextInput() {
    return (
      <TodoTextInput className="edit"
                     commitOnBlur={true}
                     initialValue={this.props.todo.text}
                     onCancel={this._handleTextInputCancel}
                     onDelete={this._handleTextInputDelete}
                     onSave={this._handleTextInputSave}
      />
    );
  }

  _handleCompleteChange= (e) => {
    this
      .from(Refrax.Schema.todos.todo)
      .update({
        complete: e.target.checked
      });
  }

  _handleDestroyClick= () => {
    this._removeTodo();
  }

  _handleLabelDoubleClick= () => {
    this._setEditMode(true);
  }

  _handleTextInputCancel= () => {
    this._setEditMode(false);
  }

  _handleTextInputDelete= () => {
    this._setEditMode(false);
    this._removeTodo();
  }

  _handleTextInputSave= (text) => {
    this._setEditMode(false);
    this
      .from(Refrax.Schema.todos.todo)
      .update({
        text: text
      });
  }

  _removeTodo= () => {
    this.deleteTodo();
  }

  _setEditMode= (shouldEdit) => {
    this.setState({isEditing: shouldEdit});
  }
}

export default Todo;
