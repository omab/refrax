/**
 * Copyright (c) 2015-present, Joshua Hollenbeck
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */
const RefraxTools = require('RefraxTools');
const RefraxSchemaNodeAccessor = require('RefraxSchemaNodeAccessor');
const RefraxResource = require('RefraxResource');
const RefraxMutableResource = require('RefraxMutableResource');
const RefraxOptions = require('RefraxOptions');
const createAction = require('createAction');


export const Shims = {
  getComponentParams: function() {
    return RefraxTools.extend({}, this.props);
  }
};

function detect(array, targets, predicate) {
  refraxifyComponent(this);

  return RefraxTools.any(array, function(other) {
    if (targets && targets.length > 0 && targets.indexOf(other) === -1) {
      return false;
    }

    return predicate(other);
  });
}

const MixinResourceStatus = {
  isLoading: function(...targets) {
    return detect.call(this, this.__refrax.resources, targets, function(resource) {
      return resource.isLoading();
    }) || detect.call(this, this.__refrax.actions, targets, function(action) {
      return (action.default instanceof RefraxResource) && action.default.isLoading();
    });
  },
  isPending: function(...targets) {
    return detect.call(this, this.__refrax.actions, targets, function(action) {
      return action.isPending();
    });
  },
  hasData: function(...targets) {
    return !detect.call(this, this.__refrax.resources, targets, function(resource) {
      return !resource.hasData();
    }) && !detect.call(this, this.__refrax.actions, targets, function(action) {
      return !((action.default instanceof RefraxResource) && action.default.hasData());
    });
  },
  isStale: function(...targets) {
    return !detect.call(this, this.__refrax.resources, targets, function(resource) {
      return resource.isStale();
    }) && !detect.call(this, this.__refrax.actions, targets, function(action) {
      return (action.default instanceof RefraxResource) && action.default.isStale();
    });
  }
};

const MixinBase = {
  attach: function(target, options, ...args) {
    return attach(this, target, options, ...args);
  },
  mutableFrom: function(accessor, ...args) {
    var self = this
      , options = new RefraxOptions({
        paramsGenerator: function() {
          return Shims.getComponentParams.call(self);
        }
      });

    return RefraxMutableResource.from(accessor, options, ...args);
  }
};

function refraxifyComponent(component) {
  if (component.__refrax) {
    return;
  }

  Object.defineProperty(component, '__refrax', {
    value: {
      resources: [],
      actions: [],
      disposers: []
    }
  });

  // quick-check for
  if (component.attach !== MixinBase.attach) {
    RefraxTools.extend(component, MixinBase, MixinResourceStatus);
  }

  // Hook existing componentWillUnmount for cleanup
  var _componentWillUnmount = component.componentWillUnmount;
  component.componentWillUnmount = function() {
    RefraxTools.each(this.__refrax.disposers, function(disposer) {
      disposer();
    });
    this.__refrax.disposers = [];

    RefraxTools.each(this.__refrax.resources, function(resource) {
      resource._dispose();
    });
    this.__refrax.resources = [];

    if (_componentWillUnmount) {
      _componentWillUnmount();
    }
  };
}

function attachAccessor(component, accessor, options, ...args) {
  var resource;

  options = RefraxTools.extend({
    paramsGenerator: function() {
      return Shims.getComponentParams.call(component);
    }
  }, options);

  resource = new RefraxResource(accessor, new RefraxOptions(options), ...args);
  component.__refrax.resources.push(resource);
  component.__refrax.disposers.push(resource.subscribe('change', function() {
    component.forceUpdate();
  }));
  return resource;
}

function attachAction(component, Action, options) {
  var action;

  options = RefraxTools.extend({}, options);
  options.resource = RefraxTools.extend({}, {
    paramsGenerator: function() {
      return Shims.getComponentParams.call(component);
    }
  }, options.resource);

  action = new Action(options);
  component.__refrax.actions.push(action);
  // TODO: finish/mutated can cause double updates due to a request failure
  RefraxTools.each(['start', 'finish', 'mutated'], function(event) {
    component.__refrax.disposers.push(action.subscribe(event, function() {
      component.forceUpdate();
    }));
  });
  return action;
}

export function attach(component, target, options, ...args) {
  refraxifyComponent(component);

  if (target instanceof RefraxSchemaNodeAccessor) {
    return attachAccessor(component, target, options, ...args);
  }
  else if (target instanceof createAction) {
    return attachAction(component, target, options);
  }

  throw new TypeError('RefraxReact::attach cannot attach invalid target `' + target + '`.');
}

/**
 * Extend lives as a function so we can use it on ES6 React component classes, but
 * we extend with the MixinBase so it can be used in legacy React component classes.
 */
export function extend(component) {
  // ES6 - class XYZ extends RefraxReact.extend(React.Component)
  if (typeof(component) === 'function') {
    component = (class extends component {});
    RefraxTools.extend(component.prototype, MixinBase, MixinResourceStatus);
  }
  // Manual - RefraxReact.extend(this)
  else {
    refraxifyComponent(component);
  }

  return component;
}

export const Mixin = {
  componentWillMount: function() {
    refraxifyComponent(this);
  }
};

RefraxTools.extend(Mixin, MixinBase);
