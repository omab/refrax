/**
 * Copyright (c) 2015-present, Joshua Hollenbeck
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */
const mixinSubscribable = require('mixinSubscribable');
const RefraxFragmentCache = require('RefraxFragmentCache');
const RefraxTools = require('RefraxTools');
const StoreMap = {};
var RefraxResourceDescriptor = null;

// circular dependency hack
function getResourceDescriptor() {
  return RefraxResourceDescriptor ||
    (RefraxResourceDescriptor = require('RefraxResourceDescriptor'));
}

function validateDefinition(definition) {
  if (typeof(definition) === 'string') {
    definition = {
      type: definition
    };
  }

  if (!RefraxTools.isPlainObject(definition)) {
    throw new TypeError(
      'RefraxStore - You\'re attempting to pass an invalid definition of type `' + typeof(definition) + '`. ' +
      'A valid definition type is a regular object.'
    );
  }

  if (!definition.type || typeof(definition.type) !== 'string') {
    throw new TypeError(
      'RefraxStore - `type` can only be of type String but found type ' + typeof(definition.type) + '`.'
    );
  }

  if (StoreMap[definition.type]) {
    throw new TypeError(
      'RefraxStore - cannot create new store for type `' + definition.type + '` as it already has been defined.'
    );
  }

  return definition;
}

/**
 * A RefraxStore is a wrapper around the RefraxFragmentCache object that offers
 * a Subscribable interface to resource mutations.
 */
class RefraxStore {
  static get(type) {
    var store;

    if (type) {
      if (typeof(type) !== 'string') {
        throw new TypeError(
          'RefraxStore.get - `type` can only be of type String but found type `' + typeof(type) + '`.'
        );
      }

      store = StoreMap[type];
      if (!store) {
        store = StoreMap[type] = new RefraxStore({type: type});
      }
    }
    else {
      // an anonymous store still has a type for reference
      while (StoreMap[(type = RefraxTools.randomString(12))]) {}
      store = StoreMap[type] = new RefraxStore({type: type});
    }

    return store;
  }

  static reset() {
    RefraxTools.each(StoreMap, function(store) {
      store.reset();
    });
  }

  constructor(definition) {
    definition = validateDefinition(definition);

    mixinSubscribable(this);

    Object.defineProperty(this, 'definition', {
      value: definition,
      enumerable: true
    });

    Object.defineProperty(this, 'cache', {
      value: null,
      writable: true
    });

    this.reset();
  }

  reset() {
    this.cache = new RefraxFragmentCache();
  }

  invalidate(resourceDescriptor, options) {
    if (!(resourceDescriptor instanceof getResourceDescriptor())) {
      if (!options && RefraxTools.isPlainObject(resourceDescriptor)) {
        options = resourceDescriptor;
      }
      else if (resourceDescriptor) {
        throw new TypeError(
          'RefraxStore:invalidate - Argument `resourceDescriptor` has invalid value `' + resourceDescriptor + '`.\n' +
          'Expected type `ResourceDescriptor`, found `' + typeof(resourceDescriptor) + '`.'
        );
      }

      resourceDescriptor = null;
    }

    options = options || {};
    if (!RefraxTools.isPlainObject(options)) {
      throw new TypeError(
        'RefraxStore:invalidate - Argument `options` has invalid value `' + options + '`.\n' +
        'Expected type `Object`, found `' + typeof(options) + '`.'
      );
    }

    this.cache.invalidate(resourceDescriptor, options);
    this._notifyChange(resourceDescriptor, RefraxTools.extend({type: 'invalidate'}, options));
  }

  // Fragment Map is intentionally separate to allow future switching depending
  // on the need; this concept may change.

  fetchResource(resourceDescriptor) {
    return this.cache.fetch(resourceDescriptor);
  }

  touchResource(resourceDescriptor, data, noNotify) {
    this.cache.touch(resourceDescriptor, data);
    if (!noNotify) {
      this._notifyChange(resourceDescriptor, {type: 'touch'});
    }
  }

  updateResource(resourceDescriptor, data, status) {
    this.cache.update(resourceDescriptor, data, status);
    this._notifyChange(resourceDescriptor, {type: 'update'});
  }

  destroyResource(resourceDescriptor) {
    this.cache.destroy(resourceDescriptor);
    this._notifyChange(resourceDescriptor, {type: 'destroy'});
  }

  //

  _notifyChange(resourceDescriptor, event) {
    event = RefraxTools.extend({storeType: this.definition.type}, event);

    this.emit('change', event);
    if (resourceDescriptor && resourceDescriptor.id) {
      this.emit(
        'change:' + resourceDescriptor.id,
        RefraxTools.extend({id: resourceDescriptor.id}, event)
      );
    }
  }
}

Object.defineProperty(RefraxStore, 'all', {value: StoreMap});

export default RefraxStore;
