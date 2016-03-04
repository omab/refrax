var _ = require('utils')
  , RPS = require('Refrax')
  , Constants = require('Constants')
  , StackInvoker = require('StackInvoker')
  , STATUS_STALE = Constants.status.STALE
  , TIMESTAMP_LOADING = Constants.timestamp.loading;


function anyDataset(names, predicate) {
  var self = this;

  if (names) {
    names = _.map([].concat(names || []), function(name) {
      return self[name];
    });
  }
  return _.any(this.__wrappers, function(wrapper) {
    if (names && names.indexOf(wrapper) === -1) {
      return false;
    }

    return predicate(wrapper);
  });
}

function validateDataset(dataset, datasetKey) {
  if (_.isFunction(dataset)) {
    dataset = dataset.call(this);
  }

  if (!dataset) {
    throw new TypeError("validateDataset: expected non-null dataset for `" + datasetKey + "`");
  }
  else if (!dataset.resolve) {
    throw new TypeError("validateDataset: expected MixinResolvable derived dataset for `" + datasetKey + "`");
  }

  return dataset;
}

var MixinStatus = {
  isLoading: function(names) {
    return anyDataset.call(this, names, function(resource) {
      return resource.timestamp === TIMESTAMP_LOADING &&
             resource.status === STATUS_STALE;
    });
  },
  isPending: function(names) {
    return anyDataset.call(this, names, function(resource) {
      return resource.isPending();
    });
  },
  hasData: function(names) {
    return !anyDataset.call(this, names, function(resource) {
      return !resource.data;
    });
  },
  isStale: function(names) {
    return !anyDataset.call(this, names, function(resource) {
      return resource.status !== STATUS_STALE;
    });
  }
};

function registerComponentDataset(component, dataset) {
  if (component.__datasets) {
    component.__datasets.push(component);
    return;
  }

  component.__datasets = [dataset];
  component.__wrappers = [];
  component.getComponentParams = RPS.shims.getComponentParams;

  _.extend(component, MixinStatus);

  var _componentWillUnmount = component.componentWillUnmount;
  component.componentWillUnmount = function() {
    if (this.__subscriptions) {
      _.each(this.__subscriptions, function(unsubscriber) {
        unsubscriber();
      });
    }

    this.__subscriptions = null;

    if (_componentWillUnmount) {
      _componentWillUnmount();
    }
  };
}

function createWrapper(component, dataset, options) {
  var wrapper = {}
    , mutable = {}
    , validationErrors = {}
    , resourceDescriptor;

  // Invoking a stack with no aciton just to get a descriptor of this dataset resource
  // so we know what actions are referenced and what store is used.
  resourceDescriptor = StackInvoker.invoke(dataset.resolve({__params: component.getComponentParams()}));

  // Wrap each allowed action to provide params & the mutable before
  // resolving to our given dataset.
  _.each(resourceDescriptor.actions, function(action, key) {
    var actionWrapper = action.wrap(function(stack) {
      return dataset.resolve([].concat(
        {__params: component.getComponentParams()},
        mutable,
        stack || []
      ));
    }, component);

    actionWrapper.__resolveInvoker = function(stack) {
      if (_.isPlainObject(options.query)) {
        stack.push(options.query);
      }

      // TODO: We only allow one action to process at a time for now?
      if (actionWrapper.isPending) {
        return;
      }
      actionWrapper.isPending = true;

      var promise = StackInvoker.invoke(stack);
      if (!promise.then) {
        return promise;
      }

      promise.then(function() {
        actionWrapper.isPending = false;
      }, function(response) {
        actionWrapper.isPending = false;

        // TODO: Pending json format spec
        if (_.isPlainObject(response.data)) {
          validationErrors = response.data || {};
        }
      });

      return promise;
    };

    wrapper[key] = actionWrapper;
  });

  wrapper.invalidate = function(opts) {
    resourceDescriptor.store.invalidate(opts);
  };

  wrapper.errors = function(attribute) {
    if (attribute) {
      return validationErrors[attribute];
    }
    else {
      return validationErrors;
    }
  };

  wrapper.set = function(attribute, value) {
    mutable[attribute] = value;
    component.forceUpdate();
  };

  wrapper.setter = function(attribute) {
    return function(value) {
      mutable[attribute] = value;
      component.forceUpdate();
    };
  };

  wrapper.unset = function() {
    mutable = {};
  };

  wrapper.isDirty = function(attribute) {
    if (attribute) {
      return mutable[attribute] && mutable[attribute] !== wrapper.data[attribute];
    }
    else {
      return _.any(mutable, function(value, key) {
        return value !== wrapper[key];
      });
    }
  };

  wrapper.isPending = function(names) {
    if (names) {
      names = [].concat(names);
    }

    return _.any(resourceDescriptor.actions, function(action, key) {
      return (!names || names.indexOf(key) !== -1) && wrapper[key].isPending;
    });
  };

  function updateWrapper() {
    var result = StackInvoker.invoke(dataset.resolve([
      {__params: component.getComponentParams()},
      {__params: {__getable: !!wrapper.get}},  // Sneakily hide in params for Resolver
      {__resolve: "fetch"}
    ]));

    // Mutable data is only merged when we have not yet loaded any data
    // or we know we are a non-collection type.
    if (!result.data || _.isPlainObject(result.data)) {
      result.data = _.extend({}, result.data || {}, mutable);
    }

    _.extend(wrapper, result);
    wrapper.validationErrors = validationErrors;
  }

  // Do we have a store we can subscribe to for component render updates?
  if (resourceDescriptor.store) {
    var localEvent = resourceDescriptor.event
      , globalEvent = resourceDescriptor.type + ":" + localEvent
      , subscriptions = component.__subscriptions = component.__subscriptions || {};

    if (!subscriptions[globalEvent]) {
      // TODO: Switch this to throttle/debounce
      // TODO: We could also override render in the given component and toggle
      // a render flag
      subscriptions[globalEvent] = resourceDescriptor.store.subscribe(localEvent, function() {
        _.nextTick(function() {
          // We double check subscription status before invoking incase we were just unmounted
          if (component.__subscriptions) {
            updateWrapper();
            component.forceUpdate();
          }
        });
      });
    }
  }

  updateWrapper();
  component.__wrappers.push(wrapper);
  return wrapper;
}

export default function(component, dataset, options) {
  options = options || {};
  dataset = validateDataset.call(component, dataset);
  registerComponentDataset(component, dataset);
  return createWrapper(component, dataset, options);
};
