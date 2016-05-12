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
const createAction = require('createAction');


const SHIMS = {
  getComponentParams: function() {
    return RefraxTools.extend({}, this.props);
  }
};

function detectResource(targets, predicate) {
  refraxifyComponent(this);

  return RefraxTools.any(this.__refrax.resources, function(resource) {
    if (targets && targets.length > 0 && targets.indexOf(resource) === -1) {
      return false;
    }

    return predicate(resource);
  });
}

var MixinResourceStatus = {
  isLoading: function(...targets) {
    return detectResource.call(this, targets, function(resource) {
      return resource.isLoading();
    });
  },
  hasData: function(...targets) {
    return !detectResource.call(this, targets, function(resource) {
      return !resource.hasData();
    });
  },
  isStale: function(...targets) {
    return !detectResource.call(this, targets, function(resource) {
      return resource.isStale();
    });
  }
};

const MixinBase = {
  attach: function(target, options) {
    return attach(this, target, options);
  },
  from: function(accessor, ...args) {
    var self = this
      , options = {
        paramsGenerator: function() {
          return SHIMS.getComponentParams.call(self);
        }
      };

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
      disposers: []
    }
  });

  // quick-check for
  if (component.attach === MixinBase.attach) {
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

function attachSchemaNodeAccessorToCompontent(component, accessor, options) {
  var resource;

  options = RefraxTools.extend({
    paramsGenerator: function() {
      return SHIMS.getComponentParams.call(component);
    }
  }, options);

  resource = new RefraxResource(accessor, options);
  component.__refrax.resources.push(resource);
  component.__refrax.disposers.push(resource.subscribe('change', function() {
    RefraxTools.nextTick(function() {
      component.forceUpdate();
    });
  }));
  return resource;
}

function attachActionTemplateToComponent(component, ActionTemplate, options) {
  var template;

  options = RefraxTools.extend({
    paramsGenerator: function() {
      return SHIMS.getComponentParams.call(component);
    }
  }, options);

  template = new ActionTemplate(options);

  component.__refrax.disposers.push(template.subscribe('change', function() {
    RefraxTools.nextTick(function() {
      component.forceUpdate();
    });
  }));

  return template;
}

function attach(component, target, options) {
  refraxifyComponent(component);

  if (target instanceof RefraxSchemaNodeAccessor) {
    return attachSchemaNodeAccessorToCompontent(component, target, options);
  }
  else if (target instanceof createAction) {
    return attachActionTemplateToComponent(component, target, options);
  }

  throw new TypeError('RefraxReact::attach failed to identify `' + typeof(target) +
  '` as a valid Refrax target');
}

/**
 * Mixin lives as a function so we can use it on ES6 React component classes, but
 * we extend with the MixinBase so it can be used in legacy React component classes.
 */
function mixin(component) {
  // ES6 - class XYZ extends RefraxReact.mixin(React.Component)
  if (typeof(component) === 'function') {
    component = (class extends component {});
    RefraxTools.extend(component.prototype, MixinBase, MixinResourceStatus);
  }
  // Manual - RefraxReact.mixin(this)
  else {
    refraxifyComponent(component);
  }

  return component;
}

mixin.componentWillMount = function() {
  refraxifyComponent(this);
};

RefraxTools.extend(mixin, MixinBase);

export default {
  SHIMS,
  mixin,
  attach
};
