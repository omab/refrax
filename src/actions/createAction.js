/**
 * Copyright (c) 2015-present, Joshua Hollenbeck
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */
const Promise = require('es6-promise').Promise;
const RefraxTools = require('RefraxTools');
const RefraxMutableResource = require('RefraxMutableResource');
const mixinSubscribable = require('mixinSubscribable');
const prototypeActionTemplate = {};


class ActionInvoker {
  from(accessor) {
    return RefraxMutableResource.from(accessor, this.options);
  }
}

function createLocalizedAction(template, method, options) {
  var mutable = {}
    , self = new ActionInvoker();

  Object.defineProperty(self, 'options', {value: options});

  function invoke(params) {
    var promise;

    template.emit('start');
    Action.emit('start');
    promise = method.call(self, RefraxTools.extend({}, mutable, params));

    if (RefraxTools.objToString.call(promise) !== '[object Promise]') {
      promise =  new Promise(function(resolve, reject) {
        resolve();
      });
    }

    promise.then(function(result) {
      finish();
    });

    return promise;
  }

  function finish() {
    template.emit('finish');
    Action.emit('finish');
  }

  function Action(params) {
    return invoke(params);
  }

  mixinSubscribable(Action);

  Action.get = function(attribute) {
    return mutable[attribute];
  };

  Action.set = function(attribute, value) {
    mutable[attribute] = value;
  };

  Action.setter = function(attribute) {
    return function(value) {
      mutable[attribute] = value;
    };
  };

  Action.setterHandler = function(attribute) {
    return function(event) {
      mutable[attribute] = event.target.value;
    };
  };

  Action.unset = function() {
    mutable = {};
  };

  return Action;
}

function createAction(method) {
  if (this instanceof createAction) {
    throw new TypeError('Cannot call createAction as a class');
  }

  /**
   * An ActionTemplate wraps the action method providing utility for either
   * global invocation or localized invocation.
   */
  function ActionTemplate(arg) {
    if (this instanceof ActionTemplate) {
      return createLocalizedAction(ActionTemplate, method, arg);
    }
    else {
      ActionTemplate.emit('start');
      method(arg);
    }
  }
  RefraxTools.setPrototypeOf(ActionTemplate, prototypeActionTemplate);

  mixinSubscribable(ActionTemplate);

  return ActionTemplate;
}

createAction.prototype = prototypeActionTemplate;

export default createAction;
