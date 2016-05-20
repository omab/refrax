/**
 * Copyright (c) 2015-present, Joshua Hollenbeck
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */
const RefraxTools = require('RefraxTools');
const RefraxFragmentCache = require('RefraxFragmentCache');
const mixinSubscribable = require('mixinSubscribable');
const StoreMap = {};


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

  invalidate(opts) {
    opts = opts || {};

    this.cache.invalidate(opts);

    if (opts.notify) {
      this.emit('change');
    }
  }

  //

  notifyChange(resourceDescriptor) {
    this.emit('change');
    if (resourceDescriptor.id) {
      this.emit('change:' + resourceDescriptor.id);
    }
  }

  // Fragment Map is intentionally separate to allow future switching depending
  // on the need; this concept may change.

  fetchResource(resourceDescriptor) {
    return this.cache.fetch(resourceDescriptor);
  }

  touchResource(resourceDescriptor, data, noNotify) {
    this.cache.touch(resourceDescriptor, data);
    if (!noNotify) {
      this.notifyChange(resourceDescriptor);
    }
  }

  updateResource(resourceDescriptor, data, status) {
    this.cache.update(resourceDescriptor, data, status);
    this.notifyChange(resourceDescriptor);
  }

  deleteResource(resourceDescriptor) {
    this.cache.remove(resourceDescriptor);
    this.notifyChange(resourceDescriptor);
  }
}

Object.defineProperty(RefraxStore, 'all', {value: StoreMap});

export default RefraxStore;
