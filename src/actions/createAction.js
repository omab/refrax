/**
 * Copyright (c) 2015-present, Joshua Hollenbeck
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */
const Promise = require('es6-promise').Promise;
const RefraxTools = require('RefraxTools');
const RefraxResource = require('RefraxResource');
const RefraxMutableResource = require('RefraxMutableResource');
const mixinSubscribable = require('mixinSubscribable');
const prototypeAction = {};


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
    // @TODO is it better to pre-dispose vs track disposable on our invoker and
    // cleanup on action "finish"?
    return RefraxMutableResource.from(accessor, this._options.resource, ...args)._dispose();
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

function createActionInstance(template, method, options) {
  var mutable = {}
    , errors = {};

  function ActionInstance(params) {
    var promise
      , self = new ActionInvoker(ActionInstance, options);

    // reset errors on invocation
    errors = {};
    params = RefraxTools.extend({}, mutable, getDefaultMutable(), params);
    promise = invokeAction.call(self, method, [template, ActionInstance], params);

    promise.catch(function(response) {
      if (RefraxTools.isPlainObject(response.data)) {
        errors = RefraxTools.extend({}, response.data);
      }
      ActionInstance.emit('change');
    });

    return promise;
  }

  function getDefaultMutable() {
    var result = options.default || {};

    if (RefraxTools.isFunction(result)) {
      result = result();
    }

    if (result instanceof RefraxResource) {
      result = result.data || {};
    }
    else if (!RefraxTools.isPlainObject(result)) {
      throw new TypeError('ActionInstance ' + template + ' failed to resolve default value');
    }

    return result;
  }

  mixinSubscribable(ActionInstance);
  mixinStatus(ActionInstance);

  // @TODO these seem like a "mutable" mixin candidate that could also be used on MutableResource

  ActionInstance.get = function(attribute) {
    return mutable[attribute] || getDefaultMutable()[attribute];
  };

  ActionInstance.set = function(attribute, value) {
    mutable[attribute] = value;
  };

  ActionInstance.setter = function(attribute) {
    return function(value) {
      mutable[attribute] = value;
    };
  };

  ActionInstance.setterHandler = function(attribute) {
    return function(event) {
      mutable[attribute] = event.target.value;
      ActionInstance.emit('change');
    };
  };

  ActionInstance.unset = function() {
    mutable = {};
    ActionInstance.emit('change');
  };

  ActionInstance.getErrors = function(attribute) {
    return errors[attribute];
  };

  return ActionInstance;
}

function createAction(method) {
  if (this instanceof createAction) {
    throw new TypeError('Cannot call createAction as a class');
  }

  /**
   * An Action can either be globally invoked or instantiated and invoked on that
   * particular instance.
   */
  function Action(params) {
    if (this instanceof Action) {
      return createActionInstance(Action, method, params);
    }
    else {
      var self = new ActionInvoker(Action, {});
      params = RefraxTools.extend({}, params);
      return invokeAction.call(self, method, [Action], params);
    }
  }
  // templates all share the same prototype so they can be identified above with instanceof
  RefraxTools.setPrototypeOf(Action, prototypeAction);

  mixinSubscribable(Action);
  mixinStatus(Action);

  return Action;
}

createAction.prototype = prototypeAction;

export default createAction;
