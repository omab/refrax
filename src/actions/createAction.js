/**
 * Copyright (c) 2015-present, Joshua Hollenbeck
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */
const Promise = require('bluebird');
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

const MixinMutable = {
  get: function(attribute) {
    return this.mutable[attribute] ||
      (this.getDefault && this.getDefault()[attribute]);
  },
  set: function(attribute, value) {
    this.mutable[attribute] = value;
  },
  setter: function(attribute) {
    var self = this;

    return function(value) {
      self.mutable[attribute] = value;
    };
  },
  setterHandler: function(attribute) {
    var self = this;

    return function(event) {
      self.mutable[attribute] = event.target.value;
      self.emit('change');
    };
  },
  unset: function() {
    this.mutable = {};
    this.emit('change');
  },
  getErrors: function(attribute) {
    return this.errors[attribute];
  }
};

function mixinMutable(target) {
  Object.defineProperty(target, 'mutable', {
    value: {},
    writable: true
  });
  Object.defineProperty(target, 'errors', {
    value: {},
    writable: true
  });

  return RefraxTools.extend(target, MixinMutable);
}

class ActionInvoker {
  constructor(action, options) {
    Object.defineProperty(this, '_action', {value: action});
    Object.defineProperty(this, '_options', {value: options});
  }

  mutableFrom(accessor, ...args) {
    return RefraxMutableResource.from(accessor, this._options.resource, ...args);
  }
}

function invokeAction(emitters, method, params, options, args) {
  var action = emitters[0]
    , invoker = new ActionInvoker(action, options)
    , promise, result, i;

  // reset errors on invocation
  action.errors = {};
  params = RefraxTools.extend({}, action.mutable, action.getDefault(), params);

  for (i=0; i<emitters.length; i++) {
    emitters[i].emit('start');
  }

  promise = result = method.apply(invoker, [params].concat(args));

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

  promise.catch(function(response) {
    if (RefraxTools.isPlainObject(response.data)) {
      action.errors = RefraxTools.extend({}, response.data);
    }
    action.emit('change');
  });

  return promise;
}

function createActionInstance(template, method, options) {
  function ActionInstance(params, ...args) {
    return invokeAction([ActionInstance, template], method, params, options, args);
  }

  ActionInstance.getDefault = function() {
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
  };

  mixinSubscribable(ActionInstance);
  mixinStatus(ActionInstance);
  mixinMutable(ActionInstance);

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
  function Action(params, ...args) {
    if (this instanceof Action) {
      return createActionInstance(Action, method, params);
    }
    else {
      return invokeAction([Action], method, params, {}, args);
    }
  }
  // templates all share the same prototype so they can be identified above with instanceof
  RefraxTools.setPrototypeOf(Action, prototypeAction);

  mixinSubscribable(Action);
  mixinStatus(Action);
  mixinMutable(Action);

  return Action;
}

createAction.prototype = prototypeAction;

export default createAction;
