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


const MixinStatus = {
  isPending: function() {
    return this._promises.length > 0;
  }
};

function mixinStatus(target) {
  Object.defineProperty(target, '_promises', {value: []});

  return RefraxTools.extend(target, MixinStatus);
}

class ActionInvoker {
  constructor(action, options) {
    Object.defineProperty(this, '_action', {value: action});
    Object.defineProperty(this, '_options', {value: options});
  }

  mutableFrom(accessor, ...args) {
    return RefraxMutableResource.from(accessor, this._options, ...args);
  }
}

function invokeAction(method, emitters, params) {
  var action = this._action
    , promise, result, i;

  for (i=0; i<emitters.length; i++) {
    emitters[i].emit('start');
  }

  promise = result = method.call(this, params);

  if (!RefraxTools.isPromise(result)) {
    promise = new Promise(function(resolve, reject) {
      resolve(result);
    });
  }

  action._promises.push(promise);
  function finalize() {
    var i = action._promises.indexOf(promise);
    if (i > -1) {
      action._promises.splice(i, 1);
    }

    for (i=0; i<emitters.length; i++) {
      emitters[i].emit('finish');
    }
  }
  promise.then(finalize, finalize);

  return promise;
}

function createActionFromTemplate(template, method, options) {
  var mutable = {}
    , errors = {};

  function Action(params) {
    var promise
      , self = new ActionInvoker(Action, options);

    // reset errors on invocation
    errors = {};
    params = RefraxTools.extend({}, mutable, params);
    promise = invokeAction.call(self, method, [template, Action], params);

    promise.catch(function(response) {
      if (RefraxTools.isPlainObject(response.data)) {
        errors = RefraxTools.extend({}, response.data);
      }
      Action.emit('change');
    });

    return promise;
  }

  mixinSubscribable(Action);
  mixinStatus(Action);

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
      Action.emit('change');
    };
  };

  Action.unset = function() {
    mutable = {};
    Action.emit('change');
  };

  Action.getErrors = function(attribute) {
    return errors[attribute];
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
  function ActionTemplate(params) {
    if (this instanceof ActionTemplate) {
      return createActionFromTemplate(ActionTemplate, method, params);
    }
    else {
      var self = new ActionInvoker(ActionTemplate, {});
      params = RefraxTools.extend({}, params);
      return invokeAction.call(self, method, [ActionTemplate], params);
    }
  }
  // templates all share the same prototype so they can be identified above with instanceof
  RefraxTools.setPrototypeOf(ActionTemplate, prototypeActionTemplate);

  mixinSubscribable(ActionTemplate);
  mixinStatus(ActionTemplate);

  return ActionTemplate;
}

createAction.prototype = prototypeActionTemplate;

export default createAction;
